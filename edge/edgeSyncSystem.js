import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import express from 'express';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

function loadSqliteDriver() {
  try {
    return require('better-sqlite3');
  } catch (err) {
    try {
      const sqlite3 = require('sqlite3');
      return sqlite3.verbose();
    } catch (inner) {
      throw new Error('SQLite driver not found. Install better-sqlite3 or sqlite3 to use the edge sync system.');
    }
  }
}

function safeStringify(value) {
  return JSON.stringify(value, Object.keys(value).sort());
}

export class EdgeStore {
  constructor(dbPath) {
    this.dbPath = dbPath || path.resolve(process.cwd(), 'edge-data.sqlite');
    this.sqlite = loadSqliteDriver();
    this.db = this.openDatabase(this.dbPath);
    this.initializeSchema();
  }

  openDatabase(dbPath) {
    if (this.sqlite.Database) {
      return new this.sqlite.Database(dbPath);
    }
    return new this.sqlite(dbPath);
  }

  initializeSchema() {
    const schema = [
      `CREATE TABLE IF NOT EXISTS learning_events (
        event_id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        school_id TEXT,
        region TEXT,
        skill_id TEXT,
        event_type TEXT,
        payload TEXT,
        raw_score REAL,
        error_codes TEXT,
        outcome TEXT,
        created_at TEXT NOT NULL,
        uploaded_at TEXT,
        sync_attempts INTEGER DEFAULT 0
      );`,
      `CREATE TABLE IF NOT EXISTS skill_states (
        student_id TEXT NOT NULL,
        school_id TEXT,
        region TEXT,
        skill_id TEXT NOT NULL,
        proficiency REAL,
        confidence REAL,
        attempts INTEGER,
        successes INTEGER,
        failures INTEGER,
        last_attempt_at TEXT,
        progress_history TEXT,
        updated_at TEXT,
        PRIMARY KEY (student_id, skill_id)
      );`,
      `CREATE TABLE IF NOT EXISTS curriculum_patch_applications (
        patch_id TEXT PRIMARY KEY,
        applied_at TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS proof_bundles (
        bundle_id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        learning_events TEXT,
        skill_snapshot TEXT,
        applied_patches TEXT,
        sync_started_at TEXT,
        sync_completed_at TEXT,
        hash_signature TEXT,
        created_at TEXT NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS sync_state (
        key TEXT PRIMARY KEY,
        value TEXT
      );`,
    ]; 

    schema.forEach((sql) => this.db.exec(sql));
  }

  run(sql, params = []) {
    if (this.sqlite.Database) {
      return this.db.prepare(sql).run(...params);
    }
    return this.db.run(sql, params);
  }

  query(sql, params = []) {
    if (this.sqlite.Database) {
      return this.db.prepare(sql).all(...params);
    }
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  async upsertLearningEvent(event) {
    const record = {
      event_id: event.event_id,
      student_id: event.student_id,
      school_id: event.school_id || null,
      region: event.region || null,
      skill_id: event.skill_id || null,
      event_type: event.event_type || 'submission',
      payload: safeStringify(event.payload || {}),
      raw_score: event.raw_score ?? null,
      error_codes: safeStringify(event.error_codes || []),
      outcome: event.outcome || 'partial',
      created_at: event.created_at || new Date().toISOString(),
      uploaded_at: null,
      sync_attempts: 0,
    };

    const sql = `INSERT OR IGNORE INTO learning_events (
      event_id, student_id, school_id, region, skill_id, event_type, payload, raw_score,
      error_codes, outcome, created_at, uploaded_at, sync_attempts
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    this.run(sql, Object.values(record));
    return record;
  }

  async getPendingEvents(limit = 200) {
    return this.query(`SELECT * FROM learning_events WHERE uploaded_at IS NULL ORDER BY created_at ASC LIMIT ?;`, [limit]);
  }

  async markEventsUploaded(eventIds, uploadedAt = new Date().toISOString()) {
    const sql = `UPDATE learning_events SET uploaded_at = ?, sync_attempts = sync_attempts + 1 WHERE event_id = ?;`;
    const stmt = this.db.prepare(sql);
    eventIds.forEach((id) => {
      stmt.run(uploadedAt, id);
    });
  }

  async getSkillState(studentId, skillId) {
    const rows = await this.query(`SELECT * FROM skill_states WHERE student_id = ? AND skill_id = ?;`, [studentId, skillId]);
    return rows[0] || null;
  }

  async upsertSkillState(state) {
    const existing = await this.getSkillState(state.student_id, state.skill_id);
    const merged = existing ? this.mergeSkillState(existing, state) : state;
    const sql = `INSERT INTO skill_states (
      student_id, school_id, region, skill_id, proficiency, confidence,
      attempts, successes, failures, last_attempt_at, progress_history, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(student_id, skill_id) DO UPDATE SET
      school_id = excluded.school_id,
      region = excluded.region,
      proficiency = excluded.proficiency,
      confidence = excluded.confidence,
      attempts = excluded.attempts,
      successes = excluded.successes,
      failures = excluded.failures,
      last_attempt_at = excluded.last_attempt_at,
      progress_history = excluded.progress_history,
      updated_at = excluded.updated_at;`;
    this.run(sql, [
      merged.student_id,
      merged.school_id || null,
      merged.region || null,
      merged.skill_id,
      merged.proficiency ?? 0,
      merged.confidence ?? 0,
      merged.attempts ?? 0,
      merged.successes ?? 0,
      merged.failures ?? 0,
      merged.last_attempt_at || null,
      safeStringify(merged.progress_history || []),
      merged.updated_at || new Date().toISOString(),
    ]);
    return merged;
  }

  mergeSkillState(local, cloud) {
    const localHistory = JSON.parse(local.progress_history || '[]');
    const cloudHistory = cloud.progress_history || [];
    const mergedHistory = [...localHistory, ...cloudHistory].slice(-20);

    return {
      student_id: cloud.student_id,
      school_id: cloud.school_id || local.school_id,
      region: cloud.region || local.region,
      skill_id: cloud.skill_id,
      proficiency: cloud.proficiency,
      confidence: cloud.confidence,
      attempts: cloud.attempts,
      successes: cloud.successes,
      failures: cloud.failures,
      last_attempt_at: cloud.last_attempt_at || local.last_attempt_at,
      progress_history: mergedHistory,
      updated_at: cloud.updated_at || new Date().toISOString(),
    };
  }

  async getLocalSkillSnapshot(opts = {}) {
    const where = [];
    const params = [];
    if (opts.region) {
      where.push('region = ?');
      params.push(opts.region);
    }
    if (opts.school_id) {
      where.push('school_id = ?');
      params.push(opts.school_id);
    }
    if (opts.student_id) {
      where.push('student_id = ?');
      params.push(opts.student_id);
    }
    const query = `SELECT * FROM skill_states${where.length ? ' WHERE ' + where.join(' AND ') : ''};`;
    const rows = await this.query(query, params);
    return rows.map((row) => ({
      ...row,
      progress_history: JSON.parse(row.progress_history || '[]'),
    }));
  }

  async recordCurriculumPatchApplication(patchId) {
    const sql = `INSERT OR IGNORE INTO curriculum_patch_applications (patch_id, applied_at) VALUES (?, ?);`;
    this.run(sql, [patchId, new Date().toISOString()]);
  }

  async getAppliedPatchIds() {
    const rows = await this.query(`SELECT patch_id FROM curriculum_patch_applications ORDER BY applied_at ASC;`);
    return rows.map((row) => row.patch_id);
  }

  async saveProofBundle(bundle) {
    const sql = `INSERT OR REPLACE INTO proof_bundles (
      bundle_id, student_id, learning_events, skill_snapshot,
      applied_patches, sync_started_at, sync_completed_at, hash_signature, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    this.run(sql, [
      bundle.bundle_id,
      bundle.student_id,
      safeStringify(bundle.learning_events),
      safeStringify(bundle.skill_snapshot),
      safeStringify(bundle.applied_patches),
      bundle.sync_started_at,
      bundle.sync_completed_at,
      bundle.hash_signature,
      bundle.created_at,
    ]);
    return bundle;
  }

  async getSyncState(key) {
    const rows = await this.query(`SELECT value FROM sync_state WHERE key = ?;`, [key]);
    return rows[0]?.value ?? null;
  }

  async setSyncState(key, value) {
    const sql = `INSERT INTO sync_state (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value;`;
    this.run(sql, [key, value]);
  }
}

export class LocalValidationEngine {
  constructor(commonMistakes = []) {
    this.commonMistakes = commonMistakes.length ? commonMistakes : LocalValidationEngine.defaultMistakes();
  }

  static defaultMistakes() {
    return [
      {
        code: 'syntax_unmatched_parens',
        pattern: /\(|\)/,
        hint: 'Check that every opening parenthesis has a matching closing parenthesis.',
      },
      {
        code: 'syntax_missing_colon',
        pattern: /\bif\b|\bfor\b|\bwhile\b|\bdef\b|\bfunction\b/,
        hint: 'Make sure control statements and function definitions use the required colon or syntax marker.',
      },
      {
        code: 'logic_off_by_one',
        pattern: /for\s*\(.*<=.*\)|for .* in range\(.*\+1\)/,
        hint: 'Check whether your loop boundaries are off by one iteration.',
      },
    ];
  }

  syntaxCheckCode(code) {
    const issues = [];
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      issues.push({ code: 'syntax_unmatched_parens', message: 'Unmatched parentheses were detected.' });
    }

    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      issues.push({ code: 'syntax_unmatched_braces', message: 'Unmatched braces were detected.' });
    }

    const lines = code.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/\bif\b/.test(line) && line.trim().endsWith(':') === false && line.includes('==') === false && line.includes('=') === false) {
        issues.push({ code: 'syntax_missing_colon', message: `Possible missing colon on line ${index + 1}.` });
      }
    });

    return issues;
  }

  hintForEvent(event) {
    const hints = [];
    if (event.error_codes?.length) {
      event.error_codes.forEach((code) => {
        const match = this.commonMistakes.find((item) => item.code === code);
        if (match) {
          hints.push(match.hint);
        }
      });
    }

    if (event.event_type === 'code_execution' && typeof event.payload?.code === 'string') {
      const issues = this.syntaxCheckCode(event.payload.code);
      hints.push(...issues.map((issue) => issue.message));
    }

    if (!hints.length) {
      hints.push('Review your work carefully and compare it to the examples from class.');
    }

    return hints;
  }
}

export class ProofBundleGenerator {
  static generateProofBundle({ student_id, learning_events, skill_snapshot, applied_patches, sync_started_at, sync_completed_at }) {
    const bundle = {
      bundle_id: `${student_id}:${sync_started_at}:${Math.random().toString(36).slice(2, 10)}`,
      student_id,
      learning_events,
      skill_snapshot,
      applied_patches,
      sync_started_at,
      sync_completed_at,
      created_at: new Date().toISOString(),
    };
    bundle.hash_signature = ProofBundleGenerator.signBundle(bundle);
    return bundle;
  }

  static signBundle(bundle) {
    const payload = safeStringify({
      student_id: bundle.student_id,
      learning_events: bundle.learning_events,
      skill_snapshot: bundle.skill_snapshot,
      applied_patches: bundle.applied_patches,
      sync_started_at: bundle.sync_started_at,
      sync_completed_at: bundle.sync_completed_at,
    });
    return crypto.createHash('sha256').update(payload).digest('hex');
  }
}

export class SyncAgent {
  constructor({ edgeStore, cloudGateway, syncIntervalMs = 300000, maxRetries = 5 }) {
    this.edgeStore = edgeStore;
    this.cloudGateway = cloudGateway;
    this.syncIntervalMs = syncIntervalMs;
    this.maxRetries = maxRetries;
    this.isSyncing = false;
  }

  async prepareSyncPayload() {
    const learningEvents = await this.edgeStore.getPendingEvents(500);
    const studentIds = Array.from(new Set(learningEvents.map((evt) => evt.student_id)));
    const skillSnapshot = await this.edgeStore.getLocalSkillSnapshot();
    const appliedPatches = await this.edgeStore.getAppliedPatchIds();
    const proof = ProofBundleGenerator.generateProofBundle({
      student_id: studentIds.length === 1 ? studentIds[0] : 'multiple',
      learning_events: learningEvents,
      skill_snapshot: skillSnapshot,
      applied_patches: appliedPatches,
      sync_started_at: new Date().toISOString(),
      sync_completed_at: new Date().toISOString(),
    });

    return {
      learning_events: learningEvents.map((evt) => ({
        ...evt,
        payload: JSON.parse(evt.payload || '{}'),
        error_codes: JSON.parse(evt.error_codes || '[]'),
      })),
      skill_snapshot: skillSnapshot,
      session_metadata: {
        device_id: await this.edgeStore.getSyncState('device_id') || 'edge-node',
        last_sync_at: await this.edgeStore.getSyncState('last_sync_at'),
      },
      proof_bundle: proof,
    };
  }

  async syncOnce() {
    if (this.isSyncing) {
      return null;
    }
    this.isSyncing = true;
    try {
      const payload = await this.prepareSyncPayload();
      const uploadResponse = await this.cloudGateway.uploadLearningBatch(payload);
      if (!uploadResponse || !uploadResponse.success) {
        throw new Error('Upload failed or returned invalid response.');
      }

      const eventIds = payload.learning_events.map((event) => event.event_id);
      await this.edgeStore.markEventsUploaded(eventIds, new Date().toISOString());
      await this.edgeStore.setSyncState('last_sync_at', new Date().toISOString());

      const downloadSince = await this.edgeStore.getSyncState('last_download_at');
      const cloudUpdates = await this.cloudGateway.downloadUpdates({ since: downloadSince });
      await this.applyCloudUpdates(cloudUpdates);
      await this.edgeStore.setSyncState('last_download_at', cloudUpdates.server_time || new Date().toISOString());

      return { uploaded: eventIds.length, patches: cloudUpdates?.curriculum_patches?.length || 0 };
    } finally {
      this.isSyncing = false;
    }
  }

  async applyCloudUpdates(cloudUpdates) {
    if (!cloudUpdates) {
      return;
    }

    const { curriculum_patches = [], skill_states = [], feedback_packets = [] } = cloudUpdates;

    for (const patch of curriculum_patches.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))) {
      await this.edgeStore.recordCurriculumPatchApplication(patch.patch_id);
    }

    for (const state of skill_states) {
      await this.edgeStore.upsertSkillState(state);
    }

    await this.edgeStore.setSyncState('last_feedback_at', new Date().toISOString());
  }

  async startAutoSync() {
    if (this.autoSyncHandle) {
      return;
    }
    this.autoSyncHandle = setInterval(async () => {
      try {
        await this.syncOnce();
      } catch (err) {
        console.warn('Edge sync failed, will retry later:', err.message);
      }
    }, this.syncIntervalMs);
  }

  stopAutoSync() {
    if (!this.autoSyncHandle) {
      return;
    }
    clearInterval(this.autoSyncHandle);
    this.autoSyncHandle = null;
  }
}

export function createOfflineServer({ edgeStore, validationEngine, port = 4002 }) {
  const app = express();
  app.use(express.json());

  app.post('/events', async (req, res) => {
    try {
      const event = req.body;
      if (!event?.event_id || !event?.student_id) {
        return res.status(400).json({ error: 'Missing event_id or student_id.' });
      }
      const saved = await edgeStore.upsertLearningEvent(event);
      const hints = validationEngine.hintForEvent(event);
      return res.json({ saved, hints });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.get('/sync/status', async (_req, res) => {
    const lastSync = await edgeStore.getSyncState('last_sync_at');
    const lastDownload = await edgeStore.getSyncState('last_download_at');
    return res.json({ lastSync, lastDownload, pendingEvents: (await edgeStore.getPendingEvents(1)).length });
  });

  app.get('/patches', async (_req, res) => {
    const patches = await edgeStore.query(`SELECT patch_id, applied_at FROM curriculum_patch_applications ORDER BY applied_at DESC LIMIT 100;`);
    return res.json({ patches });
  });

  const server = app.listen(port, () => {
    console.log(`Edge offline server listening on http://localhost:${port}`);
  });

  return server;
}

export default {
  EdgeStore,
  LocalValidationEngine,
  ProofBundleGenerator,
  SyncAgent,
  createOfflineServer,
};

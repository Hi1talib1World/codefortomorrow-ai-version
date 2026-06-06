import fs from 'fs';
import path from 'path';

// Helper to recursively walk a directory
function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

// Map files to apply updates
const filesToProcess = [];
walkDir('src', (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    filesToProcess.push(filePath);
  }
});
filesToProcess.push('server.ts');

console.log(`Found ${filesToProcess.length} files to process.`);

filesToProcess.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Calculate depth of file from root
  const relativePath = path.relative('.', filePath);
  // Normalize windows separators
  const normalizedPath = relativePath.replace(/\\/g, '/');
  const parts = normalizedPath.split('/');
  const depth = parts.length - 1; // 0 for server.ts, 3 for src/api/auth/auth.controller.ts, etc.
  
  const toRoot = depth === 0 ? './' : '../'.repeat(depth);

  // 1. Imports from models:
  // Any import matching '../models/xxx' or '../../models/xxx'
  content = content.replace(/(from\s+['"])(\.\.?\/)+(models\/)([a-zA-Z0-9\._-]+)(['"])/g, (match, p1, p2, p3, modelName, p5) => {
    let relPath = toRoot + 'src/models/' + modelName;
    if (!relPath.startsWith('.')) relPath = './' + relPath;
    return `${p1}${relPath}${p5}`;
  });
  
  // 2. Imports from services:
  // Any import matching '../services/xxx' or '../../services/xxx'
  content = content.replace(/(from\s+['"])(\.\.?\/)+(services\/)([a-zA-Z0-9\._-]+)(['"])/g, (match, p1, p2, p3, serviceName, p5) => {
    let newPath = '';
    if (['xp.service', 'leaderboard.service'].includes(serviceName)) {
      newPath = `src/core/gamification/${serviceName}`;
    } else if (['unlock.service'].includes(serviceName)) {
      newPath = `src/core/learning/${serviceName}`;
    } else if (['aiEngine', 'agentMonitor.service'].includes(serviceName)) {
      newPath = `src/core/ai-coach/${serviceName}`;
    } else if (['analytics.service'].includes(serviceName)) {
      newPath = `src/core/analytics/${serviceName}`;
    } else if (['eventBus', 'eventListeners'].includes(serviceName)) {
      if (serviceName === 'eventListeners') {
        newPath = `src/events/listeners/eventListeners`;
      } else {
        newPath = `src/events/${serviceName}`;
      }
    } else if (['eventLog.service'].includes(serviceName)) {
      newPath = `src/events/processors/eventLog.processor`;
    } else if (['firebase'].includes(serviceName)) {
      newPath = `src/services/external/firebase`;
    } else if (['token.service'].includes(serviceName)) {
      newPath = `src/services/token/token.service`;
    } else if (['notification.service'].includes(serviceName)) {
      newPath = `src/realtime/sse`;
    } else if (['api'].includes(serviceName)) {
      // client-side api.ts remains in services/api.ts at root
      newPath = `services/api`;
    } else {
      newPath = `src/services/${serviceName}`;
    }
    
    let relPath = toRoot + newPath;
    if (!relPath.startsWith('.')) relPath = './' + relPath;
    return `${p1}${relPath}${p5}`;
  });

  // 3. Imports from middleware:
  // Any import matching '../middleware/xxx' or '../../middleware/xxx'
  content = content.replace(/(from\s+['"])(\.\.?\/)+(middleware\/)([a-zA-Z0-9\._-]+)(['"])/g, (match, p1, p2, p3, middlewareName, p5) => {
    let relPath = toRoot + 'src/core/permissions/' + middlewareName;
    if (!relPath.startsWith('.')) relPath = './' + relPath;
    return `${p1}${relPath}${p5}`;
  });

  // 4. Imports from config/db:
  content = content.replace(/(from\s+['"])(\.\.?\/)+(config\/)(db)(['"])/g, (match, p1, p2, p3, dbName, p5) => {
    let relPath = toRoot + 'src/services/db/db';
    if (!relPath.startsWith('.')) relPath = './' + relPath;
    return `${p1}${relPath}${p5}`;
  });

  // 5. Imports from utils:
  content = content.replace(/(from\s+['"])(\.\.?\/)+(utils\/)([a-zA-Z0-9\._-]+)(['"])/g, (match, p1, p2, p3, utilsName, p5) => {
    let relPath = toRoot + 'utils/' + utilsName;
    if (!relPath.startsWith('.')) relPath = './' + relPath;
    return `${p1}${relPath}${p5}`;
  });

  // 6. Controllers / Routes mutual imports inside src/api/ (if they were originally siblings in root)
  // For routes which imported '../controllers/xxx', they should now resolve to the exact domain folders:
  if (normalizedPath.endsWith('.routes.ts')) {
    content = content.replace(/(from\s+['"])\.\.\/controllers\/([a-zA-Z0-9\._-]+)(['"])/g, (match, p1, controllerName, p3) => {
      // Map controllerName to their new relative directory
      let relController = '';
      if (controllerName.startsWith('auth')) relController = './auth.controller';
      else if (controllerName.startsWith('user')) relController = '../users/user.controller';
      else if (controllerName.startsWith('admin')) relController = '../admin/admin.controller';
      else if (controllerName.startsWith('ai')) relController = '../ai/ai.controller';
      else if (controllerName.startsWith('agents')) relController = '../ai/agents.controller';
      else if (controllerName.startsWith('notification')) relController = '../notifications/notification.controller';
      else relController = `./${controllerName}`;
      
      return `${p1}${relController}${p3}`;
    });
  }

  // 7. Route registrations in server.ts
  if (filePath === 'server.ts') {
    content = content.replace(/(import\s+[a-zA-Z0-9_-]+\s+from\s+['"])\.\/routes\/([a-zA-Z0-9\._-]+)(['"])/g, (match, p1, routeName, p3) => {
      let relRoute = '';
      if (routeName.startsWith('auth')) relRoute = './src/api/auth/auth.routes';
      else if (routeName.startsWith('user')) relRoute = './src/api/users/user.routes';
      else if (routeName.startsWith('admin')) relRoute = './src/api/admin/admin.routes';
      else if (routeName.startsWith('ai')) relRoute = './src/api/ai/ai.routes';
      else if (routeName.startsWith('agents')) relRoute = './src/api/ai/agents.routes';
      else if (routeName.startsWith('notification')) relRoute = './src/api/notifications/notification.routes';
      else if (routeName.startsWith('message')) relRoute = './src/api/messages/message.routes';
      // Courses routes:
      else if (['opensource.routes', 'missions.routes', 'quiz.routes', 'activity.routes', 'learningEvents.routes'].includes(routeName)) {
        relRoute = `./src/api/courses/${routeName}`;
      } else {
        relRoute = `./src/api/${routeName}`;
      }
      return `${p1}${relRoute}${p3}`;
    });
  }

  // Save changes if any
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${filePath}`);
  }
});

console.log('Restructuring of imports completed.');

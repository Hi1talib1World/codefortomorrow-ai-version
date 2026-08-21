import { describe, it, expect } from 'vitest';
import { defaultAgentRegistry } from '../src/core/agents/registry/agent.registry';
import { CurriculumInputSchema, CurriculumOutputSchema } from '../src/core/agents/implementations/curriculumFactory.agent';
import { AnalyticsInputSchema, AnalyticsOutputSchema } from '../src/core/agents/implementations/studentAnalytics.agent';
import { B2BSalesInputSchema, B2BSalesOutputSchema } from '../src/core/agents/implementations/b2bSales.agent';

describe('Multi-Agent Platform Test Suite', () => {
  it('should have all 3 core agents registered in AgentRegistry', () => {
    const agents = defaultAgentRegistry.listAgents();
    const agentIds = agents.map(a => a.id);

    expect(agentIds).toContain('curriculum_factory');
    expect(agentIds).toContain('student_analytics');
    expect(agentIds).toContain('b2b_sales');
  });

  it('should validate Curriculum Factory Agent input and output Zod schemas', () => {
    const validCurriculumInput = {
      subject: 'Mathematics',
      grade: '6',
      topic: 'Fractions',
      language: 'French',
      learnerLevel: 'beginner',
      durationMinutes: 40
    };
    expect(CurriculumInputSchema.safeParse(validCurriculumInput).success).toBe(true);

    const validCurriculumOutput = {
      title: 'Fractions 101',
      learning_objectives: ['Numerators'],
      prerequisites: ['Division'],
      lesson_structure: [{ step: 1, sectionTitle: 'Intro', durationMinutes: 10, keyConcepts: ['Parts'] }],
      explanation: 'Explication...',
      activities: [{ activityName: 'Fraction Game', type: 'interactive', description: 'Match parts' }],
      exercises: [{ question: 'What is 1/2?', hint: 'Half' }],
      assessment: [{ question: '1/2 + 1/2?', options: ['1', '2'], correctAnswerIndex: 0 }],
      difficulty: 'beginner',
      estimated_duration: 40
    };
    expect(CurriculumOutputSchema.safeParse(validCurriculumOutput).success).toBe(true);
  });

  it('should validate Student Analytics Agent Zod schemas', () => {
    const validAnalyticsInput = { email: 'student@codefortomorrow.org' };
    expect(AnalyticsInputSchema.safeParse(validAnalyticsInput).success).toBe(true);

    const validAnalyticsOutput = {
      student_id: 's_123',
      student_name: 'Sara',
      mastery: { fractions: 0.8 },
      strengths: ['Logic'],
      weaknesses: ['Division'],
      knowledge_gaps: ['Improper fractions'],
      recommended_next_topic: 'Simplifying Fractions',
      recommended_difficulty: 'medium',
      teacher_alerts: [],
      confidence: 0.92
    };
    expect(AnalyticsOutputSchema.safeParse(validAnalyticsOutput).success).toBe(true);
  });

  it('should validate B2B Sales Agent Zod schemas and enforce Human Approval requirement', () => {
    const validB2bInput = {
      organizationName: 'Lycée Ibn Zohr',
      contactName: 'Admin Alami',
      contactEmail: 'admin@ibnzohr.ma'
    };
    expect(B2BSalesInputSchema.safeParse(validB2bInput).success).toBe(true);

    const validB2bOutput = {
      organization_name: 'Lycée Ibn Zohr',
      organization_type: 'school',
      country: 'Morocco',
      contact: 'Admin Alami',
      status: 'outreach_drafted' as const,
      priority: 'high' as const,
      ai_score: 85,
      qualification_notes: 'High potential partner school.',
      outreach_draft: {
        subject: 'Partnership Proposal',
        body: 'Dear Admin...',
        suggested_follow_up_days: 3
      },
      human_approval_required: true,
      next_action: 'Human Approval Required'
    };
    expect(B2BSalesOutputSchema.safeParse(validB2bOutput).success).toBe(true);
  });
});

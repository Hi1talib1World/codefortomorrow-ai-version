import { Request, Response } from 'express';
import {
  createSseClient,
  getAgentDashboard,
  triggerAgentCommand,
  pauseAgent as pauseAgentService,
  resumeAgent as resumeAgentService,
} from '../../core/ai-coach/agentMonitor.service';
import { defaultAIOrchestrator } from '../../core/agents/orchestrator/ai.orchestrator';
import { defaultAgentRegistry } from '../../core/agents/registry/agent.registry';
import AgentExecution from '../../models/agentExecution.model';
import B2BLead from '../../models/b2bLead.model';

export const getAgentsStatus = (_req: Request, res: Response) => {
  const dashboard = getAgentDashboard();
  const registeredAgents = defaultAgentRegistry.listAgents();
  return res.json({
    ...dashboard,
    registry: registeredAgents
  });
};

export const streamAgentEvents = (_req: Request, res: Response) => {
  createSseClient(res);
};

export const postAgentCommand = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;
    const { command } = req.body;

    if (!command || typeof command !== 'string') {
      return res.status(400).json({ message: 'command is required and must be a string' });
    }

    const agent = triggerAgentCommand(agentId, command);
    return res.status(200).json({ message: 'Command queued', agent });
  } catch (error) {
    console.error('Agent command failed:', (error as Error).message);
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const getActiveAgents = getAgentsStatus;
export const sendMessageToAgent = postAgentCommand;

export const pauseAgent = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;
    const agent = pauseAgentService(agentId);
    return res.status(200).json({ message: 'Agent paused', agent });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const resumeAgent = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id;
    const agent = resumeAgentService(agentId);
    return res.status(200).json({ message: 'Agent resumed', agent });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
};

// --- Orchestrated Multi-Agent Platform Controllers ---

export const orchestrateTask = async (req: Request, res: Response) => {
  try {
    const { agentId, taskIntent, inputData } = req.body;
    const userId = (req as any).user?._id?.toString();
    const userRole = (req as any).user?.role || 'guest';

    const result = await defaultAIOrchestrator.processRequest({
      agentId,
      taskIntent,
      inputData,
      userId,
      userRole
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: `Orchestration error: ${(error as Error).message}` });
  }
};

export const generateCurriculum = async (req: Request, res: Response) => {
  try {
    const result = await defaultAIOrchestrator.processRequest({
      agentId: 'curriculum_factory',
      taskIntent: 'Generate Curriculum',
      inputData: req.body,
      userId: (req as any).user?._id?.toString(),
      userRole: (req as any).user?.role
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const analyzeStudent = async (req: Request, res: Response) => {
  try {
    const result = await defaultAIOrchestrator.processRequest({
      agentId: 'student_analytics',
      taskIntent: 'Analyze Student Mastery',
      inputData: req.body,
      userId: (req as any).user?._id?.toString(),
      userRole: (req as any).user?.role
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const processB2BLead = async (req: Request, res: Response) => {
  try {
    const result = await defaultAIOrchestrator.processRequest({
      agentId: 'b2b_sales',
      taskIntent: 'Qualify & Draft Lead Outreach',
      inputData: req.body,
      userId: (req as any).user?._id?.toString(),
      userRole: (req as any).user?.role
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getB2BLeads = async (_req: Request, res: Response) => {
  try {
    const leads = await B2BLead.find().sort({ updatedAt: -1 }).limit(50);
    return res.status(200).json(leads);
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const approveB2BLead = async (req: Request, res: Response) => {
  try {
    const leadId = req.params.id;
    const userId = (req as any).user?._id?.toString() || 'admin_user';

    const lead = await B2BLead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    lead.humanApprovalStatus = 'approved';
    lead.status = 'approved';
    lead.approvedByUserId = userId;
    lead.approvedAt = new Date();

    lead.communicationHistory.push({
      timestamp: new Date(),
      action: 'human_approved',
      details: 'Human supervisor authorized B2B outreach email transmission.',
      performedBy: userId
    });

    await lead.save();

    return res.status(200).json({
      message: 'Outreach draft authorized successfully.',
      lead
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const getExecutionsHistory = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const executions = await AgentExecution.find().sort({ createdAt: -1 }).limit(limit);

    // Calculate aggregated costs & metrics
    const totalCost = executions.reduce((sum, e) => sum + (e.estimatedCostUsd || 0), 0);
    const totalTokens = executions.reduce((sum, e) => sum + (e.totalTokens || 0), 0);

    return res.status(200).json({
      executions,
      summary: {
        totalExecutions: executions.length,
        totalTokens,
        totalCostUsd: Math.round(totalCost * 10000) / 10000
      }
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};

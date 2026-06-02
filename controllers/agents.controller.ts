import { Request, Response } from 'express';
import {
  createSseClient,
  getAgentDashboard,
  triggerAgentCommand,
} from '../services/agentMonitor.service';

export const getAgentsStatus = (_req: Request, res: Response) => {
  const dashboard = getAgentDashboard();
  return res.json(dashboard);
};

export const streamAgentEvents = (_req: Request, res: Response) => {
  createSseClient(res);
};

export const postAgentCommand = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.agentId;
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

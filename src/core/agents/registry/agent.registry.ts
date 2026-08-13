import { AgentInterface } from '../interfaces/agent.interface';
import { CurriculumFactoryAgent } from '../implementations/curriculumFactory.agent';
import { StudentAnalyticsAgent } from '../implementations/studentAnalytics.agent';
import { B2BSalesAgent } from '../implementations/b2bSales.agent';

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agentsMap = new Map<string, AgentInterface>();

  private constructor() {
    // Register default agents
    this.registerAgent(new CurriculumFactoryAgent());
    this.registerAgent(new StudentAnalyticsAgent());
    this.registerAgent(new B2BSalesAgent());
  }

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  public registerAgent(agent: AgentInterface): void {
    if (this.agentsMap.has(agent.id)) {
      console.warn(`[AgentRegistry] Overwriting registered agent: ${agent.id}`);
    }
    this.agentsMap.set(agent.id, agent);
    console.log(`[AgentRegistry] Registered agent: "${agent.name}" (${agent.id})`);
  }

  public getAgent(agentId: string): AgentInterface | undefined {
    return this.agentsMap.get(agentId);
  }

  public listAgents(): Array<{
    id: string;
    name: string;
    description: string;
    capabilities: string[];
    version: string;
  }> {
    return Array.from(this.agentsMap.values()).map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      capabilities: a.capabilities,
      version: a.version
    }));
  }

  public findAgentsByCapability(capability: string): AgentInterface[] {
    return Array.from(this.agentsMap.values()).filter(a =>
      a.capabilities.includes(capability)
    );
  }
}

export const defaultAgentRegistry = AgentRegistry.getInstance();

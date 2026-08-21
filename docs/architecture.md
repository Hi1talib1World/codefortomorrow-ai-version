# Multi-Agent Platform Architecture

## Overview Diagram

```text
                         AI ORCHESTRATOR
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
     CURRICULUM FACTORY   STUDENT ANALYTICS   B2B SALES
          AGENT               AGENT             AGENT
              │                │                │
              └────────────────┼────────────────┘
                               │
                         SHARED SERVICES
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
       Database             AI Models          Knowledge Base
       (MongoDB)         (Gemini 2.5 Flash)    (Lesson Standards)
          │                    │                    │
          └────────────────────┼────────────────────┘
                               │
                    Human / Admin Dashboard
```

## Component Breakdown

1. **`AIOrchestrator` (`src/core/agents/orchestrator/ai.orchestrator.ts`)**:
   - Determines target agent based on explicit `agentId` or natural task intent.
   - Executes agent and logs execution trace to `AgentExecution` collection.

2. **`AgentRegistry` (`src/core/agents/registry/agent.registry.ts`)**:
   - Holds registered agents (`curriculum_factory`, `student_analytics`, `b2b_sales`).
   - Allows seamless addition of future agents such as `ai_teacher` or `parent_support`.

3. **`AIProvider` Abstraction (`src/core/ai/provider/gemini.provider.ts`)**:
   - Encapsulates model provider calls, token counting, cost tracking, and Zod structured JSON validation.

4. **Human-in-the-Loop CRM (`src/models/b2bLead.model.ts`)**:
   - Enforces human authorization before external communications are executed.

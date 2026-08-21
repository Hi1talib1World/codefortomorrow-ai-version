# Developer Guide — Adding New Agents

This guide explains how to add a future agent (e.g. `AI Teacher Agent`) to the platform.

---

## Steps to Implement a New Agent

1. **Define Input & Output Zod Schemas**:
   Create `src/core/agents/implementations/aiTeacher.agent.ts`:
   ```typescript
   export const AiTeacherInputSchema = z.object({ ... });
   export const AiTeacherOutputSchema = z.object({ ... });
   ```

2. **Implement `AgentInterface`**:
   ```typescript
   export class AiTeacherAgent implements AgentInterface {
     public id = 'ai_teacher';
     public name = 'AI Teacher Agent';
     // ...
   }
   ```

3. **Register Agent in `AgentRegistry`**:
   In `src/core/agents/registry/agent.registry.ts`:
   ```typescript
   this.registerAgent(new AiTeacherAgent());
   ```

4. **Add UI Tab in `components/AgentsPage.tsx`**:
   Add tab definition in `AGENT_TABS`.

# Student Privacy & Security Controls

## Security Principles

1. **Role-Based Access Control (RBAC)**:
   - Admin routes (`/api/agents/*`) guarded by `protect` and `adminOnly` middlewares.
   - Least-privilege agent permissions (`read:students`, `write:curriculum`, `read:crm`, `write:crm`).

2. **Student Privacy Safeguards**:
   - No student PII (Personally Identifiable Information) exposed in prompt texts unless necessary.
   - AI recommendation algorithms do not alter student academic transcripts or grades directly without teacher oversight.

3. **Human-in-the-Loop Guardrails**:
   - B2B Sales Agent outreach drafts require explicit admin authorization (`approvedByUserId`) before transmission.

4. **Secrets Management**:
   - `GEMINI_API_KEY` stored exclusively in environment variables (`.env`), never exposed to frontend client code.

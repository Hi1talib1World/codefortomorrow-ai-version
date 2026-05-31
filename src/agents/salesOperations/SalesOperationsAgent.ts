import { Job } from 'bullmq';
import { classifyLead, computeLeadScore, saveLeadEvaluation, saveProposal, saveDeploymentPlan } from '../models/salesModels';
import { invokeGemini } from '../services/geminiService';
import { publishEvent } from '../services/eventBus';

/**
 * B2B Sales & Operations Agent
 * Handles triggers: lead_received, contact_form_submitted, email_inquiry_received, ngo_partnership_request, school_interest_registered
 */
export async function processSalesProposal(job: Job) {
  const lead = job.data as any; // Expected lead information object

  // 1. Classify lead type (NGO, School, Government, Private)
  const classification = await classifyLead(lead);

  // 2. Compute lead score
  const leadScore = await computeLeadScore({ ...lead, classification });

  // 3. Build Gemini prompt for proposal and deployment plan
  const proposalPrompt = `Generate a professional proposal (Markdown) for a ${classification} partner with the following details:\n${JSON.stringify(lead, null, 2)}\nInclude sections: Overview, Solution, Deployment Estimate, Timeline, Cost (if applicable).`;
  const deploymentPrompt = `Create a deployment plan JSON for the above lead. Include fields: students_served, schools_served, deployment_duration_weeks, hardware_requirements, training_sessions, support_requirements.`;

  const [proposalMarkdown, deploymentJson] = await Promise.all([
    invokeGemini(proposalPrompt),
    invokeGemini(deploymentPrompt),
  ]);

  const deploymentPlan = JSON.parse(deploymentJson);

  // 4. Persist evaluation, proposal, and deployment plan
  await saveLeadEvaluation({ ...lead, classification, leadScore });
  await saveProposal({ leadId: lead.id, markdown: proposalMarkdown, leadScore });
  await saveDeploymentPlan({ leadId: lead.id, ...deploymentPlan });

  // 5. Publish events
  await publishEvent('lead_qualified', { leadId: lead.id, leadScore, classification });
  await publishEvent('proposal_generated', { leadId: lead.id });
  await publishEvent('deployment_plan_created', { leadId: lead.id });

  return { events: ['lead_qualified', 'proposal_generated', 'deployment_plan_created'] };
}

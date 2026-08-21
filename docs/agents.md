# Specialized Agents Documentation

This document describes the 3 core specialized AI agents implemented in Code for Tomorrow, their capabilities, inputs/outputs, tools, and permission models.

---

## 1. Curriculum Factory Agent (`curriculum_factory`)

### Responsibilities
- Generates structured, validated educational content, exercises, activities, and quiz assessments.
- Adapts materials to target grade levels, topics, and languages (French, Arabic, English).

### Input Schema (`CurriculumInputSchema`)
```json
{
  "subject": "Mathematics",
  "grade": "6",
  "topic": "Fractions",
  "language": "French",
  "learnerLevel": "beginner",
  "learningObjectives": ["Understand numerators and denominators"],
  "durationMinutes": 40
}
```

### Output Schema (`CurriculumOutputSchema`)
```json
{
  "title": "Les Fractions: Fundamentals",
  "learning_objectives": ["Identify numerators", "Simplify basic fractions"],
  "prerequisites": ["Whole number division"],
  "lesson_structure": [
    { "step": 1, "sectionTitle": "Introduction", "durationMinutes": 10, "keyConcepts": ["Parts of a whole"] }
  ],
  "explanation": "Une fraction représente une partie d'un tout...",
  "activities": [],
  "exercises": [],
  "assessment": [],
  "difficulty": "beginner",
  "estimated_duration": 40
}
```

### Tools
- `CurriculumTool`: Queries MongoDB for existing lessons and stages generated curriculum patches.

---

## 2. Student Analytics Agent (`student_analytics`)

### Responsibilities
- Inspects deterministic student progress data from MongoDB (skill mastery map, quiz scores, XP, lesson history).
- Generates AI diagnostic recommendations without inventing performance metrics.

### Input Schema (`AnalyticsInputSchema`)
```json
{
  "studentId": "student_67890",
  "email": "sara@student.ma",
  "pathId": "python"
}
```

### Output Schema (`AnalyticsOutputSchema`)
```json
{
  "student_id": "student_67890",
  "student_name": "Sara Alami",
  "mastery": { "fractions": 0.72, "addition": 0.91 },
  "strengths": ["Arithmetic", "Loops"],
  "weaknesses": ["Fraction Division"],
  "knowledge_gaps": ["Simplifying mixed fractions"],
  "recommended_next_topic": "Simplifying Fractions",
  "recommended_difficulty": "medium",
  "teacher_alerts": [],
  "confidence": 0.88
}
```

### Tools
- `StudentProfileTool`: Reads deterministic progress from `StudentProgress` and `User` models.

---

## 3. B2B Sales Agent (`b2b_sales`)

### Responsibilities
- Qualifies institutional leads (schools, academies, universities).
- Drafts personalized partnership outreach emails.
- **Human-in-the-Loop Safeguard**: Prohibited from sending external communications autonomously. Requires explicit human supervisor approval.

### Lead State Transitions
```text
New Lead → Outreach Drafted (Pending) → Human Approved → Transmitted
```

### Tools
- `CRMTool`: Manages B2B school lead records and human approval states in MongoDB (`B2BLead`).

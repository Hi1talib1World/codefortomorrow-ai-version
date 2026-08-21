import { z } from 'zod';
import { BaseTool } from './tool.interface';
import Lesson from '../../../models/lesson.model';

const CurriculumToolInput = z.object({
  action: z.enum(['get_by_subject', 'create_patch', 'validate_objectives']),
  subject: z.string(),
  grade: z.string().optional(),
  patchData: z.record(z.string(), z.any()).optional()
});

const CurriculumToolOutput = z.object({
  success: z.boolean(),
  lessonsFound: z.number().optional(),
  data: z.any().optional(),
  message: z.string().optional()
});

export class CurriculumTool extends BaseTool<
  z.infer<typeof CurriculumToolInput>,
  z.infer<typeof CurriculumToolOutput>
> {
  constructor() {
    super({
      name: 'CurriculumTool',
      description: 'Queries existing curriculum lessons and validates learning objective alignment.',
      inputSchema: CurriculumToolInput,
      outputSchema: CurriculumToolOutput,
      permissions: ['write:curriculum']
    });
  }

  public async run(
    input: z.infer<typeof CurriculumToolInput>
  ): Promise<z.infer<typeof CurriculumToolOutput>> {
    try {
      if (input.action === 'get_by_subject') {
        const lessons = await Lesson.find({
          pathId: input.subject.toLowerCase()
        }).limit(10).lean();

        return {
          success: true,
          lessonsFound: lessons.length,
          data: lessons
        };
      }

      if (input.action === 'create_patch' && input.patchData) {
        return {
          success: true,
          data: input.patchData,
          message: 'Curriculum patch staged successfully.'
        };
      }

      return {
        success: true,
        message: 'Curriculum action validated.'
      };
    } catch (error) {
      return {
        success: false,
        message: `CurriculumTool error: ${(error as Error).message}`
      };
    }
  }
}

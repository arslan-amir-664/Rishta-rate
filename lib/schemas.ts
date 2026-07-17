import { z } from 'zod';


export const calculatorSchema = z.object({
  groomName: z.string().min(1, 'Name is required'),
  groomAge: z.number().min(18, 'Must be 18+').max(70, 'Invalid age'),
  groomBackground: z.enum(['wealthy', 'upper-middle', 'middle-class', 'lower-middle']),
  groomIncome: z.number().min(0, 'Income cannot be negative'),
  groomProfession: z.string().min(1, 'Groom profession is required'),
  brideFatherIncome: z.number().min(0, 'Income cannot be negative'),
  brideEmploymentStatus: z.enum(['not-employed', 'student', 'job', 'business']),
  brideProfession: z.string().optional(),
  dowryAmount: z.number().min(0, 'Dowry cannot be negative').optional().default(0),
  dowryDetails: z.array(z.string()).optional(),
});

export const analyzerSchema = z.object({
  scenario: z.string().min(10, 'Please describe the scenario in detail'),
  familyContext: z.string().optional(),
});

export const shareSchema = z.object({
  greedScore: z.number().min(0).max(10),
  humanityScore: z.number().min(0).max(10),
  message: z.string().optional(),
});


export type CalculatorFormData = z.infer<typeof calculatorSchema>;
export type AnalyzerFormData = z.infer<typeof analyzerSchema>;
export type ShareFormData = z.infer<typeof shareSchema>;

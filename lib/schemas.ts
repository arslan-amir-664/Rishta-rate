import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const calculatorSchema = z.object({
  groomName: z.string().min(1, 'Name is required'),
  groomAge: z.number().min(18, 'Must be 18+').max(70, 'Invalid age'),
  groomBackground: z.enum(['wealthy', 'upper-middle', 'middle-class', 'lower-middle']),
  groomIncome: z.number().min(0, 'Income cannot be negative'),
  dowryAmount: z.number().min(0, 'Dowry cannot be negative'),
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

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type CalculatorFormData = z.infer<typeof calculatorSchema>;
export type AnalyzerFormData = z.infer<typeof analyzerSchema>;
export type ShareFormData = z.infer<typeof shareSchema>;

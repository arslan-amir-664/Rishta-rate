export interface CalculatorResult {
  groomName: string;
  greedScore: number;
  humanityScore: number;
  toxicityScore: number;
  islamicEthicsScore: number;
  dowryAmount: number;
  dowryFormatted: string;
  dowryItems: Array<{ id: string; name: string; value: number }>;
  aiCommentary: string;
  satiricalResponse: string;
  quote: string;
  timestamp: Date;
}
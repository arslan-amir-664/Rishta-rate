'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProtectedFeature } from '@/components/protected-feature';
import { SkeletonCard } from '@/components/loading-skeleton';
import { analyzerSchema } from '@/lib/schemas';
import { generateAICommentary, generateSatiricalResponse, calculateGreedScore, calculateToxicityIndex, calculateIslamicEthicsScore, calculateHumanityScore } from '@/lib/calculations';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Send, AlertTriangle, TrendingUp, Heart, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AnalysisResult {
  scenario: string;
  redFlags: string[];
  materialDemands: string;
  emotionalPressure: string;
  familyPressure: string;
  estimatedBurden: string;
  affordabilityWarning: string;
  debtRisk: string;
  greedScore: number;
  toxicityScore: number;
  humanityScore: number;
  islamicScore: number;
  aiCommentary: string;
  satiricalResponse: string;
  timestamp: Date;
}

const mockAnalyses = [
  {
    scenario: 'Software engineer in Dubai demanding Civic and 15 tola gold',
    redFlags: ['Material demands excessive for marriage', 'Luxury car expectations', 'Specific gold weight requirement'],
    materialDemands: 'Vehicle (Rs. 45-50 lakh) + Gold (Rs. 20+ lakh) = Rs. 65-70 lakh+',
    emotionalPressure: 'High - "If you can\'t afford this, don\'t marry my daughter"',
    familyPressure: 'Moderate - Extended family involvement in demands',
    estimatedBurden: 'Rs. 70 lakh - would require 5-6 years of salary for average father',
    affordabilityWarning: 'SEVERE - Beyond reasonable middle-class affordability',
    debtRisk: 'Extreme - High probability of family debt',
  },
  {
    scenario: 'Government officer asking for cash, furniture and wedding expenses',
    redFlags: ['Direct cash demand unusual', 'Expects family to cover wedding costs', 'Furniture as dowry item'],
    materialDemands: 'Cash (Rs. 15-20 lakh) + Furniture (Rs. 5-8 lakh) + Wedding (Rs. 10-15 lakh)',
    emotionalPressure: 'Moderate - Professional but transactional tone',
    familyPressure: 'Low to Moderate - Individual expectations',
    estimatedBurden: 'Rs. 30-40 lakh + wedding organization stress',
    affordabilityWarning: 'MODERATE - Achievable but strains finances',
    debtRisk: 'High - Likely requires loan for cash component',
  },
  {
    scenario: 'Doctor in Karachi wants 25 lakh and gold',
    redFlags: ['High cash demand', 'Additional gold expectation', 'Professional status implies affordability'],
    materialDemands: 'Cash (Rs. 25 lakh) + Gold (Rs. 10+ lakh) = Rs. 35 lakh+',
    emotionalPressure: 'High - "Professional doctors deserve quality"',
    familyPressure: 'High - Medical family expectations and status',
    estimatedBurden: 'Rs. 35+ lakh - 3-4 years middle-class salary',
    affordabilityWarning: 'SEVERE - Unrealistic for most families',
    debtRisk: 'Extreme - Family debt almost certain',
  },
];

export default function AnalyzerPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(analyzerSchema),
    defaultValues: {
      scenario: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      // Simulate analysis with delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate mock analysis based on input keywords
      const mockAnalysis = mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
      
      // Generate dynamic scores based on scenario length and keywords
      const keywordMatches = [
        'expensive', 'luxury', 'gold', 'car', 'cash', 'lakh', 'crore'
      ].filter(keyword => data.scenario.toLowerCase().includes(keyword)).length;
      
      const greedScore = Math.min(40 + keywordMatches * 10, 95);
      const humanityScore = Math.max(100 - greedScore, 5);
      const toxicityScore = greedScore;
      const islamicScore = Math.max(100 - greedScore, 10);

      const result: AnalysisResult = {
        scenario: data.scenario,
        redFlags: mockAnalysis.redFlags,
        materialDemands: mockAnalysis.materialDemands,
        emotionalPressure: mockAnalysis.emotionalPressure,
        familyPressure: mockAnalysis.familyPressure,
        estimatedBurden: mockAnalysis.estimatedBurden,
        affordabilityWarning: mockAnalysis.affordabilityWarning,
        debtRisk: mockAnalysis.debtRisk,
        greedScore: greedScore,
        toxicityScore: toxicityScore,
        humanityScore: humanityScore,
        islamicScore: islamicScore,
        aiCommentary: generateAICommentary(greedScore, humanityScore, toxicityScore),
        satiricalResponse: generateSatiricalResponse(greedScore),
        timestamp: new Date(),
      };

      setAnalysis(result);
      form.reset();
      toast.success('Analysis complete');
    } catch (error) {
      toast.error('Failed to analyze scenario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <ProtectedFeature featureName="Rishta Analyzer">
          <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  Rishta Proposal Analyzer
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Describe the proposal scenario and get a detailed analysis of material demands, emotional pressure, and relationship toxicity.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Input Section */}
                <motion.div
                  className="lg:col-span-1 p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50 h-fit"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-6">Enter Rishta Scenario</h2>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="scenario" className="text-foreground">
                        Describe the Proposal
                      </Label>
                      <Textarea
                        id="scenario"
                        placeholder="E.g., Software engineer in Dubai demanding Civic and 15 tola gold"
                        {...form.register('scenario')}
                        className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground mt-2 resize-none"
                        rows={4}
                      />
                      {form.formState.errors.scenario && (
                        <p className="text-xs text-destructive mt-1">
                          {form.formState.errors.scenario.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={loading || form.formState.isSubmitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {loading ? 'Analyzing...' : 'Analyze Now'}
                    </Button>
                  </form>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
                    <p className="text-xs text-muted-foreground font-semibold mb-2">EXAMPLES:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Software engineer demanding Civic and gold</li>
                      <li>• Doctor asking for 25 lakh cash</li>
                      <li>• Government officer + furniture</li>
                    </ul>
                  </div>
                </motion.div>

                {/* Analysis Results */}
                {analysis && (
                  <motion.div
                    className="lg:col-span-2 space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {/* Scores Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-card/50 backdrop-blur border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Greed Score</p>
                        <p className={`text-2xl font-bold ${analysis.greedScore > 80 ? 'text-destructive' : analysis.greedScore > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {analysis.greedScore}%
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 backdrop-blur border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Toxicity Index</p>
                        <p className={`text-2xl font-bold ${analysis.toxicityScore > 75 ? 'text-destructive' : analysis.toxicityScore > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {analysis.toxicityScore}%
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 backdrop-blur border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Humanity Score</p>
                        <p className={`text-2xl font-bold ${analysis.humanityScore > 50 ? 'text-green-500' : 'text-yellow-500'}`}>
                          {analysis.humanityScore}%
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 backdrop-blur border border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Islamic Ethics</p>
                        <p className={`text-2xl font-bold ${analysis.islamicScore > 50 ? 'text-accent' : 'text-destructive'}`}>
                          {analysis.islamicScore}%
                        </p>
                      </div>
                    </div>

                    {/* Red Flags */}
                    <div className="p-6 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <h3 className="text-lg font-semibold text-foreground">Red Flags</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysis.redFlags.map((flag, i) => (
                          <li key={i} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-destructive">•</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Material Demands */}
                    <div className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Material Demands Detected</h3>
                      <p className="text-foreground">{analysis.materialDemands}</p>
                    </div>

                    {/* Emotional & Family Pressure */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-card/50 backdrop-blur border border-border/50">
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Emotional Pressure</p>
                        <p className="text-sm text-foreground">{analysis.emotionalPressure}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 backdrop-blur border border-border/50">
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Family Pressure</p>
                        <p className="text-sm text-foreground">{analysis.familyPressure}</p>
                      </div>
                    </div>

                    {/* Financial Burden */}
                    <div className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Financial Burden Analysis</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Estimated Dowry Burden</p>
                          <p className="text-foreground font-semibold">{analysis.estimatedBurden}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Affordability Warning</p>
                          <p className={`text-foreground font-semibold ${analysis.affordabilityWarning.includes('SEVERE') ? 'text-destructive' : 'text-yellow-500'}`}>
                            {analysis.affordabilityWarning}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Debt Risk</p>
                          <p className={`text-foreground font-semibold ${analysis.debtRisk.includes('Extreme') ? 'text-destructive' : analysis.debtRisk.includes('High') ? 'text-yellow-500' : 'text-green-500'}`}>
                            {analysis.debtRisk}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* AI Commentary */}
                    <div className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50">
                      <h3 className="text-lg font-semibold text-foreground mb-2">AI Commentary</h3>
                      <p className="text-foreground italic bg-muted/30 p-3 rounded">{analysis.aiCommentary}</p>
                    </div>

                    {/* Satirical Response */}
                    <div className="p-6 rounded-lg bg-primary/10 border border-primary/20">
                      <h3 className="text-lg font-semibold text-foreground mb-2">Satirical Reveal</h3>
                      <p className="text-foreground italic bg-primary/5 p-3 rounded">{analysis.satiricalResponse}</p>
                    </div>
                  </motion.div>
                )}

                {loading && (
                  <div className="lg:col-span-2">
                    <SkeletonCard />
                  </div>
                )}
              </div>
            </div>
          </section>
        </ProtectedFeature>
      </main>

      <Footer />
    </div>
  );
}

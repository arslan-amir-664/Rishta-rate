'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProtectedFeature } from '@/components/protected-feature';
import { ScoreMeter } from '@/components/score-meter';
import { calculatorSchema } from '@/lib/schemas';
import { calculateGreedScore, calculateHumanityScore, calculateToxicityIndex, calculateIslamicEthicsScore, formatPKR, generateShareableQuote, generateAICommentary, generateSatiricalResponse } from '@/lib/calculations';
import { useAuth } from '@/lib/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DowryItem {
  id: string;
  name: string;
  value: number;
}

export default function CalculatorPage() {
  const { setCalculatorResult } = useAuth();
  const [results, setResults] = useState<any>(null);
  const [dowryItems, setDowryItems] = useState<DowryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemValue, setNewItemValue] = useState('');

  const form = useForm({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      groomName: '',
      groomAge: 25,
      groomBackground: 'middle-class',
      groomIncome: 0,
      dowryAmount: 0,
      dowryDetails: [],
    },
  });

  const totalDowryFromItems = dowryItems.reduce((sum, item) => sum + item.value, 0);

  const addDowryItem = () => {
    if (!newItemName.trim() || !newItemValue.trim()) {
      toast.error('Please enter both item name and value');
      return;
    }
    const value = parseFloat(newItemValue);
    if (isNaN(value) || value < 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    setDowryItems([...dowryItems, { id: Date.now().toString(), name: newItemName, value }]);
    setNewItemName('');
    setNewItemValue('');
    toast.success('Item added');
  };

  const removeDowryItem = (id: string) => {
    setDowryItems(dowryItems.filter(item => item.id !== id));
  };

  const onSubmit = async (data: any) => {
    try {
      const finalDowryAmount = totalDowryFromItems > 0 ? totalDowryFromItems : data.dowryAmount;
      
      if (finalDowryAmount === 0) {
        toast.error('Please enter dowry amount or add dowry items');
        return;
      }

      const greedScore = calculateGreedScore(finalDowryAmount, data.groomBackground);
      const humanityScore = calculateHumanityScore(finalDowryAmount, data.dowryDetails || []);
      const toxicityScore = calculateToxicityIndex(greedScore, finalDowryAmount);
      const islamicScore = calculateIslamicEthicsScore(greedScore, humanityScore);

      const aiCommentary = generateAICommentary(greedScore, humanityScore, toxicityScore);
      const satiricalResponse = generateSatiricalResponse(greedScore);
      const quote = generateShareableQuote(greedScore, humanityScore);

      const resultData = {
        groomName: data.groomName,
        greedScore: Math.round(greedScore),
        humanityScore: Math.round(humanityScore),
        toxicityScore: Math.round(toxicityScore),
        islamicEthicsScore: Math.round(islamicScore),
        dowryAmount: finalDowryAmount,
        dowryFormatted: formatPKR(finalDowryAmount),
        dowryItems,
        aiCommentary,
        satiricalResponse,
        quote,
        timestamp: new Date(),
      };

      setResults(resultData);
      setCalculatorResult(resultData);
      toast.success('Your reality check is ready!');
    } catch (error) {
      toast.error('Error calculating scores');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <ProtectedFeature featureName="Dowry Calculator">
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  Dowry Calculator
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Enter the groom&apos;s profile and dowry details to calculate your wedding reality score.
                </p>
              </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <motion.div
                className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="text-xl font-semibold text-foreground mb-6">Groom Details</h2>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <Label htmlFor="groomName" className="text-foreground">Groom&apos;s Name</Label>
                    <Input
                      id="groomName"
                      placeholder="e.g., Ahmed"
                      {...form.register('groomName')}
                      className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground mt-1"
                    />
                    {form.formState.errors.groomName && (
                      <p className="text-xs text-destructive mt-1">{form.formState.errors.groomName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="groomAge" className="text-foreground">Age</Label>
                      <Input
                        id="groomAge"
                        type="number"
                        {...form.register('groomAge', { valueAsNumber: true })}
                        className="bg-input border-border/50 text-foreground mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="groomBackground" className="text-foreground">Background</Label>
                      <select
                        {...form.register('groomBackground')}
                        className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground mt-1"
                      >
                        <option value="wealthy">Wealthy</option>
                        <option value="upper-middle">Upper Middle Class</option>
                        <option value="middle-class">Middle Class</option>
                        <option value="lower-middle">Lower Middle Class</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="groomIncome" className="text-foreground">Monthly Income (PKR)</Label>
                    <Input
                      id="groomIncome"
                      type="number"
                      placeholder="e.g., 150000"
                      {...form.register('groomIncome', { valueAsNumber: true })}
                      className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dowryAmount" className="text-foreground">Total Dowry Amount (PKR)</Label>
                    <Input
                      id="dowryAmount"
                      type="number"
                      placeholder="e.g., 5000000"
                      value={totalDowryFromItems > 0 ? totalDowryFromItems : form.watch('dowryAmount')}
                      onChange={(e) => form.setValue('dowryAmount', parseFloat(e.target.value) || 0)}
                      className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground mt-1"
                    />
                    {totalDowryFromItems > 0 && (
                      <p className="text-xs text-primary mt-1">From items: {formatPKR(totalDowryFromItems)}</p>
                    )}
                  </div>

                  {/* Add Dowry Items Section */}
                  <div className="border-t border-border/50 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Add Dowry Items</h3>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="itemName" className="text-sm text-muted-foreground">Item Name</Label>
                          <Input
                            id="itemName"
                            placeholder="e.g., Car"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="itemValue" className="text-sm text-muted-foreground">Value (PKR)</Label>
                          <Input
                            id="itemValue"
                            type="number"
                            placeholder="e.g., 4000000"
                            value={newItemValue}
                            onChange={(e) => setNewItemValue(e.target.value)}
                            className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground mt-1"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={addDowryItem}
                        variant="outline"
                        className="w-full border-border/50 hover:bg-muted"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>

                      {/* Items List */}
                      {dowryItems.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {dowryItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{formatPKR(item.value)}</p>
                              </div>
                              <button
                                onClick={() => removeDowryItem(item.id)}
                                className="p-2 rounded hover:bg-destructive/20 text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Calculating...' : 'Calculate Reality Score'}
                  </Button>
                </form>
              </motion.div>

              {/* Results Section */}
              {results && (
                <motion.div
                  className="p-8 rounded-lg bg-gradient-to-br from-card/80 to-card/40 backdrop-blur border border-border/50"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-foreground mb-2">Your Reality Check</h2>
                    <p className="text-muted-foreground">Total Dowry Demand: <span className="text-primary font-semibold">{results.dowryFormatted}</span></p>
                  </div>

                  {/* Score Meters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="flex justify-center">
                      <ScoreMeter score={results.greedScore} label="Greed Score" color="red" size="md" />
                    </div>
                    <div className="flex justify-center">
                      <ScoreMeter score={results.humanityScore} label="Humanity Score" color="green" size="md" />
                    </div>
                    <div className="text-center">
                      <div className="mb-2">
                        <p className="text-sm text-muted-foreground mb-2">Toxicity Index</p>
                        <p className={`text-2xl font-bold ${results.toxicityScore > 75 ? 'text-destructive' : results.toxicityScore > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {results.toxicityScore}%
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="mb-2">
                        <p className="text-sm text-muted-foreground mb-2">Islamic Ethics</p>
                        <p className="text-2xl font-bold text-accent">
                          {results.islamicEthicsScore}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Pressure */}
                  <div className="border-t border-border/50 pt-6 mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Financial Pressure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Groom Name</p>
                        <p className="font-semibold text-foreground">{results.groomName}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Affordability Warning</p>
                        <p className={`font-semibold ${results.greedScore > 80 ? 'text-destructive' : results.greedScore > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                          {results.greedScore > 80 ? 'SEVERE' : results.greedScore > 50 ? 'MODERATE' : 'LOW'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Commentary */}
                  <div className="border-t border-border/50 pt-6 mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3">AI Commentary</h3>
                    <p className="text-foreground bg-muted/50 p-4 rounded-lg italic">
                      &quot;{results.aiCommentary}&quot;
                    </p>
                  </div>

                  {/* Satirical Response */}
                  <div className="border-t border-border/50 pt-6 mb-6 bg-primary/10 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Satirical Reveal</h3>
                    <p className="text-foreground italic">
                      &quot;{results.satiricalResponse}&quot;
                    </p>
                  </div>

                  {/* Dowry Items Breakdown */}
                  {results.dowryItems && results.dowryItems.length > 0 && (
                    <div className="border-t border-border/50 pt-6 mb-6">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Dowry Breakdown</h3>
                      <div className="space-y-2">
                        {results.dowryItems.map((item: DowryItem) => (
                          <div key={item.id} className="flex justify-between p-2 bg-muted rounded">
                            <span className="text-foreground">{item.name}</span>
                            <span className="font-semibold text-primary">{formatPKR(item.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Link
                      href="/share"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                    >
                      Generate Share Card <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>

            {!results && (
              <motion.div
                className="mt-12 p-8 rounded-lg bg-card/30 backdrop-blur border border-border/50 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">How it works</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  The Greed Score is calculated based on the dowry amount relative to the groom&apos;s income and background. The Humanity Score is based on the dowry amount and family expectations. Both scores are on a scale of 0-10, where 10 is the extreme.
                </p>
              </motion.div>
            )}
            </div>
          </section>
        </ProtectedFeature>
      </main>

      <Footer />
    </div>
  );
}

'use client';

import { PROFESSIONS } from '@/lib/professions';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ScoreMeter } from '@/components/score-meter';
import { calculatorSchema } from '@/lib/schemas';
import {
  FURNITURE_ITEMS,
  ELECTRONICS_ITEMS,
  JEWELRY_QUANTITY_ITEMS,
  JEWELRY_FIXED_ITEMS,
  VEHICLE_ITEMS,
  DOWRY_CATEGORIES,
} from '@/lib/dowry-items';
import { calculateGreedScore, calculateHumanityScore, calculateToxicityIndex, calculateIslamicEthicsScore, formatPKR, generateShareableQuote, generateAICommentary, generateSatiricalResponse } from '@/lib/calculations';
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

export default function CalculatorPage() {
  //const { setCalculatorResult } = useAuth();
  const [results, setResults] = useState<any>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>([]);
  const [selectedElectronics, setSelectedElectronics] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [goldTola, setGoldTola] = useState<number>(0);
  const [selectedJewelryFixed, setSelectedJewelryFixed] = useState<string[]>([]);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [propertyAmount, setPropertyAmount] = useState<number>(0);
  const [brideEmploymentStatus, setBrideEmploymentStatus] = useState('not-employed');

  const form = useForm({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      groomName: '',
      groomAge: 25,
      groomBackground: 'middle-class',
      groomIncome: 0,
      groomProfession: '',
      brideFatherIncome: 0,
      brideEmploymentStatus: 'not-employed',
      brideProfession: '',
      dowryAmount: 0,
      dowryDetails: [],
    },
  });
  console.log(form.formState.errors);

  const toggleSelection = (list: string[], setList: (v: string[]) => void, id: string) => {
    if (list.includes(id)) {
      setList(list.filter((i) => i !== id));
    } else {
      setList([...list, id]);
    }
  };

  const furnitureTotal = FURNITURE_ITEMS
    .filter((i) => selectedFurniture.includes(i.id))
    .reduce((sum, i) => sum + i.price, 0);

  const electronicsTotal = ELECTRONICS_ITEMS
    .filter((i) => selectedElectronics.includes(i.id))
    .reduce((sum, i) => sum + i.price, 0);

  const vehicleTotal = VEHICLE_ITEMS
    .filter((i) => selectedVehicles.includes(i.id))
    .reduce((sum, i) => sum + i.price, 0);

  const goldTotal = goldTola * JEWELRY_QUANTITY_ITEMS[0].unitPrice;

  const jewelryFixedTotal = JEWELRY_FIXED_ITEMS
    .filter((i) => selectedJewelryFixed.includes(i.id))
    .reduce((sum, i) => sum + i.price, 0);

  const jewelryTotal = goldTotal + jewelryFixedTotal;

  const totalDowryFromItems =
    furnitureTotal + electronicsTotal + vehicleTotal + jewelryTotal + cashAmount + propertyAmount;

  const selectedDowryItemsList = [
    ...FURNITURE_ITEMS.filter((i) => selectedFurniture.includes(i.id)).map((i) => ({ name: i.name, value: i.price })),
    ...ELECTRONICS_ITEMS.filter((i) => selectedElectronics.includes(i.id)).map((i) => ({ name: i.name, value: i.price })),
    ...VEHICLE_ITEMS.filter((i) => selectedVehicles.includes(i.id)).map((i) => ({ name: i.name, value: i.price })),
    ...(goldTola > 0 ? [{ name: `Gold (${goldTola} tola)`, value: goldTotal }] : []),
    ...JEWELRY_FIXED_ITEMS.filter((i) => selectedJewelryFixed.includes(i.id)).map((i) => ({ name: i.name, value: i.price })),
    ...(cashAmount > 0 ? [{ name: 'Cash', value: cashAmount }] : []),
    ...(propertyAmount > 0 ? [{ name: 'Property', value: propertyAmount }] : []),
  ];

  const onSubmit = async (data: any) => {
    try {
      const finalDowryAmount = totalDowryFromItems;

      if (finalDowryAmount === 0) {
        toast.error('Please select at least one dowry item, gold, cash, or property amount');
        return;
      }

      const greedScore = calculateGreedScore(
        finalDowryAmount,
        data.groomBackground,
        data.groomIncome,
        data.brideFatherIncome,
        data.brideEmploymentStatus
      );
      const humanityScore = calculateHumanityScore(
        finalDowryAmount,
        data.dowryDetails || [],
        data.brideEmploymentStatus,
        data.brideFatherIncome,
        data.groomIncome
      );
      const toxicityScore = calculateToxicityIndex(greedScore, humanityScore);
      const islamicScore = calculateIslamicEthicsScore(greedScore, humanityScore);

      const aiCommentary = generateAICommentary(greedScore, humanityScore, toxicityScore);
      const satiricalResponse = generateSatiricalResponse(greedScore);
      const quote = generateShareableQuote(greedScore, humanityScore);

      const resultData = {
        groomName: data.groomName,
        groomProfession: data.groomProfession,
        brideFatherIncome: data.brideFatherIncome,
        brideEmploymentStatus: data.brideEmploymentStatus,
        brideProfession: data.brideProfession,
        greedScore: Math.round(greedScore),
        humanityScore: Math.round(humanityScore),
        toxicityScore: Math.round(toxicityScore),
        islamicEthicsScore: Math.round(islamicScore),
        dowryAmount: finalDowryAmount,
        dowryFormatted: formatPKR(finalDowryAmount),
        dowryItems: selectedDowryItemsList,
        aiCommentary,
        satiricalResponse,
        quote,
        timestamp: new Date(),
      };

      setResults(resultData);
      localStorage.setItem('calculatorResult', JSON.stringify(resultData));
      toast.success('Your reality check is ready!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error('Error calculating scores');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        
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
                    <Label htmlFor="groomProfession" className="text-foreground">Groom's Profession</Label>
                    <select
                      {...form.register('groomProfession')}
                      className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground mt-1"
                    >
                      <option value="">Select Profession</option>
                      {PROFESSIONS.map((prof) => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                    </select>
                    {form.formState.errors.groomProfession && (
                      <p className="text-xs text-destructive mt-1">{form.formState.errors.groomProfession.message}</p>
                    )}
                  </div>

                  {/* Bride & Family Details Section */}
                  <div className="border-t border-border/50 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Bride & Family Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="brideFatherIncome" className="text-foreground">Bride's Father's Monthly Income (PKR)</Label>
                        <Input
                          id="brideFatherIncome"
                          type="number"
                          placeholder="e.g., 100000"
                          {...form.register('brideFatherIncome', { valueAsNumber: true })}
                          className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="brideEmploymentStatus" className="text-foreground">Bride's Employment Status</Label>
                        <select
                          {...form.register('brideEmploymentStatus')}
                          onChange={(e) => {
                            form.setValue('brideEmploymentStatus', e.target.value as any);
                            setBrideEmploymentStatus(e.target.value);
                          }}
                          className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground mt-1"
                        >
                          <option value="not-employed">Not Employed / Housewife</option>
                          <option value="student">Student</option>
                          <option value="job">Employed (Job)</option>
                          <option value="business">Business Owner</option>
                        </select>
                      </div>

                      {(brideEmploymentStatus === 'job' || brideEmploymentStatus === 'business') && (
                        <div>
                          <Label htmlFor="brideProfession" className="text-foreground">Bride's Profession</Label>
                          <select
                            {...form.register('brideProfession')}
                            className="w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground mt-1"
                          >
                            <option value="">Select Profession</option>
                            {PROFESSIONS.map((prof) => (
                              <option key={prof} value={prof}>{prof}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                
                  {/* Add Dowry Items Section */}
                  <div className="border-t border-border/50 pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Select Dowry Items</h3>

                    {/* Furniture */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Furniture</h4>
                      <div className="space-y-2">
                        {FURNITURE_ITEMS.map((item) => (
                          <label key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-lg cursor-pointer">
                            <span className="flex items-center gap-2 text-sm text-foreground">
                              <input
                                type="checkbox"
                                checked={selectedFurniture.includes(item.id)}
                                onChange={() => toggleSelection(selectedFurniture, setSelectedFurniture, item.id)}
                              />
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">{formatPKR(item.price)}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Electronics */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Electronics</h4>
                      <div className="space-y-2">
                        {ELECTRONICS_ITEMS.map((item) => (
                          <label key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-lg cursor-pointer">
                            <span className="flex items-center gap-2 text-sm text-foreground">
                              <input
                                type="checkbox"
                                checked={selectedElectronics.includes(item.id)}
                                onChange={() => toggleSelection(selectedElectronics, setSelectedElectronics, item.id)}
                              />
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">{formatPKR(item.price)}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Jewelry */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Jewelry</h4>
                      <div className="space-y-2">
                        <div className="p-2 bg-muted rounded-lg">
                          <Label htmlFor="goldTola" className="text-sm text-foreground">Gold (tola)</Label>
                          <Input
                            id="goldTola"
                            type="number"
                            min={0}
                            placeholder="e.g., 5"
                            value={goldTola || ''}
                            onChange={(e) => setGoldTola(parseFloat(e.target.value) || 0)}
                            className="bg-input border-border/50 text-foreground mt-1"
                          />
                          {goldTola > 0 && (
                            <p className="text-xs text-primary mt-1">{formatPKR(goldTotal)}</p>
                          )}
                        </div>
                        {JEWELRY_FIXED_ITEMS.map((item) => (
                          <label key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-lg cursor-pointer">
                            <span className="flex items-center gap-2 text-sm text-foreground">
                              <input
                                type="checkbox"
                                checked={selectedJewelryFixed.includes(item.id)}
                                onChange={() => toggleSelection(selectedJewelryFixed, setSelectedJewelryFixed, item.id)}
                              />
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">{formatPKR(item.price)}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Vehicle */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Vehicle</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {VEHICLE_ITEMS.map((item) => (
                          <label key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-lg cursor-pointer">
                            <span className="flex items-center gap-2 text-sm text-foreground">
                              <input
                                type="checkbox"
                                checked={selectedVehicles.includes(item.id)}
                                onChange={() => toggleSelection(selectedVehicles, setSelectedVehicles, item.id)}
                              />
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">{formatPKR(item.price)}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Cash */}
                    <div className="mb-6">
                      <Label htmlFor="cashAmount" className="text-foreground">Cash (PKR)</Label>
                      <Input
                        id="cashAmount"
                        type="number"
                        min={0}
                        placeholder="e.g., 500000"
                        value={cashAmount || ''}
                        onChange={(e) => setCashAmount(parseFloat(e.target.value) || 0)}
                        className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground mt-1"
                      />
                    </div>

                    {/* Property */}
                    <div className="mb-2">
                      <Label htmlFor="propertyAmount" className="text-foreground">Property (PKR)</Label>
                      <Input
                        id="propertyAmount"
                        type="number"
                        min={0}
                        placeholder="e.g., 5000000"
                        value={propertyAmount || ''}
                        onChange={(e) => setPropertyAmount(parseFloat(e.target.value) || 0)}
                        className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground mt-1"
                      />
                    </div>

                    {/* Total Dowry Amount - read only, auto-calculated */}
                    <div className="border-t border-border/50 pt-4">
                      <Label className="text-foreground">Total Dowry Amount (PKR)</Label>
                      <div className="mt-1 px-3 py-2 bg-muted border border-border/50 rounded-md text-foreground font-semibold">
                        {formatPKR(totalDowryFromItems)}
                      </div>
                    </div>
                  </div>

                  

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-6"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Calculating...' : 'What Groom Should Get 😈'}
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
                          {results.greedScore >= 90 ? '🚨 EXTREME — Bhai ye toh looting hai!' :
                            results.greedScore >= 75 ? '🔴 SEVERE — Larki ke baap ko doctor dikhao' :
                            results.greedScore >= 55 ? '🟠 HIGH — Thoda zyada ho gaya yaar' :
                            results.greedScore >= 35 ? '🟡 MODERATE — Chalta hai, bas barely' :
                            '🟢 LOW — MashAllah, decent insaan lag raha hai'}
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
                        {results.dowryItems.map((item: { name: string; value: number }, idx: number) => (
                          <div key={idx} className="flex justify-between p-2 bg-muted rounded">
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
      </main>

      <Footer />
    </div>
  );
}

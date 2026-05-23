'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProtectedFeature } from '@/components/protected-feature';
import { StatisticsCard } from '@/components/statistics-card';
import { formatPKR, estimateWeddingCost, calculateDownPayment, calculateRecoveryImpact } from '@/lib/calculations';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function SimulatorPage() {
  const [guests, setGuests] = useState(300);
  const [categoryPerHead, setCategoryPerHead] = useState(25000);
  const [loan, setLoan] = useState(2000000);
  const [monthlyIncome, setMonthlyIncome] = useState(150000);

  const totalCost = estimateWeddingCost(guests, categoryPerHead);
  const downPayment = calculateDownPayment(totalCost);
  const recoveryImpact = calculateRecoveryImpact(loan, monthlyIncome);

  // Generate recovery timeline
  const timeline = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    remaining: loan * Math.max(1 - (i + 1) * (1 / 12), 0),
    payment: loan / 12,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <ProtectedFeature featureName="Financial Simulator">
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  Wedding Financial Simulator
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  See the real financial impact of your wedding on your future. Plan ahead, make informed decisions.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                {/* Input Controls */}
                <motion.div
                  className="lg:col-span-1 p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50 space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-xl font-semibold text-foreground">Inputs</h2>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-foreground">Number of Guests</Label>
                      <span className="text-sm font-semibold text-primary">{guests}</span>
                    </div>
                    <Slider
                      min={50}
                      max={1000}
                      step={10}
                      value={[guests]}
                      onValueChange={(value) => setGuests(value[0])}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-foreground">Cost per Guest (PKR)</Label>
                      <span className="text-sm font-semibold text-primary">{categoryPerHead.toLocaleString()}</span>
                    </div>
                    <Slider
                      min={10000}
                      max={100000}
                      step={5000}
                      value={[categoryPerHead]}
                      onValueChange={(value) => setCategoryPerHead(value[0])}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-foreground">Loan Amount (PKR)</Label>
                      <span className="text-sm font-semibold text-primary">{loan.toLocaleString()}</span>
                    </div>
                    <Slider
                      min={0}
                      max={5000000}
                      step={100000}
                      value={[loan]}
                      onValueChange={(value) => setLoan(value[0])}
                    />
                  </div>

                  <div>
                    <Label htmlFor="income" className="text-foreground block mb-2">Monthly Income (PKR)</Label>
                    <Input
                      id="income"
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="bg-input border-border/50 text-foreground"
                    />
                  </div>
                </motion.div>

                {/* Statistics */}
                <motion.div
                  className="lg:col-span-2 space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <StatisticsCard
                    title="Total Wedding Cost"
                    value={formatPKR(totalCost)}
                    subtext={`${guests} guests × Rs. ${categoryPerHead.toLocaleString()}`}
                    icon={<DollarSign className="w-5 h-5" />}
                  />
                  <StatisticsCard
                    title="Down Payment Required"
                    value={formatPKR(downPayment)}
                    subtext="(30% of total cost)"
                    icon={<TrendingUp className="w-5 h-5" />}
                  />
                  <div className={`p-4 rounded-lg border ${
                    recoveryImpact > 5
                      ? 'bg-destructive/10 border-destructive/50'
                      : 'bg-primary/10 border-primary/50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 mt-1 flex-shrink-0 ${
                        recoveryImpact > 5 ? 'text-destructive' : 'text-primary'
                      }`} />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Recovery Impact</h4>
                        <p className={`text-sm ${recoveryImpact > 5 ? 'text-destructive' : 'text-primary'}`}>
                          {recoveryImpact.toFixed(1)}/10 Financial Strain
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {recoveryImpact > 7 ? 'This loan will significantly impact your financial freedom.' : 
                           recoveryImpact > 4 ? 'This is a moderate financial commitment.' :
                           'This is manageable with your income level.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recovery Timeline */}
              <motion.div
                className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50 mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">12-Month Repayment Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem',
                      }}
                      formatter={(value: number) => formatPKR(value)}
                    />
                    <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                    <Line
                      type="monotone"
                      dataKey="remaining"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      name="Remaining Balance"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Insights */}
              <motion.div
                className="p-6 rounded-lg bg-card/30 backdrop-blur border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Financial Insights</h3>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Total Investment:</span> You'll spend {formatPKR(totalCost)} on your wedding day.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Monthly Payment:</span> If you take a loan of {formatPKR(loan)}, you'll need to pay {formatPKR(loan / 12)} monthly for recovery.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Impact on Income:</span> This represents {((loan / 12) / monthlyIncome * 100).toFixed(1)}% of your monthly income.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Recommendation:</span> {
                      recoveryImpact > 7 ? 'This is very high. Consider scaling back or extending the payment period.' :
                      recoveryImpact > 4 ? 'This is manageable. Plan your budget carefully.' :
                      'This is comfortable. You can afford this comfortably.'
                    }
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        </ProtectedFeature>
      </main>

      <Footer />
    </div>
  );
}

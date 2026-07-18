'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { StatisticsCard } from '@/components/statistics-card';
import { formatPKR, estimateWeddingCost, calculateDownPayment, calculateRecoveryImpact } from '@/lib/calculations';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, AlertCircle, Building2 } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function SimulatorPage() {
  const [guests, setGuests] = useState(300);
  const [categoryPerHead, setCategoryPerHead] = useState(3000);
  const [venueCost, setVenueCost] = useState(500000);
  const [loan, setLoan] = useState(2000000);
  const [monthlyIncome, setMonthlyIncome] = useState(150000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [repaymentMonths, setRepaymentMonths] = useState(12);

  const foodCost = estimateWeddingCost(guests, categoryPerHead);
  const totalCost = foodCost + venueCost;
  const downPayment = (totalCost * downPaymentPercent) / 100;
  const recoveryImpact = calculateRecoveryImpact(loan, monthlyIncome);
  const monthlyPayment = repaymentMonths > 0 ? loan / repaymentMonths : 0;
  const incomePercent = monthlyIncome > 0 ? ((monthlyPayment / monthlyIncome) * 100).toFixed(1) : '0';

  const timeline = Array.from({ length: repaymentMonths }, (_, i) => ({
    month: `M${i + 1}`,
    remaining: Math.max(loan - (i + 1) * monthlyPayment, 0),
    payment: monthlyPayment,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
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
                See the real financial impact of your wedding. Plan ahead, make informed decisions.
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

                {/* Guests */}
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

                {/* Cost per head */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-foreground">Cost per Guest (PKR)</Label>
                    <span className="text-sm font-semibold text-primary">{categoryPerHead.toLocaleString()}</span>
                  </div>
                  <Slider
                    min={500}
                    max={20000}
                    step={100}
                    value={[categoryPerHead]}
                    onValueChange={(value) => setCategoryPerHead(value[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Food, decoration, per person estimate</p>
                </div>

                {/* Venue cost */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-foreground">Venue / Hall Cost (PKR)</Label>
                    <span className="text-sm font-semibold text-primary">{formatPKR(venueCost)}</span>
                  </div>
                  <Slider
                    min={50000}
                    max={5000000}
                    step={50000}
                    value={[venueCost]}
                    onValueChange={(value) => setVenueCost(value[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Banquet hall / marquee fixed booking fee</p>
                </div>

                {/* Loan */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-foreground">Loan Amount (PKR)</Label>
                    <span className="text-sm font-semibold text-primary">{formatPKR(loan)}</span>
                  </div>
                  <Slider
                    min={0}
                    max={20000000}
                    step={500000}
                    value={[loan]}
                    onValueChange={(value) => setLoan(value[0])}
                  />
                </div>

                {/* Monthly income */}
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

                {/* Down payment % */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-foreground">Down Payment</Label>
                    <span className="text-sm font-semibold text-primary">{downPaymentPercent}%</span>
                  </div>
                  <Slider
                    min={10}
                    max={100}
                    step={5}
                    value={[downPaymentPercent]}
                    onValueChange={(value) => setDownPaymentPercent(value[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">% of total cost you pay upfront</p>
                </div>

                {/* Repayment months */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-foreground">Repayment Period</Label>
                    <span className="text-sm font-semibold text-primary">{repaymentMonths} months</span>
                  </div>
                  <Slider
                    min={3}
                    max={60}
                    step={1}
                    value={[repaymentMonths]}
                    onValueChange={(value) => setRepaymentMonths(value[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">How many months to repay the loan</p>
                </div>
              </motion.div>

              {/* Statistics */}
              <motion.div
                className="lg:col-span-2 space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <StatisticsCard
                  title="Food & Decor Cost"
                  value={formatPKR(foodCost)}
                  subtext={`${guests} guests × Rs. ${categoryPerHead.toLocaleString()} per head`}
                  icon={<DollarSign className="w-5 h-5" />}
                />
                <StatisticsCard
                  title="Venue / Hall Cost"
                  value={formatPKR(venueCost)}
                  subtext="Fixed banquet/marquee booking fee"
                  icon={<Building2 className="w-5 h-5" />}
                />
                <StatisticsCard
                  title="Total Wedding Cost"
                  value={formatPKR(totalCost)}
                  subtext={`Food + Venue combined`}
                  icon={<TrendingUp className="w-5 h-5" />}
                />
                <StatisticsCard
                  title="Down Payment Required"
                  value={formatPKR(downPayment)}
                  subtext={`${downPaymentPercent}% of total cost upfront`}
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
                        Monthly payment: <span className="font-semibold text-foreground">{formatPKR(monthlyPayment)}</span> for {repaymentMonths} months
                        {' '}({incomePercent}% of your income)
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {recoveryImpact > 7 ? '🚨 This loan will seriously impact your financial freedom. Consider reducing.' :
                         recoveryImpact > 4 ? '⚠️ This is a moderate commitment. Plan your budget carefully.' :
                         '✅ This is manageable with your income level.'}
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
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {repaymentMonths}-Month Repayment Timeline
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Paying {formatPKR(monthlyPayment)} per month for {repaymentMonths} months
              </p>
              {loan === 0 ? (
                <p className="text-center text-muted-foreground py-12">Set a loan amount to see the repayment timeline.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="var(--muted-foreground)" tickFormatter={(v) => formatPKR(v)} tick={{ fontSize: 11 }} />
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
              )}
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
                  <span className="font-semibold text-foreground">Total Wedding Cost:</span> You will spend {formatPKR(totalCost)} — {formatPKR(foodCost)} on food/decor and {formatPKR(venueCost)} on venue.
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Upfront Payment:</span> You need {formatPKR(downPayment)} ready on day one ({downPaymentPercent}% of total).
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Monthly Loan Payment:</span> {formatPKR(monthlyPayment)} per month for {repaymentMonths} months — that is {incomePercent}% of your monthly income.
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Total Loan Cost:</span> You will pay back {formatPKR(loan)} over {repaymentMonths} months.
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Recommendation:</span>{' '}
                  {recoveryImpact > 7
                    ? 'Bhai ye bohat zyada hai. Guest list kam karo, venue change karo, ya repayment period badhao. 🚨'
                    : recoveryImpact > 4
                    ? 'Manageable hai lekin budget ka khayal rakho. Emergency fund mat bhulo. ⚠️'
                    : 'MashAllah, comfortable range mein hai. Aage barho! ✅'}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
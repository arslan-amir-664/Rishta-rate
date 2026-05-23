'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { StatisticsCard } from '@/components/statistics-card';
import { useAuth } from '@/lib/auth-store';
import { mockAdminStats, mockDashboardCharts } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { redirect } from 'next/navigation';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, Share2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    redirect('/');
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to access the admin dashboard.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {user?.name}. Here&apos;s your platform overview.</p>
            </motion.div>

            {/* Key Statistics */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div variants={item}>
                <StatisticsCard
                  title="Total Users"
                  value={mockAdminStats.totalUsers.toLocaleString()}
                  trend={12}
                  icon={<Users className="w-5 h-5" />}
                />
              </motion.div>
              <motion.div variants={item}>
                <StatisticsCard
                  title="Calculations Run"
                  value={mockAdminStats.calculationsRun.toLocaleString()}
                  trend={25}
                  icon={<TrendingUp className="w-5 h-5" />}
                />
              </motion.div>
              <motion.div variants={item}>
                <StatisticsCard
                  title="Stories Shared"
                  value={mockAdminStats.storiesShared}
                  trend={8}
                  icon={<Share2 className="w-5 h-5" />}
                />
              </motion.div>
              <motion.div variants={item}>
                <StatisticsCard
                  title="Avg Greed Score"
                  value={mockAdminStats.averageGreedScore}
                  subtext="Out of 10"
                />
              </motion.div>
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Daily Users Chart */}
              <motion.div
                className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Daily Active Users</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockDashboardCharts.dailyUsers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem',
                      }}
                      cursor={{ stroke: 'var(--primary)' }}
                    />
                    <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={{ fill: 'var(--primary)', r: 5 }}
                      name="Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Score Distribution Chart */}
              <motion.div
                className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Score Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockDashboardCharts.scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '0.5rem',
                      }}
                      cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
                    />
                    <Legend wrapperStyle={{ color: 'var(--foreground)' }} />
                    <Bar
                      dataKey="count"
                      fill="var(--primary)"
                      name="Number of Users"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Admin Actions */}
            <motion.div
              className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button
                  onClick={() => toast.success('Feature coming soon!')}
                  className="px-4 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium text-sm"
                >
                  View All Users
                </button>
                <button
                  onClick={() => toast.success('Feature coming soon!')}
                  className="px-4 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium text-sm"
                >
                  Manage Content
                </button>
                <button
                  onClick={() => toast.success('Feature coming soon!')}
                  className="px-4 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium text-sm"
                >
                  View Reports
                </button>
                <button
                  onClick={() => toast.success('Feature coming soon!')}
                  className="px-4 py-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium text-sm"
                >
                  Settings
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

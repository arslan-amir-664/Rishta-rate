'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { StatisticsCard } from '@/components/statistics-card';
import { mockQuotes, mockAdminStats } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Users, Share2, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

export default function Home() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % mockQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Know the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Real Rate</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A satirical reality check on wedding expectations and dowry dynamics in Pakistan. Because honesty is the best policy.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/calculator"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  Try Calculator <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/learn"
                  className="px-8 py-3 border border-border/50 bg-card/50 backdrop-blur hover:bg-card transition-colors font-semibold rounded-lg"
                >
                  Learn More
                </Link>
              </div>

              {/* Quote Carousel */}
              <motion.div
                className="mt-12 p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50"
                key={quoteIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-lg italic text-foreground">"{mockQuotes[quoteIndex]}"</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 sm:py-20 bg-card/30 backdrop-blur border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div variants={item}>
                <StatisticsCard
                  title="Users Calculated"
                  value={mockAdminStats.totalUsers.toLocaleString()}
                  icon={<Users className="w-5 h-5" />}
                />
              </motion.div>
              <motion.div variants={item}>
                <StatisticsCard
                  title="Calculations Run"
                  value={mockAdminStats.calculationsRun.toLocaleString()}
                  icon={<Zap className="w-5 h-5" />}
                />
              </motion.div>
              <motion.div variants={item}>
                <StatisticsCard
                  title="Stories Shared"
                  value={mockAdminStats.storiesShared}
                  icon={<Share2 className="w-5 h-5" />}
                />
              </motion.div>
              <motion.div variants={item}>
                <StatisticsCard
                  title="Avg Greed Score"
                  value={mockAdminStats.averageGreedScore}
                  subtext="(Out of 10)"
                  icon={<TrendingUp className="w-5 h-5" />}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                How RishtaRate Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real tools. Real insights. Real satire.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                {
                  title: 'Greed Calculator',
                  description: 'Input the groom details and dowry amount, get your personalized greed score.',
                  icon: '📊',
                  href: '/calculator',
                },
                {
                  title: 'AI Analyzer',
                  description: 'Get AI-powered analysis of your wedding scenario with honest feedback.',
                  icon: '🤖',
                  href: '/analyzer',
                },
                {
                  title: 'Financial Simulator',
                  description: 'See the real impact of wedding expenses on your financial future.',
                  icon: '💰',
                  href: '/simulator',
                },
                {
                  title: 'Community Stories',
                  description: 'Read real stories from people navigating this beautiful madness.',
                  icon: '📖',
                  href: '/community',
                },
                {
                  title: 'AI Auntie Chat',
                  description: 'Chat with our sarcastic AI auntie for unfiltered, hilarious advice.',
                  icon: '👵',
                  href: '/auntie',
                },
                {
                  title: 'Share Generator',
                  description: 'Generate and share your results with family and friends (at your own risk).',
                  icon: '📱',
                  href: '/share',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50 hover:border-border transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <Link href={feature.href} className="block h-full">
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-card/50 backdrop-blur border-y border-border/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Know the Real Rate?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start by calculating your personalized greed score. It&apos;s free, anonymous, and painfully honest.
              </p>
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Calculate Now <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

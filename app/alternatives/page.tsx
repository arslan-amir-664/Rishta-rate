'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { mockAlternatives } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

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

export default function AlternativesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Dowry Alternatives
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Modern alternatives to traditional cash dowry. Invest in the future, not the past.
              </p>
            </motion.div>

            <motion.div
              className="space-y-8"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {mockAlternatives.map((alternative, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="p-8 rounded-lg bg-card/50 backdrop-blur border border-border/50 hover:border-border transition-all"
                >
                  <h3 className="text-2xl font-bold text-foreground mb-6">{alternative.title}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pros */}
                    <div>
                      <h4 className="flex items-center gap-2 text-lg font-semibold text-green-500 mb-4">
                        <CheckCircle className="w-5 h-5" />
                        Advantages
                      </h4>
                      <ul className="space-y-3">
                        {alternative.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                            <span className="text-foreground">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div>
                      <h4 className="flex items-center gap-2 text-lg font-semibold text-red-500 mb-4">
                        <XCircle className="w-5 h-5" />
                        Challenges
                      </h4>
                      <ul className="space-y-3">
                        {alternative.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                            <span className="text-foreground">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Key Insight */}
            <motion.div
              className="mt-12 p-8 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-4">Why Consider Alternatives?</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Traditional dowry is often based on outdated customs that don&apos;t reflect modern values. 
                  Alternatives offer a way to honor tradition while investing in the couple&apos;s future.
                </p>
                <p className="text-muted-foreground">
                  Consider these options as a way to:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Build shared assets that benefit the couple long-term
                  </li>
                  <li className="text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Empower the bride with education or career support
                  </li>
                  <li className="text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Create financial security for the new family
                  </li>
                  <li className="text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    Reduce financial burden and stress
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Negotiation Tips */}
            <motion.div
              className="mt-8 p-8 rounded-lg bg-card/30 backdrop-blur border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold text-foreground mb-4">Negotiation Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Do&apos;s</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Have open conversations with both families</li>
                    <li>✓ Present alternatives as investments in the future</li>
                    <li>✓ Document agreements in writing</li>
                    <li>✓ Be flexible and willing to compromise</li>
                    <li>✓ Focus on mutual respect and understanding</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Don&apos;t&apos;s</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✗ Make demands without explanation</li>
                    <li>✗ Use dowry negotiation as a power play</li>
                    <li>✗ Ignore family values and beliefs</li>
                    <li>✗ Sign documents without full understanding</li>
                    <li>✗ Put the bride in an uncomfortable position</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

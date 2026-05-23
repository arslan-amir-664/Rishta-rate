'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { mockLearnTopics } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const categories = ['All', 'Legal', 'Finance', 'Negotiation', 'Psychology', 'Culture'];

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

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTopics =
    selectedCategory === 'All'
      ? mockLearnTopics
      : mockLearnTopics.filter((topic) => topic.category === selectedCategory);

  const handleReadMore = (topic: any) => {
    toast.success(`Loading: ${topic.title}`);
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
                Learning Center
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Educational resources on dowry laws, negotiation strategies, financial planning, and more.
              </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center mb-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card/50 border border-border/50 text-foreground hover:border-border'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>

            {/* Topics Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredTopics.map((topic) => (
                <motion.div
                  key={topic.id}
                  variants={item}
                  className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50 hover:border-border transition-all hover:shadow-lg hover:-translate-y-1 group cursor-pointer"
                  onClick={() => handleReadMore(topic)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <BookOpen className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-primary/10 text-primary">
                      {topic.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    Deep dive into {topic.title.toLowerCase()} with expert insights and practical tips.
                  </p>

                  <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {filteredTopics.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-muted-foreground">
                  No topics found in this category. Try selecting another.
                </p>
              </motion.div>
            )}

            {/* Featured Resource */}
            <motion.div
              className="p-8 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-4">Popular Right Now</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Understanding Dowry Laws in Pakistan
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    A comprehensive guide to dowry laws, your rights, and legal protections.
                  </p>
                  <button
                    onClick={() => toast.success('Opening guide...')}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Read Guide →
                  </button>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Negotiation Tips & Tricks
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Practical strategies for negotiating dowry amounts and expectations.
                  </p>
                  <button
                    onClick={() => toast.success('Opening guide...')}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Read Guide →
                  </button>
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

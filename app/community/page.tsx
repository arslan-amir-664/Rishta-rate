'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { mockCommunityStories } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
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

export default function CommunityPage() {
  const [likes, setLikes] = useState<Record<number, boolean>>({});

  const toggleLike = (id: number) => {
    setLikes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    toast.success('Added to favorites');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Community Stories
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real people, real experiences, real lessons. Read how others navigated the wedding madness.
              </p>
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {mockCommunityStories.map((story) => (
                <motion.article
                  key={story.id}
                  variants={item}
                  className="overflow-hidden rounded-lg bg-card/50 backdrop-blur border border-border/50 hover:border-border transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 sm:h-64 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover opacity-70 hover:opacity-90 transition-opacity"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                        Personal Story
                      </span>
                    </div>

                    <Link href={`#story-${story.id}`} className="block group">
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {story.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{story.excerpt}</p>
                    </Link>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">{story.author}</span>
                        <span className="mx-2">•</span>
                        {new Date(story.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleLike(story.id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                            likes[story.id]
                              ? 'bg-primary/20 text-primary'
                              : 'hover:bg-muted text-muted-foreground'
                          }`}
                          title="Like this story"
                        >
                          <Heart
                            className="w-4 h-4"
                            fill={likes[story.id] ? 'currentColor' : 'none'}
                          />
                          <span className="text-xs font-medium">
                            {likes[story.id] ? 'Liked' : 'Like'}
                          </span>
                        </button>
                        <button
                          onClick={() => toast.success('Comment feature coming soon!')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          title="Comment on this story"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Comment</span>
                        </button>
                        <button
                          onClick={() => toast.success('Shared to clipboard!')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          title="Share this story"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="text-xs font-medium">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {/* Share Your Story CTA */}
            <motion.div
              className="mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur border border-border/50 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-2">Have a story to share?</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                We&apos;re looking for real stories about navigating weddings, dowry, and family expectations.
              </p>
              <button
                onClick={() => toast.success('Story submission feature coming soon!')}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Submit Your Story
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

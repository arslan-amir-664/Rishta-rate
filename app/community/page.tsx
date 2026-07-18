'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, X, PenLine } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Story {
  id: string;
  name: string;
  title: string;
  content: string;
  city: string | null;
  likes: number;
  createdAt: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CommunityPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [expandedStory, setExpandedStory] = useState<Story | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTokens, setDeleteTokens] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    title: '',
    content: '',
    city: '',
  });

  useEffect(() => {
    fetchStories();
    const liked = JSON.parse(localStorage.getItem('liked_stories') || '{}');
    setLikedStories(liked);
    const tokens = JSON.parse(localStorage.getItem('story_tokens') || '{}');
    setDeleteTokens(tokens);
  }, []);

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/stories');
      const data = await res.json();
      setStories(data.stories || []);
    } catch {
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    if (likedStories[id]) return;

    try {
      const res = await fetch(`/api/stories/${id}/like`, { method: 'POST' });
      const data = await res.json();

      setStories((prev) =>
        prev.map((s) => (s.id === id ? { ...s, likes: data.likes } : s))
      );

      const updated = { ...likedStories, [id]: true };
      setLikedStories(updated);
      localStorage.setItem('liked_stories', JSON.stringify(updated));
      toast.success('Liked!');
    } catch {
      toast.error('Failed to like');
    }
  };

  const handleShare = (story: Story) => {
    navigator.clipboard.writeText(`${story.title} — read on RishtaRate: ${window.location.href}`);
    toast.success('Link copied to clipboard!');
  };

  const handleDelete = async (id: string) => {
    const token = deleteTokens[id];
    if (!token) return;

    if (!confirm('Delete your story? This cannot be undone.')) return;

    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) throw new Error('Failed');

      setStories((prev) => prev.filter((s) => s.id !== id));
      const tokens = { ...deleteTokens };
      delete tokens[id];
      setDeleteTokens(tokens);
      localStorage.setItem('story_tokens', JSON.stringify(tokens));
      toast.success('Story deleted.');
    } catch {
      toast.error('Could not delete story.');
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || form.title.trim().length < 5) {
      toast.error('Title is too short');
      return;
    }
    if (!form.content.trim() || form.content.trim().length < 50) {
      toast.error('Story must be at least 50 characters');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStories((prev) => [data.story, ...prev]);

      // Save delete token so user can delete their own story
      const tokens = JSON.parse(localStorage.getItem('story_tokens') || '{}');
      tokens[data.story.id] = data.deleteToken;
      localStorage.setItem('story_tokens', JSON.stringify(tokens));
      setDeleteTokens(tokens);

      setShowModal(false);
      setForm({ name: '', title: '', content: '', city: '' });
      toast.success('Your story is live! Shukriya beta 🌹');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
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

            {/* Stories List */}
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : stories.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg mb-2">Koi story nahi abhi tak.</p>
                <p>Be the first to share yours!</p>
              </div>
            ) : (
              <motion.div
                className="space-y-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {stories.map((story) => (
                  <motion.article
                    key={story.id}
                    variants={item}
                    className="rounded-lg bg-card/50 backdrop-blur border border-border/50 hover:border-border transition-all hover:shadow-lg"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          Personal Story
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(story.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                        {story.title}
                      </h3>

                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {story.content}
                      </p>

                      {story.content.length > 200 && (
                        <button
                          onClick={() => setExpandedStory(story)}
                          className="text-sm text-primary hover:text-primary/80 font-medium mb-4"
                        >
                          Read full story
                        </button>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">{story.name}</span>
                          {story.city && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{story.city}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleLike(story.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                              likedStories[story.id]
                                ? 'bg-primary/20 text-primary'
                                : 'hover:bg-muted text-muted-foreground'
                            }`}
                          >
                            <Heart
                              className="w-4 h-4"
                              fill={likedStories[story.id] ? 'currentColor' : 'none'}
                            />
                            <span className="text-xs font-medium">{story.likes}</span>
                          </button>

                          <button
                            onClick={() => handleShare(story)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Share</span>
                          </button>

                          {deleteTokens[story.id] && (
                            <button
                              onClick={() => handleDelete(story.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                            >
                              <X className="w-4 h-4" />
                              <span className="text-xs font-medium">Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              className="mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur border border-border/50 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-2">Have a story to share?</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Real stories help real people. Share your experience anonymously if you want.
              </p>
              <Button
                onClick={() => setShowModal(true)}
                className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                <PenLine className="w-4 h-4 mr-2" />
                Share Your Story
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Submit Story Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              className="w-full max-w-lg bg-card border border-border/50 rounded-2xl p-6 space-y-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Share Your Story</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <Label className="text-foreground">Your Name (optional)</Label>
                <Input
                  placeholder="Leave blank to post as Anonymous"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 bg-input border-border/50"
                />
              </div>

              <div>
                <Label className="text-foreground">City (optional)</Label>
                <Input
                  placeholder="e.g. Karachi, Lahore"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-1 bg-input border-border/50"
                />
              </div>

              <div>
                <Label className="text-foreground">Title <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g. How we said no to unreasonable demands"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 bg-input border-border/50"
                />
              </div>

              <div>
                <Label className="text-foreground">Your Story <span className="text-destructive">*</span></Label>
                <textarea
                  placeholder="Share your experience... (min 50 characters)"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={6}
                  className="mt-1 w-full px-3 py-2 bg-input border border-border/50 rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">{form.content.length} characters (min 50)</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border-border/50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {submitting ? 'Posting...' : 'Post Story'}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By posting you agree to keep it respectful. No personal attacks or hate speech.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Read Full Story Modal */}
      <AnimatePresence>
        {expandedStory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setExpandedStory(null)}
          >
            <motion.div
              className="w-full max-w-lg bg-card border border-border/50 rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground pr-4">{expandedStory.title}</h2>
                <button onClick={() => setExpandedStory(null)} className="text-muted-foreground hover:text-foreground shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {expandedStory.name}
                {expandedStory.city && ` • ${expandedStory.city}`}
                {` • ${new Date(expandedStory.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`}
              </p>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{expandedStory.content}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
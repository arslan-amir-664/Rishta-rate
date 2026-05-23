'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ProtectedFeature } from '@/components/protected-feature';
import { ScoreMeter } from '@/components/score-meter';
import { EmptyState } from '@/components/empty-state';
import { useAuth } from '@/lib/auth-store';
import { motion } from 'framer-motion';
import { Copy, Download, Share2, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';

export default function SharePage() {
  const { calculatorResult } = useAuth();
  const [previewMode, setPreviewMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!calculatorResult) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
          <ProtectedFeature featureName="Share Generator">
            <section className="py-20">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <EmptyState
                  title="No Results Yet"
                  description="Complete the Dowry Calculator first to generate shareable results."
                  actionText="Go to Calculator"
                  actionHref="/calculator"
                />
              </div>
            </section>
          </ProtectedFeature>
        </main>
        <Footer />
      </div>
    );
  }

  const handleDownload = async () => {
    if (shareCardRef.current) {
      try {
        const canvas = await html2canvas(shareCardRef.current, {
          backgroundColor: null,
          scale: 2,
        });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `rishta-rate-${calculatorResult.groomName}.png`;
        link.click();
        toast.success('Image downloaded!');
      } catch (error) {
        toast.error('Failed to download image');
      }
    }
  };

  const handleCopyText = () => {
    const text = `My RishtaRate Results

Groom: ${calculatorResult.groomName}
Total Dowry Demand: ${calculatorResult.dowryFormatted}

Greed Score: ${calculatorResult.greedScore}%
Humanity Score: ${calculatorResult.humanityScore}%
Toxicity Index: ${calculatorResult.toxicityScore}%
Islamic Ethics: ${calculatorResult.islamicEthicsScore}%

"${calculatorResult.satiricalResponse}"

Check yours at RishtaRate.com`;
    
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'RishtaRate - My Wedding Reality Check',
      text: `My Greed Score: ${calculatorResult.greedScore}%, Humanity: ${calculatorResult.humanityScore}%. "${calculatorResult.satiricalResponse}"`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <ProtectedFeature featureName="Share Generator">
          <section className="py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  Share Your Results
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Your RishtaRate calculation is ready to share. Download, copy, or share directly with family and friends (at your own risk).
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Share Card Preview */}
                <motion.div
                  className="lg:col-span-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="relative">
                    {/* Share Card */}
                    <div
                      ref={shareCardRef}
                      className="p-8 rounded-lg bg-gradient-to-br from-primary/15 via-card/70 to-accent/15 border border-border/50 space-y-6 backdrop-blur-sm"
                      style={{ backgroundColor: 'rgba(20,20,30,0.8)' }}
                    >
                      {/* Header */}
                      <div className="text-center border-b border-border/50 pb-4">
                        <h3 className="text-2xl font-bold text-foreground mb-1">My RishtaRate Results</h3>
                        <p className="text-sm text-muted-foreground">A Reality Check on Wedding Expectations</p>
                      </div>

                      {/* Main Info */}
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm mb-1">For</p>
                        <p className="text-xl font-semibold text-foreground">{calculatorResult.groomName}</p>
                        <p className="text-lg font-bold text-primary mt-2">{calculatorResult.dowryFormatted}</p>
                        <p className="text-sm text-muted-foreground">Dowry Demand</p>
                      </div>

                      {/* Score Grid */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">GREED SCORE</p>
                          <p className={`text-3xl font-bold ${calculatorResult.greedScore > 80 ? 'text-red-500' : calculatorResult.greedScore > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {calculatorResult.greedScore}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">HUMANITY SCORE</p>
                          <p className={`text-3xl font-bold ${calculatorResult.humanityScore > 50 ? 'text-green-500' : 'text-yellow-500'}`}>
                            {calculatorResult.humanityScore}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">TOXICITY INDEX</p>
                          <p className={`text-3xl font-bold ${calculatorResult.toxicityScore > 75 ? 'text-red-500' : calculatorResult.toxicityScore > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                            {calculatorResult.toxicityScore}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">ISLAMIC ETHICS</p>
                          <p className="text-3xl font-bold text-accent">
                            {calculatorResult.islamicEthicsScore}%
                          </p>
                        </div>
                      </div>

                      {/* Commentary */}
                      <div className="text-center space-y-3">
                        <p className="text-sm italic text-foreground bg-muted/30 p-3 rounded">
                          {calculatorResult.aiCommentary}
                        </p>
                        <p className="text-lg font-semibold italic text-primary">
                          "{calculatorResult.satiricalResponse}"
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="text-center border-t border-border/50 pt-4">
                        <p className="text-xs text-muted-foreground font-semibold">RishtaRate.com</p>
                        <p className="text-xs text-muted-foreground mt-1">A satirical reality check on wedding expectations</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Actions Sidebar */}
                <motion.div
                  className="p-6 rounded-lg bg-card/50 backdrop-blur border border-border/50 h-fit space-y-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3 className="text-lg font-semibold text-foreground">Share Options</h3>

                  <Button
                    onClick={handleShare}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Results
                  </Button>

                  <Button
                    onClick={handleCopyText}
                    variant="outline"
                    className="w-full border-border/50 hover:bg-muted"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Text
                  </Button>

                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full border-border/50 hover:bg-muted"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>

                  {/* Quick Info */}
                  <div className="border-t border-border/50 pt-4 space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Groom</p>
                      <p className="text-foreground">{calculatorResult.groomName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Total Demand</p>
                      <p className="text-foreground">{calculatorResult.dowryFormatted}</p>
                    </div>
                  </div>

                  {/* Back to Calculator */}
                  <Link
                    href="/calculator"
                    className="block text-center text-xs text-primary hover:text-primary/80 transition-colors mt-4"
                  >
                    ← Calculate Another
                  </Link>
                </motion.div>
              </div>

              {/* Social Preview Cards */}
              <motion.div
                className="mt-12 p-8 rounded-lg bg-card/30 backdrop-blur border border-border/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-6">How it will look on social media:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Twitter/X Preview */}
                  <div className="p-4 rounded border border-border/50 bg-slate-900">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/20"></div>
                        <div>
                          <p className="text-white font-semibold text-sm">@rishta_reality</p>
                          <p className="text-muted-foreground text-xs">just now</p>
                        </div>
                      </div>
                      <p className="text-white text-sm">
                        My Greed Score: {calculatorResult.greedScore}% | Humanity: {calculatorResult.humanityScore}%
                      </p>
                      <p className="text-sm italic text-primary">"{calculatorResult.satiricalResponse}"</p>
                      <p className="text-primary text-xs">rishta-rate.com</p>
                    </div>
                  </div>

                  {/* WhatsApp Preview */}
                  <div className="p-4 rounded border border-border/50 bg-green-900/20">
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-green-400">My RishtaRate Results</p>
                      <p className="text-foreground">
                        Groom: {calculatorResult.groomName}<br />
                        Dowry: {calculatorResult.dowryFormatted}<br />
                        Greed: {calculatorResult.greedScore}% | Humanity: {calculatorResult.humanityScore}%
                      </p>
                      <p className="text-muted-foreground italic text-xs mt-2">"{calculatorResult.satiricalResponse}"</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                className="mt-8 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <p className="text-sm text-foreground">
                  <span className="font-semibold">⚠️ Disclaimer:</span> Share responsibly. We&apos;re not responsible for awkward family dinners.
                </p>
              </motion.div>
            </div>
          </section>
        </ProtectedFeature>
      </main>

      <Footer />
    </div>
  );
}

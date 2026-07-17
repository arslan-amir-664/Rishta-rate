'use client';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { EmptyState } from '@/components/empty-state';
import { motion } from 'framer-motion';
import { Copy, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { toPng } from 'html-to-image';

export default function SharePage() {
  const [calculatorResult, setCalculatorResultState] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('calculatorResult');
    if (stored) setCalculatorResultState(JSON.parse(stored));
  }, []);

  if (!mounted) return null;

  if (!calculatorResult) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1">
            <section className="py-20">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <EmptyState
                  title="No Results Yet"
                  description="Complete the Dowry Calculator first to generate shareable results."
                  action={{
                    label: 'Go to Calculator',
                    onClick: () => router.push('/calculator'),
                  }}
/>
              </div>
            </section>
        </main>
        <Footer />
      </div>
    );
  }

  const handleDownload = async () => {
    if (shareCardRef.current) {
      try {
        toast.loading('Generating image...');
        const dataUrl = await toPng(shareCardRef.current, {
          cacheBust: true,
          pixelRatio: 3,
          backgroundColor: '#fdf6e3',
        });
        toast.dismiss();
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `rishta-rate-${calculatorResult.groomName}.png`;
        link.click();
        toast.success('Downloaded! Ready for Instagram story 📸');
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to download — try again');
        console.error(error);
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

Check yours at rishta-rate.vercel.app`;
    
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
                      className="rounded-2xl overflow-hidden"
                      style={{ background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9f0 50%, #fdf0d5 100%)', border: '3px solid #c8960c' }}
                    >
                      {/* Gold ornamental top border */}
                      <div className="h-3" style={{ background: 'repeating-linear-gradient(90deg, #c8960c 0px, #f5d060 10px, #c8960c 20px)' }} />

                      {/* Header */}
                      <div className="px-8 pt-6 pb-4 text-center" style={{ borderBottom: '2px solid #c8960c' }}>
                        <p className="text-xs tracking-widest font-bold" style={{ color: '#c8960c' }}>— بسم اللہ الرحمٰن الرحیم —</p>
                        <h2 className="text-4xl font-black mt-2 mb-1" style={{ color: '#1a0a00', fontFamily: 'serif' }}>
                          🏅 Rishta Aunty Certificate
                        </h2>
                        <p className="text-sm font-semibold" style={{ color: '#7a4f00' }}>Officially Certified by RishtaRate™ </p>
                      </div>

                      {/* Body */}
                      <div className="px-8 py-6 space-y-5">

                        {/* This certifies */}
                        <div className="text-center">
                          <p className="text-xs uppercase tracking-widest font-bold" style={{ color: '#7a4f00' }}>This is to certify that</p>
                          <div className="mt-3 px-6 py-4 rounded-xl" style={{ background: 'rgba(200,150,12,0.1)', border: '1.5px dashed #c8960c' }}>
                            <p className="text-xs" style={{ color: '#7a4f00' }}>Rishta aaya tha</p>
                            <p className="text-3xl font-black my-1" style={{ color: '#1a0a00' }}>🎩 {calculatorResult.groomName}</p>
                            <p className="text-xs" style={{ color: '#7a4f00' }}>ki taraf se — aur unhon ne maanga</p>
                            <p className="text-2xl font-black mt-1" style={{ color: '#c0392b' }}>{calculatorResult.dowryFormatted}</p>
                            <p className="text-xs mt-1" style={{ color: '#7a4f00' }}>ka jahaiz. Allah maaf kare. 🤲</p>
                          </div>
                        </div>

                        {/* Scores as official grades */}
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-center mb-3" style={{ color: '#7a4f00' }}>Official Jahaiz Audit Report</p>
                          <div className="space-y-2">
                            {[
                              { label: 'Greed Score (Lalach Index)', value: calculatorResult.greedScore, reverse: true },
                              { label: 'Humanity Score (Insaaniyat)', value: calculatorResult.humanityScore, reverse: false },
                              { label: 'Toxicity Index (Zeher Level)', value: calculatorResult.toxicityScore, reverse: true },
                              { label: 'Islamic Ethics (Deen-daari)', value: calculatorResult.islamicEthicsScore, reverse: false },
                            ].map(({ label, value, reverse }) => {
                              const grade = reverse
                                ? value >= 80 ? { g: 'F', c: '#c0392b' } : value >= 60 ? { g: 'D', c: '#e67e22' } : value >= 40 ? { g: 'C', c: '#f39c12' } : value >= 20 ? { g: 'B', c: '#27ae60' } : { g: 'A+', c: '#1a7a4a' }
                                : value >= 80 ? { g: 'A+', c: '#1a7a4a' } : value >= 60 ? { g: 'B', c: '#27ae60' } : value >= 40 ? { g: 'C', c: '#f39c12' } : value >= 20 ? { g: 'D', c: '#e67e22' } : { g: 'F', c: '#c0392b' };
                              return (
                                <div key={label} className="flex items-center justify-between px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid #e8d5a3' }}>
                                  <span className="text-sm font-medium" style={{ color: '#1a0a00' }}>{label}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold" style={{ color: '#7a4f00' }}>{value}/100</span>
                                    <span className="text-lg font-black w-10 text-center" style={{ color: grade.c }}>{grade.g}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Verdict stamp area */}
                        <div className="rounded-xl p-4 relative" style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid #e8d5a3' }}>
                          <p className="text-xs font-bold uppercase mb-1" style={{ color: '#7a4f00' }}>Aunty Ji ka Faisla 👜</p>
                          <p className="text-sm italic" style={{ color: '#1a0a00' }}>"{calculatorResult.satiricalResponse}"</p>
                        </div>

                        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.7)', border: '1.5px solid #e8d5a3' }}>
                          <p className="text-xs font-bold uppercase mb-1" style={{ color: '#7a4f00' }}>AI Aunty ka Tajzia 🤖</p>
                          <p className="text-sm" style={{ color: '#1a0a00' }}>{calculatorResult.aiCommentary}</p>
                        </div>

                        {/* Stamp */}
                        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1.5px dashed #c8960c' }}>
                          <div>
                            <p className="text-xs font-bold" style={{ color: '#7a4f00' }}>rishta-rate.vercel.app</p>
                            <p className="text-xs" style={{ color: '#a07840' }}>Jahaiz ki haqeeqat — numbers mein nahi chhupti</p>
                          </div>
                          <div className="text-center px-4 py-2 rounded-full" style={{ border: '2px solid #c0392b', transform: 'rotate(12deg)' }}>
                            <p className="text-xs font-black" style={{ color: '#c0392b' }}>CERTIFIED</p>
                            <p className="text-xs font-black" style={{ color: '#c0392b' }}>BEGHAIRAT</p>
                          </div>
                        </div>
                      </div>

                      {/* Gold ornamental bottom border */}
                      <div className="h-3" style={{ background: 'repeating-linear-gradient(90deg, #c8960c 0px, #f5d060 10px, #c8960c 20px)' }} />
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
      </main>

      <Footer />
    </div>
  );
}

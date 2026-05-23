'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card/50 backdrop-blur border-t border-border/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent"></div>
              RishtaRate
            </h3>
            <p className="text-sm text-muted-foreground">
              Bringing satire and reality to wedding expectations in Pakistan.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Features</h4>
            <ul className="space-y-2">
              <li><Link href="/calculator" className="text-sm text-muted-foreground hover:text-primary transition-colors">Greed Calculator</Link></li>
              <li><Link href="/analyzer" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Analyzer</Link></li>
              <li><Link href="/simulator" className="text-sm text-muted-foreground hover:text-primary transition-colors">Financial Simulator</Link></li>
              <li><Link href="/alternatives" className="text-sm text-muted-foreground hover:text-primary transition-colors">Alternatives</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/learn" className="text-sm text-muted-foreground hover:text-primary transition-colors">Learning Center</Link></li>
              <li><Link href="/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community Stories</Link></li>
              <li><Link href="/auntie" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Auntie Chat</Link></li>
              <li><Link href="/share" className="text-sm text-muted-foreground hover:text-primary transition-colors">Share Generator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8">
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-primary" />
            <span>for sanity</span>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            © 2024 RishtaRate. A satire. Not legal or financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useAuth } from '@/lib/auth-store';
import { loginSchema, signupSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', name: '' },
  });

  const currentForm = isLogin ? loginForm : signupForm;

  const onSubmit = async (data: any) => {
    try {
      if (isLogin) {
        await login(data.email, data.password);
        toast.success('Welcome back!');
      } else {
        await signup(data.email, data.password, data.name);
        toast.success('Account created successfully!');
      }
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm bg-card/95 backdrop-blur-xl border border-border/50">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin ? 'Sign in to access the RishtaRate calculator' : 'Join the RishtaRate community'}
            </p>
          </div>

          <form onSubmit={currentForm.handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-foreground">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  {...currentForm.register('name')}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                />
                {currentForm.formState.errors.name && (
                  <p className="text-xs text-destructive mt-1">{currentForm.formState.errors.name.message}</p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                {...currentForm.register('email')}
                className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
              />
              {currentForm.formState.errors.email && (
                <p className="text-xs text-destructive mt-1">{currentForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...currentForm.register('password')}
                className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
              />
              {currentForm.formState.errors.password && (
                <p className="text-xs text-destructive mt-1">{currentForm.formState.errors.password.message}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...currentForm.register('confirmPassword')}
                  className="bg-input border-border/50 text-foreground placeholder:text-muted-foreground"
                />
                {currentForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive mt-1">{currentForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={currentForm.formState.isSubmitting}
            >
              {currentForm.formState.isSubmitting
                ? 'Loading...'
                : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or</span>
            </div>
          </div>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-sm text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

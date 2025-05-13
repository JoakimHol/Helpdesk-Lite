
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { LifeBuoy } from 'lucide-react';
import Balancer from 'react-wrap-balancer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signInWithPassword, session, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && session) {
      router.push('/');
    }
  }, [session, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Error', description: 'Please enter both email and password.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await signInWithPassword({ email, password });
      if (error) {
        toast({ title: 'Login Failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Login Successful', description: 'Redirecting to dashboard...' });
        router.push('/'); // AuthProvider will also redirect, but this is a fallback
      }
    } catch (err) {
        const loginError = err as Error;
        toast({ title: 'Login Error', description: loginError.message || 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (!authLoading && session)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <LifeBuoy className="size-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">HelpDesk Lite</CardTitle>
          <CardDescription>
            <Balancer>Please login to access the helpdesk system.</Balancer>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          {/* Add link to registration or forgot password if needed */}
          {/* For now, no registration link. Users are expected to be created by an admin or pre-seeded. */}
        </CardFooter>
      </Card>
    </div>
  );
}

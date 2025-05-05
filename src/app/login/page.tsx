'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from '@/components/ui/card';
import {useRouter} from 'next/navigation';
import {LifeBuoy} from 'lucide-react';
import Balancer from 'react-wrap-balancer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    // Dummy login logic - replace with actual authentication
    console.log('Logging in with:', email, password);
    // Redirect to dashboard on successful login
    router.push('/');
  };

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
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          {/* Add link to registration or forgot password if needed */}
        </CardFooter>
      </Card>
    </div>
  );
}

import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  const [, navigate] = useLocation();

  return (
    <div className="app-shell">
      <div className="app-content flex items-center justify-center px-4">
        <Card className="p-8 text-center card-elevated space-y-4">
          <p className="text-5xl">🧭</p>
          <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
          <p className="text-sm text-muted-foreground">
            That page doesn't exist. Let's get you back on track.
          </p>
          <Button onClick={() => navigate('/')} className="w-full h-12 font-semibold">
            Back to Home
          </Button>
        </Card>
      </div>
    </div>
  );
}

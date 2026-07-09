import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Scan } from 'lucide-react';
import { useFODMAP } from '@/contexts/FODMAPContext';

const FEATURES = [
  {
    icon: '🧪',
    title: 'Symptom Triage',
    description: "Tell us which foods upset your stomach. We'll narrow down your likely FODMAP triggers.",
  },
  {
    icon: '📱',
    title: 'Smart Scanner',
    description: 'Scan a barcode or paste an ingredient list to get an instant green / yellow / red verdict.',
  },
  {
    icon: '🔄',
    title: 'Smart Swaps',
    description: 'Every flagged ingredient comes with low-FODMAP alternatives you can actually buy.',
  },
  {
    icon: '👨‍⚕️',
    title: 'Find a Pro',
    description: 'Connect with FODMAP-trained dietitians through official directories and telehealth.',
  },
];

export default function Home() {
  const [, navigate] = useLocation();
  const { hasCompletedTriage } = useFODMAP();

  return (
    <div className="app-shell">
      <div className="app-content">
        {/* Hero Section */}
        <section className="relative pt-8 pb-12 px-4">
          <div className="text-center mb-8">
            <div
              aria-hidden="true"
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center text-3xl shadow-md"
            >
              🌿
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              FODMAP Navigator
            </h1>
            <p className="text-lg text-muted-foreground">
              Figure out your stomach triggers. Find food you can eat.
            </p>
          </div>

          {/* Hero */}
          <div className="w-full rounded-lg mb-8 shadow-md bg-secondary/40 border border-border p-6 flex items-center justify-around text-4xl">
            <span>🍚</span>
            <span>🍌</span>
            <span>🥕</span>
            <span>🍓</span>
            <span>🥚</span>
          </div>

          {/* Quick Start */}
          <div className="space-y-3">
            {!hasCompletedTriage && (
              <Button
                onClick={() => navigate('/triage')}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Triage
              </Button>
            )}
            <Button
              onClick={() => navigate('/scanner')}
              variant="outline"
              className="w-full h-12 text-base font-semibold"
            >
              <Scan className="w-5 h-5 mr-2" />
              Scan a Product
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-8 space-y-4">
          <h2 className="text-2xl font-bold text-foreground mb-6">How It Works</h2>
          {FEATURES.map(feature => (
            <Card key={feature.title} className="p-4 card-elevated flex gap-3">
              <span className="text-2xl shrink-0">{feature.icon}</span>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </section>

        <p className="text-xs text-muted-foreground text-center px-4 pb-6">
          ⚠️ This is an educational tool, not medical advice. Always confirm with a
          doctor or dietitian.
        </p>
      </div>
    </div>
  );
}

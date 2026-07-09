import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useFODMAP } from '@/contexts/FODMAPContext';
import { triageSymptoms, FODMAPProfile, SUBGROUP_INFO } from '@/lib/fodmap';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function Triage() {
  const [, navigate] = useLocation();
  const { setProfile, setTriageResult, setHasCompletedTriage } = useFODMAP();

  const [step, setStep] = useState<'symptoms' | 'foods' | 'result'>(
    'symptoms'
  );

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [badFoods, setBadFoods] = useState<string>('');
  const [goodFoods, setGoodFoods] = useState<string>('');
  const [redFlags, setRedFlags] = useState<string>('');

  const commonSymptoms = [
    'bloating',
    'gas',
    'pain',
    'diarrhea',
    'constipation',
    'nausea',
  ];

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleRunTriage = () => {
    const badFoodsList = badFoods
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);
    const goodFoodsList = goodFoods
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);
    const redFlagsList = redFlags
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    const result = triageSymptoms({
      symptoms,
      badFoods: badFoodsList,
      goodFoods: goodFoodsList,
      redFlags: redFlagsList,
    });

    setTriageResult(result);

    // Build profile from result
    const newProfile: FODMAPProfile = {
      lactose: result.likelySubgroups.includes('lactose'),
      fructans: result.likelySubgroups.includes('fructans'),
      gos: result.likelySubgroups.includes('gos'),
      fructose: result.likelySubgroups.includes('fructose'),
      polyols: result.likelySubgroups.includes('polyols'),
    };
    setProfile(newProfile);
    setHasCompletedTriage(true);
    setStep('result');
  };

  return (
    <div className="app-shell">
      <div className="app-content">
        {/* Step: Symptoms */}
        {step === 'symptoms' && (
          <section className="px-4 py-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Let's figure this out
              </h1>
              <p className="text-muted-foreground">
                Tell us about your symptoms.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Which symptoms do you experience?
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {commonSymptoms.map(symptom => (
                  <label
                    key={symptom}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border cursor-pointer hover:bg-secondary transition-colors"
                  >
                    <Checkbox
                      checked={symptoms.includes(symptom)}
                      onCheckedChange={() => toggleSymptom(symptom)}
                    />
                    <span className="capitalize text-sm font-medium">
                      {symptom}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep('foods')}
              disabled={symptoms.length === 0}
              className="w-full h-12 text-base font-semibold"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </section>
        )}

        {/* Step: Foods */}
        {step === 'foods' && (
          <section className="px-4 py-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Now, let's talk food
              </h1>
              <p className="text-muted-foreground">
                Which foods make you feel worse? Which ones are fine?
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="badFoods" className="text-base font-semibold">
                Foods that upset your stomach
              </Label>
              <Input
                id="badFoods"
                placeholder="e.g., garlic, onion, milk, wheat"
                value={badFoods}
                onChange={e => setBadFoods(e.target.value)}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                Separate with commas
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="goodFoods" className="text-base font-semibold">
                Foods that feel fine
              </Label>
              <Input
                id="goodFoods"
                placeholder="e.g., rice, chicken, banana, eggs"
                value={goodFoods}
                onChange={e => setGoodFoods(e.target.value)}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                Separate with commas
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="redFlags" className="text-base font-semibold">
                Any concerning symptoms?
              </Label>
              <Input
                id="redFlags"
                placeholder="e.g., weight loss, blood, fever (optional)"
                value={redFlags}
                onChange={e => setRedFlags(e.target.value)}
                className="h-12"
              />
              <p className="text-xs text-muted-foreground">
                Leave blank if none
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setStep('symptoms')}
                variant="outline"
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={handleRunTriage}
                disabled={badFoods.trim().length === 0}
                className="flex-1 h-12 font-semibold"
              >
                Get Results
              </Button>
            </div>
          </section>
        )}

        {/* Step: Result */}
        {step === 'result' && (
          <section className="px-4 py-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Your Results
              </h1>
            </div>

            {(() => {
              const result = triageSymptoms({
                symptoms,
                badFoods: badFoods.split(',').map(f => f.trim()).filter(Boolean),
                goodFoods: goodFoods.split(',').map(f => f.trim()).filter(Boolean),
                redFlags: redFlags.split(',').map(f => f.trim()).filter(Boolean),
              });
              return (
                <>
                  <Card className="p-6 card-elevated space-y-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                    </div>
                  </Card>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Likely Sensitivities
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      These filters are now active in the scanner. You can adjust them in your Profile anytime.
                    </p>
                    {result.likelySubgroups.length > 0 ? (
                      <div className="space-y-2">
                        {result.likelySubgroups.map(key => {
                          const info = SUBGROUP_INFO[key];
                          return (
                            <div key={key} className={`px-3 py-3 rounded-xl text-sm font-medium ${info.color} space-y-0.5`}>
                              <p className="font-semibold">{info.icon} {info.label}</p>
                              <p className="text-xs font-normal opacity-80">{info.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No specific subgroups identified. Try keeping a food diary and speaking with a dietitian.
                      </p>
                    )}
                  </div>
                </>
              );
            })()}

            <Button
              onClick={() => navigate('/scanner')}
              className="w-full h-12 text-base font-semibold bg-primary"
            >
              Start Scanning
            </Button>

            <Button
              onClick={() => navigate('/find-pro')}
              variant="outline"
              className="w-full h-12 text-base font-semibold"
            >
              Find a Dietitian
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              ⚠️ This is an educational tool. Confirm with a healthcare provider.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

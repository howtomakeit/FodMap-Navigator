import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useFODMAP } from '@/contexts/FODMAPContext';
import { SUBGROUP_INFO, FODMAPProfile } from '@/lib/fodmap';

export default function Profile() {
  const { profile, setProfile, triageResult } = useFODMAP();
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState<FODMAPProfile>(profile);

  const toggleSubgroup = (subgroup: keyof FODMAPProfile) => {
    setTempProfile(prev => ({
      ...prev,
      [subgroup]: !prev[subgroup],
    }));
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setEditMode(false);
  };

  const displayProfile = editMode ? tempProfile : profile;

  return (
    <div className="app-shell">
      <div className="app-content">
        <section className="px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
            {!editMode && (
              <Button
                onClick={() => setEditMode(true)}
                variant="outline"
                size="sm"
              >
                Edit
              </Button>
            )}
          </div>

          {/* Triage Result Summary */}
          {triageResult && (
            <Card className="p-4 card-elevated space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Triage Result
              </p>
              <p className="text-sm text-muted-foreground">
                {triageResult.recommendation}
              </p>
            </Card>
          )}

          {/* FODMAP Filters */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Your FODMAP Filters
            </Label>
            <p className="text-sm text-muted-foreground">
              Toggle the FODMAP groups you're sensitive to. These filters are
              used when you scan products.
            </p>

            <div className="space-y-3">
              {Object.entries(SUBGROUP_INFO).map(([key, info]) => {
                const subgroupKey = key as keyof FODMAPProfile;
                const isActive = displayProfile[subgroupKey];

                return (
                  <Card
                    key={key}
                    className={`p-4 card-elevated flex items-center justify-between ${
                      isActive ? 'border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{info.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{info.label}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                    {editMode ? (
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => toggleSubgroup(subgroupKey)}
                      />
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        {isActive ? '✓ Active' : 'Inactive'}
                      </span>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Edit Actions */}
          {editMode && (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 h-12">
                Save Changes
              </Button>
            </div>
          )}

          {/* Info */}
          <Card className="p-4 card-elevated space-y-2 bg-secondary/30">
            <p className="text-sm font-semibold text-foreground">
              💡 About FODMAP Groups
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                <strong>Lactose:</strong> Found in milk and dairy products
              </li>
              <li>
                <strong>Fructans:</strong> Found in garlic, onion, wheat, and
                some fruits
              </li>
              <li>
                <strong>GOS:</strong> Found in legumes, beans, and nuts
              </li>
              <li>
                <strong>Fructose:</strong> Found in apples, pears, honey, and
                some fruits
              </li>
              <li>
                <strong>Polyols:</strong> Found in stone fruits, mushrooms, and
                sugar alcohols
              </li>
            </ul>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            ⚠️ These filters help personalize your scanning experience. Confirm
            with a dietitian for medical guidance.
          </p>
        </section>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Globe, Star, ExternalLink } from 'lucide-react';

interface Directory {
  name: string;
  description: string;
  url: string;
  logo: string;
  specialty: string;
}

const DIRECTORIES: Directory[] = [
  {
    name: 'Monash FODMAP App',
    description: 'The gold standard — built by the researchers who developed the FODMAP diet at Monash University. Find certified dietitians and use their food guide.',
    url: 'https://www.monashfodmap.com/online-training/training-dietitian/',
    logo: '🎓',
    specialty: 'Official FODMAP Dietitian Directory',
  },
  {
    name: 'Academy of Nutrition & Dietetics',
    description: 'Search thousands of registered dietitians in the US by specialty, insurance, and location.',
    url: 'https://www.eatright.org/find-a-nutrition-expert',
    logo: '🇺🇸',
    specialty: 'US — Find a Registered Dietitian',
  },
  {
    name: 'Dietitians Australia',
    description: 'Find an accredited practising dietitian (APD) in Australia who specializes in gut health and IBS.',
    url: 'https://member.dietitiansaustralia.org.au/faad',
    logo: '🇦🇺',
    specialty: 'Australia — Find an APD',
  },
  {
    name: 'British Dietetic Association',
    description: 'UK-based directory to find qualified dietitians, many specializing in IBS and gut disorders.',
    url: 'https://www.bda.uk.com/find-a-dietitian.html',
    logo: '🇬🇧',
    specialty: 'UK — Find a Dietitian',
  },
  {
    name: 'Dietitians of Canada',
    description: 'Official Canadian directory for finding registered dietitians, searchable by province and specialty.',
    url: 'https://www.dietitians.ca/Your-Health/Find-a-Dietitian/Find-a-Dietitian.aspx',
    logo: '🇨🇦',
    specialty: 'Canada — Find a Registered Dietitian',
  },
  {
    name: 'ZocDoc',
    description: 'Book appointments online with gastroenterologists and dietitians who accept your insurance.',
    url: 'https://www.zocdoc.com/specialty/dietitian-nutritionist',
    logo: '📅',
    specialty: 'US — Online Booking',
  },
];

interface LocalResource {
  title: string;
  description: string;
  icon: string;
}

const LOCAL_TIPS: LocalResource[] = [
  {
    title: 'Ask your GP / PCP',
    description: 'Your primary care doctor can refer you to a gastroenterologist and often knows local dietitians who specialize in IBS.',
    icon: '🏥',
  },
  {
    title: 'Check your hospital system',
    description: 'Major hospitals often have outpatient nutrition clinics with FODMAP-trained dietitians. Insurance usually covers this.',
    icon: '🏨',
  },
  {
    title: 'Telehealth dietitians',
    description: 'Many FODMAP dietitians now work via telehealth — you can see a specialist anywhere in your country.',
    icon: '💻',
  },
];

interface Specialist {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  location: string;
  website?: string;
  rating: number;
  telehealth: boolean;
}

const EXAMPLE_SPECIALISTS: Specialist[] = [
  {
    id: '1',
    name: 'Kate Scarlata, RDN',
    credentials: 'RDN, LDN',
    specialty: 'FODMAP & IBS Expert — Author & Speaker',
    location: 'Boston, MA (Telehealth available)',
    website: 'katescarlata.com',
    rating: 5.0,
    telehealth: true,
  },
  {
    id: '2',
    name: 'Patsy Catsos, MS',
    credentials: 'MS, RDN, LD',
    specialty: 'FODMAP Specialist, Author of "IBS — Free at Last!"',
    location: 'Portland, ME (Telehealth available)',
    website: 'ibsfree.net',
    rating: 4.9,
    telehealth: true,
  },
  {
    id: '3',
    name: 'Joanna Baker, APD',
    credentials: 'APD, AN',
    specialty: 'Monash-trained FODMAP Dietitian',
    location: 'Melbourne, Australia (Telehealth available)',
    website: 'everyday-nutrition.com.au',
    rating: 4.9,
    telehealth: true,
  },
];

export default function FindPro() {
  const [activeSection, setActiveSection] = useState<'directories' | 'specialists'>('directories');

  return (
    <div className="app-shell">
      <div className="app-content">
        <section className="px-4 py-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Find a Dietitian</h1>
            <p className="text-muted-foreground">
              Connect with a FODMAP-trained dietitian near you or via telehealth.
            </p>
          </div>

          {/* Why see a dietitian */}
          <Card className="p-4 card-elevated space-y-2 bg-secondary/30">
            <p className="text-sm font-semibold text-foreground">💡 Why work with a dietitian?</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• The full FODMAP diet has 3 phases — a dietitian guides you through all of them safely</li>
              <li>• They personalize reintroduction so you don't restrict more than you need to</li>
              <li>• They ensure you're getting proper nutrition during elimination</li>
              <li>• They can rule out other conditions like celiac disease or SIBO</li>
            </ul>
          </Card>

          {/* Section toggle */}
          <div className="flex gap-2">
            <Button
              variant={activeSection === 'directories' ? 'default' : 'outline'}
              className="flex-1 h-10 text-sm"
              onClick={() => setActiveSection('directories')}
            >
              Directories
            </Button>
            <Button
              variant={activeSection === 'specialists' ? 'default' : 'outline'}
              className="flex-1 h-10 text-sm"
              onClick={() => setActiveSection('specialists')}
            >
              Known Specialists
            </Button>
          </div>

          {activeSection === 'directories' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                These official directories connect you with qualified, registered dietitians:
              </p>
              {DIRECTORIES.map((dir, i) => (
                <Card key={i} className="p-4 card-elevated space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{dir.logo}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground">{dir.name}</p>
                      <p className="text-xs text-primary font-medium">{dir.specialty}</p>
                      <p className="text-sm text-muted-foreground mt-1">{dir.description}</p>
                    </div>
                  </div>
                  <a
                    href={dir.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Open Directory <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Card>
              ))}

              {/* Local tips */}
              <div className="space-y-3 pt-2">
                <p className="text-sm font-semibold text-foreground">Other ways to find help:</p>
                {LOCAL_TIPS.map((tip, i) => (
                  <Card key={i} className="p-4 card-elevated flex gap-3">
                    <span className="text-xl shrink-0">{tip.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{tip.title}</p>
                      <p className="text-xs text-muted-foreground">{tip.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'specialists' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Well-known FODMAP dietitians who offer telehealth consultations:
              </p>
              {EXAMPLE_SPECIALISTS.map(d => (
                <Card key={d.id} className="p-4 card-elevated space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-foreground">{d.name}</h3>
                      <p className="text-xs text-muted-foreground">{d.credentials}</p>
                      <p className="text-sm text-muted-foreground">{d.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{d.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0" />
                      {d.location}
                    </div>
                    {d.website && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="w-4 h-4 shrink-0" />
                        <a
                          href={`https://${d.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary underline"
                        >
                          {d.website}
                        </a>
                      </div>
                    )}
                    {d.telehealth && (
                      <p className="text-xs font-medium text-green-700">📡 Telehealth available</p>
                    )}
                  </div>

                  {d.website && (
                    <a
                      href={`https://${d.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-10 rounded-lg border border-border text-sm font-semibold hover:bg-secondary transition-colors"
                    >
                      Visit Website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </Card>
              ))}

              <Card className="p-4 card-elevated bg-secondary/30">
                <p className="text-xs text-muted-foreground">
                  💬 This list includes publicly known FODMAP specialists. Use the Directories tab to find more practitioners near you.
                </p>
              </Card>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

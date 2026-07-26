import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Legal() {
  const [, navigate] = useLocation();

  return (
    <div className="app-shell">
      <div className="app-content">
        <section className="px-4 py-6 space-y-6 pb-24">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>

          <h1 className="text-3xl font-bold text-foreground">Legal &amp; Privacy</h1>

          {/* Medical Disclaimer */}
          <Card className="p-5 card-elevated space-y-3">
            <h2 className="text-xl font-bold text-foreground">Medical Disclaimer</h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Everyday FODMAP is an <strong>educational tool only</strong>. It is not a medical
                device and does not provide medical advice, diagnosis, or treatment.
              </p>
              <p>
                The information in this app — including symptom questionnaires, ingredient
                assessments, and food swap suggestions — is general educational content about the
                low-FODMAP diet. It is not personalized medical guidance and may not be accurate,
                complete, or appropriate for your situation. FODMAP tolerance is highly individual
                and portion-dependent.
              </p>
              <p>
                Always consult a qualified healthcare provider — such as a physician or registered
                dietitian — before starting, changing, or stopping any diet, and before acting on
                anything this app tells you. Never disregard professional medical advice or delay
                seeking it because of something you read in this app.
              </p>
              <p>
                If you experience concerning symptoms such as unintended weight loss, blood in your
                stool, fever, severe pain, or persistent diarrhea, see a doctor promptly.
              </p>
              <p>
                This app does not check for allergens. Ingredient labels change; always read the
                actual product label if you have a food allergy or intolerance.
              </p>
            </div>
          </Card>

          {/* Privacy Policy */}
          <Card className="p-5 card-elevated space-y-3">
            <h2 className="text-xl font-bold text-foreground">Privacy Policy</h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>We do not collect, store, or share your personal data.</strong>
              </p>
              <p>
                Everyday FODMAP has no user accounts, no analytics, no advertising, and no tracking
                cookies. Your profile, triage answers, and scan history are stored only in your own
                browser (localStorage) on your own device. They are never transmitted to us — we
                have no server that receives them, and we cannot see them.
              </p>
              <p>
                You can erase all app data at any time by clearing this site's data in your browser
                settings, or using the "Clear" button in Scan History.
              </p>
              <p>
                <strong>Barcode lookups:</strong> when you look up a barcode, the app sends that
                barcode number to Open Food Facts (openfoodfacts.org), a nonprofit open food
                database, to fetch product information. Like any web request, this shares your IP
                address with that service. No other information about you is sent. See the{' '}
                <a
                  href="https://world.openfoodfacts.org/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Open Food Facts privacy policy
                </a>{' '}
                for how they handle requests.
              </p>
              <p>
                <strong>Camera:</strong> the barcode scanner uses your device camera only with your
                permission, only while the scanner is open, and processes images entirely on your
                device. No photos or video are stored or transmitted.
              </p>
              <p>
                Because we collect no personal data, there is nothing for us to sell, share, or
                delete under privacy laws such as GDPR or CCPA/CPRA.
              </p>
            </div>
          </Card>

          {/* Terms of Use */}
          <Card className="p-5 card-elevated space-y-3">
            <h2 className="text-xl font-bold text-foreground">Terms of Use</h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>By using Everyday FODMAP, you agree to the following:</p>
              <p>
                <strong>As-is.</strong> The app is provided "as is" and "as available," without
                warranties of any kind, express or implied — including accuracy, completeness,
                fitness for a particular purpose, or uninterrupted availability.
              </p>
              <p>
                <strong>No liability.</strong> To the maximum extent permitted by law, the creators
                of Everyday FODMAP are not liable for any damages arising from your use of the app,
                including decisions you make based on its content. Your sole remedy for
                dissatisfaction is to stop using the app.
              </p>
              <p>
                <strong>Personal use.</strong> The app is for personal, non-commercial use. Do not
                scrape, resell, or misrepresent its content.
              </p>
              <p>
                <strong>Third-party content.</strong> Product data comes from Open Food Facts and
                may be incomplete or out of date — always verify against the physical product
                label. Links to external directories and practitioners are provided for
                convenience; we do not endorse and are not responsible for third-party services.
                Brand names mentioned in swap suggestions are trademarks of their respective
                owners and are referenced for identification only.
              </p>
              <p>
                <strong>Changes.</strong> We may update the app and these terms at any time.
                Continued use after changes constitutes acceptance.
              </p>
            </div>
          </Card>

          {/* Attribution */}
          <Card className="p-5 card-elevated space-y-3">
            <h2 className="text-xl font-bold text-foreground">Data Attribution</h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Product and ingredient data is provided by{' '}
                <a
                  href="https://world.openfoodfacts.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Open Food Facts
                </a>
                , available under the{' '}
                <a
                  href="https://opendatacommons.org/licenses/odbl/1-0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Open Database License (ODbL)
                </a>
                . Open Food Facts is a collaborative, free and open database of food products from
                around the world.
              </p>
              <p>
                General information about FODMAPs draws on publicly available research, including
                work by Monash University, which developed the low-FODMAP diet. This app is not
                affiliated with or endorsed by Monash University.
              </p>
            </div>
          </Card>

          <p className="text-xs text-muted-foreground text-center">
            Questions? Contact the site owner. Last updated: July 2026.
          </p>
        </section>
      </div>
    </div>
  );
}

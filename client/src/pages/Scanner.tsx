import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFODMAP } from '@/contexts/FODMAPContext';
import { scanProduct, SUBGROUP_INFO, ScanResult } from '@/lib/fodmap';
import { BrowserMultiFormatReader } from '@zxing/browser';
import {
  Loader2, X, AlertCircle, CheckCircle, AlertTriangle,
  History, ChevronDown, ChevronUp, Trash2, Package
} from 'lucide-react';
import { toast } from 'sonner';

interface ScanState {
  productName: string;
  barcode: string;
  ingredients: string;
}

type Tab = 'scan' | 'history';

const OPENFOODFACTS_API = 'https://world.openfoodfacts.org/api/v0/product';

async function lookupBarcode(barcode: string): Promise<{ name: string; ingredients: string } | null> {
  try {
    const res = await fetch(`${OPENFOODFACTS_API}/${barcode}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;

    const product = data.product;
    const name: string = product.product_name || product.product_name_en || '';
    // Prefer English ingredient text so the FODMAP matcher can recognize items
    let ingredients = '';
    if (product.ingredients_text_en) {
      ingredients = product.ingredients_text_en;
    } else if (product.ingredients && Array.isArray(product.ingredients) && product.ingredients.length > 0) {
      ingredients = product.ingredients
        .map((i: { text?: string }) => i.text || '')
        .filter(Boolean)
        .join(', ');
    } else if (product.ingredients_text) {
      ingredients = product.ingredients_text;
    }

    ingredients = ingredients
      .replace(/\([^)]*%\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return { name, ingredients };
  } catch {
    return null;
  }
}

function VerdictIcon({ verdict }: { verdict: string }) {
  if (verdict === 'green') return <CheckCircle className="w-12 h-12 text-[var(--signal-green)]" />;
  if (verdict === 'yellow') return <AlertTriangle className="w-12 h-12 text-[var(--signal-amber)]" />;
  return <AlertCircle className="w-12 h-12 text-[var(--signal-red)]" />;
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const cls =
    verdict === 'green'
      ? 'bg-green-100 text-green-800'
      : verdict === 'yellow'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-red-100 text-red-800';
  const label = verdict === 'green' ? '✅ Safe' : verdict === 'yellow' ? '⚠️ Caution' : '❌ Avoid';
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

function HistoryCard({ item }: { item: ScanResult }) {
  const [expanded, setExpanded] = useState(false);
  const date = item.scannedAt ? new Date(item.scannedAt).toLocaleDateString() : '';

  return (
    <Card className="p-4 card-elevated space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{item.productName}</p>
          {date && <p className="text-xs text-muted-foreground">{date}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <VerdictBadge verdict={item.verdict} />
          <button onClick={() => setExpanded(e => !e)} className="text-muted-foreground">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {expanded && item.flaggedIngredients.length > 0 && (
        <div className="pt-2 border-t border-border space-y-1">
          {item.flaggedIngredients.map((fi, i) => (
            <div key={i} className="flex flex-wrap gap-1 items-center text-sm">
              <span className="text-foreground font-medium">{fi.ingredient}</span>
              {fi.subgroups.map(sg => {
                const info = SUBGROUP_INFO[sg as keyof typeof SUBGROUP_INFO];
                return (
                  <span key={sg} className={`text-xs px-1.5 py-0.5 rounded-full ${info.color}`}>
                    {info.icon} {info.label}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {expanded && item.flaggedIngredients.length === 0 && (
        <p className="text-sm text-muted-foreground pt-1">No flagged ingredients.</p>
      )}
    </Card>
  );
}

function ResultView({ result, onBack }: { result: ScanResult; onBack: () => void }) {
  return (
    <div className="app-shell">
      <div className="app-content">
        <section className="px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Scan Result</h1>
            <Button variant="ghost" size="sm" onClick={onBack}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <Card className="p-6 card-elevated flex flex-col items-center gap-4 text-center">
            <div className="animate-scale-in">
              <VerdictIcon verdict={result.verdict} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{result.productName}</h2>
            <p className="text-sm text-muted-foreground">
              {result.verdict === 'green'
                ? '✅ This product looks safe for your FODMAP profile!'
                : result.verdict === 'yellow'
                ? '⚠️ Some ingredients may cause issues — see below.'
                : '❌ This product contains ingredients to avoid.'}
            </p>
            {result.barcode && (
              <p className="text-xs text-muted-foreground">Barcode: {result.barcode}</p>
            )}
          </Card>

          {result.flaggedIngredients.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Flagged Ingredients</Label>
              <div className="space-y-2">
                {result.flaggedIngredients.map((item, idx) => (
                  <Card key={idx} className="p-3 card-elevated">
                    <p className="font-medium text-foreground">{item.ingredient}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.subgroups.map(sg => {
                        const info = SUBGROUP_INFO[sg as keyof typeof SUBGROUP_INFO];
                        return (
                          <span key={sg} className={`text-xs px-2 py-1 rounded-full ${info.color}`}>
                            {info.icon} {info.label}
                          </span>
                        );
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {result.swaps.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Smart Swaps for You</Label>
              <div className="space-y-3">
                {result.swaps.map((swap, idx) => (
                  <Card key={idx} className="p-4 card-elevated space-y-2">
                    <p className="font-semibold text-foreground">Instead of {swap.original}:</p>
                    <div className="space-y-2">
                      {swap.alternatives.map((alt, altIdx) => (
                        <div key={altIdx} className="text-sm">
                          <p className="font-medium text-foreground">
                            • {alt.name}{alt.brand && ` (${alt.brand})`}
                          </p>
                          <p className="text-xs text-muted-foreground">{alt.reason}</p>
                        </div>
                      ))}
                    </div>
                    {swap.diyTip && (
                      <p className="text-xs text-muted-foreground italic pt-2 border-t border-border">
                        💡 DIY Tip: {swap.diyTip}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">⚠️ {result.disclaimer}</p>

          <Button onClick={onBack} className="w-full h-12 font-semibold">
            Scan Another Product
          </Button>
        </section>
      </div>
    </div>
  );
}

export default function Scanner() {
  const { profile, hasCompletedTriage, scanHistory, addScanToHistory, clearHistory } = useFODMAP();
  const [tab, setTab] = useState<Tab>('scan');
  const [scanState, setScanState] = useState<ScanState>({ productName: '', barcode: '', ingredients: '' });
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  if (!hasCompletedTriage) {
    return (
      <div className="app-shell">
        <div className="app-content flex items-center justify-center px-4">
          <Card className="p-6 text-center card-elevated space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-amber-600" />
            <h2 className="text-xl font-bold text-foreground">Complete Triage First</h2>
            <p className="text-sm text-muted-foreground">
              Run the symptom triage to set your FODMAP filters. This helps the scanner give you personalized results.
            </p>
            <Button onClick={() => (window.location.href = '/triage')} className="w-full">
              Go to Triage
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (result) {
    return <ResultView result={result} onBack={() => setResult(null)} />;
  }

  const handleBarcodeDetected = async (barcode: string) => {
    setIsScannerActive(false);
    setIsScanning(false);
    setScanState(prev => ({ ...prev, barcode }));
    toast.success(`Barcode detected: ${barcode} — looking up product…`);
    setIsLookingUp(true);
    const info = await lookupBarcode(barcode);
    setIsLookingUp(false);
    if (info && (info.name || info.ingredients)) {
      setScanState(prev => ({
        ...prev,
        barcode,
        productName: info.name || prev.productName,
        ingredients: info.ingredients || prev.ingredients,
      }));
      toast.success('Product found! Review the details and tap Check Product.');
    } else {
      toast.info('Product not in database. Please enter ingredients manually.');
    }
  };

  const startScanner = async () => {
    if (!videoRef.current) return;
    if (!codeReaderRef.current) {
      codeReaderRef.current = new BrowserMultiFormatReader();
    }
    setIsScannerActive(true);
    setIsScanning(true);
    try {
      await codeReaderRef.current.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (res) => { if (res) handleBarcodeDetected(res.getText()); }
      );
    } catch {
      toast.error('Camera access denied or not available');
      setIsScanning(false);
      setIsScannerActive(false);
    }
  };

  const stopScanner = () => {
    try { (codeReaderRef.current as any)?.reset?.(); } catch { /* ignore */ }
    setIsScannerActive(false);
    setIsScanning(false);
  };

  const handleManualLookup = async () => {
    if (!scanState.barcode || scanState.barcode.length < 8) return;
    setIsLookingUp(true);
    const info = await lookupBarcode(scanState.barcode);
    setIsLookingUp(false);
    if (info && (info.name || info.ingredients)) {
      setScanState(prev => ({
        ...prev,
        productName: info.name || prev.productName,
        ingredients: info.ingredients || prev.ingredients,
      }));
      toast.success('Product data filled in!');
    } else {
      toast.info('No data found — enter ingredients manually.');
    }
  };

  const handleScan = () => {
    if (!scanState.productName.trim() || !scanState.ingredients.trim()) {
      toast.error('Please enter product name and ingredients');
      return;
    }

    const ingredientsList = scanState.ingredients
      .split(/[,;]+/)
      .map(i => i.trim())
      .filter(Boolean);

    const activeProfile =
      profile.lactose || profile.fructans || profile.gos || profile.fructose || profile.polyols
        ? profile
        : { lactose: true, fructans: true, gos: true, fructose: true, polyols: true };

    const scanResult = scanProduct(
      scanState.productName,
      ingredientsList,
      activeProfile,
      scanState.barcode || undefined
    );
    addScanToHistory(scanResult);
    setResult(scanResult);
    setScanState({ productName: '', barcode: '', ingredients: '' });
  };

  return (
    <div className="app-shell">
      <div className="app-content">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setTab('scan')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === 'scan' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            Scan Product
          </button>
          <button
            onClick={() => setTab('history')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-1 ${tab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            <History className="w-4 h-4" />
            History
            {scanHistory.length > 0 && (
              <span className="ml-0.5 text-xs bg-primary text-primary-foreground rounded-full px-1.5">
                {scanHistory.length}
              </span>
            )}
          </button>
        </div>

        {tab === 'scan' && (
          <section className="px-4 py-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Scan a Product</h1>
              <p className="text-muted-foreground">
                Scan a barcode to auto-fill product details, or enter ingredients manually.
              </p>
            </div>

            {isScannerActive ? (
              <div className="space-y-3">
                <video
                  ref={videoRef}
                  className="w-full rounded-lg bg-black"
                  style={{ height: '280px', objectFit: 'cover' }}
                />
                <Button onClick={stopScanner} variant="destructive" className="w-full">
                  {isScanning ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Scanning…</>
                  ) : (
                    'Cancel'
                  )}
                </Button>
              </div>
            ) : (
              <Button onClick={startScanner} variant="outline" className="w-full h-12 font-semibold">
                📷 Scan Barcode
              </Button>
            )}

            {isLookingUp && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Looking up barcode in Open Food Facts…
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="productName" className="text-base font-semibold">Product Name</Label>
              <Input
                id="productName"
                placeholder="e.g., Heinz Ketchup"
                value={scanState.productName}
                onChange={e => setScanState(prev => ({ ...prev, productName: e.target.value }))}
                className="h-12"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="barcode" className="text-base font-semibold">
                Barcode{' '}
                <span className="font-normal text-muted-foreground text-xs">
                  (optional — scan or type to auto-fill)
                </span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="barcode"
                  placeholder="e.g., 5700141157008"
                  value={scanState.barcode}
                  onChange={e => setScanState(prev => ({ ...prev, barcode: e.target.value }))}
                  className="h-12 flex-1"
                />
                {scanState.barcode.length >= 8 && (
                  <Button
                    variant="outline"
                    className="h-12 shrink-0"
                    onClick={handleManualLookup}
                    disabled={isLookingUp}
                  >
                    {isLookingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Look Up'}
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="ingredients" className="text-base font-semibold">Ingredients</Label>
              <textarea
                id="ingredients"
                placeholder="e.g., tomato, vinegar, garlic, onion, salt, spices&#10;&#10;Barcode lookup will fill this in automatically."
                value={scanState.ingredients}
                onChange={e => setScanState(prev => ({ ...prev, ingredients: e.target.value }))}
                className="w-full p-3 rounded-lg border border-border bg-background text-foreground h-28 resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground">Separate with commas or semicolons.</p>
            </div>

            <Button
              onClick={handleScan}
              disabled={!scanState.productName.trim() || !scanState.ingredients.trim()}
              className="w-full h-12 text-base font-semibold bg-primary"
            >
              Check Product
            </Button>
          </section>
        )}

        {tab === 'history' && (
          <section className="px-4 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">Scan History</h1>
              {scanHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { if (confirm('Clear all scan history?')) clearHistory(); }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {scanHistory.length === 0 ? (
              <Card className="p-8 card-elevated text-center space-y-3">
                <Package className="w-10 h-10 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">No scans yet.</p>
                <p className="text-sm text-muted-foreground">Products you check will appear here.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {scanHistory.map((item, i) => (
                  <HistoryCard key={i} item={item} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

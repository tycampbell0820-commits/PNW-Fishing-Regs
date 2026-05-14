'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MARINE_AREAS, RIVER_SYSTEMS, LAKE_RULES,
  getActiveRules, isLingcodOpen, isCabezonOpen,
  type MarineArea, type SalmonPeriod,
} from './regulations-data';
import { SPECIES, type Species } from './species-data';

// ── Icon Components ──────────────────────────────────────────────────────────

function IconFish() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 12c0-3.9 3.1-7 7-7 1.9 0 3.6.7 4.9 1.9L21 12l-2.6 5.1C17.1 18.3 15.4 19 13.5 19c-3.9 0-7-3.1-7-7Z"/>
      <path d="m6.5 12-3-4M6.5 12l-3 4"/>
      <circle cx="17" cy="10" r="1" fill="currentColor"/>
    </svg>
  );
}
function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  );
}
function IconHook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v10"/>
      <path d="M12 12c0 3.3 2.7 6 6 6"/>
      <path d="M18 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2"/>
    </svg>
  );
}
function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
    </svg>
  );
}
function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>
  );
}
function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}
function IconChevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
function IconLog() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  );
}

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = 'id' | 'regs' | 'tips' | 'where' | 'log' | 'settings';

const API_KEY_STORAGE = 'fish-guide-api-key';

type FishIdResult = {
  species: string;
  scientificName: string;
  confidence: 'High' | 'Medium' | 'Low';
  features: string[];
  confusionSpecies: { name: string; difference: string }[];
  waState: string;
  typicalSize: string;
  notFish: boolean;
  error?: string;
};

// ── Catch Log Types & Helpers ────────────────────────────────────────────────

type CatchEntry = {
  id: string;
  timestamp: number;
  species: string;
  scientificName?: string;
  date: string;            // YYYY-MM-DD
  location: string;
  sizeIn?: string;
  weightLb?: string;
  thumbnailData?: string;  // compressed base64 for localStorage
  notes: string;
  confidence?: string;
  aiFeatures?: string[];
};

type SaveFormData = {
  species: string;
  date: string;
  location: string;
  sizeIn: string;
  weightLb: string;
  notes: string;
};

const CATCH_LOG_KEY = 'pnw-fish-catches';

function loadCatches(): CatchEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CATCH_LOG_KEY);
    return raw ? (JSON.parse(raw) as CatchEntry[]) : [];
  } catch { return []; }
}

function persistCatches(entries: CatchEntry[]) {
  try { localStorage.setItem(CATCH_LOG_KEY, JSON.stringify(entries)); } catch {}
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

async function compressImage(dataUrl: string, maxPx = 400): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxPx / img.width, maxPx / img.height, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      // Iteratively reduce quality until base64 is under 4MB
      let quality = 0.82;
      let result = canvas.toDataURL('image/jpeg', quality);
      while (result.length > 4 * 1024 * 1024 && quality > 0.3) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(result);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function useCatchLog() {
  const [entries, setEntries] = useState<CatchEntry[]>([]);

  useEffect(() => { setEntries(loadCatches()); }, []);

  const addEntry = useCallback((entry: Omit<CatchEntry, 'id' | 'timestamp'>): CatchEntry => {
    const newEntry: CatchEntry = { ...entry, id: makeId(), timestamp: Date.now() };
    setEntries(prev => {
      const next = [newEntry, ...prev];
      persistCatches(next);
      return next;
    });
    return newEntry;
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => {
      const next = prev.filter(e => e.id !== id);
      persistCatches(next);
      return next;
    });
  }, []);

  return { entries, addEntry, removeEntry };
}

// ── Root App ──────────────────────────────────────────────────────────────────

export default function FishingApp() {
  const [tab, setTab] = useState<Tab>('regs');
  const [apiKey, setApiKey] = useState('');
  const { entries, addEntry, removeEntry } = useCatchLog();

  useEffect(() => {
    const saved = localStorage.getItem(API_KEY_STORAGE);
    if (saved) setApiKey(saved);
  }, []);

  const saveApiKey = useCallback((key: string) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    if (trimmed) localStorage.setItem(API_KEY_STORAGE, trimmed);
    else localStorage.removeItem(API_KEY_STORAGE);
  }, []);

  return (
    <div className="fishing-app">
      <header className="fish-header">
        <span className="fish-logo">🎣 PNW Fish Guide</span>
        <div className="fish-header-actions">
          {!apiKey && (
            <button
              className="fish-icon-btn"
              onClick={() => setTab('settings')}
              aria-label="Settings"
              title="Add API key"
              style={{color:'var(--fish-warn)'}}
            >
              <IconSettings />
            </button>
          )}
          {apiKey && (
            <button
              className="fish-icon-btn"
              onClick={() => setTab('settings')}
              aria-label="Settings"
            >
              <IconSettings />
            </button>
          )}
        </div>
      </header>

      <main className="fish-main">
        {tab === 'id'       && <FishIdTab onSaveCatch={addEntry} apiKey={apiKey} />}
        {tab === 'regs'     && <RegsTab />}
        {tab === 'tips'     && <TipsTab />}
        {tab === 'where'    && <WhereTab />}
        {tab === 'log'      && <CatchLogTab entries={entries} onRemove={removeEntry} onAdd={addEntry} />}
        {tab === 'settings' && <SettingsTab apiKey={apiKey} onSaveKey={saveApiKey} />}
      </main>

      <nav className="fish-nav">
        <NavBtn icon={<IconFish />}      label="ID"      active={tab === 'id'}       onClick={() => setTab('id')} />
        <NavBtn icon={<IconClipboard />} label="Regs"    active={tab === 'regs'}     onClick={() => setTab('regs')} />
        <NavBtn icon={<IconHook />}      label="How To"  active={tab === 'tips'}     onClick={() => setTab('tips')} />
        <NavBtn icon={<IconMapPin />}    label="Where"   active={tab === 'where'}    onClick={() => setTab('where')} />
        <NavBtn icon={<IconLog />}       label="Log"     active={tab === 'log'}      onClick={() => setTab('log')}
          badge={entries.length > 0 ? entries.length : undefined} />
        <NavBtn icon={<IconSettings />}  label="Settings" active={tab === 'settings'} onClick={() => setTab('settings')}
          alert={!apiKey} />
      </nav>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick, badge, alert }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
  badge?: number; alert?: boolean;
}) {
  return (
    <button className={`fish-nav-btn${active ? ' active' : ''}`} onClick={onClick}>
      <span style={{position:'relative',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
        {icon}
        {badge !== undefined && badge > 0 && (
          <span style={{
            position:'absolute',top:-5,right:-7,
            background:'var(--fish-teal)',color:'#fff',
            borderRadius:'50%',width:15,height:15,
            fontSize:9,fontWeight:800,
            display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1,
          }}>
            {badge > 99 ? '99' : badge}
          </span>
        )}
        {alert && badge === undefined && (
          <span style={{
            position:'absolute',top:-4,right:-5,
            background:'var(--fish-warn)',
            borderRadius:'50%',width:7,height:7,
          }} />
        )}
      </span>
      {label}
    </button>
  );
}

// ── Fish ID Tab ───────────────────────────────────────────────────────────────

function FishIdTab({ onSaveCatch, apiKey }: {
  onSaveCatch: (entry: Omit<CatchEntry, 'id' | 'timestamp'>) => CatchEntry;
  apiKey: string;
}) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [result, setResult] = useState<FishIdResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaveSheet, setShowSaveSheet] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setResult(null);
    setError(null);
    setSavedId(null);
    setShowSaveSheet(false);
    setMimeType('image/jpeg');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result as string, 1568);
      setPhoto(compressed);
    };
    reader.readAsDataURL(file);
  }, []);

  const identify = async () => {
    if (!photo) return;
    setLoading(true);
    setError(null);
    try {
      const base64 = photo.split(',')[1];
      const res = await fetch('/api/fishing/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType, clientApiKey: apiKey || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <div className="section-header">
        <span className="section-title">Identify a Fish</span>
      </div>

      <div className="fish-id-hero">
        {photo ? (
          <img src={photo} alt="Fish to identify" className="fish-photo" />
        ) : (
          <div className="fish-id-placeholder">
            <span className="placeholder-icon">🐟</span>
            <p>Take a photo or upload from gallery</p>
          </div>
        )}
      </div>

      <input
        ref={cameraRef}
        type="file" accept="image/*" capture="environment"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        style={{display:'none'}}
      />
      <input
        ref={galleryRef}
        type="file" accept="image/*"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        style={{display:'none'}}
      />

      <div className="fish-id-actions">
        <button className="btn btn-primary" onClick={() => cameraRef.current?.click()}>
          <IconCamera /> Camera
        </button>
        <button className="btn btn-secondary" onClick={() => galleryRef.current?.click()}>
          <IconUpload /> Gallery
        </button>
      </div>

      {photo && !loading && (
        <div className="fish-id-identify-btn">
          <button className="btn btn-outline" onClick={identify}>
            🔍 Identify This Fish
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-card">
          <div className="spinner" />
          Analyzing with Claude AI…
        </div>
      )}

      {error && (
        <div className="error-card">
          <strong>Error: </strong>{error}
          {error.includes('ANTHROPIC_API_KEY') && (
            <div style={{marginTop:8}}>
              Add <code>ANTHROPIC_API_KEY=sk-ant-...</code> to your <code>.env.local</code> file and restart the server.
            </div>
          )}
        </div>
      )}

      {result && !loading && (
        <>
          <FishIdResult result={result} />
          {!result.notFish && (
            savedId ? (
              <div style={{margin:'0 12px 8px',padding:'11px 14px',background:'var(--fish-open-bg)',border:'1px solid var(--fish-open)',borderRadius:10,fontSize:13,color:'var(--fish-open)',textAlign:'center',fontWeight:600}}>
                ✓ Saved to catch log
              </div>
            ) : (
              <div style={{margin:'0 12px 8px'}}>
                <button className="btn btn-outline" onClick={() => setShowSaveSheet(true)}>
                  💾 Save to Catch Log
                </button>
              </div>
            )
          )}
        </>
      )}

      {showSaveSheet && result && (
        <SaveCatchSheet
          defaultSpecies={result.species}
          defaultScientific={result.scientificName}
          confidence={result.confidence}
          onSave={async (formData) => {
            const thumbnail = photo ? await compressImage(photo) : undefined;
            const entry = onSaveCatch({
              species: formData.species,
              scientificName: result.scientificName,
              date: formData.date,
              location: formData.location,
              sizeIn: formData.sizeIn || undefined,
              weightLb: formData.weightLb || undefined,
              thumbnailData: thumbnail,
              notes: formData.notes,
              confidence: result.confidence,
              aiFeatures: result.features,
            });
            setSavedId(entry.id);
            setShowSaveSheet(false);
          }}
          onClose={() => setShowSaveSheet(false)}
        />
      )}

      {!apiKey && (
        <div className="api-key-notice">
          <strong>API key required for fish ID.</strong>
          {' '}Tap the <strong>Settings</strong> tab to add your free Claude API key.
        </div>
      )}

      <p className="disclaimer">
        AI identification may not be 100% accurate. Always verify species before keeping.
        <br/>Check regulations before retaining any fish.
      </p>
    </div>
  );
}

function FishIdResult({ result }: { result: FishIdResult }) {
  if (result.notFish) {
    return (
      <div className="fish-id-result">
        <p className="fish-id-result-name">Not a fish</p>
        <p style={{fontSize:13,color:'var(--text-dim)'}}>{result.species}</p>
      </div>
    );
  }
  const confColor = result.confidence === 'High' ? 'open' : result.confidence === 'Medium' ? 'warn' : 'closed';
  return (
    <div className="fish-id-result">
      <p className="fish-id-result-name">{result.species}</p>
      <p className="fish-id-result-sci">{result.scientificName}</p>
      <div className="fish-id-confidence">
        <span className={`badge badge-${confColor}`}>
          {result.confidence === 'High' ? '✓' : result.confidence === 'Medium' ? '~' : '?'} {result.confidence} Confidence
        </span>
      </div>

      {result.features?.length > 0 && (
        <>
          <p className="fish-id-section-title">ID Features</p>
          <ul className="feature-list">
            {result.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </>
      )}

      {result.typicalSize && (
        <>
          <p className="fish-id-section-title">Typical Size</p>
          <p style={{fontSize:13,color:'var(--text-dim)'}}>{result.typicalSize}</p>
        </>
      )}

      {result.waState && (
        <>
          <p className="fish-id-section-title">Washington State</p>
          <p className="wa-note">{result.waState}</p>
        </>
      )}

      {result.confusionSpecies?.length > 0 && (
        <>
          <p className="fish-id-section-title">Don&apos;t Confuse With</p>
          {result.confusionSpecies.map((c, i) => (
            <div key={i} style={{background:'var(--panel-2)',borderRadius:8,padding:'8px 10px',marginBottom:5,fontSize:12}}>
              <strong style={{color:'var(--text)'}}>{c.name}</strong>
              <span style={{color:'var(--text-mute)'}}> — {c.difference}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── Regulations Tab ───────────────────────────────────────────────────────────

type WaterType = 'marine' | 'river' | 'lake';

function RegsTab() {
  const [waterType, setWaterType] = useState<WaterType>('marine');
  const [marineAreaId, setMarineAreaId] = useState('area10');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(['salmon']));

  const today = new Date();
  const area = MARINE_AREAS.find(a => a.id === marineAreaId)!;

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const monthName = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <div className="tab-content">
      <div className="section-header">
        <span className="section-title">Regulations</span>
      </div>

      <div className="seg-control">
        <button className={`seg-btn${waterType === 'marine' ? ' active' : ''}`} onClick={() => setWaterType('marine')}>⚓ Marine</button>
        <button className={`seg-btn${waterType === 'river'  ? ' active' : ''}`} onClick={() => setWaterType('river')}>🌊 Rivers</button>
        <button className={`seg-btn${waterType === 'lake'   ? ' active' : ''}`} onClick={() => setWaterType('lake')}>💧 Lakes</button>
      </div>

      {waterType === 'marine' && (
        <>
          <div className="fish-select-wrap">
            <label className="fish-select-label">Select Marine Area</label>
            <select
              className="fish-select"
              value={marineAreaId}
              onChange={e => setMarineAreaId(e.target.value)}
            >
              {MARINE_AREAS.map(a => (
                <option key={a.id} value={a.id}>{a.shortName}</option>
              ))}
            </select>
            <span className="fish-select-arrow">▾</span>
          </div>

          <div className="today-banner">
            📅 Rules for {monthName} · {area.waters}
          </div>

          <MarineSalmonCard area={area} today={today} expanded={expandedCards.has('salmon')} onToggle={() => toggleCard('salmon')} />
          <MarineHalibutCard area={area} today={today} expanded={expandedCards.has('halibut')} onToggle={() => toggleCard('halibut')} />
          <MarineBottomfishCard area={area} today={today} expanded={expandedCards.has('bottomfish')} onToggle={() => toggleCard('bottomfish')} />

          {area.specialClosures && area.specialClosures.length > 0 && (
            <SpecialClosuresCard closures={area.specialClosures} expanded={expandedCards.has('closures')} onToggle={() => toggleCard('closures')} />
          )}

          <div className="universal-rules">
            <p className="universal-rules-title">Universal Rules — All Marine Areas 5–13</p>
            {area.universalRules.slice(0, 6).map((r, i) => (
              <div key={i} className="universal-rule-item">{r}</div>
            ))}
          </div>
        </>
      )}

      {waterType === 'river' && <RiverRegs />}
      {waterType === 'lake' && <LakeRegs />}

      <p className="disclaimer">
        ⚠ Always verify current rules at <strong>wdfw.wa.gov</strong> or (360) 902-2700.
        Emergency rules can change without notice.
      </p>
    </div>
  );
}

function MarineSalmonCard({ area, today, expanded, onToggle }: { area: MarineArea; today: Date; expanded: boolean; onToggle: () => void }) {
  const activeRule = getActiveRules(area, today);

  return (
    <div className="reg-species-card">
      <div className="reg-species-header" onClick={onToggle}>
        <div>
          <span className="reg-species-name">🐟 Salmon</span>
          <div style={{marginTop:4}}>
            {activeRule?.closed
              ? <span className="badge badge-closed">CLOSED</span>
              : activeRule
                ? <span className="badge badge-open">OPEN — Limit {activeRule.limit}{activeRule.bonusLimit ? ` +${activeRule.bonusLimit} ${activeRule.bonusSpecies}` : ''}</span>
                : <span className="badge badge-closed">CLOSED</span>
            }
          </div>
        </div>
        <span className={`chevron-icon${expanded ? ' open' : ''}`}><IconChevron /></span>
      </div>

      {expanded && (
        <div className="reg-species-body">
          {activeRule && !activeRule.closed && (
            <>
              <div className="reg-row">
                <span className="reg-row-label">Daily limit</span>
                <span className="reg-row-value">{activeRule.limit}{activeRule.bonusLimit ? ` (+${activeRule.bonusLimit} ${activeRule.bonusSpecies})` : ''}</span>
              </div>
              {activeRule.minSize && Object.entries(activeRule.minSize).map(([sp, size]) => (
                <div key={sp} className="reg-row">
                  <span className="reg-row-label">{sp.charAt(0).toUpperCase()+sp.slice(1)} min size</span>
                  <span className="reg-row-value">{size}&quot;</span>
                </div>
              ))}
              {activeRule.release.length > 0 && (
                <div>
                  <span className="reg-row-label" style={{fontSize:12,display:'block',paddingTop:8}}>Release (C&R)</span>
                  <div className="release-list">
                    {activeRule.release.map(r => <span key={r} className="release-chip">{r}</span>)}
                  </div>
                </div>
              )}
              {activeRule.notes?.map((n, i) => <p key={i} className="reg-note">{n}</p>)}
            </>
          )}

          <p className="fish-id-section-title" style={{marginTop:14,marginBottom:6}}>All Season Periods</p>
          {area.salmon.filter(p => !p.zone).map((p, i) => (
            <div key={i} style={{padding:'6px 0',borderBottom:'1px solid var(--border)',fontSize:12}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{color:'var(--text-dim)'}}>{p.label}</span>
                {p.closed
                  ? <span className="badge badge-closed" style={{fontSize:10}}>CLOSED</span>
                  : <span className="badge badge-open" style={{fontSize:10}}>Limit {p.limit}</span>
                }
              </div>
            </div>
          ))}
          {area.salmon.filter(p => p.zone).length > 0 && (
            <>
              <p className="fish-id-section-title" style={{marginTop:10,marginBottom:6}}>Sub-Area Rules</p>
              {area.salmon.filter(p => p.zone).map((p, i) => (
                <div key={i} style={{padding:'6px 0',borderBottom:'1px solid var(--border)',fontSize:12}}>
                  <div style={{color:'var(--fish-teal)',fontWeight:600,marginBottom:2}}>{p.zone}</div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{color:'var(--text-dim)'}}>{p.label}</span>
                    {p.closed
                      ? <span className="badge badge-closed" style={{fontSize:10}}>CLOSED</span>
                      : <span className="badge badge-open" style={{fontSize:10}}>Limit {p.limit}</span>
                    }
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MarineHalibutCard({ area, today, expanded, onToggle }: { area: MarineArea; today: Date; expanded: boolean; onToggle: () => void }) {
  const h = area.bottomfish.halibut;
  return (
    <div className="reg-species-card">
      <div className="reg-species-header" onClick={onToggle}>
        <div>
          <span className="reg-species-name">🐠 Halibut</span>
          <div style={{marginTop:4}}>
            {h.open
              ? <span className="badge badge-open">OPEN — Limit {h.limit}/day</span>
              : <span className="badge badge-closed">CLOSED</span>
            }
          </div>
        </div>
        <span className={`chevron-icon${expanded ? ' open' : ''}`}><IconChevron /></span>
      </div>
      {expanded && (
        <div className="reg-species-body">
          {h.open ? (
            <>
              <div className="reg-row"><span className="reg-row-label">Daily limit</span><span className="reg-row-value">{h.limit}</span></div>
              <div className="reg-row"><span className="reg-row-label">Annual limit</span><span className="reg-row-value">{h.annualLimit}</span></div>
              <div className="reg-row"><span className="reg-row-label">Min size</span><span className="reg-row-value">None</span></div>
              {h.note && <p className="reg-note">{h.note}</p>}
              <p className="reg-note">Descending device required. CRC required. IPHC-managed season — verify exact open dates with WDFW.</p>
            </>
          ) : (
            <p className="reg-note" style={{color:'var(--fish-closed)'}}>Halibut is CLOSED in this area. {h.note}</p>
          )}
        </div>
      )}
    </div>
  );
}

function MarineBottomfishCard({ area, today, expanded, onToggle }: { area: MarineArea; today: Date; expanded: boolean; onToggle: () => void }) {
  const bf = area.bottomfish;
  const lingOpen = isLingcodOpen(bf, today);
  const cabOpen = isCabezonOpen(bf, today);
  return (
    <div className="reg-species-card">
      <div className="reg-species-header" onClick={onToggle}>
        <div>
          <span className="reg-species-name">🐡 Bottomfish</span>
          <div style={{marginTop:4}}>
            <span className="badge badge-info">Limit {bf.totalDailyLimit}/day total</span>
          </div>
        </div>
        <span className={`chevron-icon${expanded ? ' open' : ''}`}><IconChevron /></span>
      </div>
      {expanded && (
        <div className="reg-species-body">
          <div className="reg-row">
            <span className="reg-row-label">Total daily limit</span>
            <span className="reg-row-value">{bf.totalDailyLimit}</span>
          </div>
          {bf.maxDepthFt && (
            <div className="reg-row">
              <span className="reg-row-label">Max fishing depth</span>
              <span className="reg-row-value">{bf.maxDepthFt} ft</span>
            </div>
          )}

          <p className="fish-id-section-title" style={{marginTop:10}}>Lingcod</p>
          {bf.lingcod.open ? (
            <>
              <div className="reg-row">
                <span className="reg-row-label">Season</span>
                <span className="reg-row-value" style={{color: lingOpen ? 'var(--fish-open)' : 'var(--text-dim)'}}>
                  May 1 – Jun 15 {lingOpen ? '✓ Open now' : '(closed now)'}
                </span>
              </div>
              <div className="reg-row"><span className="reg-row-label">Size (slot)</span><span className="reg-row-value">{bf.lingcod.minIn}&quot; – {bf.lingcod.maxIn}&quot;</span></div>
              <div className="reg-row"><span className="reg-row-label">Daily limit</span><span className="reg-row-value">{bf.lingcod.limit}</span></div>
            </>
          ) : (
            <p className="reg-note" style={{color:'var(--fish-closed)'}}>CLOSED — not open in this area</p>
          )}

          <p className="fish-id-section-title" style={{marginTop:10}}>Cabezon</p>
          {bf.cabezon.open ? (
            <>
              <div className="reg-row">
                <span className="reg-row-label">Season</span>
                <span className="reg-row-value" style={{color: cabOpen ? 'var(--fish-open)' : 'var(--text-dim)'}}>
                  May 1 – Nov 30 {cabOpen ? '✓ Open now' : '(closed now)'}
                </span>
              </div>
              <div className="reg-row"><span className="reg-row-label">Min size</span><span className="reg-row-value">{bf.cabezon.minIn}&quot;</span></div>
              <div className="reg-row"><span className="reg-row-label">Daily limit</span><span className="reg-row-value">{bf.cabezon.limit}</span></div>
            </>
          ) : (
            <p className="reg-note" style={{color:'var(--fish-closed)'}}>CLOSED — not open in this area</p>
          )}

          <p className="fish-id-section-title" style={{marginTop:10}}>Rockfish</p>
          {bf.rockfish.open
            ? <p className="reg-note" style={{color:'var(--fish-open)'}}>{bf.rockfish.note}</p>
            : <p className="reg-note" style={{color:'var(--fish-closed)'}}>CLOSED. {bf.rockfish.note ?? ''}</p>
          }

          <p className="fish-id-section-title" style={{marginTop:10}}>Surfperch</p>
          {bf.surfperch.open ? (
            <div className="reg-row">
              <span className="reg-row-label">Year-round · limit</span>
              <span className="reg-row-value">{bf.surfperch.limit} (shiner: {bf.surfperch.shinerLimit})</span>
            </div>
          ) : (
            <p className="reg-note" style={{color:'var(--fish-closed)'}}>CLOSED — {bf.surfperch.note}</p>
          )}
        </div>
      )}
    </div>
  );
}

function SpecialClosuresCard({ closures, expanded, onToggle }: { closures: string[]; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="reg-species-card">
      <div className="reg-species-header" onClick={onToggle}>
        <span className="reg-species-name">🚫 Special Closures</span>
        <span className={`chevron-icon${expanded ? ' open' : ''}`}><IconChevron /></span>
      </div>
      {expanded && (
        <div className="reg-species-body">
          {closures.map((c, i) => (
            <div key={i} style={{padding:'6px 0',borderBottom:'1px solid var(--border)',fontSize:12,color:'var(--text-dim)',lineHeight:1.45}}>
              ⛔ {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RiverRegs() {
  const [selectedRiver, setSelectedRiver] = useState('skagit');
  const river = RIVER_SYSTEMS.find(r => r.id === selectedRiver)!;
  return (
    <>
      <div className="fish-select-wrap">
        <label className="fish-select-label">Select River System</label>
        <select className="fish-select" value={selectedRiver} onChange={e => setSelectedRiver(e.target.value)}>
          {RIVER_SYSTEMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <span className="fish-select-arrow">▾</span>
      </div>
      <div className="today-banner">📍 {river.name} · {river.region}</div>
      {[
        { label: '🐟 Salmon', items: river.salmon },
        { label: '🎣 Steelhead', items: river.steelhead },
        { label: '🐠 Trout', items: river.trout },
      ].map(({ label, items }) => (
        <div key={label} className="fish-card" style={{margin:'6px 12px'}}>
          <p className="fish-card-title">{label}</p>
          {items.map((it, i) => (
            <div key={i} style={{display:'flex',gap:8,padding:'6px 0',borderBottom:'1px solid var(--border)',fontSize:13,alignItems:'flex-start'}}>
              <span style={{color:it.open ? 'var(--fish-open)' : 'var(--fish-closed)',flexShrink:0,marginTop:1}}>{it.open ? '✓' : '✗'}</span>
              <span style={{color:'var(--text-dim)',lineHeight:1.45}}>{it.note}</span>
            </div>
          ))}
        </div>
      ))}
      {river.notes.length > 0 && (
        <div className="fish-card" style={{margin:'6px 12px'}}>
          <p className="fish-card-title">Important Notes</p>
          {river.notes.map((n, i) => (
            <div key={i} style={{fontSize:12,color:'var(--text-mute)',padding:'5px 0',borderBottom:'1px solid var(--border)',lineHeight:1.45}}>ℹ {n}</div>
          ))}
        </div>
      )}
      <div className="fish-card" style={{margin:'6px 12px',background:'var(--fish-warn-bg)',borderColor:'var(--fish-warn)'}}>
        <p style={{fontSize:12,color:'var(--fish-warn)',margin:0,lineHeight:1.5}}>
          ⚠ River regulations vary significantly by reach and current year&apos;s run strength.
          Verify at <strong>wdfw.wa.gov</strong> before fishing any river.
        </p>
      </div>
    </>
  );
}

function LakeRegs() {
  const [selectedLake, setSelectedLake] = useState('general-western');
  const lake = LAKE_RULES.find(l => l.id === selectedLake)!;
  return (
    <>
      <div className="fish-select-wrap">
        <label className="fish-select-label">Select Lake / Region</label>
        <select className="fish-select" value={selectedLake} onChange={e => setSelectedLake(e.target.value)}>
          {LAKE_RULES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <span className="fish-select-arrow">▾</span>
      </div>
      <div className="fish-card" style={{margin:'6px 12px'}}>
        <p className="fish-card-title">{lake.name}</p>
        {lake.rules.map((r, i) => (
          <div key={i} style={{fontSize:13,color:'var(--text-dim)',padding:'7px 0',borderBottom:'1px solid var(--border)',lineHeight:1.45}}>
            • {r}
          </div>
        ))}
      </div>
    </>
  );
}

// ── Tips / How To Tab ─────────────────────────────────────────────────────────

type SpeciesCategory = 'salmon' | 'trout-steelhead' | 'bottomfish';

function TipsTab() {
  const [category, setCategory] = useState<SpeciesCategory>('salmon');
  const [expandedSpecies, setExpandedSpecies] = useState<string | null>(null);

  const filtered = SPECIES.filter(s => s.category === category);

  return (
    <div className="tab-content">
      <div className="section-header">
        <span className="section-title">How to Fish</span>
      </div>

      <div className="seg-control">
        <button className={`seg-btn${category === 'salmon' ? ' active' : ''}`} onClick={() => { setCategory('salmon'); setExpandedSpecies(null); }}>Salmon</button>
        <button className={`seg-btn${category === 'trout-steelhead' ? ' active' : ''}`} onClick={() => { setCategory('trout-steelhead'); setExpandedSpecies(null); }}>Trout/Steel</button>
        <button className={`seg-btn${category === 'bottomfish' ? ' active' : ''}`} onClick={() => { setCategory('bottomfish'); setExpandedSpecies(null); }}>Bottomfish</button>
      </div>

      {filtered.map(species => (
        <SpeciesTipsCard
          key={species.id}
          species={species}
          expanded={expandedSpecies === species.id}
          onToggle={() => setExpandedSpecies(prev => prev === species.id ? null : species.id)}
        />
      ))}
    </div>
  );
}

function SpeciesTipsCard({ species, expanded, onToggle }: { species: Species; expanded: boolean; onToggle: () => void }) {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const relevantTips = species.seasonalTips.filter(t => t.months.includes(currentMonth));

  return (
    <div className="tips-species-card">
      <div className="tips-species-header" onClick={onToggle}>
        <span className="tips-species-emoji">{species.emoji}</span>
        <div className="tips-species-info">
          <p className="tips-species-name">{species.commonName}</p>
          <p className="tips-species-aliases">{species.aliases.join(' · ')}</p>
        </div>
        <span className={`tips-expand-icon${expanded ? ' open' : ''}`}><IconChevron /></span>
      </div>

      {expanded && (
        <div className="tips-species-body">
          {relevantTips.length > 0 && (
            <div className="tips-section">
              <p className="tips-section-title">🌊 In Season Now</p>
              {relevantTips.map((t, i) => (
                <div key={i} style={{background:'var(--fish-teal-soft)',border:'1px solid var(--fish-teal)',borderRadius:9,padding:'10px 12px',marginBottom:5,fontSize:13,color:'var(--text-dim)',lineHeight:1.5}}>
                  {t.tip}
                </div>
              ))}
            </div>
          )}

          <div className="tips-section">
            <p className="tips-section-title">🆔 How to Identify</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:6}}>
              {species.colors.map((c, i) => <span key={i} className="id-feature-chip">{c}</span>)}
            </div>
            {species.idFeatures.map((f, i) => (
              <div key={i} style={{fontSize:12,color:'var(--text-dim)',padding:'5px 0',borderBottom:'1px solid var(--border)',lineHeight:1.45}}>
                ▸ {f}
              </div>
            ))}
          </div>

          <div className="tips-section">
            <p className="tips-section-title">🎣 Best Rigs</p>
            {species.bestRigs.map((r, i) => (
              <div key={i} className="rig-card">
                <p className="rig-name">{r.name}</p>
                <p className="rig-setup">{r.setup}</p>
                <p className="rig-best">Best for: {r.bestFor}</p>
              </div>
            ))}
          </div>

          <div className="tips-section">
            <p className="tips-section-title">🪱 Baits</p>
            <div className="pill-row">
              {species.bestBaits.map((b, i) => <span key={i} className="pill">{b}</span>)}
            </div>
          </div>

          <div className="tips-section">
            <p className="tips-section-title">🔩 Lures</p>
            <div className="pill-row">
              {species.bestLures.map((l, i) => <span key={i} className="pill">{l}</span>)}
            </div>
          </div>

          <div className="tips-section">
            <p className="tips-section-title">📖 Techniques</p>
            <ul className="tips-list">
              {species.techniques.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>

          <div className="tips-section">
            <p className="tips-section-title">📏 Size & Habitat</p>
            <div style={{fontSize:13,color:'var(--text-dim)',lineHeight:1.5}}>
              <div><strong style={{color:'var(--text)'}}>Typical:</strong> {species.typicalSize}</div>
              <div style={{marginTop:4}}><strong style={{color:'var(--text)'}}>Habitat:</strong> {species.habitat}</div>
            </div>
          </div>

          <div className="tips-section">
            <p className="tips-section-title">⚖ Legal Notes</p>
            <div className="legal-note-box">{species.legalNotes}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Where to Fish Tab ─────────────────────────────────────────────────────────

function WhereTab() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const monthName = today.toLocaleDateString('en-US', { month: 'long' });

  // Compute which marine areas have open salmon RIGHT NOW
  const marineStatus = MARINE_AREAS.map(area => {
    const rule = getActiveRules(area, today);
    const salmonOpen = rule && !rule.closed;
    const halibutOpen = area.bottomfish.halibut.open;
    const lingOpen = isLingcodOpen(area.bottomfish, today);
    const cabOpen = isCabezonOpen(area.bottomfish, today);
    return { area, salmonOpen, halibutOpen, lingOpen, cabOpen };
  });

  const openSalmon = marineStatus.filter(s => s.salmonOpen);
  const openHalibut = marineStatus.filter(s => s.halibutOpen);

  const seasonalAdvice = getSeasonalAdvice(month);

  return (
    <div className="tab-content">
      <div className="section-header">
        <span className="section-title">Where to Fish</span>
      </div>

      <div className="today-banner">
        📅 {monthName} — {today.getFullYear()} · Current Conditions
      </div>

      <p className="where-section-title">🎯 What&apos;s Hot This Month</p>
      {seasonalAdvice.map((advice, i) => (
        <div key={i} className="where-card">
          <div className="where-card-header">
            <div>
              <p className="where-card-name">{advice.title}</p>
              <p className="where-card-region">{advice.location}</p>
            </div>
            <span className={`badge badge-${advice.status === 'hot' ? 'open' : advice.status === 'ok' ? 'warn' : 'closed'}`}>
              {advice.status === 'hot' ? '🔥 Hot' : advice.status === 'ok' ? '✓ Open' : '· Slow'}
            </span>
          </div>
          <p className="where-card-body">{advice.description}</p>
        </div>
      ))}

      <p className="where-section-title">⚓ Marine Areas — Salmon Status Now</p>
      <div className="open-now-grid">
        {marineStatus.map(({ area, salmonOpen }) => (
          <div key={area.id} className="open-now-item">
            <p className="open-now-area">{area.shortName.replace('Area ', 'MA ')}</p>
            <p className={`open-now-status badge ${salmonOpen ? 'badge-open' : 'badge-closed'}`}>
              {salmonOpen ? '✓ Open' : '✗ Closed'}
            </p>
          </div>
        ))}
      </div>

      {openHalibut.length > 0 && (
        <>
          <p className="where-section-title">🐠 Halibut Open In</p>
          <div className="fish-card" style={{margin:'4px 12px'}}>
            <div className="pill-row">
              {openHalibut.map(({ area }) => (
                <span key={area.id} className="pill" style={{background:'var(--fish-open-bg)',color:'var(--fish-open)',borderColor:'var(--fish-open)'}}>
                  {area.shortName.replace('Marine Area ', 'MA ')}
                </span>
              ))}
            </div>
            <p style={{fontSize:11,color:'var(--text-mute)',marginTop:8,marginBottom:0}}>Daily limit 1 · Annual limit 6 · No min size · Verify exact season dates with WDFW</p>
          </div>
        </>
      )}

      <p className="where-section-title">🌊 Top River Picks for {monthName}</p>
      {getRiverPicks(month).map((pick, i) => (
        <div key={i} className="where-card">
          <div className="where-card-header">
            <div>
              <p className="where-card-name">{pick.river}</p>
              <p className="where-card-region">{pick.target}</p>
            </div>
            <span className={`badge badge-${pick.hot ? 'open' : 'info'}`}>{pick.hot ? '🔥 Go Now' : '✓ Worth It'}</span>
          </div>
          <p className="where-card-body">{pick.tip}</p>
        </div>
      ))}

      <p className="disclaimer">
        ⚠ Conditions and regulations change rapidly. Check WDFW emergency rules and stream flow data (USGS WaterNow) before any trip.
      </p>
    </div>
  );
}

type SeasonalAdvice = { title: string; location: string; status: 'hot' | 'ok' | 'slow'; description: string };
type RiverPick = { river: string; target: string; hot: boolean; tip: string };

function getSeasonalAdvice(month: number): SeasonalAdvice[] {
  const advice: Record<number, SeasonalAdvice[]> = {
    1: [
      { title: 'Winter Steelhead', location: 'Cowlitz, Snohomish, Hoh Rivers', status: 'hot', description: 'Peak winter steelhead season. Hatchery fish running strong. After rain events, rivers clear and bite turns on. 5–10 AM best window.' },
      { title: 'Blackmouth Chinook', location: 'Areas 9, 10, 11 (marine)', status: 'ok', description: 'Resident Chinook (blackmouth) feeding on herring near deep structure. Downrigger troll at 80–120 ft. Punch Landing area, Bainbridge Island kelp lines.' },
    ],
    2: [
      { title: 'Winter Steelhead', location: 'Cowlitz, Snoqualmie, Green', status: 'hot', description: 'Still prime winter steelhead month. Look for fresh fish after rain. Side-drift eggs through classic runs.' },
      { title: 'Blackmouth Chinook', location: 'Areas 9–10 (marine)', status: 'ok', description: 'Blackmouth available in Puget Sound all winter. Check WDFW for current marine season opener.' },
    ],
    3: [
      { title: 'Spring Chinook', location: 'Cowlitz River, Cowlitz Salmon Hatchery area', status: 'hot', description: 'Spring (springer) Chinook beginning their run. Best eating salmon of the year — lean, firm, bright. Float eggs below Riffe Lake.' },
      { title: 'Winter Steelhead (late)', location: 'Olympic Peninsula rivers', status: 'ok', description: 'Late winter steelhead on the Hoh, Queets, Quillayute. Wild fish must be released — target hatchery only.' },
    ],
    4: [
      { title: 'Spring Chinook Peak', location: 'Cowlitz, Skykomish, Columbia River', status: 'hot', description: 'Best month for spring Chinook. Cowlitz is top bet in WA. Drift eggs near bottom in 4–8 ft runs. Back-bounce or side-drift.' },
      { title: 'Marine Areas Opening', location: 'Areas 10, 11 (Wed–Sat only)', status: 'ok', description: 'Marine salmon opens Apr 1 in some areas. Chinook min 22". Wed–Sat only — great for long weekends.' },
    ],
    5: [
      { title: 'Lingcod Season Opens!', location: 'Areas 5–13 (rocky reefs)', status: 'hot', description: 'May 1 lingcod opens. Fish rocky reefs 30–150 ft. Season only runs through Jun 15 — get out early. 26–36" slot limit.' },
      { title: 'Cabezon Opens', location: 'All marine areas except Hood Canal', status: 'ok', description: 'Cabezon season opens May 1. Target shallow rocky structure. Min 18".' },
      { title: 'Halibut Season', location: 'Areas 5–10', status: 'ok', description: 'Halibut fishing typically good through May–Jun. Fish sandy bottom 100–300 ft. Limit 1/day. Verify exact season dates.' },
      { title: 'Late Steelhead (summer)', location: 'Upper Cowlitz, Snake tributaries', status: 'ok', description: 'Early summer steelhead starting to show on upper river systems. Fish cold, deep pools at dawn.' },
    ],
    6: [
      { title: 'Lingcod LAST CHANCE', location: 'All marine areas', status: 'hot', description: 'Lingcod season closes Jun 15 — final 2 weeks! Get out now. Best fishing of the season on rocky structure 30–120 ft.' },
      { title: 'Halibut', location: 'Areas 5–10', status: 'hot', description: 'Halibut concentrating on shallower flats Jun–Jul. Area 5 (Strait) and Area 7 (San Juans) produce well. Big bait = big halibut.' },
      { title: 'Marine Salmon Opens', location: 'Area 6 (eastern Strait)', status: 'ok', description: 'Salmon season opening in multiple marine areas. Check by area — Area 6 opens Jun 1 in eastern Strait sections.' },
    ],
    7: [
      { title: 'Halibut Peak', location: 'Areas 5, 6, 7', status: 'hot', description: 'Best halibut fishing of the year in the Strait of Juan de Fuca. Anchor over sandy bottom 100–250 ft. Whole herring or salmon belly.' },
      { title: 'Chinook Marine Season', location: 'Areas 5, 6, 7, 9, 10', status: 'hot', description: 'Chinook season open in many marine areas. Jul 17–19 sport week in Areas 7, 9, 10. Troll at 60–100 ft with flasher + plug-cut herring.' },
      { title: 'Pink Salmon Arrive (odd years)', location: 'Areas 5, 6, 7, marine and rivers', status: 'hot', description: '2025 = odd year = PINK SALMON YEAR. Pinks begin entering Puget Sound. Aggressive biters near surface. Light gear and pink jigs near pier heads.' },
    ],
    8: [
      { title: 'Pink Salmon PEAK (odd years)', location: 'All marine areas + river mouths', status: 'hot', description: 'Peak pink salmon month in odd years. Bonus +2 pinks on top of daily limit. Cast pink jigs from any pier or beach — one of the easiest PNW fisheries.' },
      { title: 'Coho Beginning', location: 'Areas 5, 6, 7 marine', status: 'hot', description: 'Early coho entering the Strait. Troll near surface at 3–4 mph with hoochies and flashers. Look for jumping fish.' },
      { title: 'Chinook Marine Open', location: 'Areas 5–12', status: 'ok', description: 'Most marine areas open for Chinook through Sept. Release rules vary by area — check before keeping any fish.' },
    ],
    9: [
      { title: 'Coho Salmon Peak', location: 'All marine areas + river tidewater', status: 'hot', description: 'September is coho time. Both marine and river fishing producing. Troll hoochies in salt; swing spinners in rivers. Some of the year\'s best fishing.' },
      { title: 'Fall Chinook Rivers', location: 'Cowlitz, Snohomish, Skagit, Columbia', status: 'hot', description: 'Fall Chinook entering river systems. Large, chrome-bright fish. Float eggs at river mouths and tidewater. Time incoming tides.' },
      { title: 'Pink Salmon (odd years)', location: 'Marine and river mouths', status: 'ok', description: 'Late pinks still available in rivers like Skagit, Snohomish. Smaller numbers but still fun.' },
    ],
    10: [
      { title: 'Fall Coho in Rivers', location: 'Skagit, Snohomish, Cowlitz, Hoh', status: 'hot', description: 'River coho peak in October. Fish pools and tailouts with spinners, spoons, or float+eggs. Rain events push fish upstream fast.' },
      { title: 'Fall Chinook (late)', location: 'Columbia, lower Cowlitz', status: 'ok', description: 'Late-season fall Chinook still available on major rivers. Fish are darker but still good eating.' },
      { title: 'Hood Canal Salmon', location: 'Marine Area 12', status: 'ok', description: 'Hood Canal opens Oct 16 for salmon through Nov 30. Limit 4 — one of the best fall coho opportunities.' },
    ],
    11: [
      { title: 'Marine Coho (late)', location: 'Area 10, 11, 12', status: 'ok', description: 'Nov 15 deadline in most Puget Sound marine areas. Last chance for late coho. Areas 10 and 11 open through mid-month.' },
      { title: 'Hood Canal Salmon', location: 'Marine Area 12', status: 'hot', description: 'Hood Canal open through Nov 30. Limit 4 coho. One of the last open marine areas for salmon.' },
      { title: 'Early Winter Steelhead', location: 'Snohomish, Green, Cowlitz', status: 'ok', description: 'First winter steelhead arriving. Rivers need a good shot of rain. Side-drift eggs through classic runs.' },
    ],
    12: [
      { title: 'Winter Steelhead Starts', location: 'Cowlitz, Snohomish, Olympic Peninsula', status: 'hot', description: 'Winter steelhead season kicking off. Fresh-run chrome fish are the prize. Fish after rain when rivers drop and clear.' },
      { title: 'Blackmouth Chinook', location: 'Areas 9, 10 (check WDFW)', status: 'ok', description: 'Blackmouth Chinook available in some Puget Sound areas. Check WDFW for current marine season.' },
    ],
  };
  return advice[month] ?? advice[1];
}

function getRiverPicks(month: number): RiverPick[] {
  const picks: Record<number, RiverPick[]> = {
    1:  [{ river: 'Cowlitz River', target: 'Winter Steelhead', hot: true, tip: 'Fish the "Barrier Dam" section and below Riffe. Side-drift cured eggs near bottom in 4–6 ft runs. Limit 2 hatchery.' }],
    2:  [{ river: 'Snohomish / Skykomish', target: 'Winter Steelhead', hot: true, tip: 'Index area produces well in Feb. Side-drift or float+jig through slots on the index. Avoid wild fish.' }],
    3:  [{ river: 'Cowlitz River', target: 'Spring Chinook', hot: true, tip: 'Spring Chinook starting Mar. Float cured eggs below Riffe Lake. Best on incoming tide at the mouth.' }],
    4:  [{ river: 'Cowlitz River', target: 'Spring Chinook peak', hot: true, tip: 'Best spring Chinook fishing in WA. Concentrate below the hatchery. Back-bounce eggs through runs.' }, { river: 'Skykomish River', target: 'Spring Chinook', hot: false, tip: 'Some spring Chinook available below Stevens Pass. Check WDFW for current regs by reach.' }],
    5:  [{ river: 'Hoh River', target: 'Summer Steelhead', hot: false, tip: 'Summer steelhead starting to show on Olympic rivers. Swing a spoon through deep pools at dawn.' }, { river: 'Green River', target: 'Cutthroat Trout', hot: false, tip: 'Resident cutthroat active in May. Barbless spinners or fly fishing. Artificial lures only on some sections.' }],
    6:  [{ river: 'Cowlitz River', target: 'Late Spring Chinook', hot: false, tip: 'Season winding down but some fish still available June. Upper river sections near Riffe.' }],
    7:  [{ river: 'Snohomish River (tidewater)', target: 'Chinook Salmon', hot: true, tip: 'Tidewater Chinook available July. Fish the mouths on incoming tides. Float + eggs or back-bounce near deep holes.' }],
    8:  [{ river: 'Skagit River', target: 'Pink Salmon (odd years)', hot: true, tip: 'Pinks in the Skagit in Aug. Cast small pink spinners or jigs from bars. Very fast action.' }, { river: 'Snohomish / Skykomish', target: 'Chinook & Pink', hot: true, tip: 'Multiple species available in August. Tidewater zones very productive on incoming tides.' }],
    9:  [{ river: 'Cowlitz River', target: 'Fall Chinook & Coho', hot: true, tip: 'Best river fishing of the year. Float eggs near bottom, fish on incoming tide in tidal reaches. Large Chinook to 40 lbs.' }, { river: 'Hoh River', target: 'Coho Salmon', hot: true, tip: 'Olympic Peninsula coho arriving Sept. Swing spinners through pools. Gorgeous setting.' }],
    10: [{ river: 'Skagit River', target: 'Coho Salmon', hot: true, tip: 'Skagit coho in October after rains. Fish log-jam edges and deep pools with spinners and float rigs.' }, { river: 'Snohomish', target: 'Coho Salmon', hot: true, tip: 'Hatchery coho returning to Warm Beach and Monroe hatcheries. Fish below facilities.' }],
    11: [{ river: 'Cowlitz River', target: 'Coho + Early Steelhead', hot: true, tip: 'Coho finishing up, first winter steelhead arriving. Side-drift eggs. Fish after any significant rain.' }],
    12: [{ river: 'Cowlitz River', target: 'Winter Steelhead', hot: true, tip: 'Dec brings strong steelhead runs to the Cowlitz. Hatchery fish below Barrier Dam are chrome bright.' }, { river: 'Snohomish / Skykomish', target: 'Winter Steelhead', hot: false, tip: 'Early steelhead showing — fish during rising water conditions for best results.' }],
  };
  return picks[month] ?? picks[1];
}

// ── Save Catch Sheet ──────────────────────────────────────────────────────────

function SaveCatchSheet({ defaultSpecies, defaultScientific, confidence, onSave, onClose, allowPhoto = false }: {
  defaultSpecies?: string;
  defaultScientific?: string;
  confidence?: string;
  onSave: (data: SaveFormData & { photoData?: string }) => Promise<void>;
  onClose: () => void;
  allowPhoto?: boolean;
}) {
  const today = new Date().toISOString().split('T')[0];
  const [species, setSpecies] = useState(defaultSpecies ?? '');
  const [date, setDate] = useState(today);
  const [location, setLocation] = useState('');
  const [sizeIn, setSizeIn] = useState('');
  const [weightLb, setWeightLb] = useState('');
  const [notes, setNotes] = useState('');
  const [photoData, setPhotoData] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  const handlePhotoFile = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const compressed = await compressImage(reader.result as string);
      setPhotoData(compressed);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSave = async () => {
    if (!species.trim()) return;
    setSaving(true);
    try {
      await onSave({ species, date, location, sizeIn, weightLb, notes, photoData });
    } finally {
      setSaving(false);
    }
  };

  const confColor = confidence === 'High' ? 'open' : confidence === 'Medium' ? 'warn' : confidence === 'Low' ? 'closed' : undefined;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-sheet" onClick={e => e.stopPropagation()}>
        <div className="settings-handle" />
        <h2 className="settings-title">Save to Catch Log</h2>

        {defaultSpecies && (
          <div style={{background:'var(--fish-teal-soft)',border:'1px solid var(--fish-teal)',borderRadius:10,padding:'10px 14px',marginBottom:14}}>
            <div style={{fontWeight:700,color:'var(--fish-teal)'}}>{defaultSpecies}</div>
            {defaultScientific && <div style={{fontSize:12,fontStyle:'italic',color:'var(--text-mute)',marginTop:2}}>{defaultScientific}</div>}
            {confColor && <span className={`badge badge-${confColor}`} style={{marginTop:6,display:'inline-flex'}}>{confidence} confidence</span>}
          </div>
        )}

        <label className="settings-input-label">Species *</label>
        <input className="settings-input" value={species} onChange={e => setSpecies(e.target.value)} placeholder="e.g. Chinook Salmon" />

        <label className="settings-input-label" style={{marginTop:10,display:'block'}}>Date *</label>
        <input className="settings-input" type="date" value={date} onChange={e => setDate(e.target.value)} />

        <label className="settings-input-label" style={{marginTop:10,display:'block'}}>Location</label>
        <input className="settings-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Marine Area 10, Elliott Bay" />

        <div style={{display:'flex',gap:8,marginTop:10}}>
          <div style={{flex:1}}>
            <label className="settings-input-label" style={{display:'block'}}>Size (in)</label>
            <input className="settings-input" value={sizeIn} onChange={e => setSizeIn(e.target.value)} placeholder='28"' inputMode="decimal" />
          </div>
          <div style={{flex:1}}>
            <label className="settings-input-label" style={{display:'block'}}>Weight (lbs)</label>
            <input className="settings-input" value={weightLb} onChange={e => setWeightLb(e.target.value)} placeholder="12.5" inputMode="decimal" />
          </div>
        </div>

        <label className="settings-input-label" style={{marginTop:10,display:'block'}}>Notes</label>
        <textarea
          className="settings-input"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Where exactly, what lure/bait worked, conditions…"
          rows={3}
          style={{resize:'none',fontFamily:'inherit'}}
        />

        {allowPhoto && (
          <>
            <label className="settings-input-label" style={{marginTop:10,display:'block'}}>Photo (optional)</label>
            <input ref={photoRef} type="file" accept="image/*" capture="environment" onChange={e => e.target.files?.[0] && handlePhotoFile(e.target.files[0])} style={{display:'none'}} />
            {photoData ? (
              <div style={{position:'relative',marginBottom:4}}>
                <img src={photoData} alt="Catch" style={{width:'100%',borderRadius:10,display:'block'}} />
                <button
                  onClick={() => setPhotoData(undefined)}
                  style={{position:'absolute',top:6,right:6,background:'rgba(0,0,0,0.5)',color:'#fff',border:'none',borderRadius:6,padding:'4px 8px',fontSize:12,cursor:'pointer'}}
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <button className="btn btn-secondary" style={{fontSize:13}} onClick={() => photoRef.current?.click()}>
                <IconCamera /> Add Photo
              </button>
            )}
          </>
        )}

        <div className="settings-actions" style={{marginTop:16}}>
          <button className="btn btn-secondary" onClick={onClose} style={{flex:1}}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!species.trim() || saving} style={{flex:2}}>
            {saving ? 'Saving…' : '💾 Save Catch'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Catch Log Tab ─────────────────────────────────────────────────────────────

function CatchLogTab({ entries, onRemove, onAdd }: {
  entries: CatchEntry[];
  onRemove: (id: string) => void;
  onAdd: (entry: Omit<CatchEntry, 'id' | 'timestamp'>) => CatchEntry;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);

  const totalCount = entries.length;
  const speciesCounts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.species] = (acc[e.species] ?? 0) + 1;
    return acc;
  }, {});
  const topSpecies = Object.entries(speciesCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="tab-content">
      <div className="section-header">
        <span className="section-title">Catch Log</span>
        <button
          className="btn btn-primary"
          style={{width:'auto',padding:'8px 16px',fontSize:13}}
          onClick={() => setShowAddSheet(true)}
        >
          + Add
        </button>
      </div>

      {totalCount === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📖</span>
          <p>No catches logged yet.</p>
          <p style={{marginTop:4,fontSize:12}}>Identify a fish and tap &quot;Save to Catch Log,&quot; or tap + Add above to log manually.</p>
          <button className="btn btn-outline" style={{marginTop:16,maxWidth:200,margin:'16px auto 0'}} onClick={() => setShowAddSheet(true)}>
            + Log a Catch
          </button>
        </div>
      ) : (
        <>
          {topSpecies.length > 0 && (
            <div className="fish-card" style={{margin:'6px 12px'}}>
              <p className="fish-card-title">Summary — {totalCount} {totalCount === 1 ? 'catch' : 'catches'}</p>
              <div className="pill-row">
                {topSpecies.map(([sp, count]) => (
                  <span key={sp} className="pill" style={{background:'var(--fish-teal-soft)',color:'var(--fish-teal)',borderColor:'var(--fish-teal)'}}>
                    {sp} × {count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {entries.map(entry => (
            <CatchEntryCard
              key={entry.id}
              entry={entry}
              expanded={expandedId === entry.id}
              onToggle={() => setExpandedId(prev => prev === entry.id ? null : entry.id)}
              onDelete={() => {
                onRemove(entry.id);
                if (expandedId === entry.id) setExpandedId(null);
              }}
            />
          ))}
        </>
      )}

      {showAddSheet && (
        <SaveCatchSheet
          allowPhoto
          onSave={async (formData) => {
            onAdd({
              species: formData.species,
              date: formData.date,
              location: formData.location,
              sizeIn: formData.sizeIn || undefined,
              weightLb: formData.weightLb || undefined,
              thumbnailData: formData.photoData,
              notes: formData.notes,
            });
            setShowAddSheet(false);
          }}
          onClose={() => setShowAddSheet(false)}
        />
      )}

      <p className="disclaimer">Stored locally on this device only. Not backed up to the cloud.</p>
    </div>
  );
}

// ── Catch Entry Card ──────────────────────────────────────────────────────────

function CatchEntryCard({ entry, expanded, onToggle, onDelete }: {
  entry: CatchEntry;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dateStr = entry.date
    ? new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="catch-entry-card">
      <div className="catch-entry-header" onClick={onToggle}>
        <div className="catch-entry-thumb">
          {entry.thumbnailData
            ? <img src={entry.thumbnailData} alt={entry.species} className="catch-thumb-img" />
            : <span style={{fontSize:26,lineHeight:1}}>🐟</span>
          }
        </div>
        <div className="catch-entry-info">
          <p className="catch-entry-species">{entry.species}</p>
          <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:3}}>
            <span className="badge badge-info" style={{fontSize:10,padding:'2px 7px'}}>{dateStr}</span>
            {entry.location && (
              <span className="badge" style={{fontSize:10,padding:'2px 7px',background:'var(--panel-2)',color:'var(--text-mute)',borderRadius:20}}>
                {entry.location.length > 22 ? entry.location.slice(0, 20) + '…' : entry.location}
              </span>
            )}
          </div>
          {(entry.sizeIn || entry.weightLb) && (
            <div style={{fontSize:11,color:'var(--text-mute)',marginTop:3}}>
              {entry.sizeIn && <span>{entry.sizeIn}&quot;</span>}
              {entry.sizeIn && entry.weightLb && <span> · </span>}
              {entry.weightLb && <span>{entry.weightLb} lbs</span>}
            </div>
          )}
        </div>
        <span className={`chevron-icon${expanded ? ' open' : ''}`}><IconChevron /></span>
      </div>

      {expanded && (
        <div className="catch-entry-body">
          {entry.thumbnailData && (
            <img src={entry.thumbnailData} alt={entry.species} className="catch-detail-photo" />
          )}

          <div className="catch-stats-grid">
            {entry.sizeIn && (
              <div className="catch-stat">
                <span className="catch-stat-label">Size</span>
                <span className="catch-stat-val">{entry.sizeIn}&quot;</span>
              </div>
            )}
            {entry.weightLb && (
              <div className="catch-stat">
                <span className="catch-stat-label">Weight</span>
                <span className="catch-stat-val">{entry.weightLb} lbs</span>
              </div>
            )}
            {entry.location && (
              <div className="catch-stat" style={{gridColumn:'1/-1'}}>
                <span className="catch-stat-label">Location</span>
                <span className="catch-stat-val">{entry.location}</span>
              </div>
            )}
            {entry.scientificName && (
              <div className="catch-stat" style={{gridColumn:'1/-1'}}>
                <span className="catch-stat-label">Species</span>
                <span className="catch-stat-val" style={{fontStyle:'italic'}}>{entry.scientificName}</span>
              </div>
            )}
            {entry.confidence && (
              <div className="catch-stat">
                <span className="catch-stat-label">AI ID</span>
                <span className={`badge badge-${entry.confidence === 'High' ? 'open' : entry.confidence === 'Medium' ? 'warn' : 'closed'}`} style={{fontSize:10}}>
                  {entry.confidence}
                </span>
              </div>
            )}
          </div>

          {entry.notes ? (
            <div style={{marginTop:10,fontSize:13,color:'var(--text-dim)',background:'var(--panel-2)',padding:'10px 12px',borderRadius:8,lineHeight:1.5}}>
              {entry.notes}
            </div>
          ) : null}

          {entry.aiFeatures && entry.aiFeatures.length > 0 && (
            <div style={{marginTop:10}}>
              <p className="fish-id-section-title">AI ID Features</p>
              <ul className="feature-list">
                {entry.aiFeatures.slice(0, 3).map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          <div style={{display:'flex',gap:8,marginTop:14}}>
            {confirmDelete ? (
              <>
                <button
                  className="btn"
                  style={{flex:1,background:'var(--fish-closed-bg)',color:'var(--fish-closed)',border:'1px solid var(--fish-closed)',fontSize:12,padding:'9px'}}
                  onClick={onDelete}
                >
                  Confirm Delete
                </button>
                <button className="btn btn-secondary" style={{flex:1,fontSize:12,padding:'9px'}} onClick={() => setConfirmDelete(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-secondary" style={{fontSize:12,padding:'9px 14px'}} onClick={() => setConfirmDelete(true)}>
                🗑 Delete Entry
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────

function SettingsTab({ apiKey, onSaveKey }: {
  apiKey: string;
  onSaveKey: (key: string) => void;
}) {
  const [draft, setDraft] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');
  const [testMsg, setTestMsg] = useState('');

  const isDirty = draft.trim() !== apiKey;
  const hasKey = !!apiKey;

  const handleSave = () => {
    onSaveKey(draft);
    setTestStatus('idle');
  };

  const handleClear = () => {
    setDraft('');
    onSaveKey('');
    setTestStatus('idle');
  };

  const testConnection = async () => {
    const key = draft.trim() || apiKey;
    if (!key) return;
    setTestStatus('testing');
    setTestMsg('');
    try {
      // Tiny 1×1 white JPEG — just enough to test auth without spending tokens on a real image
      const tiny1x1 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVIP/2Q==';
      const res = await fetch('/api/fishing/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: tiny1x1, mimeType: 'image/jpeg', clientApiKey: key }),
      });
      const data = await res.json();
      if (res.status === 401 || (data?.error ?? '').toLowerCase().includes('api key')) {
        setTestStatus('fail');
        setTestMsg('Invalid API key — double-check it and try again.');
      } else {
        setTestStatus('ok');
        setTestMsg('Connected!');
      }
    } catch (e) {
      setTestStatus('fail');
      setTestMsg(String(e));
    }
  };

  return (
    <div className="tab-content">
      <div className="section-header">
        <span className="section-title">Settings</span>
      </div>

      {/* ── API Key ── */}
      <div className="fish-card" style={{margin:'6px 12px'}}>
        <p className="fish-card-title">🔑 Claude API Key</p>
        <p style={{fontSize:12,color:'var(--text-mute)',marginBottom:12,lineHeight:1.6}}>
          Required for AI fish ID. Each person uses their own key — sign up free at{' '}
          <strong style={{color:'var(--fish-teal)'}}>console.anthropic.com</strong>.
          Cost is about <strong style={{color:'var(--text)'}}>$0.001 per photo</strong>.
        </p>

        <div style={{position:'relative',marginBottom:8}}>
          <input
            className="settings-input"
            type={showKey ? 'text' : 'password'}
            value={draft}
            onChange={e => { setDraft(e.target.value); setTestStatus('idle'); }}
            placeholder="sk-ant-api03-..."
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            style={{paddingRight:48,fontFamily:'monospace',fontSize:13}}
          />
          <button
            onClick={() => setShowKey(v => !v)}
            style={{
              position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',
              background:'none',border:'none',cursor:'pointer',
              fontSize:16,padding:'4px',lineHeight:1,color:'var(--text-mute)',
            }}
            aria-label={showKey ? 'Hide key' : 'Show key'}
          >
            {showKey ? '🙈' : '👁'}
          </button>
        </div>

        {/* Status */}
        <div style={{minHeight:26,marginBottom:12}}>
          {!draft && !hasKey && (
            <span className="badge badge-closed">No key — fish ID disabled</span>
          )}
          {hasKey && !isDirty && testStatus === 'idle' && (
            <span className="badge badge-open">✓ Key saved</span>
          )}
          {isDirty && draft && testStatus === 'idle' && (
            <span className="badge badge-warn">Unsaved changes</span>
          )}
          {testStatus === 'testing' && <span className="badge badge-info">Testing…</span>}
          {testStatus === 'ok'      && <span className="badge badge-open">✓ {testMsg}</span>}
          {testStatus === 'fail'    && <span className="badge badge-closed">✗ {testMsg}</span>}
        </div>

        <div style={{display:'flex',gap:8}}>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!isDirty || !draft.trim()}
            style={{flex:2}}
          >
            Save Key
          </button>
          <button
            className="btn btn-secondary"
            onClick={testConnection}
            disabled={(!draft.trim() && !hasKey) || testStatus === 'testing'}
            style={{flex:1,fontSize:13}}
          >
            Test
          </button>
          {hasKey && (
            <button
              className="btn btn-secondary"
              onClick={handleClear}
              style={{flex:1,fontSize:13,color:'var(--fish-closed)'}}
            >
              Clear
            </button>
          )}
        </div>

        <p style={{fontSize:11,color:'var(--text-mute)',marginTop:10,lineHeight:1.5}}>
          Stored on <strong>this device only</strong>. Never shared. Sent directly to Anthropic when you use fish ID.
        </p>
      </div>

      {/* ── Regulations info ── */}
      <div className="fish-card" style={{margin:'6px 12px'}}>
        <p className="fish-card-title">📋 Regulations Data</p>
        <div className="reg-row">
          <span className="reg-row-label">Season</span>
          <span className="reg-row-value">2025 – 2026</span>
        </div>
        <div className="reg-row">
          <span className="reg-row-label">Coverage</span>
          <span className="reg-row-value">Marine Areas 5–13, WA rivers &amp; lakes</span>
        </div>
        <div className="reg-row" style={{borderBottom:'none'}}>
          <span className="reg-row-label">Source</span>
          <span className="reg-row-value">WDFW pamphlet 2025–2026</span>
        </div>
        <div style={{marginTop:10,padding:'10px 12px',background:'var(--fish-warn-bg)',borderRadius:8,fontSize:12,color:'var(--fish-warn)',lineHeight:1.5}}>
          ⚠ Always verify at <strong>wdfw.wa.gov</strong> or call (360) 902-2700.
          Emergency rules can change any time.
        </div>
      </div>

      {/* ── Quick links ── */}
      <div className="fish-card" style={{margin:'6px 12px'}}>
        <p className="fish-card-title">🔗 Quick Links</p>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {([
            ['WDFW Emergency Rules',      'https://fortress.wa.gov/dfw/erules/efishrules/'],
            ['WDFW License &amp; CRC',    'https://fishhunt.dfw.wa.gov/'],
            ['Get a Claude API Key',      'https://console.anthropic.com/settings/keys'],
            ['USGS Stream Flow (WA)',     'https://waterdata.usgs.gov/wa/nwis/rt'],
          ] as [string, string][]).map(([label, url]) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:'flex',alignItems:'center',justifyContent:'space-between',
                padding:'11px 13px',
                background:'var(--panel-2)',border:'1px solid var(--border)',borderRadius:9,
                fontSize:13,color:'var(--fish-teal)',textDecoration:'none',fontWeight:500,
              }}
              dangerouslySetInnerHTML={undefined}
            >
              <span dangerouslySetInnerHTML={{__html: label}} />
              <span style={{color:'var(--text-mute)',fontSize:12}}>↗</span>
            </a>
          ))}
        </div>
      </div>

      <p className="disclaimer">PNW Fish Guide · WA 2025–2026 · All data stored locally on device</p>
    </div>
  );
}

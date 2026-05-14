// Washington State 2025-2026 fishing regulations (July 1 2025 – June 30 2026)
// Source: WDFW Fishing in Washington 2025-2026 regulation pamphlet
// Always verify at wdfw.wa.gov or call (360) 902-2700 for emergency rule changes

export type SalmonPeriod = {
  label: string;
  startMD: [number, number]; // [month 1-12, day]
  endMD: [number, number];
  closed?: boolean;
  limit?: number;
  bonusLimit?: number;
  bonusSpecies?: string;
  minSize?: Record<string, number>; // species -> min inches
  release: string[];
  notes?: string[];
  zone?: string;
};

export type BottomfishRegs = {
  halibut: { open: boolean; limit?: number; annualLimit?: number; note?: string };
  lingcod: { open: boolean; startMD?: [number, number]; endMD?: [number, number]; minIn?: number; maxIn?: number; limit?: number; note?: string };
  cabezon: { open: boolean; startMD?: [number, number]; endMD?: [number, number]; minIn?: number; limit?: number; note?: string };
  rockfish: { open: boolean; note?: string };
  surfperch: { open: boolean; limit?: number; shinerLimit?: number; note?: string };
  pacificCod: { open: boolean; note?: string };
  totalDailyLimit: number;
  maxDepthFt?: number;
};

export type MarineArea = {
  id: string;
  name: string;
  shortName: string;
  waters: string;
  salmon: SalmonPeriod[];
  bottomfish: BottomfishRegs;
  universalRules: string[];
  specialClosures?: string[];
};

export type RiverSystem = {
  id: string;
  name: string;
  region: string;
  salmon: { note: string; open: boolean }[];
  steelhead: { note: string; open: boolean }[];
  trout: { note: string; open: boolean }[];
  notes: string[];
};

// ─── Universal Puget Sound rules (Areas 5–13) ─────────────────────────────
export const UNIVERSAL_MARINE_RULES = [
  'Barbless hooks required for all species',
  'Single-point barbless hooks only for salmon in all areas',
  'Wild salmon may not be brought inside gunwale in Areas 5–13 if unlawful to retain',
  'Descending device must be onboard and rigged for immediate use when targeting bottomfish/halibut',
  'Yelloweye rockfish: CLOSED statewide',
  'Wolf-eel: closed to retention',
  'Sixgill, sevengill, and thresher sharks: closed',
  'Green sturgeon: illegal to fish for or retain',
  'Trout: catch-and-release only in all marine areas',
  'Steelhead: hatchery only, limit 2 — release all wild steelhead',
  'Catch Record Card required for salmon, steelhead, halibut, sturgeon, and PS Dungeness crab',
  'Halibut annual limit: 6 fish',
];

// ─── Marine Area Definitions ────────────────────────────────────────────────

export const MARINE_AREAS: MarineArea[] = [
  {
    id: 'area5',
    name: 'Marine Area 5 — Sekiu / Pillar Point',
    shortName: 'Area 5 — Sekiu',
    waters: 'Western Strait of Juan de Fuca (Cape Flattery to Pillar Point)',
    salmon: [
      {
        label: 'Jul 1 – Aug 15',
        startMD: [7, 1], endMD: [8, 15],
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        minSize: { chinook: 22 },
        release: ['wild coho', 'chum', 'sockeye', 'wild chinook'],
      },
      {
        label: 'Aug 16 – Sep 26',
        startMD: [8, 16], endMD: [9, 26],
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        release: ['chinook', 'chum', 'sockeye', 'wild coho'],
      },
      {
        label: 'Sep 27 – Oct 9',
        startMD: [9, 27], endMD: [10, 9],
        limit: 2,
        release: ['chinook', 'chum', 'sockeye'],
      },
      {
        label: 'Oct 10 – Jun 30',
        startMD: [10, 10], endMD: [6, 30],
        closed: true, release: [],
      },
    ],
    bottomfish: {
      halibut: { open: true, limit: 1, annualLimit: 6, note: 'Check WDFW for exact season dates' },
      lingcod: { open: true, startMD: [5, 1], endMD: [6, 15], minIn: 26, maxIn: 36, limit: 1 },
      cabezon: { open: true, startMD: [5, 1], endMD: [11, 30], minIn: 18, limit: 1 },
      rockfish: { open: true, note: 'First 3 black/blue/deacon rockfish W of Slip Point; first 1 E of Slip Point. May 1–Sep 30 only' },
      surfperch: { open: true, limit: 10, shinerLimit: 15 },
      pacificCod: { open: true },
      totalDailyLimit: 15,
    },
    universalRules: [...UNIVERSAL_MARINE_RULES],
    specialClosures: ['Kydaka Point: closed Jul 1–Aug 15'],
  },

  {
    id: 'area6',
    name: 'Marine Area 6 — Port Angeles / Dungeness',
    shortName: 'Area 6 — Port Angeles',
    waters: 'Eastern Strait of Juan de Fuca (Ediz Hook to Partridge Point)',
    salmon: [
      {
        label: 'Jul 1 – Aug 15 (W of Ediz Hook Buoy #2)',
        startMD: [7, 1], endMD: [8, 15],
        zone: 'West of Ediz Hook Buoy #2',
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        minSize: { chinook: 22 },
        release: ['wild coho', 'chum', 'sockeye', 'wild chinook'],
      },
      {
        label: 'Aug 16 – Sep 26',
        startMD: [8, 16], endMD: [9, 26],
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        release: ['chinook', 'chum', 'sockeye', 'wild coho'],
      },
      {
        label: 'Sep 27 – Oct 15',
        startMD: [9, 27], endMD: [10, 15],
        limit: 2,
        release: ['chinook', 'sockeye', 'chum'],
      },
      {
        label: 'Oct 16 – Jun 30',
        startMD: [10, 16], endMD: [6, 30],
        closed: true, release: [],
      },
    ],
    bottomfish: {
      halibut: { open: true, limit: 1, annualLimit: 6 },
      lingcod: { open: true, startMD: [5, 1], endMD: [6, 15], minIn: 26, maxIn: 36, limit: 1 },
      cabezon: { open: true, startMD: [5, 1], endMD: [11, 30], minIn: 18, limit: 1 },
      rockfish: { open: false, note: 'CLOSED in Area 6' },
      surfperch: { open: true, limit: 10, shinerLimit: 15 },
      pacificCod: { open: true },
      totalDailyLimit: 15,
      maxDepthFt: 120,
    },
    universalRules: [...UNIVERSAL_MARINE_RULES],
    specialClosures: [
      'Dungeness Bay: closed Jul 1–Sep 30; Oct 1–31 hatchery coho only',
      'Freshwater Bay: closed year-round',
      'Port Angeles Harbor: closed Jul 1–Aug 15',
    ],
  },

  {
    id: 'area7',
    name: 'Marine Area 7 — San Juan Islands',
    shortName: 'Area 7 — San Juans',
    waters: 'San Juan Islands, northern Puget Sound, Bellingham Bay',
    salmon: [
      {
        label: 'Jul 17–19',
        startMD: [7, 17], endMD: [7, 19],
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        minSize: { chinook: 22 },
        release: ['wild coho', 'chum', 'sockeye', 'wild chinook'],
      },
      {
        label: 'Jul 20–31',
        startMD: [7, 20], endMD: [7, 31],
        closed: true, release: [],
      },
      {
        label: 'Aug 1 – Sep 6',
        startMD: [8, 1], endMD: [9, 6],
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        release: ['chinook', 'chum', 'sockeye', 'wild coho'],
      },
      {
        label: 'Sep 7–30',
        startMD: [9, 7], endMD: [9, 30],
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        release: ['chinook', 'sockeye', 'chum'],
      },
      {
        label: 'Oct 1 – Jun 30',
        startMD: [10, 1], endMD: [6, 30],
        closed: true, release: [],
        notes: ['Bellingham Bay: Oct 1–30 open for Chinook min 22", limit 4'],
      },
    ],
    bottomfish: {
      halibut: { open: true, limit: 1, annualLimit: 6, note: 'Check WDFW for season dates' },
      lingcod: { open: true, startMD: [5, 1], endMD: [6, 15], minIn: 26, maxIn: 36, limit: 1 },
      cabezon: { open: true, startMD: [5, 1], endMD: [11, 30], minIn: 18, limit: 1 },
      rockfish: { open: false, note: 'CLOSED' },
      surfperch: { open: true, limit: 10, shinerLimit: 15 },
      pacificCod: { open: true },
      totalDailyLimit: 15,
    },
    universalRules: [...UNIVERSAL_MARINE_RULES],
    specialClosures: [
      'Lummi Bay / Lummi Reservation: closed year-round',
      'Samish Bay: closed year-round',
      'Yellow and Low Islands Preserve: closed year-round',
      'Herring: closed north of Sandy Point to Patos Island line',
    ],
  },

  {
    id: 'area81',
    name: 'Marine Area 8-1 — Deception Pass / Skagit Bay',
    shortName: 'Area 8-1 — Deception Pass',
    waters: 'Deception Pass, Hope Island, Skagit Bay',
    salmon: [
      {
        label: 'Jul 1 – Aug 15',
        startMD: [7, 1], endMD: [8, 15],
        closed: true, release: [],
      },
      {
        label: 'Aug 16 – Sep 30',
        startMD: [8, 16], endMD: [9, 30],
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        release: ['chinook', 'chum'],
      },
      {
        label: 'Oct 1–12',
        startMD: [10, 1], endMD: [10, 12],
        limit: 2,
        release: ['chinook', 'chum'],
      },
      {
        label: 'Oct 13 – Jun 30',
        startMD: [10, 13], endMD: [6, 30],
        closed: true, release: [],
      },
    ],
    bottomfish: {
      halibut: { open: true, limit: 1, annualLimit: 6 },
      lingcod: { open: true, startMD: [5, 1], endMD: [6, 15], minIn: 26, maxIn: 36, limit: 1 },
      cabezon: { open: true, startMD: [5, 1], endMD: [11, 30], minIn: 18, limit: 1 },
      rockfish: { open: false },
      surfperch: { open: true, limit: 10, shinerLimit: 15 },
      pacificCod: { open: false },
      totalDailyLimit: 15,
    },
    universalRules: [...UNIVERSAL_MARINE_RULES],
  },

  {
    id: 'area82',
    name: 'Marine Area 8-2 — Port Susan / Port Gardner',
    shortName: 'Area 8-2 — Port Susan',
    waters: 'Port Susan, Port Gardner, Possession Sound',
    salmon: [
      {
        label: 'Jul 1 – Aug 31',
        startMD: [7, 1], endMD: [7, 31],
        closed: true, release: [],
      },
      {
        label: 'Aug 1 – Sep 24',
        startMD: [8, 1], endMD: [9, 24],
        limit: 2,
        release: ['chinook', 'chum', 'pink'],
        notes: ['Tulalip Terminal Area (Fri–Mon noon): open select dates May 23–Sep 21'],
      },
      {
        label: 'Sep 25 – Jun 30',
        startMD: [9, 25], endMD: [6, 30],
        closed: true, release: [],
      },
    ],
    bottomfish: {
      halibut: { open: true, limit: 1, annualLimit: 6 },
      lingcod: { open: true, startMD: [5, 1], endMD: [6, 15], minIn: 26, maxIn: 36, limit: 1 },
      cabezon: { open: true, startMD: [5, 1], endMD: [11, 30], minIn: 18, limit: 1 },
      rockfish: { open: false },
      surfperch: { open: true, limit: 10, shinerLimit: 15 },
      pacificCod: { open: false },
      totalDailyLimit: 15,
    },
    universalRules: [...UNIVERSAL_MARINE_RULES],
    specialClosures: ['Tulalip Bay: closed year-round'],
  },

  {
    id: 'area9',
    name: 'Marine Area 9 — Admiralty Inlet',
    shortName: 'Area 9 — Admiralty Inlet',
    waters: 'Admiralty Inlet, northern Hood Canal entrance',
    salmon: [
      {
        label: 'Jul 17–19',
        startMD: [7, 17], endMD: [7, 19],
        limit: 2,
        minSize: { chinook: 22 },
        release: ['chum', 'wild coho', 'wild chinook'],
      },
      {
        label: 'Jul 20–31',
        startMD: [7, 20], endMD: [7, 31],
        closed: true, release: [],
      },
      {
        label: 'Aug 1 – Sep 30',
        startMD: [8, 1], endMD: [9, 30],
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        release: ['chinook', 'wild coho', 'chum'],
      },
      {
        label: 'Oct 1 – Jun 30',
        startMD: [10, 1], endMD: [6, 30],
        closed: true, release: [],
        notes: ['Edmonds Public Pier: open Oct 1–Jul 31, Chinook min 22", limit 2 (max 1 Chinook)'],
      },
    ],
    bottomfish: {
      halibut: { open: true, limit: 1, annualLimit: 6, note: 'Check WDFW for season' },
      lingcod: { open: true, startMD: [5, 1], endMD: [6, 15], minIn: 26, maxIn: 36, limit: 1 },
      cabezon: { open: true, startMD: [5, 1], endMD: [11, 30], minIn: 18, limit: 1 },
      rockfish: { open: false },
      surfperch: { open: true, limit: 10, shinerLimit: 15 },
      pacificCod: { open: false, note: 'CLOSED to retention' },
      totalDailyLimit: 15,
      maxDepthFt: 120,
    },
    universalRules: [...UNIVERSAL_MARINE_RULES],
    specialClosures: [
      'Admiralty Head / Keystone: closed year-round to food fish',
      'Northern Hood Canal (Area 9 portion): Jul 17–31 CLOSED; Aug 1–Sep 30 open',
    ],
  },

  {
    id: 'area10',
    name: 'Marine Area 10 — Central Puget Sound',
    shortName: 'Area 10 — Seattle / Bremerton',
    waters: 'Central Puget Sound: Seattle, Bremerton, Bainbridge, Vashon',
    salmon: [
      {
        label: 'Jun 1 – Jul 16',
        startMD: [6, 1], endMD: [7, 16],
        limit: 2,
        release: ['chinook', 'chum', 'wild coho'],
      },
      {
        label: 'Jul 17–19',
        startMD: [7, 17], endMD: [7, 19],
        limit: 2,
        minSize: { chinook: 22 },
        release: ['chum', 'wild chinook', 'wild coho'],
      },
      {
        label: 'Jul 20–31',
        startMD: [7, 20], endMD: [7, 31],
        limit: 2,
        release: ['chinook', 'chum', 'wild coho'],
      },
      {
        label: 'Aug 1 – Sep 30',
        startMD: [8, 1], endMD: [9, 30],
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        release: ['chinook', 'chum', 'wild coho'],
      },
      {
        label: 'Oct 1 – Nov 15',
        startMD: [10, 1], endMD: [11, 15],
        limit: 2,
        release: ['chinook'],
      },
      {
        label: 'Nov 16 – Mar 31',
        startMD: [11, 16], endMD: [3, 31],
        closed: true, release: [],
      },
      {
        label: 'Apr 1–30 (Wed–Sat only)',
        startMD: [4, 1], endMD: [4, 30],
        limit: 2,
        minSize: { chinook: 22 },
        release: ['chum', 'wild chinook', 'wild coho'],
        notes: ['Open Wed–Sat only'],
      },
      {
        label: 'May 1 – May 31',
        startMD: [5, 1], endMD: [5, 31],
        closed: true, release: [],
        notes: ['Check WDFW — some sub-areas may be open'],
      },
      {
        label: 'Sinclair Inlet: Jul 16 – Sep 30',
        startMD: [7, 16], endMD: [9, 30],
        zone: 'Sinclair Inlet / Port Orchard',
        limit: 3, bonusLimit: 2, bonusSpecies: 'pink',
        minSize: { chinook: 22 },
        release: ['chum', 'wild chinook'],
        notes: ['Two-pole allowed in Sinclair Inlet'],
      },
    ],
    bottomfish: {
      halibut: { open: true, limit: 1, annualLimit: 6, note: 'Check WDFW for exact season dates' },
      lingcod: { open: true, startMD: [5, 1], endMD: [6, 15], minIn: 26, maxIn: 36, limit: 1 },
      cabezon: { open: true, startMD: [5, 1], endMD: [11, 30], minIn: 18, limit: 1 },
      rockfish: { open: false },
      surfperch: { open: true, limit: 10, shinerLimit: 15 },
      pacificCod: { open: false, note: 'CLOSED to retention' },
      totalDailyLimit: 15,
      maxDepthFt: 120,
    },
    universalRules: [...UNIVERSAL_MARINE_RULES],
    specialClosures: [
      'Chittenden Locks: waters between locks and railroad bridge — CLOSED',
      'Elliott Bay Public Pier: within 100 yards — closed to food fish',
      'Orchard Rocks Conservation Area: 400-yard radius — CLOSED',
      'Elliott Bay (East, Harbor Island): various sub-area closures July–Aug 4 noon',
      'Shilshole Bay / West Elliott Bay: closed Jul 1–Aug 31; opens Aug 16 (Sep 1–30 only)',
    ],
  },

  {
    id: 'area11',
    name: 'Marine Area 11 — South Puget Sound',
    shortName: 'Area 11 — Tacoma',
    waters: 'South Puget Sound: Tacoma, Commencement Bay, Gig Harbor, Des Moines',
    salmon: [
      {
        label: 'Jun 1–30 (Wed–Sat)',
        startMD: [6, 1], endMD: [6, 30],
        limit: 2,
        minSize: { chinook: 22 },
        release: ['chum', 'wild chinook', 'wild coho'],
        notes: ['Open Wed–Sat only'],
      },
      {
        label: 'Jul 1 – Jul 19',
        startMD: [7, 1], endMD: [7, 19],
        closed: true, release: [],
        notes: ['Jul 17–19: Wed–Sat open same rules as Jun'],
      },
      {
        label: 'Aug 1 – Sep 30',
        startMD: [8, 1], endMD: [9, 30],
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        release: ['chum', 'wild chinook', 'wild coho'],
      },
      {
        label: 'Oct 1 – Nov 15',
        startMD: [10, 1], endMD: [11, 15],
        limit: 2,
        release: ['chinook'],
      },
      {
        label: 'Nov 16 – Mar 31',
        startMD: [11, 16], endMD: [3, 31],
        closed: true, release: [],
      },
      {
        label: 'Apr 1–30 (Wed–Sat)',
        startMD: [4, 1], endMD: [4, 30],
        limit: 2,
        minSize: { chinook: 22 },
        release: ['chum', 'wild chinook', 'wild coho'],
        notes: ['Open Wed–Sat only'],
      },
      {
        label: 'May 1 – May 31',
        startMD: [5, 1], endMD: [5, 31],
        closed: true, release: [],
      },
    ],
    bottomfish: {
      halibut: { open: false, note: 'CLOSED in Area 11' },
      lingcod: { open: true, startMD: [5, 1], endMD: [6, 15], minIn: 26, maxIn: 36, limit: 1 },
      cabezon: { open: true, startMD: [5, 1], endMD: [11, 30], minIn: 18, limit: 1 },
      rockfish: { open: false },
      surfperch: { open: true, limit: 10, shinerLimit: 15 },
      pacificCod: { open: false },
      totalDailyLimit: 15,
      maxDepthFt: 120,
    },
    universalRules: [...UNIVERSAL_MARINE_RULES],
    specialClosures: [
      'Commencement Bay: closed Jun 1–Jul 31; opens Aug 1',
    ],
  },

  {
    id: 'area12',
    name: 'Marine Area 12 — Hood Canal',
    shortName: 'Area 12 — Hood Canal',
    waters: 'Hood Canal (Ayock Point to Lynch Cove)',
    salmon: [
      {
        label: 'Jul 1–10',
        startMD: [7, 1], endMD: [7, 10],
        closed: true, release: [],
      },
      {
        label: 'Jul 11 – Sep 30 (N of Ayock Pt)',
        startMD: [7, 11], endMD: [9, 30],
        zone: 'North of Ayock Point',
        limit: 4, bonusLimit: 2, bonusSpecies: 'pink',
        release: ['chinook', 'chum', 'sockeye', 'wild coho'],
        notes: ['Jul 11–31: bait prohibited; single-point barbless hook ≤½" gap'],
      },
      {
        label: 'Jul 1 – Sep 30 (S of Ayock Pt)',
        startMD: [7, 1], endMD: [9, 30],
        zone: 'South of Ayock Point',
        limit: 4, bonusLimit: 2, bonusSpecies: 'pink',
        minSize: { chinook: 20 },
        release: ['chum', 'sockeye', 'wild chinook', 'wild coho'],
        notes: ['Two-pole allowed south of Ayock Point'],
      },
      {
        label: 'Oct 1–15',
        startMD: [10, 1], endMD: [10, 15],
        closed: true, release: [],
      },
      {
        label: 'Oct 16 – Nov 30',
        startMD: [10, 16], endMD: [11, 30],
        limit: 4,
        release: ['chinook', 'wild coho'],
      },
      {
        label: 'Dec 1 – Jun 30',
        startMD: [12, 1], endMD: [6, 30],
        closed: true, release: [],
      },
    ],
    bottomfish: {
      halibut: { open: false, note: 'CLOSED in Hood Canal' },
      lingcod: { open: false, note: 'CLOSED in Hood Canal' },
      cabezon: { open: false, note: 'CLOSED in Hood Canal' },
      rockfish: { open: false },
      surfperch: { open: false, note: 'Most fish CLOSED — flatfish only in limited areas' },
      pacificCod: { open: false },
      totalDailyLimit: 15,
      maxDepthFt: 120,
    },
    universalRules: [
      ...UNIVERSAL_MARINE_RULES,
      'Hood Canal: most bottomfish species CLOSED except flatfish (north of Turner Creek to Toandos Pen., <120 ft depth)',
      'Hood Canal: herring, anchovy, smelt — CLOSED',
    ],
    specialClosures: [
      'Sund Rock Conservation Area: CLOSED to all fish and shellfish',
      'Enetai Hatchery Outfall: 100-yard radius CLOSED year-round',
      'Big Beef Creek Bridge: Aug 1–Nov 30, 100 ft radius CLOSED',
      'Waketickeh Creek Conservation Area: CLOSED',
      'Hoodsport Hatchery ADA Site: closed year-round (disability program only)',
      'River mouth channels at low tide: CLOSED to salmon Jul 1–Sep 30',
    ],
  },

  {
    id: 'area13',
    name: 'Marine Area 13 — South Sound (Olympia)',
    shortName: 'Area 13 — Olympia',
    waters: 'South Puget Sound: Olympia, Nisqually, Budd Inlet',
    salmon: [
      {
        label: 'Jul 1 – Sep 30',
        startMD: [7, 1], endMD: [9, 30],
        limit: 2, bonusLimit: 2, bonusSpecies: 'pink',
        minSize: { chinook: 20 },
        release: ['chum', 'wild coho', 'wild chinook'],
        notes: ['Two-pole allowed', 'S Budd Inlet CLOSED Jul 1–Oct 31'],
      },
      {
        label: 'Oct 1 – Jun 30',
        startMD: [10, 1], endMD: [6, 30],
        limit: 2,
        minSize: { chinook: 22 },
        release: [],
        notes: ['Two-pole allowed', 'Southern Budd Inlet: Nov 1–Jun 30 open'],
      },
    ],
    bottomfish: {
      halibut: { open: false, note: 'CLOSED in Area 13' },
      lingcod: { open: true, startMD: [5, 1], endMD: [6, 15], minIn: 26, maxIn: 36, limit: 1 },
      cabezon: { open: true, startMD: [5, 1], endMD: [11, 30], minIn: 18, limit: 1 },
      rockfish: { open: false },
      surfperch: { open: true, limit: 10, shinerLimit: 15 },
      pacificCod: { open: false },
      totalDailyLimit: 15,
      maxDepthFt: 120,
    },
    universalRules: [...UNIVERSAL_MARINE_RULES],
    specialClosures: [
      'Fourth Ave Bridge (Olympia): CLOSED year-round',
      'Titlow Beach Marine Preserve: closed except salmon from shore/non-motorized craft with lures only',
      'Saltar\'s Point Conservation Area: CLOSED',
      'Z\'s Reef Marine Preserve: fly-fishing for salmon only',
      'Northern Budd Inlet: Aug 1–Oct 31 night closure + anti-snagging rule',
    ],
  },
];

// ─── River Systems ───────────────────────────────────────────────────────────

export const RIVER_SYSTEMS: RiverSystem[] = [
  {
    id: 'skagit',
    name: 'Skagit River System',
    region: 'Northwest WA',
    salmon: [
      { note: 'Chinook: check WDFW for current run — historically spring Chinook Mar–May, fall Aug–Oct', open: true },
      { note: 'Coho: typically Aug–Nov depending on tributaries', open: true },
      { note: 'Pink salmon (odd years only): runs in Aug–Sep', open: true },
    ],
    steelhead: [
      { note: 'Wild steelhead: catch-and-release only on most reaches', open: true },
      { note: 'Hatchery winter steelhead: Nov–Mar on mainstem', open: true },
      { note: 'Summer steelhead: typically Jul–Oct on upper mainstem', open: true },
    ],
    trout: [
      { note: 'Resident rainbow/cutthroat: check WDFW for size/bag limits by reach', open: true },
      { note: 'Bull trout: CLOSED — catch-and-release only', open: true },
    ],
    notes: [
      'Selective gear rules apply on many tributaries',
      'Wild coho retention varies by run strength — check current emergency rules',
      'Sauk and Suiattle rivers: important tributaries with separate regulations',
    ],
  },
  {
    id: 'snohomish',
    name: 'Snohomish / Skykomish / Snoqualmie',
    region: 'Northwest WA',
    salmon: [
      { note: 'Chinook: spring run Mar–Jun; fall run Sep–Nov on mainstem and Skykomish', open: true },
      { note: 'Coho: Oct–Dec — hatchery fish only on many reaches', open: true },
      { note: 'Pink salmon (odd years): late Aug–Sep on mainstem', open: true },
      { note: 'Chum: Nov–Dec (Wallace, Pilchuck tributaries)', open: true },
    ],
    steelhead: [
      { note: 'Wild winter steelhead: catch-and-release only Jan–Apr', open: true },
      { note: 'Hatchery steelhead: Jan–Mar below index sections', open: true },
    ],
    trout: [
      { note: 'Rainbow: various seasons by reach — check WDFW', open: true },
    ],
    notes: [
      'Skykomish River has special wild steelhead rules — check before fishing',
      'Snoqualmie River: salmon closed above Snoqualmie Falls',
      'Many tributaries closed to protect spawning',
    ],
  },
  {
    id: 'green',
    name: 'Green / Duwamish River',
    region: 'King County',
    salmon: [
      { note: 'Chinook: CLOSED to salmon above Landsburg Dam', open: false },
      { note: 'Coho: Sep–Dec below Auburn on select days', open: true },
      { note: 'Anti-snagging rules apply during salmon seasons', open: true },
    ],
    steelhead: [
      { note: 'Hatchery steelhead: Dec–Mar on select lower river reaches', open: true },
      { note: 'Wild steelhead: catch-and-release only', open: true },
    ],
    trout: [
      { note: 'Resident cutthroat: year-round below Landsburg; single barbless hook + artificial lure only', open: true },
    ],
    notes: [
      'Most Green River above Auburn is closed to salmon protection',
      'Check WDFW for current Fishways reports',
    ],
  },
  {
    id: 'cowlitz',
    name: 'Cowlitz River',
    region: 'Southwest WA',
    salmon: [
      { note: 'Spring Chinook: Apr–Jun on lower mainstem (famous run)', open: true },
      { note: 'Fall Chinook: Aug–Nov on lower and upper river', open: true },
      { note: 'Coho: Oct–Dec (Riffe Lake area popular)', open: true },
    ],
    steelhead: [
      { note: 'Wild winter steelhead: catch-and-release only', open: true },
      { note: 'Hatchery winter steelhead: Jan–Apr — one of WA\'s best steelhead rivers', open: true },
      { note: 'Hatchery summer steelhead: Jul–Sep above Riffe Lake', open: true },
    ],
    trout: [
      { note: 'Rainbow/cutthroat: May–Oct on upper river reaches', open: true },
    ],
    notes: [
      'Riffe Lake (Swofford Pond area): excellent trout and kokanee fishing',
      'Tilton River tributary: good steelhead access',
      'Check for anti-snagging rules during peak runs',
    ],
  },
  {
    id: 'hoh',
    name: 'Hoh River',
    region: 'Olympic Peninsula',
    salmon: [
      { note: 'Chinook: Jun–Sep; fall run Sep–Nov (wild fish conservation focus)', open: true },
      { note: 'Coho: Oct–Dec hatchery fish', open: true },
    ],
    steelhead: [
      { note: 'Wild steelhead: catch-and-release only — Hoh is renowned wild fish river', open: true },
      { note: 'Hatchery steelhead: Nov–Mar', open: true },
    ],
    trout: [
      { note: 'Cutthroat: catch-and-release only on wild fish', open: true },
      { note: 'Dolly Varden: check WDFW — often restricted', open: false },
    ],
    notes: [
      'Olympic Peninsula rivers have strong wild steelhead populations — treat them with care',
      'Selective gear rules often required on upper reaches',
      'Quinault, Queets, Quillayute are nearby sister rivers — similar rules',
    ],
  },
  {
    id: 'columbia',
    name: 'Columbia River (WA Side)',
    region: 'Statewide / Eastern & Southwest WA',
    salmon: [
      { note: 'Spring Chinook: Mar–Jun on lower Columbia; major fishery', open: true },
      { note: 'Fall Chinook: Sep–Nov; Bonneville and McNary Dam areas', open: true },
      { note: 'Sockeye: Jul–Aug (Hanford Reach)', open: true },
      { note: 'Coho: Sep–Nov on lower Columbia', open: true },
    ],
    steelhead: [
      { note: 'Summer steelhead: Jun–Sep; Snake, Clearwater tributaries', open: true },
      { note: 'Wild steelhead: catch-and-release on most reaches', open: true },
    ],
    trout: [
      { note: 'Walleye, bass, perch, crappie: year-round on Columbia system lakes', open: true },
      { note: 'Rainbow: Hanford Reach, Rufus Woods Lake are top trophy areas', open: true },
    ],
    notes: [
      'Columbia regulations are managed jointly with Oregon — check both states',
      'Tribal fishing areas have separate rules',
      'Snake River has separate seasonal regulations',
      'Grand Coulee Lake (Roosevelt): excellent walleye, perch, kokanee',
    ],
  },
];

// ─── Lake/Reservoir Quick Reference ─────────────────────────────────────────

export const LAKE_RULES = [
  {
    id: 'general-western',
    name: 'Western WA Lakes (General)',
    rules: [
      'Rainbow/cutthroat trout: typically open Apr 27 – Oct 31 (check specific lake)',
      'Daily limit: 5 trout (no more than 2 over 12")',
      'Largemouth/smallmouth bass: year-round, no size limit, limit 5',
      'Yellow perch: year-round, no size limit, limit 25',
      'Catfish: year-round, limit 10',
      'Selective gear rules apply in many mountain lakes',
      'Electric motor only restrictions common on high-elevation lakes',
    ],
  },
  {
    id: 'general-eastern',
    name: 'Eastern WA Lakes (General)',
    rules: [
      'Rainbow/brown trout: varies — most open year-round on eastern lakes',
      'Walleye: year-round, min 12", limit 8 (Columbia system: check special rules)',
      'Largemouth/smallmouth bass: year-round, no size limit',
      'Crappie: year-round, limit 10',
      'Perch: year-round, limit 25',
      'Ice fishing: legal statewide where waters are accessible',
    ],
  },
  {
    id: 'lake-washington',
    name: 'Lake Washington / Lake Sammamish',
    rules: [
      'Sockeye salmon: usually open Jul–Aug, limit 4–6 (check WDFW for exact dates)',
      'Chinook: limited season — check current WDFW rules',
      'Cutthroat trout: year-round catch-and-release only for wild fish',
      'Bass: year-round, no size limit',
      'Kokanee: year-round, limit 5',
      'Night closure for salmon at ship canal, Portage Bay, and Montlake Cut',
    ],
  },
  {
    id: 'chelan',
    name: 'Lake Chelan / Wenatchee Area',
    rules: [
      'Lake Chelan: rainbow, cutthroat, lake trout year-round; limit 5 (max 2 over 18")',
      'Kokanee: excellent kokanee fishery year-round; limit 10',
      'Smallmouth bass: year-round, good population',
      'Wenatchee River (salmon): spring Chinook May–Jun, coho Sep–Nov',
    ],
  },
];

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function isDateInPeriod(
  date: Date,
  [startM, startD]: [number, number],
  [endM, endD]: [number, number]
): boolean {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const cur = m * 100 + d;
  const start = startM * 100 + startD;
  const end = endM * 100 + endD;
  if (start <= end) return cur >= start && cur <= end;
  return cur >= start || cur <= end; // wraps year boundary
}

export function getActiveRules(area: MarineArea, date: Date): SalmonPeriod | null {
  return area.salmon.find(p => !p.zone && isDateInPeriod(date, p.startMD, p.endMD)) ?? null;
}

export function isLingcodOpen(regs: BottomfishRegs, date: Date): boolean {
  if (!regs.lingcod.open || !regs.lingcod.startMD || !regs.lingcod.endMD) return false;
  return isDateInPeriod(date, regs.lingcod.startMD, regs.lingcod.endMD);
}

export function isCabezonOpen(regs: BottomfishRegs, date: Date): boolean {
  if (!regs.cabezon.open || !regs.cabezon.startMD || !regs.cabezon.endMD) return false;
  return isDateInPeriod(date, regs.cabezon.startMD, regs.cabezon.endMD);
}

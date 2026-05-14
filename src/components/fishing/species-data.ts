// PNW species data: identification features, bait/lure rigs, seasonal tips

export type Rig = {
  name: string;
  setup: string;
  bestFor: string;
};

export type SeasonalTip = {
  months: number[]; // 1-12
  tip: string;
};

export type Species = {
  id: string;
  commonName: string;
  aliases: string[];
  category: 'salmon' | 'trout-steelhead' | 'bottomfish' | 'other';
  emoji: string;
  colors: string[];
  idFeatures: string[];
  confusedWith: { species: string; difference: string }[];
  maxSize: string;
  typicalSize: string;
  habitat: string;
  bestRigs: Rig[];
  bestBaits: string[];
  bestLures: string[];
  techniques: string[];
  seasonalTips: SeasonalTip[];
  legalNotes: string;
};

export const SPECIES: Species[] = [
  {
    id: 'chinook',
    commonName: 'Chinook Salmon',
    aliases: ['King', 'Blackmouth (immature)', 'Tyee'],
    category: 'salmon',
    emoji: '🐟',
    colors: ['Silver body', 'Black spots on back and BOTH lobes of tail', 'Black gums (key ID!)'],
    idFeatures: [
      'BLACK gums and lower mouth interior — no other salmon has this',
      'Large black spots on BOTH lobes of tail fin',
      'Largest Pacific salmon — adults 20–50+ lbs',
      'Large spots on back and dorsal fin',
      'Greenish-blue back, silver sides',
    ],
    confusedWith: [
      { species: 'Coho (Silver)', difference: 'Coho has white gums, spots only on upper tail lobe, smaller body' },
      { species: 'Chum', difference: 'Chum lacks spots on tail, has tiger stripes when spawning' },
    ],
    maxSize: '130 lbs (record), commonly 20–50 lbs',
    typicalSize: '22–42 inches, 10–30 lbs in Puget Sound',
    habitat: 'Open water, near surface in summer; near structure/bottom in winter; river mainstems for spawning',
    bestRigs: [
      { name: 'Plug-cut herring', setup: '6–8" leader, 2/0–4/0 octopus hook, 4–8 oz cannonball sinker on a diver/downrigger', bestFor: 'Trolling in marine areas at 50–120 ft' },
      { name: 'Anchovy spinner rig', setup: 'UV teaser head + 6" Rhys Davis or anchovy, 4/0 hook, 30–50 lb leader', bestFor: 'Fast trolling in Strait, marine areas' },
      { name: 'Cured egg cluster', setup: '1/4–1/2 oz egg loop on 2/0 hook, 8–18 lb fluorocarbon leader, pencil lead', bestFor: 'River bottom-drifting or back-bouncing' },
      { name: 'Float + eggs/shrimp', setup: 'Bobber stop, 7–9 ft leader, 1/0–2/0 hook, cured eggs or prawn', bestFor: 'Rivers, tidewater, estuaries' },
    ],
    bestBaits: ['Cured salmon eggs', 'Sand shrimp / ghost shrimp', 'Plug-cut herring', 'Whole anchovy', 'Cured prawn'],
    bestLures: ['Apex (glow, chartreuse)', 'Coho Killer spinners', 'Buzz Bomb', 'Coyote spoon', 'Brad\'s Wiggler', 'Kwikfish/Flatfish'],
    techniques: [
      'Mooching: slow drift with cut-plug herring, let it spin on the way down',
      'Trolling: 1.8–3 mph with flasher + bait or hoochie on downrigger',
      'Back-bouncing: in rivers, use heavy lead to bounce bait on bottom through runs',
      'Plunking: heavy sinker, stationary setup in eddy or deep hole',
      'Jigging: on feeding fish, a heavy jig (2–4 oz Buzz Bomb) near surface',
    ],
    seasonalTips: [
      { months: [3, 4, 5, 6], tip: 'Spring Chinook: lean-bodied, bright silver, highest quality eating. Fish rivers (Cowlitz, Skykomish) and marine Areas 5-6' },
      { months: [7, 8], tip: 'Summer blackmouth in Puget Sound. Troll deep with downrigger 70–120 ft. Early mornings best' },
      { months: [9, 10], tip: 'Fall hog Chinook entering rivers. Egg clusters and sand shrimp in current seams. Fish during incoming tide at tidewater' },
      { months: [11, 12, 1, 2], tip: 'Blackmouth Chinook in winter — concentrate around bait (herring schools) in deeper water. Areas 9-10 best bet' },
    ],
    legalNotes: 'Most areas: hatchery Chinook only (clipped fin). Min size typically 22". Wild Chinook must be released in most Puget Sound areas. Annual CRC required.',
  },

  {
    id: 'coho',
    commonName: 'Coho Salmon',
    aliases: ['Silver', 'Silvers'],
    category: 'salmon',
    emoji: '🐟',
    colors: ['Bright silver body', 'Greenish-blue back', 'Small black spots on upper tail lobe only'],
    idFeatures: [
      'WHITE gums — key ID vs Chinook',
      'Black spots only on UPPER lobe of tail',
      'Smaller spots, bright silver sides',
      'Hooked jaw (kype) on males when spawning',
      'Turns red/dark when spawning',
    ],
    confusedWith: [
      { species: 'Chinook', difference: 'Chinook has black gums, spots on both tail lobes, larger body' },
      { species: 'Pink salmon', difference: 'Pink has large oval spots on both tail lobes, smaller body, hump on males' },
    ],
    maxSize: '33 lbs (record), commonly 8–15 lbs',
    typicalSize: '20–30 inches, 6–12 lbs',
    habitat: 'Surface to mid-water column in salt; current seams and pools in rivers',
    bestRigs: [
      { name: 'Hoochie + flasher', setup: '6–8" hoochie on 36–42" leader behind a dodger/flasher, trolled at 2.5–3.5 mph', bestFor: 'Marine trolling, top 30 ft of water' },
      { name: 'Spoon troll', setup: 'Coyote or Coho Killer spoon behind flasher, 50 ft back', bestFor: 'When fish are near surface in salt' },
      { name: 'River jig/float', setup: 'Corky + yarn on 1/0 hook, 2–4 ft below float, fluorocarbon leader', bestFor: 'River fishing in pools/tailouts' },
      { name: 'Spinner (river)', setup: '#3–5 Blue Fox, Mepps, or Rooster Tail in chartreuse/orange/red', bestFor: 'Rivers — cast and retrieve across current' },
    ],
    bestBaits: ['Cured eggs', 'Sand shrimp', 'Whole herring (troll)', 'Sand lance'],
    bestLures: ['Coyote spoon', 'Hoochie (UV/glow)', 'Coho Killer', 'Mepps spinner', 'Rooster Tail', 'Pink Worm'],
    techniques: [
      'Trolling near surface (0–20 ft) in saltwater at 2.5–4 mph',
      'River casting: spinners and spoons across current and swing downstream',
      'Float fishing with egg clusters or shrimp in river pools',
      'Fly fishing: weighted streamers or pink/chartreuse egg patterns',
    ],
    seasonalTips: [
      { months: [8, 9], tip: 'Early coho in marine areas — fish near surface, trolling fast with hoochies. Aerial jumpers indicate fish present' },
      { months: [10, 11], tip: 'River coho peak — target holding spots (deep pools, log jams, eddies). Fish on incoming rain events' },
      { months: [7], tip: 'Pre-season coho in Strait of Juan de Fuca and Area 5/6 — active fish that will smash lures' },
    ],
    legalNotes: 'Hatchery coho only in most Puget Sound areas. Wild coho must be released in most zones. Check area-specific rules.',
  },

  {
    id: 'pink',
    commonName: 'Pink Salmon',
    aliases: ['Humpback', 'Hump', 'Pinks'],
    category: 'salmon',
    emoji: '🐟',
    colors: ['Bright silver in saltwater', 'Turns pink/pale with olive patches in freshwater', 'Males develop prominent hump'],
    idFeatures: [
      'Large OVAL black spots on BOTH lobes of tail',
      'Males: very pronounced hump when spawning',
      'Smallest Pacific salmon (3–5 lbs typical)',
      'Oval spots also on back and dorsal fin',
      'White mouth interior',
    ],
    confusedWith: [
      { species: 'Chum salmon', difference: 'Chum is larger, has tiger stripes (spawning), no large oval tail spots' },
      { species: 'Small Coho', difference: 'Coho lacks the large oval tail spots, white gums but no hump' },
    ],
    maxSize: '15 lbs, commonly 3–6 lbs',
    typicalSize: '16–24 inches, 3–6 lbs',
    habitat: 'Surface-oriented in salt; smaller rivers and tidewater for spawning',
    bestRigs: [
      { name: 'Pink hoochie or shrimp', setup: 'Small pink/chartreuse hoochie, spinner or small spoon behind flasher', bestFor: 'Trolling in salt, near surface' },
      { name: 'Jig (pink)', setup: '1/4–1/2 oz pink or chartreuse mini-jig — cast and retrieve', bestFor: 'Marine and river — very aggressive fish' },
    ],
    bestBaits: ['Small herring', 'Sand shrimp pieces'],
    bestLures: ['Pink Buzz Bomb', 'Kastmaster (pink)', 'Pink jigs', 'Small spinners (pink/chartreuse)', 'Pink Mini Hoochie'],
    techniques: [
      'Cast jigs from shore in saltwater — aggressive biters near surface',
      'Troll pink lures near surface behind flasher',
      'River: swing spinners or spoons through pools — they bite readily',
    ],
    seasonalTips: [
      { months: [7, 8, 9], tip: 'ODD YEARS ONLY. 2025 is an odd year — big run expected! Peak Aug–Sep. Aggressive biters, great for beginners. Fish early morning near salmon terminal areas' },
      { months: [8], tip: 'Best month for pinks — they\'re near every marina and pier. Bring light gear, it\'s fast and fun' },
    ],
    legalNotes: 'Bonus limit of +2 pink on top of daily salmon limit in most marine areas Aug–Sep. Only run in odd-numbered years (2025, 2027, etc.)',
  },

  {
    id: 'steelhead',
    commonName: 'Steelhead',
    aliases: ['Summer steelhead', 'Winter steelhead', 'Sea-run rainbow'],
    category: 'trout-steelhead',
    emoji: '🐟',
    colors: ['Silver when fresh-run', 'Pink/red lateral stripe when spawning', 'Black spots on back and fins'],
    idFeatures: [
      'Looks like a large sea-run rainbow trout',
      'Pink to red lateral stripe along sides (more vivid in spawning fish)',
      'White mouth interior',
      'Small black spots all over back and fins',
      'Squared tail vs. forked tail (unlike salmon)',
    ],
    confusedWith: [
      { species: 'Rainbow trout', difference: 'Same species — steelhead are sea-run rainbows; typically larger and brighter silver' },
      { species: 'Coho salmon', difference: 'Coho tail is more forked; steelhead has rounded tail, pink stripe' },
      { species: 'Chinook salmon', difference: 'Chinook has black gums; steelhead mouth is white' },
    ],
    maxSize: '42 lbs (record), commonly 5–15 lbs',
    typicalSize: '24–34 inches, 5–12 lbs',
    habitat: 'River mainstems: current seams, tailouts, head of pools, pocket water behind boulders',
    bestRigs: [
      { name: 'Side-drifting eggs', setup: 'Pencil lead 12–18" above egg loop hook, 8–12 lb fluorocarbon, 1/4 oz drift bobber (corky), cure eggs 3–4 per hook', bestFor: 'River drifting through runs and tailouts' },
      { name: 'Float + eggs', setup: 'Centerpin or spinning rod, 8–10 ft leader, 1/0–2/0 hook, cured eggs under float set 1–2 ft off bottom', bestFor: 'Deep pools and slower water' },
      { name: 'Spoon / spinner swing', setup: '#4–5 spinner (Blue Fox, Mepps) or 1/2–3/4 oz spoon, cast upstream, swing across current', bestFor: 'Tailouts and shallower runs — very effective' },
      { name: 'Jig under float', setup: '1/4–1/2 oz marabou jig (pink, orange, chartreuse), 4–7 ft below float', bestFor: 'All water types — versatile' },
    ],
    bestBaits: ['Cured salmon eggs', 'Sand shrimp', 'Ghost shrimp', 'Nightcrawler (selective gear restricted areas)'],
    bestLures: ['Blue Fox spinner #4–6', 'Mepps Aglia', 'Little Cleo spoon', 'Vibrax bullet', 'Marabou jig'],
    techniques: [
      'Side-drifting: cast upstream at 45°, mend line, let bait drift through seams naturally',
      'Float fishing: slow swing through pools, keep bait near bottom',
      'Swing a spoon or spinner: cast across current, let swing complete before retrieve',
      'Back-bouncing: heavy lead, slow upstream pull then let thump downstream',
    ],
    seasonalTips: [
      { months: [12, 1, 2, 3], tip: 'WINTER steelhead peak. Fresh-run hatchery fish are bright silver and will eat anything. Fish after rain events when rivers rise and drop. Early morning is key' },
      { months: [6, 7, 8, 9], tip: 'SUMMER steelhead — upper river fish holding in cold, deep pools. Early morning and evening. Lighter tackle, drier conditions' },
      { months: [10, 11], tip: 'Wild fish returning — must be released. Focus on hatchery fish near facilities. Fall conditions make rivers prime' },
    ],
    legalNotes: 'HATCHERY ONLY — all wild steelhead (unclipped) must be released unharmed. Daily limit 2. CRC required.',
  },

  {
    id: 'cutthroat',
    commonName: 'Cutthroat Trout',
    aliases: ['Cuts', 'Sea-run cutthroat', 'Coastal cutthroat'],
    category: 'trout-steelhead',
    emoji: '🐟',
    colors: ['Olive to golden brown', 'Black spots', 'ORANGE/RED slash marks under jaw'],
    idFeatures: [
      'Distinctive ORANGE-RED slash marks under jaw (both sides)',
      'Profuse black spots, more spotted than rainbow',
      'Basibranchial teeth (feel inside lower jaw)',
      'Sea-run fish: bright silver with faint slash marks',
    ],
    confusedWith: [
      { species: 'Rainbow trout', difference: 'Rainbow has no slash marks under jaw; cutthroat has orange/red slashes' },
      { species: 'Bull trout', difference: 'Bull trout has NO black spots — light-colored spots on dark background' },
    ],
    maxSize: '17 lbs (record), typically 1–4 lbs',
    typicalSize: '10–18 inches in most WA waters',
    habitat: 'Small streams, beaver ponds, mountain lakes; tidal estuaries and beaches (sea-run)',
    bestRigs: [
      { name: 'Fly fishing', setup: 'Elk Hair Caddis, Adams, Woolly Bugger, or small streamers on 4–5 wt rod', bestFor: 'Streams and rivers — cutthroat love dry flies' },
      { name: 'Small spinner', setup: '#0–2 Mepps or Rooster Tail, 4–6 lb test', bestFor: 'Small streams and lakes' },
    ],
    bestBaits: ['Nightcrawler', 'Small cured salmon eggs', 'Waxworm'],
    bestLures: ['Mepps #0-2', 'Rooster Tail (black/yellow)', 'Thomas Buoyant', 'Small Panther Martin'],
    techniques: [
      'Fly fishing is the premier technique — dry fly on top in summer',
      'Cast spinners upstream in small streams, retrieve with current',
      'Sea-run in estuaries: weighted streamer on intermediate line near beach structure',
    ],
    seasonalTips: [
      { months: [7, 8, 9], tip: 'Sea-run cutthroat near estuary beaches and tidewater — fish early morning with small streamers' },
      { months: [4, 5, 6], tip: 'Lake and mountain stream fishing opens — spinner or small spinner. Pristine alpine fishing' },
    ],
    legalNotes: 'Catch-and-release only for wild fish in most marine areas. Lakes: typically limit 5, check specific water rules.',
  },

  {
    id: 'halibut',
    commonName: 'Pacific Halibut',
    aliases: ['Barn door', 'Flatty', 'Chicken (small)'],
    category: 'bottomfish',
    emoji: '🐠',
    colors: ['Brown to dark olive on topside', 'Bright white on underside', 'Both eyes on top/right side'],
    idFeatures: [
      'Flat body — both eyes migrate to right side (darker side)',
      'Straight lateral line',
      'Tail nearly symmetrical (vs. California halibut\'s curved)',
      'Sandy brown with mottled pattern on top',
      'Can grow enormous — largest flatfish in Pacific',
    ],
    confusedWith: [
      { species: 'Starry flounder', difference: 'Starry flounder is much smaller, has distinctive orange/white striped fins' },
      { species: 'Arrowtooth flounder', difference: 'Arrowtooth has large sharp teeth, not worth eating; halibut has smaller teeth' },
    ],
    maxSize: '495 lbs, commonly 20–150 lbs in WA',
    typicalSize: '22–60 inches, 10–80 lbs',
    habitat: 'Sandy/muddy bottom, 60–600 ft; migrates seasonally',
    bestRigs: [
      { name: 'Circle hook + bait', setup: '6–10 oz sinker, 5/0–7/0 circle hook, 80–150 lb leader, chunk bait', bestFor: 'Anchored or drifting over flat bottom' },
      { name: 'Herring/salmon belly', setup: '10/0 circle hook, 5+ ft leader, drift with 12–24 oz sinker', bestFor: 'Drifting in Areas 5–10' },
      { name: 'Big jig', setup: '6–12 oz lead jig in white/chartreuse, jigged on bottom', bestFor: 'Aggressive presentation when bite is on' },
    ],
    bestBaits: ['Whole herring', 'Salmon belly/head', 'Octopus', 'Squid', 'Greenling chunks', 'Pogie (menhaden)'],
    bestLures: ['Crippled Herring jig', 'Big Stinger (white)', 'Andrus jig', 'Casting spoon (heavy)'],
    techniques: [
      'Anchor or slow drift over sandy/muddy bottom 60–300 ft',
      'Keep bait on bottom — halibut are ambush predators looking up',
      'Set hook firmly with circle hook (reel into fish, don\'t jerk)',
      'When jigging: lift rod tip 3–4 ft, drop, keep contact with bottom',
    ],
    seasonalTips: [
      { months: [4, 5, 6, 7, 8], tip: 'Peak halibut season Apr–Aug in WA marine areas. Check WDFW for exact season dates by area. Areas 5-10 open; Areas 11-13 CLOSED' },
      { months: [5, 6], tip: 'May–Jun: halibut concentrated on shallow flats (150–300 ft). Good bite in Area 5 (Strait) and Area 7 (San Juans)' },
    ],
    legalNotes: 'Daily limit 1, annual limit 6. No min size. CLOSED in Areas 11, 12, 13. Descending device required. IPHC-managed — check exact season dates with WDFW.',
  },

  {
    id: 'lingcod',
    commonName: 'Lingcod',
    aliases: ['Ling', 'Cultus cod'],
    category: 'bottomfish',
    emoji: '🐡',
    colors: ['Brown to grey-green mottled', 'Large white spots or patches', 'Striking BLUE/GREEN flesh (normal)'],
    idFeatures: [
      'Large mouth with numerous sharp teeth',
      'Long body, tapered tail',
      'Mottled brown/grey with lighter blotches',
      'Single lateral line',
      'Flesh is blue-green when raw — completely normal and turns white when cooked',
    ],
    confusedWith: [
      { species: 'Cabezon', difference: 'Cabezon lacks scales, has fleshy tabs on head, no teeth like lingcod' },
      { species: 'Rockfish', difference: 'Rockfish are smaller and deeper-bodied; lingcod is elongated and has large mouth' },
    ],
    maxSize: '80 lbs, commonly 5–30 lbs',
    typicalSize: '24–40 inches, 5–25 lbs',
    habitat: 'Rocky reefs, kelp beds, 20–200 ft; ambush predator near structure',
    bestRigs: [
      { name: 'Live rockfish / jigging', setup: 'Heavy jig (4–8 oz) in white/chartreuse, or live small rockfish as live bait', bestFor: 'Vertical jigging on rocky reefs' },
      { name: 'Tube jig', setup: '4–8 oz leadhead with swimbait or tube body, worked slowly near bottom', bestFor: 'Rockfish habitat' },
      { name: 'Large swimbait', setup: '4–6" paddle tail swimbait on heavy jig head, 30–40 lb leader', bestFor: 'Shallow rocky structure' },
    ],
    bestBaits: ['Live small rockfish', 'Squid', 'Herring chunk', 'Greenling'],
    bestLures: ['White tube jig', 'Crippled Herring', 'Large swimbaits', 'Mega-Craw', 'Iron (heavy jig)'],
    techniques: [
      'Drop jig to bottom over rocky reef, let it sink, then short aggressive lifts',
      'Lingcod will often follow prey up — keep retrieving after bite',
      'Use electronics to find rocky structure and baitfish schools above',
      'May–Jun slot: keep fish 26–36 inches (undersized and oversized must be released)',
    ],
    seasonalTips: [
      { months: [5, 6], tip: 'WA open season May 1–Jun 15. Fish rocky reefs 30–150 ft. Early season fish are aggressive and hungry after winter' },
      { months: [1, 2, 3, 4], tip: 'Out of season in Puget Sound — but OPEN year-round on coast (Areas 1–2). Winter fish are large females on shallow spawning reefs' },
    ],
    legalNotes: 'Open May 1–Jun 15 in Areas 5–13. Min 26", max 36" (slot limit). Limit 1. CLOSED rest of year in Puget Sound. Descending device required.',
  },

  {
    id: 'rockfish',
    commonName: 'Rockfish (Black/Blue/Deacon)',
    aliases: ['Black rockfish', 'Blue rockfish', 'Deacon rockfish', 'Blackie'],
    category: 'bottomfish',
    emoji: '🐡',
    colors: ['Black rockfish: nearly black with mottled lighter sides', 'Blue rockfish: grey-blue overall', 'Deacon: similar to blue with darker back'],
    idFeatures: [
      'Spiny first dorsal fin (family trait)',
      'Deep body, big eyes',
      'Black rockfish: very dark, near-black overall',
      'Blue rockfish: uniform grey-blue, smaller spots',
      'All have sharp spines — handle carefully',
    ],
    confusedWith: [
      { species: 'Yelloweye rockfish', difference: 'Yelloweye is ORANGE-RED with bright yellow eye — CLOSED species, must release' },
      { species: 'Canary rockfish', difference: 'Canary is orange with grey-white lateral line — also restricted' },
    ],
    maxSize: '25 lbs, commonly 1–5 lbs',
    typicalSize: '10–20 inches, 1–4 lbs',
    habitat: 'Rocky reefs and kelp beds 30–400 ft; black/blue rockfish often mid-water to surface',
    bestRigs: [
      { name: 'Dropper loop rig', setup: '2–4 dropper loops with size 1–2/0 hooks, 4–8 oz sinker, cut bait', bestFor: 'Bottom and mid-water in open areas' },
      { name: 'Jig', setup: '1–3 oz leadhead jig with soft plastic or tube', bestFor: 'Mid-water column — black rockfish hit near surface' },
    ],
    bestBaits: ['Squid strips', 'Herring pieces', 'Shrimp'],
    bestLures: ['Tube jig', 'Small swimbait', 'Anchovy on jighead'],
    techniques: [
      'Black rockfish often feed near surface on baitfish — watch for birds/boils',
      'Drop jig to bottom, let come up through water column',
    ],
    seasonalTips: [
      { months: [5, 6, 7, 8, 9], tip: 'Only open in Area 5 and coast (Areas 1-4). CLOSED in Areas 6-13. If fishing Area 5, target outer rocky points' },
    ],
    legalNotes: 'CLOSED in Marine Areas 6–13. Area 5 only: limit 3 black/blue/deacon rockfish W of Slip Point; 1 fish E of Slip Point. May 1–Sep 30 only. Yelloweye rockfish: CLOSED everywhere.',
  },

  {
    id: 'cabezon',
    commonName: 'Cabezon',
    aliases: ['Bullhead', 'Scorpion'],
    category: 'bottomfish',
    emoji: '🐡',
    colors: ['Highly variable: brown, grey, red-brown, greenish', 'Mottled pattern to blend with rocks'],
    idFeatures: [
      'NO scales — skin is smooth but rough-feeling',
      'Fleshy tabs (cirri) on top of snout above eyes',
      'Very large head for body size',
      'Rows of spiny projections along sides and head',
    ],
    confusedWith: [
      { species: 'Lingcod', difference: 'Lingcod has scales, long body, large teeth; cabezon has no scales, shorter stockier body' },
      { species: 'Rockfish', difference: 'Rockfish have scales and are deeper-bodied; cabezon is scaleless with unique fleshy tabs' },
    ],
    maxSize: '25 lbs, commonly 2–8 lbs',
    typicalSize: '16–24 inches, 2–6 lbs',
    habitat: 'Shallow rocky intertidal to 200 ft; kelp beds, mussel beds',
    bestRigs: [
      { name: 'Bait on bottom', setup: '1–2 oz sinker, 18" leader, 2/0 hook, crab meat or shrimp', bestFor: 'Rocky shallow structure' },
      { name: 'Small jig', setup: '1–2 oz white/chartreuse jig worked near bottom', bestFor: 'Rocky reefs' },
    ],
    bestBaits: ['Crab entrails', 'Shrimp', 'Squid', 'Octopus pieces'],
    bestLures: ['Tube jig', 'Crippled Herring (small)', 'Small swimbait'],
    techniques: [
      'Fish tight to rocky structure — cabezon rarely move far',
      'Low tides expose prime habitat; fish from shore at rocky points',
    ],
    seasonalTips: [
      { months: [5, 6, 7, 8, 9, 10, 11], tip: 'Open May 1–Nov 30 in most areas. Best fishing in summer on shallow rocky structure at low tide' },
    ],
    legalNotes: 'Open May 1–Nov 30. Min size 18". Limit 1/day. CLOSED Dec–Apr. CLOSED in Hood Canal (Area 12) year-round.',
  },
];

export const SPECIES_BY_CATEGORY = {
  salmon: SPECIES.filter(s => s.category === 'salmon'),
  'trout-steelhead': SPECIES.filter(s => s.category === 'trout-steelhead'),
  bottomfish: SPECIES.filter(s => s.category === 'bottomfish'),
};

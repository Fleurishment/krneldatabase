// FGO Database Types

export type Region = 'NA' | 'JP';

export interface Servant {
  id: number;
  collectionNo: number;
  name: string;
  originalName: string;
  className: string;
  classId: number;
  rarity: number;
  cost: number;
  lvMax: number;
  atkBase: number;
  atkMax: number;
  hpBase: number;
  hpMax: number;
  gender: string;
  attribute: string;
  traits: Trait[];
  cards: string[];
  starAbsorb: number;
  starGen: number;
  instantDeathChance: number;
  hitsDistribution: HitsDistribution;
  cardDetails: CardDetails;
  extraAssets: ExtraAssets;
  skills: Skill[];
  passiveSkills: PassiveSkill[];
  noblePhantasms: NoblePhantasm[];
  ascensionMaterials: Materials;
  skillMaterials: Materials;
  bondGrowth: number[];
  expGrowth: number[];
  profile?: Profile;
  costume?: Record<string, Costume>;
  type?: string;
  flag?: string;
}

export interface Trait {
  id: number;
  name: string;
}

export interface HitsDistribution {
  [key: string]: number[];
}

export interface CardDetails {
  [key: string]: {
    hitsDistribution: number[];
    attackIndividuality: Trait[];
    attackType: string;
  };
}

export interface ExtraAssets {
  charaGraph: {
    ascension: Record<string, string>;
    costume?: Record<string, string>;
  };
  faces: {
    ascension: Record<string, string>;
    costume?: Record<string, string>;
  };
  commands?: {
    ascension: Record<string, string>;
    costume?: Record<string, string>;
  };
  status?: {
    ascension: Record<string, string>;
    costume?: Record<string, string>;
  };
}

export interface Skill {
  id: number;
  num: number;
  name: string;
  detail: string;
  type: string;
  strengthStatus: number;
  priority: number;
  condQuestId: number;
  condQuestPhase: number;
  condLv: number;
  condLimitCount: number;
  icon?: string;
  coolDown: number[];
  functions: Function[];
}

export interface PassiveSkill {
  id: number;
  num: number;
  name: string;
  detail: string;
  icon?: string;
  rank: string;
}

export interface NoblePhantasm {
  id: number;
  num: number;
  card: string;
  name: string;
  originalName: string;
  ruby: string;
  type: string;
  detail: string;
  npGain: {
    [key: string]: number[];
  };
  npDistribution: number[];
  svt?: {
    id: number;
    num: number;
    priority: number;
  };
  functions?: Function[];
  strengthStatus?: number;
  priority?: number;
  condQuestId?: number;
  condQuestPhase?: number;
  condLv?: number;
  condLimitCount?: number;
}

export interface Function {
  id: number;
  funcType: string;
  funcTargetType: string;
  funcTargetTeam: string;
  funcPopupText: string;
  funcPopupIcon?: string;
  functvals: Trait[];
  buffs: Buff[];
  svals: Sval[];
}

export interface Buff {
  id: number;
  name: string;
  detail: string;
  icon?: string;
  type: string;
  buffGroup: number;
  script: Record<string, unknown>;
}

export interface Sval {
  Rate?: number;
  Turn?: number;
  Count?: number;
  Value?: number;
  Value2?: number;
  UseRate?: boolean;
}

export interface Materials {
  [key: string]: {
    items: MaterialItem[];
    qp: number;
  };
}

export interface MaterialItem {
  id: number;
  name: string;
  icon: string;
  amount: number;
}

export interface Profile {
  cv: string;
  illustrator: string;
  stats: {
    strength: string;
    endurance: string;
    agility: string;
    mana: string;
    luck: string;
    np: string;
  };
  context: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  priority: number;
  condMessage: string;
  comment: string;
}

export interface Costume {
  id: number;
  costumeCollectionNo: number;
  battleCharaId: number;
  shortName: string;
}

// Craft Essence Types
export interface CraftEssence {
  id: number;
  collectionNo: number;
  name: string;
  originalName: string;
  ruby: string;
  rarity: number;
  cost: number;
  lvMax: number;
  atkBase: number;
  atkMax: number;
  hpBase: number;
  hpMax: number;
  growthCurve: number;
  attribute?: string;
  skills: CESkill[];
  profile?: CEProfile;
  extraAssets: CEExtraAssets;
  flag?: string;
  bondServantId?: number;
}

export interface CESkill {
  id: number;
  num: number;
  name: string;
  detail: string;
  icon?: string;
  strengthStatus: number;
}

export interface CEProfile {
  comments: Comment[];
  illustrator?: string;
  voiceActor?: string;
}

export interface CEExtraAssets {
  charaGraph: {
    ascension: Record<string, string>;
  };
  faces: {
    ascension: Record<string, string>;
  };
}

// Database Types
export interface Database {
  servants: Servant[];
  craftEssences: CraftEssence[];
  lastUpdated: string;
  version: string;
  region: Region;
}

// Filter Types
export interface ServantFilters {
  className?: string;
  rarity?: number;
  attribute?: string;
  gender?: string;
  searchQuery?: string;
}

export interface CEFilters {
  rarity?: number;
  searchQuery?: string;
}

// API Response Types
export interface AtlasServantBasic {
  id: number;
  collectionNo: number;
  name: string;
  className: string;
  rarity: number;
  atkMax: number;
  hpMax: number;
  face: string;
}

export interface AtlasCEBasic {
  id: number;
  collectionNo: number;
  name: string;
  rarity: number;
  atkMax: number;
  hpMax: number;
  face: string;
}

// Admin Types
export interface AdminUser {
  username: string;
  passwordHash: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

import type { Servant, CraftEssence, AtlasServantBasic, AtlasCEBasic, Region } from '@/types';

const ATLAS_BASE_URL = 'https://api.atlasacademy.io';

// Fetch all servants (basic data)
export async function fetchAllServantsBasic(region: Region = 'NA'): Promise<AtlasServantBasic[]> {
  try {
    const response = await fetch(`${ATLAS_BASE_URL}/export/${region}/basic_servant.json`);
    if (!response.ok) throw new Error('Failed to fetch servants');
    return await response.json();
  } catch (error) {
    console.error('Error fetching servants:', error);
    return [];
  }
}

// Fetch all craft essences (basic data)
export async function fetchAllCEsBasic(region: Region = 'NA'): Promise<AtlasCEBasic[]> {
  try {
    const response = await fetch(`${ATLAS_BASE_URL}/export/${region}/basic_equip.json`);
    if (!response.ok) throw new Error('Failed to fetch craft essences');
    return await response.json();
  } catch (error) {
    console.error('Error fetching craft essences:', error);
    return [];
  }
}

// Fetch detailed servant data
export async function fetchServantDetail(id: number, region: Region = 'NA'): Promise<Servant | null> {
  try {
    const response = await fetch(`${ATLAS_BASE_URL}/nice/${region}/servant/${id}`);
    if (!response.ok) throw new Error('Failed to fetch servant detail');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching servant ${id}:`, error);
    return null;
  }
}

// Fetch detailed craft essence data
export async function fetchCEDetail(id: number, region: Region = 'NA'): Promise<CraftEssence | null> {
  try {
    const response = await fetch(`${ATLAS_BASE_URL}/nice/${region}/equip/${id}`);
    if (!response.ok) throw new Error('Failed to fetch CE detail');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching CE ${id}:`, error);
    return null;
  }
}

// Fetch multiple servants in batch
export async function fetchServantsBatch(ids: number[], region: Region = 'NA'): Promise<Servant[]> {
  const servants: Servant[] = [];
  for (const id of ids) {
    const servant = await fetchServantDetail(id, region);
    if (servant) servants.push(servant);
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return servants;
}

// Fetch multiple CEs in batch
export async function fetchCEsBatch(ids: number[], region: Region = 'NA'): Promise<CraftEssence[]> {
  const ces: CraftEssence[] = [];
  for (const id of ids) {
    const ce = await fetchCEDetail(id, region);
    if (ce) ces.push(ce);
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return ces;
}

// Get servant face image URL
export function getServantFaceUrl(collectionNo: number, region: Region = 'NA', ascension: number = 0): string {
  return `https://static.atlasacademy.io/${region}/Faces/f_${collectionNo}${ascension}0.png`;
}

// Get CE face image URL
export function getCEFaceUrl(collectionNo: number, region: Region = 'NA'): string {
  return `https://static.atlasacademy.io/${region}/Faces/f_${collectionNo}0.png`;
}

// Get servant full image URL
export function getServantFullImageUrl(servantId: number, region: Region = 'NA', ascension: number = 1): string {
  return `https://static.atlasacademy.io/${region}/CharaGraph/${servantId}/${servantId}a@${ascension}.png`;
}

// Get CE full image URL
export function getCEFullImageUrl(ceId: number, region: Region = 'NA', ascension: number = 1): string {
  return `https://static.atlasacademy.io/${region}/CharaGraph/${ceId}/${ceId}a@${ascension}.png`;
}

// Get material/item icon URL
export function getItemIconUrl(itemId: number, region: Region = 'NA'): string {
  return `https://static.atlasacademy.io/${region}/Items/${itemId}_bordered.png`;
}

// Get skill icon URL
export function getSkillIconUrl(skillId: number, region: Region = 'NA'): string {
  return `https://static.atlasacademy.io/${region}/SkillIcons/skill_${skillId.toString().padStart(3, '0')}.png`;
}

// Get buff icon URL
export function getBuffIconUrl(buffId: number, region: Region = 'NA'): string {
  return `https://static.atlasacademy.io/${region}/BuffIcons/buff_${buffId.toString().padStart(3, '0')}.png`;
}

// Class names mapping for display
export const CLASS_NAMES: Record<string, string> = {
  saber: 'Saber',
  archer: 'Archer',
  lancer: 'Lancer',
  rider: 'Rider',
  caster: 'Caster',
  assassin: 'Assassin',
  berserker: 'Berserker',
  shielder: 'Shielder',
  ruler: 'Ruler',
  avenger: 'Avenger',
  alterEgo: 'Alter Ego',
  moonCancer: 'Moon Cancer',
  foreigner: 'Foreigner',
  pretender: 'Pretender',
  beast: 'Beast',
};

// Attribute names mapping
export const ATTRIBUTE_NAMES: Record<string, string> = {
  human: 'Human',
  sky: 'Sky',
  earth: 'Earth',
  star: 'Star',
  beast: 'Beast',
};

// Gender names mapping
export const GENDER_NAMES: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  unknown: 'Unknown',
};

// Rarity stars mapping
export function getRarityStars(rarity: number): string {
  return '★'.repeat(rarity);
}

// Card type mapping
export const CARD_TYPES: Record<string, { name: string; color: string; bgClass: string }> = {
  '1': { name: 'Arts', color: '#1E88E5', bgClass: 'bg-blue-500' },
  '2': { name: 'Quick', color: '#43A047', bgClass: 'bg-green-500' },
  '3': { name: 'Buster', color: '#E53935', bgClass: 'bg-red-500' },
  '4': { name: 'Extra', color: '#FFB300', bgClass: 'bg-yellow-500' },
};

// Class color mapping for UI
export const CLASS_COLORS: Record<string, string> = {
  saber: 'bg-blue-600',
  archer: 'bg-red-600',
  lancer: 'bg-green-600',
  rider: 'bg-purple-600',
  caster: 'bg-cyan-600',
  assassin: 'bg-gray-600',
  berserker: 'bg-amber-700',
  shielder: 'bg-indigo-600',
  ruler: 'bg-yellow-500',
  avenger: 'bg-red-900',
  alterEgo: 'bg-pink-600',
  moonCancer: 'bg-rose-500',
  foreigner: 'bg-teal-600',
  pretender: 'bg-emerald-600',
  beast: 'bg-purple-900',
};

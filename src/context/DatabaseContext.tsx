import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Servant, CraftEssence, Database, Region } from '@/types';

interface DatabaseContextType {
  db: Database;
  isLoading: boolean;
  servantCount: number;
  ceCount: number;
  lastUpdated: string;
  region: Region;
  
  // Database operations
  setDatabase: (db: Database) => void;
  resetDatabase: () => void;
  importDatabase: (json: string) => boolean;
  exportDatabase: () => string;
  downloadDatabase: () => void;
  setRegion: (region: Region) => void;
  
  // Servant operations
  getServantById: (id: number) => Servant | undefined;
  getServantByCollectionNo: (collectionNo: number) => Servant | undefined;
  addServant: (servant: Servant) => void;
  updateServant: (id: number, updates: Partial<Servant>) => void;
  deleteServant: (id: number) => void;
  getAllServants: () => Servant[];
  filterServants: (filters: {
    className?: string;
    rarity?: number;
    attribute?: string;
    gender?: string;
    searchQuery?: string;
  }) => Servant[];
  
  // CE operations
  getCEById: (id: number) => CraftEssence | undefined;
  getCEByCollectionNo: (collectionNo: number) => CraftEssence | undefined;
  addCE: (ce: CraftEssence) => void;
  updateCE: (id: number, updates: Partial<CraftEssence>) => void;
  deleteCE: (id: number) => void;
  getAllCEs: () => CraftEssence[];
  filterCEs: (filters: {
    rarity?: number;
    searchQuery?: string;
  }) => CraftEssence[];
  
  // Filter options
  getUniqueClasses: () => string[];
  getUniqueRarities: () => number[];
  getUniqueAttributes: () => string[];
  getUniqueGenders: () => string[];
  getCERarities: () => number[];
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const DB_VERSION = '2.0.0';
const STORAGE_KEY = 'fgo_database_v2';

function createEmptyDatabase(): Database {
  return {
    servants: [],
    craftEssences: [],
    lastUpdated: new Date().toISOString(),
    version: DB_VERSION,
    region: 'NA',
  };
}

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database>(createEmptyDatabase());
  const [isLoading, setIsLoading] = useState(true);

  // Load database from localStorage on mount
  useEffect(() => {
    const loadDatabase = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setDb({
            ...createEmptyDatabase(),
            ...parsed,
            version: DB_VERSION,
          });
        }
      } catch (error) {
        console.error('Error loading database:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDatabase();
  }, []);

  // Save database to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      } catch (error) {
        console.error('Error saving database:', error);
      }
    }
  }, [db, isLoading]);

  const setDatabase = useCallback((newDb: Database) => {
    setDb({
      ...newDb,
      lastUpdated: new Date().toISOString(),
      version: DB_VERSION,
    });
  }, []);

  const resetDatabase = useCallback(() => {
    setDb(createEmptyDatabase());
  }, []);

  const importDatabase = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed.servants) && Array.isArray(parsed.craftEssences)) {
        setDb({
          servants: parsed.servants,
          craftEssences: parsed.craftEssences,
          lastUpdated: new Date().toISOString(),
          version: DB_VERSION,
          region: parsed.region || 'NA',
        });
        return true;
      }
    } catch (error) {
      console.error('Error importing database:', error);
    }
    return false;
  }, []);

  const exportDatabase = useCallback((): string => {
    return JSON.stringify(db, null, 2);
  }, [db]);

  const downloadDatabase = useCallback(() => {
    const json = exportDatabase();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fgo_database_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportDatabase]);

  const setRegion = useCallback((region: Region) => {
    setDb(prev => ({
      ...prev,
      region,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Servant operations
  const getServantById = useCallback((id: number) => {
    return db.servants.find(s => s.id === id);
  }, [db.servants]);

  const getServantByCollectionNo = useCallback((collectionNo: number) => {
    return db.servants.find(s => s.collectionNo === collectionNo);
  }, [db.servants]);

  const addServant = useCallback((servant: Servant) => {
    setDb(prev => {
      if (prev.servants.some(s => s.id === servant.id)) {
        throw new Error(`Servant with ID ${servant.id} already exists`);
      }
      return {
        ...prev,
        servants: [...prev.servants, servant],
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const updateServant = useCallback((id: number, updates: Partial<Servant>) => {
    setDb(prev => ({
      ...prev,
      servants: prev.servants.map(s =>
        s.id === id ? { ...s, ...updates } : s
      ),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const deleteServant = useCallback((id: number) => {
    setDb(prev => ({
      ...prev,
      servants: prev.servants.filter(s => s.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const getAllServants = useCallback(() => {
    return [...db.servants].sort((a, b) => a.collectionNo - b.collectionNo);
  }, [db.servants]);

  const filterServants = useCallback((filters: {
    className?: string;
    rarity?: number;
    attribute?: string;
    gender?: string;
    searchQuery?: string;
  }) => {
    let result = getAllServants();

    if (filters.className) {
      result = result.filter(s => s.className === filters.className);
    }

    if (filters.rarity !== undefined) {
      result = result.filter(s => s.rarity === filters.rarity);
    }

    if (filters.attribute) {
      result = result.filter(s => s.attribute === filters.attribute);
    }

    if (filters.gender) {
      result = result.filter(s => s.gender === filters.gender);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.originalName.toLowerCase().includes(query) ||
        s.className.toLowerCase().includes(query)
      );
    }

    return result;
  }, [getAllServants]);

  // CE operations
  const getCEById = useCallback((id: number) => {
    return db.craftEssences.find(ce => ce.id === id);
  }, [db.craftEssences]);

  const getCEByCollectionNo = useCallback((collectionNo: number) => {
    return db.craftEssences.find(ce => ce.collectionNo === collectionNo);
  }, [db.craftEssences]);

  const addCE = useCallback((ce: CraftEssence) => {
    setDb(prev => {
      if (prev.craftEssences.some(c => c.id === ce.id)) {
        throw new Error(`Craft Essence with ID ${ce.id} already exists`);
      }
      return {
        ...prev,
        craftEssences: [...prev.craftEssences, ce],
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const updateCE = useCallback((id: number, updates: Partial<CraftEssence>) => {
    setDb(prev => ({
      ...prev,
      craftEssences: prev.craftEssences.map(ce =>
        ce.id === id ? { ...ce, ...updates } : ce
      ),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const deleteCE = useCallback((id: number) => {
    setDb(prev => ({
      ...prev,
      craftEssences: prev.craftEssences.filter(ce => ce.id !== id),
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const getAllCEs = useCallback(() => {
    return [...db.craftEssences].sort((a, b) => a.collectionNo - b.collectionNo);
  }, [db.craftEssences]);

  const filterCEs = useCallback((filters: {
    rarity?: number;
    searchQuery?: string;
  }) => {
    let result = getAllCEs();

    if (filters.rarity !== undefined) {
      result = result.filter(ce => ce.rarity === filters.rarity);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(ce =>
        ce.name.toLowerCase().includes(query) ||
        ce.originalName.toLowerCase().includes(query)
      );
    }

    return result;
  }, [getAllCEs]);

  // Filter options
  const getUniqueClasses = useCallback(() => {
    const classes = new Set(db.servants.map(s => s.className));
    return Array.from(classes).sort();
  }, [db.servants]);

  const getUniqueRarities = useCallback(() => {
    const rarities = new Set(db.servants.map(s => s.rarity));
    return Array.from(rarities).sort((a, b) => b - a);
  }, [db.servants]);

  const getUniqueAttributes = useCallback(() => {
    const attributes = new Set(db.servants.map(s => s.attribute));
    return Array.from(attributes).sort();
  }, [db.servants]);

  const getUniqueGenders = useCallback(() => {
    const genders = new Set(db.servants.map(s => s.gender));
    return Array.from(genders).sort();
  }, [db.servants]);

  const getCERarities = useCallback(() => {
    const rarities = new Set(db.craftEssences.map(ce => ce.rarity));
    return Array.from(rarities).sort((a, b) => b - a);
  }, [db.craftEssences]);

  return (
    <DatabaseContext.Provider
      value={{
        db,
        isLoading,
        servantCount: db.servants.length,
        ceCount: db.craftEssences.length,
        lastUpdated: db.lastUpdated,
        region: db.region,
        setDatabase,
        resetDatabase,
        importDatabase,
        exportDatabase,
        downloadDatabase,
        setRegion,
        getServantById,
        getServantByCollectionNo,
        addServant,
        updateServant,
        deleteServant,
        getAllServants,
        filterServants,
        getCEById,
        getCEByCollectionNo,
        addCE,
        updateCE,
        deleteCE,
        getAllCEs,
        filterCEs,
        getUniqueClasses,
        getUniqueRarities,
        getUniqueAttributes,
        getUniqueGenders,
        getCERarities,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

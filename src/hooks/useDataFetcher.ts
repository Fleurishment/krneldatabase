import { useState, useCallback } from 'react';
import type { Database, Region } from '@/types';
import {
  fetchAllServantsBasic,
  fetchAllCEsBasic,
  fetchServantDetail,
  fetchCEDetail,
} from '@/services/api';

interface UseDataFetcherReturn {
  isFetching: boolean;
  progress: FetchProgress;
  fetchData: (region: Region, servantLimit: number, ceLimit: number) => Promise<Database | null>;
  resetProgress: () => void;
}

export interface FetchProgress {
  stage: 'idle' | 'fetching-list' | 'fetching-servants' | 'fetching-ces' | 'complete' | 'error';
  message: string;
  servantCurrent: number;
  servantTotal: number;
  ceCurrent: number;
  ceTotal: number;
}

const FETCH_DELAY_MS = 100; // Delay between API calls to avoid rate limiting

export function useDataFetcher(): UseDataFetcherReturn {
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState<FetchProgress>({
    stage: 'idle',
    message: '',
    servantCurrent: 0,
    servantTotal: 0,
    ceCurrent: 0,
    ceTotal: 0,
  });

  const resetProgress = useCallback(() => {
    setProgress({
      stage: 'idle',
      message: '',
      servantCurrent: 0,
      servantTotal: 0,
      ceCurrent: 0,
      ceTotal: 0,
    });
  }, []);

  const fetchData = useCallback(async (
    region: Region,
    servantLimit: number,
    ceLimit: number
  ): Promise<Database | null> => {
    setIsFetching(true);
    const db: Database = {
      servants: [],
      craftEssences: [],
      lastUpdated: new Date().toISOString(),
      version: '2.0.0',
      region,
    };

    try {
      // Fetch servant list
      setProgress({
        stage: 'fetching-list',
        message: 'Fetching servant list...',
        servantCurrent: 0,
        servantTotal: 0,
        ceCurrent: 0,
        ceTotal: 0,
      });

      const basicServants = await fetchAllServantsBasic(region);
      const servantsToFetch = basicServants.slice(0, Math.min(servantLimit, basicServants.length));

      setProgress({
        stage: 'fetching-servants',
        message: `Fetching ${servantsToFetch.length} servants...`,
        servantCurrent: 0,
        servantTotal: servantsToFetch.length,
        ceCurrent: 0,
        ceTotal: 0,
      });

      // Fetch detailed servant data
      for (let i = 0; i < servantsToFetch.length; i++) {
        const basic = servantsToFetch[i];
        setProgress(prev => ({
          ...prev,
          message: `Fetching servant ${i + 1}/${servantsToFetch.length}: ${basic.name}`,
          servantCurrent: i + 1,
        }));

        const detail = await fetchServantDetail(basic.id, region);
        if (detail) {
          db.servants.push(detail);
        }

        // Add delay to avoid rate limiting
        if (i < servantsToFetch.length - 1) {
          await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
        }
      }

      // Fetch craft essence list
      setProgress({
        stage: 'fetching-list',
        message: 'Fetching craft essence list...',
        servantCurrent: servantsToFetch.length,
        servantTotal: servantsToFetch.length,
        ceCurrent: 0,
        ceTotal: 0,
      });

      const basicCEs = await fetchAllCEsBasic(region);
      const cesToFetch = basicCEs.slice(0, Math.min(ceLimit, basicCEs.length));

      setProgress({
        stage: 'fetching-ces',
        message: `Fetching ${cesToFetch.length} craft essences...`,
        servantCurrent: servantsToFetch.length,
        servantTotal: servantsToFetch.length,
        ceCurrent: 0,
        ceTotal: cesToFetch.length,
      });

      // Fetch detailed CE data
      for (let i = 0; i < cesToFetch.length; i++) {
        const basic = cesToFetch[i];
        setProgress(prev => ({
          ...prev,
          message: `Fetching CE ${i + 1}/${cesToFetch.length}: ${basic.name}`,
          ceCurrent: i + 1,
        }));

        const detail = await fetchCEDetail(basic.id, region);
        if (detail) {
          db.craftEssences.push(detail);
        }

        // Add delay to avoid rate limiting
        if (i < cesToFetch.length - 1) {
          await new Promise(resolve => setTimeout(resolve, FETCH_DELAY_MS));
        }
      }

      setProgress({
        stage: 'complete',
        message: `Successfully fetched ${db.servants.length} servants and ${db.craftEssences.length} craft essences!`,
        servantCurrent: servantsToFetch.length,
        servantTotal: servantsToFetch.length,
        ceCurrent: cesToFetch.length,
        ceTotal: cesToFetch.length,
      });

      return db;
    } catch (error) {
      console.error('Error fetching data:', error);
      setProgress({
        stage: 'error',
        message: error instanceof Error ? error.message : 'An error occurred while fetching data',
        servantCurrent: 0,
        servantTotal: 0,
        ceCurrent: 0,
        ceTotal: 0,
      });
      return null;
    } finally {
      setIsFetching(false);
    }
  }, []);

  return {
    isFetching,
    progress,
    fetchData,
    resetProgress,
  };
}

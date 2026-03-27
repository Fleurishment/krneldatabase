import { useState } from 'react';
import { Download, Globe, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDataFetcher } from '@/hooks/useDataFetcher';
import { useDatabase } from '@/context/DatabaseContext';
import type { Region } from '@/types';

export function DataFetcher() {
  const { isFetching, progress, fetchData } = useDataFetcher();
  const { setDatabase, region, setRegion } = useDatabase();
  
  const [selectedRegion, setSelectedRegion] = useState<Region>(region);
  const [servantLimit, setServantLimit] = useState(100);
  const [ceLimit, setCeLimit] = useState(100);
  const [fetchComplete, setFetchComplete] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const handleFetch = async () => {
    setFetchComplete(false);
    setFetchError('');
    
    const data = await fetchData(selectedRegion, servantLimit, ceLimit);
    
    if (data) {
      setDatabase(data);
      setRegion(selectedRegion);
      setFetchComplete(true);
    } else {
      setFetchError('Failed to fetch data. Please try again.');
    }
  };

  const getProgressValue = () => {
    if (progress.servantTotal === 0) return 0;
    if (progress.ceTotal === 0) {
      return (progress.servantCurrent / progress.servantTotal) * 100;
    }
    const servantProgress = progress.servantCurrent / progress.servantTotal;
    const ceProgress = progress.ceCurrent / progress.ceTotal;
    return ((servantProgress + ceProgress) / 2) * 100;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Fetch Data from Atlas Academy API
        </CardTitle>
        <CardDescription>
          Populate the database with official FGO data. Choose your preferred region and fetch limits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Region Selection */}
        <div className="space-y-2">
          <Label>Region</Label>
          <div className="flex gap-2">
            <Button
              variant={selectedRegion === 'NA' ? 'default' : 'outline'}
              onClick={() => setSelectedRegion('NA')}
              className="flex-1"
              disabled={isFetching}
            >
              <Globe className="w-4 h-4 mr-2" />
              NA (North America)
            </Button>
            <Button
              variant={selectedRegion === 'JP' ? 'default' : 'outline'}
              onClick={() => setSelectedRegion('JP')}
              className="flex-1"
              disabled={isFetching}
            >
              <Globe className="w-4 h-4 mr-2" />
              JP (Japan)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {selectedRegion === 'NA' 
              ? 'North America server data (~400+ servants, ~400+ CEs)' 
              : 'Japan server data (~500+ servants, ~500+ CEs, includes latest content)'}
          </p>
        </div>

        {/* Fetch Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="servant-limit">Servants to Fetch</Label>
            <Input
              id="servant-limit"
              type="number"
              min={1}
              max={1000}
              value={servantLimit}
              onChange={(e) => setServantLimit(Number(e.target.value))}
              disabled={isFetching}
            />
            <p className="text-xs text-muted-foreground">
              Max: {selectedRegion === 'NA' ? '~400' : '~500'} servants
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ce-limit">Craft Essences to Fetch</Label>
            <Input
              id="ce-limit"
              type="number"
              min={1}
              max={1000}
              value={ceLimit}
              onChange={(e) => setCeLimit(Number(e.target.value))}
              disabled={isFetching}
            />
            <p className="text-xs text-muted-foreground">
              Max: {selectedRegion === 'NA' ? '~400' : '~500'} CEs
            </p>
          </div>
        </div>

        {/* Progress */}
        {isFetching && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">{progress.message}</span>
            </div>
            <Progress value={getProgressValue()} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Servants: {progress.servantCurrent}/{progress.servantTotal}</span>
              <span>CEs: {progress.ceCurrent}/{progress.ceTotal}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {fetchComplete && (
          <Alert className="bg-green-500/10 border-green-500/50">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              {progress.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {fetchError && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{fetchError}</AlertDescription>
          </Alert>
        )}

        {/* Current Region Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Current Database Region:</span>
          <Badge variant={region === 'NA' ? 'default' : 'secondary'}>
            {region}
          </Badge>
        </div>

        {/* Fetch Button */}
        <Button
          onClick={handleFetch}
          disabled={isFetching}
          className="w-full"
          size="lg"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Fetching Data...' : `Fetch ${selectedRegion} Data`}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Note: Fetching may take several minutes depending on the amount of data. Please be patient.
        </p>
      </CardContent>
    </Card>
  );
}

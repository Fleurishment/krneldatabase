import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  X, 
  Gem,
  Grid3X3,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useDatabase } from '@/context/DatabaseContext';
import { getRarityStars, getCEFaceUrl } from '@/services/api';
import { cn } from '@/lib/utils';

const RARITIES = [5, 4, 3, 2, 1];

export function CraftEssencesPage() {
  const navigate = useNavigate();
  const { getAllCEs, region } = useDatabase();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const craftEssences = getAllCEs();

  // Filter craft essences
  const filteredCEs = useMemo(() => {
    let result = craftEssences;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ce => 
        ce.name.toLowerCase().includes(query) ||
        ce.originalName.toLowerCase().includes(query)
      );
    }

    if (selectedRarities.length > 0) {
      result = result.filter(ce => selectedRarities.includes(ce.rarity));
    }

    return result;
  }, [craftEssences, searchQuery, selectedRarities]);

  // Toggle rarity filter
  const toggleRarity = (rarity: number) => {
    setSelectedRarities(prev => 
      prev.includes(rarity) ? prev.filter(r => r !== rarity) : [...prev, rarity]
    );
  };

  const clearFilters = () => {
    setSelectedRarities([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedRarities.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
            <Gem className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Craft Essences</h1>
            <p className="text-muted-foreground">
              {filteredCEs.length} of {craftEssences.length} craft essences
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search craft essences by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showFilters ? 'default' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                {selectedRarities.length}
              </Badge>
            )}
          </Button>

          {/* View Mode Toggle */}
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="p-4">
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-4">
                {/* Rarity Filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Rarity</p>
                  <div className="flex flex-wrap gap-2">
                    {RARITIES.map(rarity => (
                      <button
                        key={rarity}
                        onClick={() => toggleRarity(rarity)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                          selectedRarities.includes(rarity)
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {getRarityStars(rarity)}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <>
                    <Separator />
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                      <X className="w-4 h-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </>
                )}
              </div>
            </ScrollArea>
          </Card>
        )}

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedRarities.map(rarity => (
              <Badge key={rarity} variant="secondary" className="gap-1 cursor-pointer hover:bg-muted" onClick={() => toggleRarity(rarity)}>
                {getRarityStars(rarity)}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Craft Essences Grid/List */}
      {filteredCEs.length === 0 ? (
        <div className="text-center py-16">
          <Gem className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No craft essences found</h3>
          <p className="text-muted-foreground">
            {craftEssences.length === 0 
              ? 'The database is empty. Use the data fetcher on the home page to populate it.'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCEs.map((ce) => (
            <Card
              key={ce.id}
              className="cursor-pointer overflow-hidden group hover:shadow-lg transition-all hover:-translate-y-1"
              onClick={() => navigate(`/craft-essences/${ce.id}`)}
            >
              <div className="aspect-square relative overflow-hidden bg-muted">
                <ImageWithFallback
                  src={ce.extraAssets?.faces?.ascension?.['1'] || 
                       ce.extraAssets?.faces?.ascension?.['0'] ||
                       ce.extraAssets?.charaGraph?.ascension?.['1'] ||
                       ce.extraAssets?.charaGraph?.ascension?.['0'] ||
                       getCEFaceUrl(ce.collectionNo, region)}
                  alt={ce.name}
                  containerClassName="w-full h-full"
                  fallbackType="ce"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/60 text-yellow-400 font-bold">
                    {getRarityStars(ce.rarity)}
                  </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 py-1 px-2 bg-purple-600">
                  <p className="text-xs text-white font-medium text-center">
                    Cost {ce.cost}
                  </p>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="font-medium text-sm truncate" title={ce.name}>
                  {ce.name}
                </p>
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>Max Lv. {ce.lvMax}</span>
                  <span>ATK {ce.atkMax.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredCEs.map((ce) => (
            <Card
              key={ce.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/craft-essences/${ce.id}`)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <ImageWithFallback
                  src={ce.extraAssets?.faces?.ascension?.['1'] || 
                       ce.extraAssets?.faces?.ascension?.['0'] ||
                       ce.extraAssets?.charaGraph?.ascension?.['1'] ||
                       ce.extraAssets?.charaGraph?.ascension?.['0'] ||
                       getCEFaceUrl(ce.collectionNo, region)}
                  alt={ce.name}
                  containerClassName="w-16 h-16 rounded-lg"
                  fallbackType="ce"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{ce.name}</h3>
                    <Badge variant="secondary" className="shrink-0 text-yellow-600">
                      {getRarityStars(ce.rarity)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>Max Lv. {ce.lvMax}</span>
                    <span>Cost {ce.cost}</span>
                  </div>
                </div>
                <div className="text-right text-sm hidden sm:block">
                  <p><span className="text-muted-foreground">ATK</span> {ce.atkMax.toLocaleString()}</p>
                  <p><span className="text-muted-foreground">HP</span> {ce.hpMax.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

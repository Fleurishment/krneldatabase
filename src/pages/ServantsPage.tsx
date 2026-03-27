import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  X, 
  Sword,
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
import { 
  CLASS_NAMES, 
  getRarityStars, 
  CLASS_COLORS,
  getServantFaceUrl 
} from '@/services/api';
import { cn } from '@/lib/utils';

const CLASSES = [
  'saber', 'archer', 'lancer', 'rider', 'caster', 
  'assassin', 'berserker', 'shielder', 'ruler', 
  'avenger', 'alterEgo', 'moonCancer', 'foreigner', 'pretender'
];

const RARITIES = [5, 4, 3, 2, 1, 0];
const ATTRIBUTES = ['human', 'earth', 'sky', 'star', 'beast'];
const GENDERS = ['male', 'female', 'unknown'];

export function ServantsPage() {
  const navigate = useNavigate();
  const { getAllServants, region } = useDatabase();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<number[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const servants = getAllServants();

  // Filter servants
  const filteredServants = useMemo(() => {
    let result = servants;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.originalName.toLowerCase().includes(query) ||
        s.className.toLowerCase().includes(query)
      );
    }

    if (selectedClasses.length > 0) {
      result = result.filter(s => selectedClasses.includes(s.className));
    }

    if (selectedRarities.length > 0) {
      result = result.filter(s => selectedRarities.includes(s.rarity));
    }

    if (selectedAttributes.length > 0) {
      result = result.filter(s => selectedAttributes.includes(s.attribute));
    }

    if (selectedGenders.length > 0) {
      result = result.filter(s => selectedGenders.includes(s.gender));
    }

    return result;
  }, [servants, searchQuery, selectedClasses, selectedRarities, selectedAttributes, selectedGenders]);

  // Toggle filter helpers
  const toggleClass = (cls: string) => {
    setSelectedClasses(prev => 
      prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
    );
  };

  const toggleRarity = (rarity: number) => {
    setSelectedRarities(prev => 
      prev.includes(rarity) ? prev.filter(r => r !== rarity) : [...prev, rarity]
    );
  };

  const toggleAttribute = (attr: string) => {
    setSelectedAttributes(prev => 
      prev.includes(attr) ? prev.filter(a => a !== attr) : [...prev, attr]
    );
  };

  const toggleGender = (gender: string) => {
    setSelectedGenders(prev => 
      prev.includes(gender) ? prev.filter(g => g !== gender) : [...prev, gender]
    );
  };

  const clearFilters = () => {
    setSelectedClasses([]);
    setSelectedRarities([]);
    setSelectedAttributes([]);
    setSelectedGenders([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedClasses.length > 0 || selectedRarities.length > 0 || 
                          selectedAttributes.length > 0 || selectedGenders.length > 0;

  const activeFilterCount = selectedClasses.length + selectedRarities.length + 
                           selectedAttributes.length + selectedGenders.length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sword className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Servants</h1>
            <p className="text-muted-foreground">
              {filteredServants.length} of {servants.length} servants
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
              placeholder="Search servants by name..."
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
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
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
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-4">
                {/* Class Filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Class</p>
                  <div className="flex flex-wrap gap-2">
                    {CLASSES.map(cls => (
                      <button
                        key={cls}
                        onClick={() => toggleClass(cls)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all',
                          selectedClasses.includes(cls)
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {CLASS_NAMES[cls] || cls}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

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

                <Separator />

                {/* Attribute Filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Attribute</p>
                  <div className="flex flex-wrap gap-2">
                    {ATTRIBUTES.map(attr => (
                      <button
                        key={attr}
                        onClick={() => toggleAttribute(attr)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all',
                          selectedAttributes.includes(attr)
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {attr}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Gender Filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Gender</p>
                  <div className="flex flex-wrap gap-2">
                    {GENDERS.map(gender => (
                      <button
                        key={gender}
                        onClick={() => toggleGender(gender)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all',
                          selectedGenders.includes(gender)
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted hover:bg-muted/80'
                        )}
                      >
                        {gender}
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
            {selectedClasses.map(cls => (
              <Badge key={cls} variant="secondary" className="gap-1 cursor-pointer hover:bg-muted" onClick={() => toggleClass(cls)}>
                {CLASS_NAMES[cls] || cls}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            {selectedRarities.map(rarity => (
              <Badge key={rarity} variant="secondary" className="gap-1 cursor-pointer hover:bg-muted" onClick={() => toggleRarity(rarity)}>
                {getRarityStars(rarity)}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            {selectedAttributes.map(attr => (
              <Badge key={attr} variant="secondary" className="gap-1 capitalize cursor-pointer hover:bg-muted" onClick={() => toggleAttribute(attr)}>
                {attr}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            {selectedGenders.map(gender => (
              <Badge key={gender} variant="secondary" className="gap-1 capitalize cursor-pointer hover:bg-muted" onClick={() => toggleGender(gender)}>
                {gender}
                <X className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Servants Grid/List */}
      {filteredServants.length === 0 ? (
        <div className="text-center py-16">
          <Sword className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No servants found</h3>
          <p className="text-muted-foreground">
            {servants.length === 0 
              ? 'The database is empty. Use the data fetcher on the home page to populate it.'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredServants.map((servant) => (
            <Card
              key={servant.id}
              className="cursor-pointer overflow-hidden group hover:shadow-lg transition-all hover:-translate-y-1"
              onClick={() => navigate(`/servants/${servant.id}`)}
            >
              <div className="aspect-square relative overflow-hidden bg-muted">
                <ImageWithFallback
                  src={servant.extraAssets?.faces?.ascension?.['1'] || 
                       servant.extraAssets?.faces?.ascension?.['0'] ||
                       getServantFaceUrl(servant.collectionNo, region, 0)}
                  alt={servant.name}
                  containerClassName="w-full h-full"
                  fallbackType="servant"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/60 text-yellow-400 font-bold">
                    {getRarityStars(servant.rarity)}
                  </Badge>
                </div>
                <div className={cn(
                  'absolute bottom-0 left-0 right-0 py-1 px-2',
                  CLASS_COLORS[servant.className] || 'bg-gray-600'
                )}>
                  <p className="text-xs text-white font-medium capitalize text-center">
                    {CLASS_NAMES[servant.className] || servant.className}
                  </p>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="font-medium text-sm truncate" title={servant.name}>
                  {servant.name}
                </p>
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span className="capitalize">{servant.attribute}</span>
                  <span>ATK {servant.atkMax.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredServants.map((servant) => (
            <Card
              key={servant.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/servants/${servant.id}`)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <ImageWithFallback
                  src={servant.extraAssets?.faces?.ascension?.['1'] || 
                       servant.extraAssets?.faces?.ascension?.['0'] ||
                       getServantFaceUrl(servant.collectionNo, region, 0)}
                  alt={servant.name}
                  containerClassName="w-16 h-16 rounded-lg"
                  fallbackType="servant"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{servant.name}</h3>
                    <Badge variant="secondary" className="shrink-0 text-yellow-600">
                      {getRarityStars(servant.rarity)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="capitalize">{CLASS_NAMES[servant.className] || servant.className}</span>
                    <span className="capitalize">{servant.attribute}</span>
                    <span className="capitalize">{servant.gender}</span>
                  </div>
                </div>
                <div className="text-right text-sm hidden sm:block">
                  <p><span className="text-muted-foreground">ATK</span> {servant.atkMax.toLocaleString()}</p>
                  <p><span className="text-muted-foreground">HP</span> {servant.hpMax.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

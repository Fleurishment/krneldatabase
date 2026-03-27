import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Sword, 
  Heart, 
  Zap,
  Target,
  Skull,
  Edit,
  Trash2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useDatabase } from '@/context/DatabaseContext';
import { useAuth } from '@/context/AuthContext';
import { 
  CLASS_NAMES, 
  getRarityStars, 
  CARD_TYPES,
  getServantFullImageUrl
} from '@/services/api';
import { cn } from '@/lib/utils';

export function ServantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getServantById, deleteServant, region } = useDatabase();
  const { isAuthenticated } = useAuth();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const servant = id ? getServantById(Number(id)) : undefined;

  if (!servant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Sword className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Servant Not Found</h2>
          <p className="text-muted-foreground mb-4">The servant you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => navigate('/servants')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteServant(servant.id);
    setDeleteDialogOpen(false);
    navigate('/servants');
  };

  // Get card display
  const getCardDisplay = (cardType: string) => {
    const card = CARD_TYPES[cardType];
    if (!card) return null;
    return (
      <span 
        className={cn(
          'inline-flex items-center justify-center w-8 h-8 rounded text-white text-xs font-bold',
          card.bgClass
        )}
      >
        {card.name[0]}
      </span>
    );
  };

  // Format skill description (basic HTML parsing)
  const formatSkillDetail = (detail: string) => {
    return detail
      .replace(/\n/g, '<br />')
      .replace(/\[(.+?)\]/g, '<span class="text-primary font-medium">[$1]</span>');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/servants')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold truncate">{servant.name}</h1>
          <p className="text-muted-foreground">No. {servant.collectionNo}</p>
        </div>
        {isAuthenticated && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image & Basic Info */}
        <div className="space-y-6">
          {/* Servant Image */}
          <Card className="overflow-hidden">
            <div className="aspect-[3/4] relative bg-muted">
              <ImageWithFallback
                src={servant.extraAssets?.charaGraph?.ascension?.['4'] || 
                     servant.extraAssets?.charaGraph?.ascension?.['1'] ||
                     getServantFullImageUrl(servant.id, region, 1)}
                alt={servant.name}
                containerClassName="w-full h-full"
                fallbackType="servant"
              />
            </div>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Class</span>
                <span className="font-medium capitalize">{CLASS_NAMES[servant.className] || servant.className}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rarity</span>
                <span className="text-yellow-500 font-bold">{getRarityStars(servant.rarity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attribute</span>
                <span className="font-medium capitalize">{servant.attribute}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-medium capitalize">{servant.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost</span>
                <span className="font-medium">{servant.cost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Level</span>
                <span className="font-medium">{servant.lvMax}</span>
              </div>
            </CardContent>
          </Card>

          {/* Card Deck */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Command Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 justify-center">
                {servant.cards.map((card, index) => (
                  <div key={index}>
                    {getCardDisplay(card)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="np">Noble Phantasm</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
            </TabsList>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-6">
              {/* Combat Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sword className="w-5 h-5" />
                    Combat Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">ATK (Max)</p>
                      <p className="text-2xl font-bold">{servant.atkMax.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Base: {servant.atkBase.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">HP (Max)</p>
                      <p className="text-2xl font-bold">{servant.hpMax.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Base: {servant.hpBase.toLocaleString()}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                      <p className="text-sm text-muted-foreground">Star Absorb</p>
                      <p className="font-semibold">{servant.starAbsorb}</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Zap className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-sm text-muted-foreground">Star Gen</p>
                      <p className="font-semibold">{servant.starGen}%</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Target className="w-5 h-5 mx-auto mb-1 text-red-500" />
                      <p className="text-sm text-muted-foreground">Death Rate</p>
                      <p className="font-semibold">{servant.instantDeathChance}%</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Skull className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                      <p className="text-sm text-muted-foreground">Death Rate</p>
                      <p className="font-semibold">{servant.instantDeathChance}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bond Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Bond Levels
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {servant.bondGrowth?.slice(0, 10).map((bond, index) => (
                      <div key={index} className="text-center p-2 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">Lv.{index + 1}</p>
                        <p className="text-sm font-medium">{bond.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              {/* Active Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Active Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {servant.skills?.filter(s => s.num > 0).map((skill) => (
                    <div key={skill.id} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{skill.name}</h4>
                        <Badge variant="outline">Rank {skill.strengthStatus}</Badge>
                      </div>
                      <p 
                        className="text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: formatSkillDetail(skill.detail) }}
                      />
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Cooldown:</span>
                        <span className="font-medium">{skill.coolDown?.join('/')}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Passive Skills */}
              {servant.passiveSkills && servant.passiveSkills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Passive Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {servant.passiveSkills.map((skill) => (
                      <div key={skill.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{skill.name}</h4>
                          <Badge variant="secondary" className="text-xs">{skill.rank}</Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Noble Phantasm Tab */}
            <TabsContent value="np" className="space-y-6">
              {servant.noblePhantasms?.map((np) => (
                <Card key={np.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getCardDisplay(np.card)}
                      <span>{np.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{np.type}</Badge>
                      <Badge variant="secondary">Rank {np.strengthStatus}</Badge>
                    </div>
                    <p 
                      className="text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: formatSkillDetail(np.detail) }}
                    />
                    {np.npGain && (
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="p-2 bg-muted rounded text-center">
                          <p className="text-muted-foreground">Attack</p>
                          <p className="font-medium">{np.npGain.attack?.[0]}%</p>
                        </div>
                        <div className="p-2 bg-muted rounded text-center">
                          <p className="text-muted-foreground">Defense</p>
                          <p className="font-medium">{np.npGain.defense?.[0]}%</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="space-y-6">
              {/* Ascension Materials */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ascension Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(servant.ascensionMaterials || {}).map(([level, data]) => (
                    <div key={level} className="mb-4 last:mb-0">
                      <p className="text-sm font-medium mb-2">Ascension {level}</p>
                      <div className="flex flex-wrap gap-2">
                        {data.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm">
                            <span>{item.name}</span>
                            <span className="text-muted-foreground">x{item.amount}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded text-sm">
                          <span className="font-medium">{data.qp.toLocaleString()}</span>
                          <span className="text-muted-foreground">QP</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skill Materials */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skill Reinforcement Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(servant.skillMaterials || {}).map(([level, data]) => (
                    <div key={level} className="mb-4 last:mb-0">
                      <p className="text-sm font-medium mb-2">Level {level}</p>
                      <div className="flex flex-wrap gap-2">
                        {data.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm">
                            <span>{item.name}</span>
                            <span className="text-muted-foreground">x{item.amount}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded text-sm">
                          <span className="font-medium">{data.qp.toLocaleString()}</span>
                          <span className="text-muted-foreground">QP</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Servant</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{servant.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

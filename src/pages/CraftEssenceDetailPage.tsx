import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Gem,
  Edit,
  Trash2,
  Heart,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useDatabase } from '@/context/DatabaseContext';
import { useAuth } from '@/context/AuthContext';
import { getRarityStars, getCEFullImageUrl } from '@/services/api';

export function CraftEssenceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCEById, deleteCE, region } = useDatabase();
  const { isAuthenticated } = useAuth();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const ce = id ? getCEById(Number(id)) : undefined;

  if (!ce) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Gem className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Craft Essence Not Found</h2>
          <p className="text-muted-foreground mb-4">The craft essence you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => navigate('/craft-essences')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteCE(ce.id);
    setDeleteDialogOpen(false);
    navigate('/craft-essences');
  };

  // Format skill description
  const formatSkillDetail = (detail: string) => {
    return detail
      .replace(/\n/g, '<br />')
      .replace(/\[(.+?)\]/g, '<span class="text-primary font-medium">[$1]</span>');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/craft-essences')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold truncate">{ce.name}</h1>
          <p className="text-muted-foreground">No. {ce.collectionNo}</p>
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
          {/* CE Image */}
          <Card className="overflow-hidden">
            <div className="aspect-[3/4] relative bg-muted">
              <ImageWithFallback
                src={ce.extraAssets?.charaGraph?.ascension?.['1'] || 
                     ce.extraAssets?.charaGraph?.ascension?.['0'] ||
                     getCEFullImageUrl(ce.id, region, 1)}
                alt={ce.name}
                containerClassName="w-full h-full"
                fallbackType="ce"
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
                <span className="text-muted-foreground">Rarity</span>
                <span className="text-yellow-500 font-bold">{getRarityStars(ce.rarity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost</span>
                <span className="font-medium">{ce.cost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Level</span>
                <span className="font-medium">{ce.lvMax}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Growth Curve</span>
                <span className="font-medium">{ce.growthCurve}</span>
              </div>
              {ce.bondServantId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bond CE</span>
                  <Badge variant="secondary" className="gap-1">
                    <Heart className="w-3 h-3" />
                    Yes
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Effects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Base Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">ATK (Max)</p>
                  <p className="text-2xl font-bold">{ce.atkMax.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Base: {ce.atkBase.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">HP (Max)</p>
                  <p className="text-2xl font-bold">{ce.hpMax.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Base: {ce.hpBase.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills/Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Effects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ce.skills && ce.skills.length > 0 ? (
                <div className="space-y-4">
                  {ce.skills.map((skill) => (
                    <div key={skill.id} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{skill.name}</h4>
                      </div>
                      <p 
                        className="text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: formatSkillDetail(skill.detail) }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No effect data available</p>
              )}
            </CardContent>
          </Card>

          {/* Profile */}
          {ce.profile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ce.profile.illustrator && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Illustrator</span>
                    <span className="font-medium">{ce.profile.illustrator}</span>
                  </div>
                )}
                {ce.profile.voiceActor && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Voice Actor</span>
                    <span className="font-medium">{ce.profile.voiceActor}</span>
                  </div>
                )}
                {ce.profile.comments && ce.profile.comments.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <p className="font-medium">Comments</p>
                      {ce.profile.comments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">{comment.condMessage}</p>
                          <p className="text-sm">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Craft Essence</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{ce.name}</strong>? This action cannot be undone.
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

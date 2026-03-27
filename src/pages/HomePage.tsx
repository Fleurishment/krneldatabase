import { useNavigate } from 'react-router-dom';
import { 
  Sword, 
  Gem, 
  Database, 
  Search, 
  Star, 
  Shield,
  Users,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataFetcher } from '@/components/DataFetcher';
import { useDatabase } from '@/context/DatabaseContext';

export function HomePage() {
  const navigate = useNavigate();
  const { servantCount, ceCount, lastUpdated, region } = useDatabase();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Never';
    }
  };

  const features = [
    {
      icon: <Search className="w-5 h-5" />,
      title: 'Advanced Search',
      description: 'Search and filter servants by class, rarity, attribute, and more',
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: 'Detailed Stats',
      description: 'View complete servant stats, skills, noble phantasms, and materials',
    },
    {
      icon: <Gem className="w-5 h-5" />,
      title: 'Craft Essences',
      description: 'Browse all craft essences with effects, stats, and artwork',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Admin Panel',
      description: 'Manage database content with full CRUD operations (admin only)',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Unofficial FGO Database</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fate/Grand Order
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Database
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Comprehensive database for Fate/Grand Order servants, craft essences, skills, and stats. 
              Powered by Atlas Academy API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/servants')}
                className="gap-2"
              >
                <Sword className="w-5 h-5" />
                Browse Servants
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/craft-essences')}
                className="gap-2 border-white/30 text-white hover:bg-white/10"
              >
                <Gem className="w-5 h-5" />
                Craft Essences
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{servantCount}</p>
                    <p className="text-muted-foreground">Servants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Gem className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{ceCount}</p>
                    <p className="text-muted-foreground">Craft Essences</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Database className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{formatDate(lastUpdated)}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-muted-foreground">Last Updated</p>
                      <Badge variant="outline" className="text-xs">
                        {region}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Fetcher Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <DataFetcher />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Database Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore comprehensive data for all your favorite servants and craft essences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/servants')}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Sword className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">All Servants</h3>
                    <p className="text-sm text-muted-foreground">Browse the complete servant database</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/craft-essences')}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
                    <Gem className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Craft Essences</h3>
                    <p className="text-sm text-muted-foreground">View all craft essences and effects</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              Data Sources: This database is powered by data from{' '}
              <a 
                href="https://api.atlasacademy.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Atlas Academy API
              </a>
            </p>
            <p>
              All game assets and data are property of TYPE-MOON and Aniplex.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

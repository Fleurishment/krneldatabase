import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Database, 
  Download, 
  Upload, 
  Trash2,
  Users,
  Gem,
  AlertTriangle,
  CheckCircle,
  FileJson,
  Plus,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { DataFetcher } from '@/components/DataFetcher';
import { useDatabase } from '@/context/DatabaseContext';
import { useAuth } from '@/context/AuthContext';
import type { Servant, CraftEssence } from '@/types';

export function AdminPage() {
  const navigate = useNavigate();
  const { 
    servantCount, 
    ceCount, 
    lastUpdated, 
    region,
    resetDatabase,
    importDatabase,
    exportDatabase,
    downloadDatabase,
    addServant,
    addCE
  } = useDatabase();
  const { logout, isAuthenticated } = useAuth();
  
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [addServantDialogOpen, setAddServantDialogOpen] = useState(false);
  const [addCEDialogOpen, setAddCEDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  // Custom servant form state
  const [customServant, setCustomServant] = useState<Partial<Servant>>({
    id: Date.now(),
    collectionNo: 0,
    name: '',
    originalName: '',
    className: 'saber',
    rarity: 3,
    atkMax: 0,
    hpMax: 0,
  });

  // Custom CE form state
  const [customCE, setCustomCE] = useState<Partial<CraftEssence>>({
    id: Date.now() + 1,
    collectionNo: 0,
    name: '',
    originalName: '',
    rarity: 3,
    atkMax: 0,
    hpMax: 0,
    cost: 5,
    lvMax: 100,
    growthCurve: 1,
    skills: [],
    extraAssets: {
      charaGraph: { ascension: {} },
      faces: { ascension: {} },
    },
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Never';
    }
  };

  const handleImport = () => {
    setImportError('');
    setImportSuccess(false);
    
    if (!importData.trim()) {
      setImportError('Please paste JSON data');
      return;
    }
    
    const success = importDatabase(importData);
    if (success) {
      setImportSuccess(true);
      setImportData('');
      setTimeout(() => setImportDialogOpen(false), 1500);
    } else {
      setImportError('Invalid JSON format');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabase(content);
      if (success) {
        setImportSuccess(true);
        setImportError('');
        setTimeout(() => setImportDialogOpen(false), 1500);
      } else {
        setImportError('Invalid JSON file format');
        setImportSuccess(false);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetDatabase();
    setResetDialogOpen(false);
  };

  const handleAddServant = () => {
    if (!customServant.name) return;
    
    const newServant: Servant = {
      ...customServant as Servant,
      id: Date.now(),
      collectionNo: customServant.collectionNo || Date.now(),
      originalName: customServant.originalName || customServant.name || '',
      classId: 1,
      cost: 12,
      lvMax: 80,
      atkBase: 0,
      hpBase: 0,
      gender: 'unknown',
      attribute: 'human',
      traits: [],
      cards: ['1', '1', '2', '2', '3'],
      starAbsorb: 100,
      starGen: 10,
      instantDeathChance: 0,
      hitsDistribution: {},
      cardDetails: {},
      extraAssets: {
        charaGraph: { ascension: {} },
        faces: { ascension: {} },
      },
      skills: [],
      passiveSkills: [],
      noblePhantasms: [],
      ascensionMaterials: {},
      skillMaterials: {},
      bondGrowth: [],
      expGrowth: [],
    };
    
    addServant(newServant);
    setAddServantDialogOpen(false);
    setCustomServant({
      id: Date.now(),
      collectionNo: 0,
      name: '',
      originalName: '',
      className: 'saber',
      rarity: 3,
      atkMax: 0,
      hpMax: 0,
    });
  };

  const handleAddCE = () => {
    if (!customCE.name) return;
    
    const newCE: CraftEssence = {
      ...customCE as CraftEssence,
      id: Date.now(),
      collectionNo: customCE.collectionNo || Date.now(),
      originalName: customCE.originalName || customCE.name || '',
      ruby: '',
      atkBase: 0,
      hpBase: 0,
      growthCurve: 1,
    };
    
    addCE(newCE);
    setAddCEDialogOpen(false);
    setCustomCE({
      id: Date.now() + 1,
      collectionNo: 0,
      name: '',
      originalName: '',
      rarity: 3,
      atkMax: 0,
      hpMax: 0,
      cost: 5,
      lvMax: 100,
      growthCurve: 1,
      skills: [],
      extraAssets: {
        charaGraph: { ascension: {} },
        faces: { ascension: {} },
      },
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage database and content</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-bold">{servantCount}</p>
                <p className="text-muted-foreground">Servants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Gem className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-3xl font-bold">{ceCount}</p>
                <p className="text-muted-foreground">Craft Essences</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatDate(lastUpdated)}</p>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">Last Updated</p>
                  <Badge variant="outline">{region}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="custom">Custom Content</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-6">
          <DataFetcher />
        </TabsContent>

        {/* Custom Content Tab */}
        <TabsContent value="custom" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Add Custom Servant
                </CardTitle>
                <CardDescription>
                  Create a custom servant entry in the database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setAddServantDialogOpen(true)} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Servant
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gem className="w-5 h-5" />
                  Add Custom Craft Essence
                </CardTitle>
                <CardDescription>
                  Create a custom craft essence entry in the database.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setAddCEDialogOpen(true)} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Craft Essence
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Import/Export Tab */}
        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Database
              </CardTitle>
              <CardDescription>
                Download the current database as a JSON file for backup or sharing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={downloadDatabase} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard.writeText(exportDatabase());
                  }}
                  className="flex-1"
                >
                  <FileJson className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Import Database
              </CardTitle>
              <CardDescription>
                Import a database from JSON file or paste JSON data directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setImportDialogOpen(true)} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone Tab */}
        <TabsContent value="danger" className="space-y-6">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                These actions cannot be undone. Please be careful.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="destructive" 
                  onClick={() => setResetDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Reset Database
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to reset the database? This will delete all servants and craft essences. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              <Trash2 className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Database</DialogTitle>
            <DialogDescription>
              Paste JSON data or upload a file to import.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="import-file">Upload File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="mt-1"
              />
            </div>
            <Separator />
            <div>
              <Label htmlFor="import-text">Or Paste JSON</Label>
              <Textarea
                id="import-text"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste JSON data here..."
                className="mt-1 min-h-[150px] font-mono text-xs"
              />
            </div>
            {importError && (
              <Alert variant="destructive">
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}
            {importSuccess && (
              <Alert className="bg-green-500/10 border-green-500/50">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Database imported successfully!
                </AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImport}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Servant Dialog */}
      <Dialog open={addServantDialogOpen} onOpenChange={setAddServantDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Custom Servant</DialogTitle>
            <DialogDescription>
              Create a new custom servant entry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="servant-name">Name *</Label>
              <Input
                id="servant-name"
                value={customServant.name}
                onChange={(e) => setCustomServant(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Servant name"
              />
            </div>
            <div>
              <Label htmlFor="servant-class">Class</Label>
              <select
                id="servant-class"
                value={customServant.className}
                onChange={(e) => setCustomServant(prev => ({ ...prev, className: e.target.value }))}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="saber">Saber</option>
                <option value="archer">Archer</option>
                <option value="lancer">Lancer</option>
                <option value="rider">Rider</option>
                <option value="caster">Caster</option>
                <option value="assassin">Assassin</option>
                <option value="berserker">Berserker</option>
                <option value="shielder">Shielder</option>
                <option value="ruler">Ruler</option>
                <option value="avenger">Avenger</option>
                <option value="alterEgo">Alter Ego</option>
                <option value="moonCancer">Moon Cancer</option>
                <option value="foreigner">Foreigner</option>
                <option value="pretender">Pretender</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="servant-rarity">Rarity</Label>
                <Input
                  id="servant-rarity"
                  type="number"
                  min={0}
                  max={5}
                  value={customServant.rarity}
                  onChange={(e) => setCustomServant(prev => ({ ...prev, rarity: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="servant-collection">Collection No</Label>
                <Input
                  id="servant-collection"
                  type="number"
                  value={customServant.collectionNo}
                  onChange={(e) => setCustomServant(prev => ({ ...prev, collectionNo: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="servant-atk">Max ATK</Label>
                <Input
                  id="servant-atk"
                  type="number"
                  value={customServant.atkMax}
                  onChange={(e) => setCustomServant(prev => ({ ...prev, atkMax: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="servant-hp">Max HP</Label>
                <Input
                  id="servant-hp"
                  type="number"
                  value={customServant.hpMax}
                  onChange={(e) => setCustomServant(prev => ({ ...prev, hpMax: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddServantDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddServant} disabled={!customServant.name}>
                <Plus className="w-4 h-4 mr-2" />
                Add Servant
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add CE Dialog */}
      <Dialog open={addCEDialogOpen} onOpenChange={setAddCEDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Custom Craft Essence</DialogTitle>
            <DialogDescription>
              Create a new custom craft essence entry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ce-name">Name *</Label>
              <Input
                id="ce-name"
                value={customCE.name}
                onChange={(e) => setCustomCE(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Craft Essence name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ce-rarity">Rarity</Label>
                <Input
                  id="ce-rarity"
                  type="number"
                  min={1}
                  max={5}
                  value={customCE.rarity}
                  onChange={(e) => setCustomCE(prev => ({ ...prev, rarity: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="ce-cost">Cost</Label>
                <Input
                  id="ce-cost"
                  type="number"
                  value={customCE.cost}
                  onChange={(e) => setCustomCE(prev => ({ ...prev, cost: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ce-atk">Max ATK</Label>
                <Input
                  id="ce-atk"
                  type="number"
                  value={customCE.atkMax}
                  onChange={(e) => setCustomCE(prev => ({ ...prev, atkMax: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="ce-hp">Max HP</Label>
                <Input
                  id="ce-hp"
                  type="number"
                  value={customCE.hpMax}
                  onChange={(e) => setCustomCE(prev => ({ ...prev, hpMax: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setAddCEDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCE} disabled={!customCE.name}>
                <Plus className="w-4 h-4 mr-2" />
                Add Craft Essence
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

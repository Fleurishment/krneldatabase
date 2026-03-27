import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { DatabaseProvider } from '@/context/DatabaseContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navigation } from '@/components/Navigation';
import { HomePage } from '@/pages/HomePage';
import { ServantsPage } from '@/pages/ServantsPage';
import { ServantDetailPage } from '@/pages/ServantDetailPage';
import { CraftEssencesPage } from '@/pages/CraftEssencesPage';
import { CraftEssenceDetailPage } from '@/pages/CraftEssenceDetailPage';
import { AdminPage } from '@/pages/AdminPage';
import { LoginPage } from '@/pages/LoginPage';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <DatabaseProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background flex flex-col">
              <Navigation />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/servants" element={<ServantsPage />} />
                  <Route path="/servants/:id" element={<ServantDetailPage />} />
                  <Route path="/craft-essences" element={<CraftEssencesPage />} />
                  <Route path="/craft-essences/:id" element={<CraftEssenceDetailPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <footer className="border-t bg-muted/50 py-6">
                <div className="container mx-auto px-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">FGO Database</span>
                      <span>•</span>
                      <span>Unofficial Fan Project</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>Data from Atlas Academy API</span>
                      <a 
                        href="https://github.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-foreground transition-colors"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium">Made by Krlnel</p>
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

export default App;

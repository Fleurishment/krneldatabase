import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Database, 
  Home, 
  Sword, 
  Gem, 
  Shield, 
  LogIn, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: <Home className="w-4 h-4" /> },
  { label: 'Servants', path: '/servants', icon: <Sword className="w-4 h-4" /> },
  { label: 'Craft Essences', path: '/craft-essences', icon: <Gem className="w-4 h-4" /> },
  { label: 'Admin', path: '/admin', icon: <Shield className="w-4 h-4" />, adminOnly: true },
];

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const visibleNavItems = navItems.filter(item => 
    !item.adminOnly || (item.adminOnly && isAuthenticated)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => handleNavigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl hidden sm:block">FGO Database</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {visibleNavItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? 'default' : 'ghost'}
              onClick={() => handleNavigate(item.path)}
              className="gap-2"
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {/* Admin Login/Logout */}
          {!isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden sm:flex"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Admin
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-4 mt-8">
                {visibleNavItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    onClick={() => handleNavigate(item.path)}
                    className="justify-start w-full"
                  >
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                  </Button>
                ))}
                
                <div className="border-t my-4" />
                
                {!isAuthenticated ? (
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigate('/login')}
                    className="justify-start w-full"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Admin Login
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="justify-start w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

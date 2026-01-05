
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/images.png';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SAA Assurances" className="h-12" />
        </Link>
        
        {user && (
          <nav className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost">Tableau de bord</Button>
            </Link>
            <Link to="/customers">
              <Button variant="ghost">Clients</Button>
            </Link>
            <Link to="/policies">
              <Button variant="ghost">Polices</Button>
            </Link>
            <Button onClick={() => signOut()} variant="outline">
              Déconnexion
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
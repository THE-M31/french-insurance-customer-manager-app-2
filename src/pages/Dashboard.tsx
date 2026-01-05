
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Customer, Claim } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, LogOut, Users, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customersResult, claimsResult] = await Promise.all([
        supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('claims')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      if (customersResult.error) throw customersResult.error;
      if (claimsResult.error) throw claimsResult.error;

      setCustomers(customersResult.data || []);
      setClaims(claimsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Actif</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactif</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">En attente</Badge>;
      default:
        return <Badge variant="outline">Non défini</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo className="h-12" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Gestion des Clients</h1>
              <p className="text-sm text-muted-foreground">
                Bienvenue, {user?.full_name}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">Clients enregistrés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Polices Actives</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customers.filter(c => c.policy_status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">Contrats en cours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sinistres</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{claims.length}</div>
              <p className="text-xs text-muted-foreground">Total déclarations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {claims.filter(c => c.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Sinistres à traiter</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Clients Récents</CardTitle>
                  <CardDescription>Derniers clients enregistrés</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/customers/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Chargement...</div>
              ) : customers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun client enregistré
                </div>
              ) : (
                <div className="space-y-4">
                  {customers.slice(0, 5).map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      <div>
                        <div className="font-medium text-foreground">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                      {getStatusBadge(customer.policy_status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sinistres Récents</CardTitle>
                  <CardDescription>Dernières déclarations</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/claims/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Chargement...</div>
              ) : claims.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun sinistre déclaré
                </div>
              ) : (
                <div className="space-y-4">
                  {claims.slice(0, 5).map((claim) => (
                    <div
                      key={claim.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/claims/${claim.id}`)}
                    >
                      <div>
                        <div className="font-medium text-foreground">{claim.claim_number}</div>
                        <div className="text-sm text-muted-foreground">{claim.claim_type}</div>
                      </div>
                      <Badge
                        variant={
                          claim.status === 'approved'
                            ? 'default'
                            : claim.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {claim.status === 'pending' && 'En attente'}
                        {claim.status === 'in_progress' && 'En cours'}
                        {claim.status === 'approved' && 'Approuvé'}
                        {claim.status === 'rejected' && 'Rejeté'}
                        {claim.status === 'closed' && 'Clôturé'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => navigate('/customers/new')} className="flex-1">
            <Users className="mr-2 h-4 w-4" />
            Gérer les Clients
          </Button>
          <Button onClick={() => navigate('/claims')} className="flex-1">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Gérer les Sinistres
          </Button>
        </div>
      </main>
    </div>
  );
}
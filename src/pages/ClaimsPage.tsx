import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Claim } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          customer:customers(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error('Error fetching claims:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les sinistres',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = claims.filter(
    (claim) =>
      claim.claim_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.claim_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const, icon: Clock },
      in_progress: { label: 'En cours', variant: 'default' as const, icon: AlertCircle },
      approved: { label: 'Approuvé', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Rejeté', variant: 'destructive' as const, icon: XCircle },
      closed: { label: 'Clôturé', variant: 'outline' as const, icon: FileText },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Sinistres</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et suivez tous les sinistres déclarés
          </p>
        </div>
        <Button onClick={() => navigate('/claims/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Sinistre
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par numéro, type ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredClaims.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Aucun sinistre trouvé
              </h3>
              <p className="text-muted-foreground mb-4">
                Commencez par déclarer un nouveau sinistre
              </p>
              <Button onClick={() => navigate('/claims/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Sinistre
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Incident</TableHead>
                  <TableHead>Montant Estimé</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.claim_number}</TableCell>
                    <TableCell>
                      {claim.customer
                        ? `${claim.customer.first_name} ${claim.customer.last_name}`
                        : '-'}
                    </TableCell>
                    <TableCell>{claim.claim_type}</TableCell>
                    <TableCell>{formatDate(claim.incident_date)}</TableCell>
                    <TableCell>{formatCurrency(claim.estimated_amount)}</TableCell>
                    <TableCell>{getStatusBadge(claim.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/claims/${claim.id}`)}
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

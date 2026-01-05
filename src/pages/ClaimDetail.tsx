import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Claim } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  User,
  Calendar,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ClaimDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaim();
  }, [id]);

  const fetchClaim = async () => {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          customer:customers(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setClaim(data);
    } catch (error) {
      console.error('Error fetching claim:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le sinistre',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('claims').delete().eq('id', id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Sinistre supprimé avec succès',
      });
      navigate('/claims');
    } catch (error) {
      console.error('Error deleting claim:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le sinistre',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      in_progress: { label: 'En cours', variant: 'default' as const },
      approved: { label: 'Approuvé', variant: 'default' as const },
      rejected: { label: 'Rejeté', variant: 'destructive' as const },
      closed: { label: 'Clôturé', variant: 'outline' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Sinistre introuvable</h3>
        <Button onClick={() => navigate('/claims')}>Retour aux sinistres</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/claims')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{claim.claim_number}</h1>
            <p className="text-muted-foreground mt-1">{claim.claim_type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/claims/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer ce sinistre ? Cette action est
                  irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-2">{getStatusBadge(claim.status)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Estimé</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(claim.estimated_amount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date de l'Incident</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-foreground">
              {formatDate(claim.incident_date)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {claim.customer && (
              <>
                <div>
                  <div className="text-sm text-muted-foreground">Nom</div>
                  <div className="text-base font-medium text-foreground">
                    {claim.customer.first_name} {claim.customer.last_name}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="text-base text-foreground">{claim.customer.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Téléphone</div>
                  <div className="text-base text-foreground">{claim.customer.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Numéro de Police</div>
                  <div className="text-base text-foreground">
                    {claim.policy_number || '-'}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Détails du Sinistre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Type</div>
              <div className="text-base font-medium text-foreground">{claim.claim_type}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Date de Déclaration</div>
              <div className="text-base text-foreground">{formatDate(claim.reported_date)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Montant Approuvé</div>
              <div className="text-base text-foreground">
                {formatCurrency(claim.approved_amount)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground whitespace-pre-wrap">{claim.description}</p>
        </CardContent>
      </Card>

      {claim.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes Internes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{claim.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

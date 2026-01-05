import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Customer, Claim } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

export default function ClaimForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    policy_number: '',
    claim_type: '',
    incident_date: '',
    description: '',
    estimated_amount: '',
    status: 'pending',
    notes: '',
  });

  useEffect(() => {
    fetchCustomers();
    if (id) {
      fetchClaim();
    }
  }, [id]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('last_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchClaim = async () => {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          customer_id: data.customer_id,
          policy_number: data.policy_number || '',
          claim_type: data.claim_type,
          incident_date: data.incident_date,
          description: data.description,
          estimated_amount: data.estimated_amount?.toString() || '',
          status: data.status,
          notes: data.notes || '',
        });
      }
    } catch (error) {
      console.error('Error fetching claim:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le sinistre',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const claimData = {
        customer_id: formData.customer_id,
        policy_number: formData.policy_number || null,
        claim_type: formData.claim_type,
        incident_date: formData.incident_date,
        description: formData.description,
        estimated_amount: formData.estimated_amount ? parseFloat(formData.estimated_amount) : null,
        status: formData.status,
        notes: formData.notes || null,
        user_id: user.id,
      };

      if (id) {
        const { error } = await supabase
          .from('claims')
          .update(claimData)
          .eq('id', id);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Sinistre mis à jour avec succès',
        });
      } else {
        const { error } = await supabase
          .from('claims')
          .insert([claimData]);

        if (error) throw error;

        toast({
          title: 'Succès',
          description: 'Sinistre créé avec succès',
        });
      }

      navigate('/claims');
    } catch (error) {
      console.error('Error saving claim:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder le sinistre',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/claims')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {id ? 'Modifier le Sinistre' : 'Nouveau Sinistre'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {id ? 'Modifiez les informations du sinistre' : 'Déclarez un nouveau sinistre'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du Sinistre</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer_id">Client *</Label>
                <Select
                  value={formData.customer_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, customer_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="policy_number">Numéro de Police</Label>
                <Input
                  id="policy_number"
                  value={formData.policy_number}
                  onChange={(e) =>
                    setFormData({ ...formData, policy_number: e.target.value })
                  }
                  placeholder="POL-2024-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="claim_type">Type de Sinistre *</Label>
                <Select
                  value={formData.claim_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, claim_type: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Accident de voiture">Accident de voiture</SelectItem>
                    <SelectItem value="Vol">Vol</SelectItem>
                    <SelectItem value="Incendie">Incendie</SelectItem>
                    <SelectItem value="Dégât des eaux">Dégât des eaux</SelectItem>
                    <SelectItem value="Bris de glace">Bris de glace</SelectItem>
                    <SelectItem value="Catastrophe naturelle">Catastrophe naturelle</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incident_date">Date de l'Incident *</Label>
                <Input
                  id="incident_date"
                  type="date"
                  value={formData.incident_date}
                  onChange={(e) =>
                    setFormData({ ...formData, incident_date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_amount">Montant Estimé (€)</Label>
                <Input
                  id="estimated_amount"
                  type="number"
                  step="0.01"
                  value={formData.estimated_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, estimated_amount: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                    <SelectItem value="closed">Clôturé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Décrivez les circonstances du sinistre..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes Internes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Notes pour usage interne..."
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="h-4 w-4" />
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/claims')}
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

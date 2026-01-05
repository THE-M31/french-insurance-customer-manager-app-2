
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Gestion des Clients</h1>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Client
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Clients</CardTitle>
            <CardDescription>Gérez vos clients et leurs informations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Fonctionnalité à venir - Liste des clients</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
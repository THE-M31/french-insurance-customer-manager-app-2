
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Gestion des Polices</h1>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Police
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Polices</CardTitle>
            <CardDescription>Gérez les polices d'assurance de vos clients</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Fonctionnalité à venir - Liste des polices</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, FileText, BarChart } from 'lucide-react';
import logo from '@/assets/images.png';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&h=1080&fit=crop')] opacity-10 bg-cover bg-center" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt="SAA Assurances" className="h-24 mb-8" />
            <h1 className="text-5xl font-bold text-primary-foreground mb-6">
              Gestion Client Simplifiée
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl">
              Gérez vos clients et leurs polices d'assurance en toute simplicité avec notre plateforme moderne et sécurisée.
            </p>
            <div className="flex gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Se connecter
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
                  En savoir plus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Fonctionnalités Principales
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Gestion des Clients</CardTitle>
                <CardDescription>
                  Centralisez toutes les informations de vos clients en un seul endroit
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Polices d'Assurance</CardTitle>
                <CardDescription>
                  Suivez et gérez toutes les polices d'assurance de vos clients
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Sécurité Renforcée</CardTitle>
                <CardDescription>
                  Vos données sont protégées avec les dernières technologies de sécurité
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Rapports & Analyses</CardTitle>
                <CardDescription>
                  Obtenez des insights précieux sur votre portefeuille client
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-foreground">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez SAA Assurances et découvrez une nouvelle façon de gérer vos clients
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Accéder à la plateforme
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 SAA Assurances. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
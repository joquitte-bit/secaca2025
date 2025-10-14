import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            SECACA 2025
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Security Awareness Academy - Train uw medewerkers in cybersecurity. Start vandaag met uw gratis pilot.
          </p>
          <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
            Start gratis pilot (3 maanden)
          </Button>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 text-white">
          <Card className="bg-white/10 border-0">
            <CardHeader>
              <CardTitle className="text-white">🎓 Cursussen</CardTitle>
              <CardDescription className="text-blue-100">
                Basis cybersecurity, phishing training, en meer
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-white/10 border-0">
            <CardHeader>
              <CardTitle className="text-white">📊 Rapportage</CardTitle>
              <CardDescription className="text-blue-100">
                Monitor voortgang en toon compliance aan
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-white/10 border-0">
            <CardHeader>
              <CardTitle className="text-white">🏢 Multi-tenant</CardTitle>
              <CardDescription className="text-blue-100">
                Elke organisatie heeft eigen data en gebruikers
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

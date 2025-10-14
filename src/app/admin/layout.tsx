import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SECACA Admin</h1>
            <p className="text-gray-600">Beheer uw security awareness academy</p>
          </div>
          <Button variant="outline">Uitloggen</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex space-x-4 border-b">
            <Button variant="ghost" className="border-b-2 border-blue-600 rounded-none">
              Content Beheer
            </Button>
            <Button variant="ghost" className="rounded-none">
              Gebruikers
            </Button>
            <Button variant="ghost" className="rounded-none">
              Rapportages
            </Button>
            <Button variant="ghost" className="rounded-none">
              Facturatie
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
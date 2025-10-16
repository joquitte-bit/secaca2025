// src/app/page.tsx - COMPLETE VERSIE MET PRICING EN FOOTER
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">SECACA</h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a href="#features" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                  Features
                </a>
                <a href="#pricing" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Pricing
                </a>
                <a href="#contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900">
                  Contact
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <Link 
                href="/login" 
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Inloggen
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Beveilig uw organisatie tegen 
              <span className="text-blue-600"> cyberdreigingen</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              SECACA 2025 transformeert uw medewerkers in de eerste verdedigingslinie tegen cyberaanvallen. 
              Ons gepersonaliseerde leerplatform maakt security awareness eenvoudig, effectief en meetbaar.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/login"
                className="rounded-md bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105"
              >
                Start Gratis Pilot - 3 Maanden
              </Link>
              <a 
                href="#features" 
                className="text-lg font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
              >
                Meer informatie <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Alles-in-één Security Awareness Platform
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Van phishing training tot compliance rapportage - wij hebben alles wat u nodig heeft.
            </p>
          </div>
          
          {/* Eerste rij features */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="text-xl font-semibold leading-7 text-gray-900">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Tweede rij features */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {additionalFeatures.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="text-xl font-semibold leading-7 text-gray-900">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Eenvoudige, transparante pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Kies het abonnement dat past bij uw organisatie. Geen verborgen kosten.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-3 lg:gap-x-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className="flex flex-col rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-200 xl:p-10"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                  <p className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-bold tracking-tight">€{tier.price}</span>
                    <span className="ml-1 text-xl font-semibold">/maand</span>
                  </p>
                  <p className="mt-6 text-sm text-gray-500">per gebruiker, excl. BTW</p>

                  <ul role="list" className="mt-8 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                        <span className="text-sm leading-6 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/login"
                  className={`mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    tier.highlight
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-500 focus-visible:outline-blue-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:outline-gray-600'
                  }`}
                >
                  Start nu
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">** Minimale afname van 10 gebruikers per abonnement</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Klaar om uw security awareness te transformeren?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Start vandaag nog met onze gratis 3-maanden pilot en ervaar het verschil.
            </p>
            <div className="mt-8">
              <Link
                href="/login"
                className="inline-flex items-center rounded-md bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all transform hover:scale-105"
              >
                Start Nu Met Uw Gratis Pilot
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo en beschrijving */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-white">SECACA</h3>
              <p className="mt-4 text-gray-400 max-w-md">
                Security Awareness Academy - Het meest complete platform voor cybersecurity training en awareness in Nederland.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentatie</a></li>
              </ul>
            </div>

            {/* Bedrijf */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Bedrijf</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Over ons</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Vacatures</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partners</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Support</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2025 SECACA - Security Awareness Academy. Alle rechten voorbehouden.
              </p>
              <div className="mt-4 md:mt-0">
                <form className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Uw emailadres" 
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    Inschrijven
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Icons
const ShieldIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
)

const CertificateIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

// Features data
const features = [
  {
    name: 'Interactieve Cursussen',
    description: 'Modulaire trainingen over phishing, social engineering, wachtwoordbeveiliging en meer. Leer met real-world scenario\'s.',
    icon: ShieldIcon,
  },
  {
    name: 'Gedetailleerde Rapportage',
    description: 'Monitor voortgang, compliance scores en identificeer kwetsbaarheden in uw organisatie met real-time dashboards.',
    icon: ChartIcon,
  },
  {
    name: 'Multi-tenant Architectuur',
    description: 'Elke organisatie heeft volledig geïsoleerde data en gebruikers. Perfect voor MSP\'s en security consultants.',
    icon: UsersIcon,
  },
]

const additionalFeatures = [
  {
    name: 'ISO 27001 Certified',
    description: 'Ons platform voldoet aan de hoogste security standaarden en is ISO 27001 gecertificeerd.',
    icon: CertificateIcon,
  },
  {
    name: '24/7 Support',
    description: 'Toegewijd support team beschikbaar voor al uw vragen en technische ondersteuning.',
    icon: PhoneIcon,
  },
  {
    name: 'Globale Bereik',
    description: 'Train medewerkers wereldwijd met multi-language support en lokale compliance requirements.',
    icon: GlobeIcon,
  },
]

const pricingTiers = [
  {
    id: 'starter',
    name: 'Starter',
    price: '6,80',
    highlight: false,
    features: [
      'Maximaal 50 gebruikers',
      'Basis security trainingen',
      'Rapportage per gebruiker',
      'Email support',
      'Multi-tenant omgeving',
    ],
  },
  {
    id: 'standard',
    name: 'Standaard',
    price: '13,60',
    highlight: true,
    features: [
      'Maximaal 200 gebruikers',
      'Geavanceerde trainingen',
      'Gedetailleerde rapportages',
      'Priority support',
      'API toegang',
      'Aangepaste branding',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '21,10',
    highlight: false,
    features: [
      'Ongelimiteerde gebruikers',
      'Alle training modules',
      'Real-time dashboards',
      '24/7 phone support',
      'White-label oplossing',
      'Dedicated account manager',
    ],
  },
]
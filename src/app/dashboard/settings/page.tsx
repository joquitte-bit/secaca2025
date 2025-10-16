// src/app/dashboard/settings/page.tsx
'use client'

import { useState } from 'react'
import { Icons } from '@/components/Icons'

const tabs = [
  { id: 'account', name: 'Account', icon: Icons.user },
  { id: 'profile', name: 'Profiel', icon: Icons.settings },
  { id: 'billing', name: 'Facturatie', icon: Icons.document },
  { id: 'notifications', name: 'Notificaties', icon: Icons.check },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account')
  const [settings, setSettings] = useState({
    email: 'admin@secaca.nl',
    name: 'Administrator',
    company: 'SECACA B.V.',
    phone: '+31 6 12345678',
    notifications: true,
    newsletter: false,
    securityAlerts: true,
    language: 'nl',
    timezone: 'Europe/Amsterdam',
    plan: 'pro',
    billingEmail: 'finance@secaca.nl',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Settings opslaan:', settings)
    alert('Instellingen opgeslagen!')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Instellingen</h1>
        <p className="text-gray-600 mt-1">Beheer je account en platform instellingen</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Account Instellingen</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Naam
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrijf
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={settings.company}
                      onChange={(e) => setSettings({ ...settings, company: e.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefoon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Profiel Instellingen</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                      Taal
                    </label>
                    <select
                      id="language"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    >
                      <option value="nl">Nederlands</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                      Tijdzone
                    </label>
                    <select
                      id="timezone"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    >
                      <option value="Europe/Amsterdam">Amsterdam</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Berlin">Berlin</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Facturatie</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Huidig Plan
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-blue-900">Pro Plan</h4>
                        <p className="text-sm text-blue-700">€29/maand</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Plan Wijzigen
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="billingEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Facturatie Email
                  </label>
                  <input
                    type="email"
                    id="billingEmail"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={settings.billingEmail}
                    onChange={(e) => setSettings({ ...settings, billingEmail: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Notificatie Instellingen</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="notifications" className="block text-sm font-medium text-gray-900">
                        Notificaties ontvangen
                      </label>
                      <p className="text-sm text-gray-500">Algemene platform notificaties</p>
                    </div>
                    <input
                      id="notifications"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={settings.notifications}
                      onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="newsletter" className="block text-sm font-medium text-gray-900">
                        Nieuwsbrief
                      </label>
                      <p className="text-sm text-gray-500">Updates en nieuwe features</p>
                    </div>
                    <input
                      id="newsletter"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={settings.newsletter}
                      onChange={(e) => setSettings({ ...settings, newsletter: e.target.checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="securityAlerts" className="block text-sm font-medium text-gray-900">
                        Security Alerts
                      </label>
                      <p className="text-sm text-gray-500">Belangrijke security updates</p>
                    </div>
                    <input
                      id="securityAlerts"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={settings.securityAlerts}
                      onChange={(e) => setSettings({ ...settings, securityAlerts: e.target.checked })}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Instellingen Opslaan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
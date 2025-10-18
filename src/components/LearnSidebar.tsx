'use client'

import { Icons } from './Icons'

export function LearnSidebar() {
  return (
    <div className="fixed top-16 left-0 w-56 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-gray-900">
          <Icons.bookOpen className="w-5 h-5" />
          <h3 className="font-semibold">Mijn Voortgang</h3>
        </div>
      </div>
      
      {/* Course Progress */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-1 mb-6">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border-r-2 border-blue-600">
            <Icons.check className="w-4 h-4 text-green-500" />
            <span>Module 1 - Cybersecurity Basis</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border-r-2 border-blue-600">
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span>Module 2 - Wachtwoorden (65%)</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400">
            <Icons.lock className="w-4 h-4" />
            <span>Module 3 - Phishing</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400">
            <Icons.lock className="w-4 h-4" />
            <span>Module 4 - Social Engineering</span>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">🏆 Achievements</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-amber-600">
              <Icons.star className="w-4 h-4" />
              <span>Phishing Expert</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-amber-600">
              <Icons.star className="w-4 h-4" />
              <span>Security Champion</span>
            </div>
          </div>
        </div>

        {/* Study Schedule */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">📅 Studierooster</h4>
          <div className="space-y-2 text-sm">
            <div className="text-gray-700">
              <div className="font-medium">Vandaag</div>
              <div className="text-gray-500">Module 2 les 3</div>
            </div>
            <div className="text-gray-700">
              <div className="font-medium">Morgen</div>
              <div className="text-gray-500">Quiz afronden</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors">
            <Icons.download className="w-4 h-4" />
            <span>Progressie Rapport</span>
          </button>
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors">
            <Icons.help className="w-4 h-4" />
            <span>Help & Support</span>
          </button>
        </div>
      </div>
    </div>
  )
}
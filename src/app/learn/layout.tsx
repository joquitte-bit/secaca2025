export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header voor learn sectie */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Learn</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
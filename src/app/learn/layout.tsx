import { LearnNav } from '@/components/LearnNav'
import { LearnSidebar } from '@/components/LearnSidebar' // Nieuwe import

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <LearnNav />
      
      <div className="flex pt-16">
        <LearnSidebar /> {/* Vervang DashboardSidebar */}
        
        <div className="ml-56 flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
          <main className="flex-1 p-6 ml-[25px] w-[95%] max-w-[calc(100%-50px)]">
            {children}
          </main>
          
          <footer className="bg-white border-t border-gray-200 h-12 flex items-center justify-center shrink-0 ml-[25px] w-[95%] max-w-[calc(100%-50px)]">
            <div className="text-center text-gray-500 text-sm">
              SECACA Learn &copy; {new Date().getFullYear()}
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
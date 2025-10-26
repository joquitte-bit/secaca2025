// src/app/learn/layout.tsx
import { LearnNav } from '@/components/LearnNav';

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Navbar */}
      <LearnNav />
      
      {/* Main Content Area - groeit om ruimte te maken voor footer */}
      <div className="flex-1 flex flex-col pt-16"> {/* pt-16 voor navbar hoogte */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer - altijd onderaan */}
        <footer className="bg-white border-t border-gray-200 h-12 flex items-center justify-center shrink-0">
          <div className="text-center text-gray-500 text-sm">
            SECACA Learn &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </div>
  );
}
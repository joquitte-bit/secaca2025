// src/app/learn/layout.tsx
import { LearnNav } from '@/components/LearnNav';

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar - ZONDER ml-64 */}
      <LearnNav />
      
      {/* Main Content - ZONDER ml-64, sidebar wordt in children geplaatst */}
      <div className="flex-1 pt-16"> {/* pt-16 voor navbar hoogte */}
        {children}
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 h-12 flex items-center justify-center">
        <div className="text-center text-gray-500 text-sm">
          SECACA Learn &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
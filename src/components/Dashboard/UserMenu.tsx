'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

interface UserMenuProps {
  user: {
    email?: string;
    user_metadata?: {
      full_name?: string;
    };
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        return;
      }
      
      // SIMPELE REDIRECT
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        onClick={() => document.getElementById('user-dropdown')?.classList.toggle('hidden')}
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
          {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <span>▾</span>
      </button>

      <div 
        id="user-dropdown" 
        className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
      >
        <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
          <p className="font-medium text-gray-900">
            {user?.user_metadata?.full_name || 'Gebruiker'}
          </p>
          <p>{user?.email}</p>
        </div>
        
        <button 
          onClick={handleLogout}
          disabled={isLoading}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Uitloggen...' : 'Uitloggen'}
        </button>
      </div>
    </div>
  );
}
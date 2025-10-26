// src/components/BackButton.tsx
'use client'

import { useRouter } from 'next/navigation'

export function BackButton() {
  const router = useRouter()

  return (
    <button 
      onClick={() => router.back()}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Terug naar overzicht
    </button>
  )
}
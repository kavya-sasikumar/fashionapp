'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

interface Outfit {
  items: string[]
  description: string
  styleTips: string[]
  occasion: string
}

export default function OutfitRecommendationsPage() {
  const { user } = useUser()
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      generateRecommendations()
    }
  }, [user])

  async function generateRecommendations() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/wardrobe/recommend', {
        method: 'POST',
      })

      if (res.ok) {
        const data = await res.json()
        setOutfits(data.outfits)
      } else {
        setError('Failed to generate outfit recommendations. Make sure you have items in your wardrobe.')
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error)
      setError('Error generating recommendations')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 text-center">
        <p className="text-gray-600">Please sign in to get outfit recommendations.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
          Outfit Recommendations
        </h1>
        <p className="text-gray-400">AI-generated outfit combos based on your wardrobe</p>
      </div>

      <div className="flex gap-4 mb-10">
        <button
          onClick={generateRecommendations}
          disabled={loading}
          className="px-6 py-2.5 rounded-full text-sm font-medium bg-[#6B2737] text-white hover:bg-[#8B3A4A] disabled:opacity-50 transition-colors">
          {loading ? 'Generating...' : 'Generate New Recommendations'}
        </button>

        <Link
          href="/wardrobe"
          className="px-6 py-2.5 rounded-full text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
          Back to Wardrobe
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-10 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <p className="text-gray-400">Analyzing your wardrobe and generating outfit combinations...</p>
        </div>
      ) : outfits.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">No recommendations yet. Add items to your wardrobe first!</p>
          <Link
            href="/wardrobe"
            className="inline-block mt-4 px-6 py-2.5 rounded-full text-sm font-medium bg-[#6B2737] text-white hover:bg-[#8B3A4A]">
            Go to Wardrobe
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {outfits.map((outfit, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                    Outfit {idx + 1}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">{outfit.description}</p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Occasion:</span> {outfit.occasion}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {outfit.items.map((item, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-600 text-center px-2">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Style Tips</h3>
                <ul className="space-y-2">
                  {outfit.styleTips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-3">
                      <span className="text-[#6B2737] font-bold">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

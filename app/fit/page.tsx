'use client'

import { useState, useRef } from 'react'

const womenProducts = ['Dresses & Gowns', 'Tops & Blouses', 'Skirts', 'Jeans & Trousers', 'Jackets & Coats', 'Activewear & Leggings', 'Swimwear', 'Lingerie & Loungewear']
const menProducts   = ['T-Shirts & Polos', 'Dress Shirts', 'Suits & Blazers', 'Shorts', 'Hoodies & Sweatshirts', 'Activewear', 'Outerwear & Coats']
const womenSizes    = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const menSizes      = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL']
const brandList     = ['Zara', 'H&M', 'Uniqlo', 'Nike', 'Hollister Co.']
const fitList       = ['Boxy', 'Skinny', 'Slim', 'Cropped']

const sizeConversionUp: Record<string, string> = { XS: 'S', S: 'M', M: 'L', L: 'XL', XL: 'XXL', XXL: 'XXL', '2XL': '3XL', '3XL': '3XL' }
const sizeConversionDown: Record<string, string> = { XS: 'XS', S: 'XS', M: 'S', L: 'M', XL: 'L', XXL: 'XL', '2XL': 'XL', '3XL': '2XL' }

const brandSizeTendency: Record<string, 'same' | 'up' | 'down'> = { 
  'Zara': 'up', 'H&M': 'same', 'ASOS': 'same', 'Uniqlo': 'up',
  "Levi's": 'down', 'Nike': 'same', 'Adidas': 'same',
  'Gap': 'down', 'Banana Republic': 'same', 'Mango': 'up',
}

function convertSize(fromBrand: string, toBrand: string, size: string) {
  const from = brandSizeTendency[fromBrand] ?? 'same'
  const to   = brandSizeTendency[toBrand]   ?? 'same'
  if (from === to || to === 'same') return size
  if (to === 'up') return sizeConversionUp[size] ?? size
  return sizeConversionDown[size] ?? size
}

export default function FitPage() {
  const [gender, setGender]     = useState<'women' | 'men'>('women')
  const [knownBrand, setKnownBrand] = useState('')
  const [targetBrand, setTargetBrand] = useState('')
  const [product, setProduct]   = useState('')
  const [size, setSize]         = useState('')
  const [fit, setFit]           = useState('')
  const [result, setResult]     = useState<{ size: string; brand: string; fit: string } | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const sizes = gender === 'women' ? womenSizes : menSizes
  const products = gender === 'women' ? womenProducts : menProducts

  const [waist, setWaist] = useState('')
  const [inseam, setInseam] = useState('')
  const isJeans = product === 'Jeans & Trousers'

  const ready = knownBrand && targetBrand && product && fit !== targetBrand &&
    (isJeans ? (waist && inseam) : size)

  const jeanWaists  = ['26', '28', '30', '32', '34', '36', '38', '40']
  const jeanInseams = ['28', '30', '32', '34']

  // how many inches a brand tends to run small/large in the waist
  const brandJeanOffset: Record<string, number> = {
    'Zara': -1, 'H&M': 0, 'Uniqlo': -1, 'Nike': 0, 'Hollister Co.': -2,
  }

  function findSize() {
    if (!ready) return
    if (isJeans) {
      const convertedWaist = convertJeanWaist(knownBrand, targetBrand, waist)
      setResult({ size: `${convertedWaist} x ${inseam}`, brand: targetBrand, fit })
    } else {
      const converted = convertSize(knownBrand, targetBrand, size)
      setResult({ size: converted, brand: targetBrand, fit })
    }
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
  }

  function convertJeanWaist(fromBrand: string, toBrand: string, waist: string) {
    const from = brandJeanOffset[fromBrand] ?? 0
    const to   = brandJeanOffset[toBrand] ?? 0
    const diff = to - from
    const num = parseInt(waist, 10) + diff
    // snap to nearest available even waist size
    return jeanWaists.reduce((closest, w) =>
      Math.abs(parseInt(w) - num) < Math.abs(parseInt(closest) - num) ? w : closest
    , jeanWaists[0])
  }

  function switchGender(g: 'women' | 'men') {
    setGender(g)
    setProduct('')
    setSize('')
    setResult(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Find Your Fit</h1>
        <p className="text-gray-400 text-sm">Tell us your size in one brand — we'll convert it to another.</p>
      </div>

      <div className="space-y-10">

        {/* Step 1 - Gender */}
        <div className="flex gap-5 items-start">
          <span className="w-9 h-9 rounded-full bg-rose-50 text-[#6B2737] flex items-center justify-center text-sm font-bold shrink-0 border border-[#6B2737]/20" style={{ fontFamily: "var(--font-playfair)" }}>1</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-3">Style Section</p>
            <div className="flex gap-2">
              {(['women', 'men'] as const).map(g => (
                <button key={g} onClick={() => switchGender(g)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium border-2 transition-colors ${
                    gender === g ? 'bg-[#6B2737] text-white border-[#6B2737]' : 'text-gray-500 border-gray-200 hover:border-[#6B2737]'
                  }`}>
                  {g === 'women' ? 'Women' : 'Men'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 - Known brand + size */}
        <div className="flex gap-5 items-start">
          <span className="w-9 h-9 rounded-full bg-rose-50 text-[#6B2737] flex items-center justify-center text-sm font-bold shrink-0 border border-[#6B2737]/20" style={{ fontFamily: "var(--font-playfair)" }}>2</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1">My size in...</p>
            <p className="text-xs text-gray-400 mb-3">Pick a brand you already know your size in</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {brandList.map(b => (
                <button key={b} onClick={() => setKnownBrand(b)}
                  className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${
                    knownBrand === b ? 'bg-[#6B2737] text-white border-[#6B2737] font-medium' : 'text-gray-500 border-gray-200 hover:border-[#6B2737]'
                  }`}>
                  {b}
                </button>
              ))}
            </div>
            {knownBrand && (
              <div className="flex flex-wrap gap-2">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`w-14 h-14 rounded-2xl text-sm font-bold border-2 transition-colors ${
                      size === s ? 'bg-[#6B2737] text-white border-[#6B2737]' : 'text-gray-600 border-gray-200 hover:border-[#6B2737]'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Step 3 - Target brand */}
        <div className="flex gap-5 items-start">
          <span className="w-9 h-9 rounded-full bg-rose-50 text-[#6B2737] flex items-center justify-center text-sm font-bold shrink-0 border border-[#6B2737]/20" style={{ fontFamily: "var(--font-playfair)" }}>3</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-1">I want to shop at...</p>
            <p className="text-xs text-gray-400 mb-3">Pick the brand you want to buy from</p>
            <div className="flex flex-wrap gap-2">
              {brandList.filter(b => b !== knownBrand).map(b => (
                <button key={b} onClick={() => setTargetBrand(b)}
                  className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${
                    targetBrand === b ? 'bg-[#6B2737] text-white border-[#6B2737] font-medium' : 'text-gray-500 border-gray-200 hover:border-[#6B2737]'
                  }`}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4 - Product */}
        <div className="flex gap-5 items-start">
          <span className="w-9 h-9 rounded-full bg-rose-50 text-[#6B2737] flex items-center justify-center text-sm font-bold shrink-0 border border-[#6B2737]/20" style={{ fontFamily: "var(--font-playfair)" }}>4</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-3">What are you shopping for?</p>
            <div className="flex flex-wrap gap-2">
              {products.map(p => (
                <button key={p} onClick={() => setProduct(p)}
                  className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${
                    product === p ? 'bg-[#6B2737] text-white border-[#6B2737] font-medium' : 'text-gray-500 border-gray-200 hover:border-[#6B2737]'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 5 - Product */}
        <div className="flex gap-5 items-start">
          <span className="w-9 h-9 rounded-full bg-rose-50 text-[#6B2737] flex items-center justify-center text-sm font-bold shrink-0 border border-[#6B2737]/20" style={{ fontFamily: "var(--font-playfair)" }}>5</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 mb-3">What is the fit you are looking for?</p>
            <div className="flex flex-wrap gap-2">
              {fitList.map(f => (
                <button key={f} onClick={() => setFit(f)}
                  className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${
                    fit === f ? 'bg-[#6B2737] text-white border-[#6B2737] font-medium' : 'text-gray-500 border-gray-200 hover:border-[#6B2737]'
                  }`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={findSize}
          disabled={!ready}
          className="w-full bg-[#6B2737] text-white py-4 rounded-2xl font-semibold text-base hover:bg-[#8B3A4A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          Find my Size
        </button>

        {result && (
          <div ref={resultRef} className="bg-[#6B2737] rounded-3xl p-6 text-white">
            <p className="text-xs font-semibold tracking-widest uppercase text-rose-300 mb-3">Your Size in {result.brand}</p>
            <p className="text-5xl font-bold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>{result.size}</p>
            <p className="text-rose-200 text-sm mt-2">Based on your {knownBrand} size {size} in {product} for {fit}</p>
          </div>
        )}

      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const playfair = { fontFamily: "var(--font-playfair)" }

const events = [
  { id: 'daily',     label: 'Everyday Looks',              sub: 'Effortless style for your daily routine',    img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80' },
  { id: 'parties',   label: 'Party & Nightout',            sub: 'Turn heads at every celebration',            img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80' },
  { id: 'weekend',   label: 'Weekend Vibes',               sub: 'Casual, cool & put-together',               img: 'https://images.unsplash.com/photo-1485125639709-a60c3a500bf1?w=600&q=80' },
  { id: 'concerts',  label: 'Concerts & Live Shows',       sub: 'Stand out in the crowd',                    img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80' },
  { id: 'corporate', label: 'Work & Corporate',            sub: 'Dress sharp, feel confident',               img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80' },
  { id: 'family',    label: 'Family Dinners & Gatherings', sub: 'Warm, elegant & effortlessly put-together',  img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80' },
  { id: 'gym',       label: 'Gym & Activewear',            sub: 'Outfits that move with you',                 img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80' },
]

const styleImages: Record<string, { women: {id:number,src:string}[], men: {id:number,src:string}[] }> = {
  daily: {
    women: [
      { id: 101, src: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80' },
      { id: 102, src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80' },
      { id: 103, src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80' },
      { id: 104, src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&q=80' },
      { id: 105, src: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=300&q=80' },
      { id: 106, src: 'https://images.unsplash.com/photo-1485125639709-a60c3a500bf1?w=300&q=80' },
    ],
    men: [
      { id: 107, src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80' },
      { id: 108, src: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=300&q=80' },
      { id: 109, src: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&q=80' },
      { id: 110, src: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=300&q=80' },
      { id: 111, src: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=300&q=80' },
      { id: 112, src: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&q=80' },
    ],
  },
  parties: {
    women: [
      { id: 201, src: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80' },
      { id: 202, src: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&q=80' },
      { id: 203, src: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=300&q=80' },
      { id: 204, src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&q=80' },
      { id: 205, src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80' },
      { id: 206, src: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&q=80' },
    ],
    men: [
      { id: 207, src: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=300&q=80' },
      { id: 208, src: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=300&q=80' },
      { id: 209, src: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=300&q=80' },
      { id: 210, src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80' },
      { id: 211, src: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&q=80' },
      { id: 212, src: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&q=80' },
    ],
  },
  weekend: {
    women: [
      { id: 301, src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=300&q=80' },
      { id: 302, src: 'https://images.unsplash.com/photo-1485125639709-a60c3a500bf1?w=300&q=80' },
      { id: 303, src: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80' },
      { id: 304, src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80' },
      { id: 305, src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80' },
      { id: 306, src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80' },
    ],
    men: [
      { id: 307, src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80' },
      { id: 308, src: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&q=80' },
      { id: 309, src: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=300&q=80' },
      { id: 310, src: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=300&q=80' },
      { id: 311, src: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=300&q=80' },
      { id: 312, src: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&q=80' },
    ],
  },
  concerts: {
    women: [
      { id: 401, src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&q=80' },
      { id: 402, src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&q=80' },
      { id: 403, src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&q=80' },
      { id: 404, src: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=300&q=80' },
      { id: 405, src: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&q=80' },
      { id: 406, src: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&q=80' },
    ],
    men: [
      { id: 407, src: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=300&q=80' },
      { id: 408, src: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=300&q=80' },
      { id: 409, src: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&q=80' },
      { id: 410, src: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=300&q=80' },
      { id: 411, src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80' },
      { id: 412, src: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&q=80' },
    ],
  },
  corporate: {
    women: [
      { id: 501, src: 'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=300&q=80' },
      { id: 502, src: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=300&q=80' },
      { id: 503, src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=80' },
      { id: 504, src: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80' },
      { id: 505, src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80' },
      { id: 506, src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80' },
    ],
    men: [
      { id: 507, src: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=300&q=80' },
      { id: 508, src: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=300&q=80' },
      { id: 509, src: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=300&q=80' },
      { id: 510, src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80' },
      { id: 511, src: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&q=80' },
      { id: 512, src: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&q=80' },
    ],
  },
  family: {
    women: [
      { id: 601, src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80' },
      { id: 602, src: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&q=80' },
      { id: 603, src: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=300&q=80' },
      { id: 604, src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80' },
      { id: 605, src: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=300&q=80' },
      { id: 606, src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80' },
    ],
    men: [
      { id: 607, src: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=300&q=80' },
      { id: 608, src: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=300&q=80' },
      { id: 609, src: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&q=80' },
      { id: 610, src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80' },
      { id: 611, src: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=300&q=80' },
      { id: 612, src: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=300&q=80' },
    ],
  },
  gym: {
    women: [
      { id: 701, src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80' },
      { id: 702, src: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80' },
      { id: 703, src: 'https://images.unsplash.com/photo-1544216717-3bbf52512659?w=300&q=80' },
      { id: 704, src: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300&q=80' },
      { id: 705, src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&q=80' },
      { id: 706, src: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&q=80' },
    ],
    men: [
      { id: 707, src: 'https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=300&q=80' },
      { id: 708, src: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&q=80' },
      { id: 709, src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80' },
      { id: 710, src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&q=80' },
      { id: 711, src: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=300&q=80' },
      { id: 712, src: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?w=300&q=80' },
    ],
  },
}

const products = [
  { id: 1, brand: 'Blush & Threads', name: 'Purple Floral Dress',  price: '$89',  src: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100&q=80' },
  { id: 2, brand: 'Luxe Loom',       name: 'Pink Flowy Dress',     price: '$124', src: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=100&q=80' },
  { id: 3, brand: 'Ivory & Lace',    name: 'Diamond Necklace',     price: '$210', src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&q=80' },
]

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6">
    &#8592; Back
  </button>
)

export default function EventsPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [selectedStyles, setSelectedStyles] = useState<number[]>([])
  const [styleGender, setStyleGender] = useState<'women' | 'men'>('women')

  const eventLabel = events.find(e => e.id === selectedEvent)?.label ?? ''
  const currentStyleImages = (selectedEvent && styleImages[selectedEvent]?.[styleGender]) ?? []

  function toggleStyle(id: number) {
    setSelectedStyles(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <BackButton onClick={() => setStep(2)} />
        <h2 className="text-2xl font-bold text-gray-900 mb-6" style={playfair}>Based on your selections</h2>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {selectedStyles.map(id => {
            const img = styleImages.find(s => s.id === id)!
            return (
              <img key={id} src={img.src} alt={img.alt}
                className="w-28 h-28 object-cover rounded-2xl flex-shrink-0 shadow-sm" />
            )
          })}
        </div>

        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          Your style is <strong className="text-gray-900">romantic and feminine</strong>, with a love for timeless elegance and intricate details.
          You appreciate <strong className="text-gray-900">standout pieces</strong> that blend confidence with graceful charm.
          Your selections radiate <strong className="text-gray-900">polished and glamorous</strong> vibes.
        </p>

        <h3 className="text-lg font-semibold text-gray-900 mb-4" style={playfair}>Products you may like</h3>
        <div className="flex flex-col gap-3 mb-8">
          {products.map(p => (
            <div key={p.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <img src={p.src} alt={p.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">{p.brand}</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                <p className="text-xs text-[#6B2737] font-medium mt-0.5">{p.price}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full bg-[#6B2737] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#8B3A4A] transition-colors">
          View More
        </button>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <BackButton onClick={() => setStep(1)} />
        <h2 className="text-2xl font-bold text-gray-900 mb-1" style={playfair}>Pick 3 {eventLabel} Styles</h2>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-400">{selectedStyles.length} of 3 selected</p>
          <div className="flex gap-1 bg-gray-100 rounded-full p-0.5">
            {(['women', 'men'] as const).map(g => (
              <button key={g} onClick={() => { setStyleGender(g); setSelectedStyles([]) }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${
                  styleGender === g ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}>
                {g === 'women' ? 'Women' : 'Men'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {currentStyleImages.map(img => {
            const picked = selectedStyles.includes(img.id)
            return (
              <button key={img.id} onClick={() => toggleStyle(img.id)}
                className={`relative rounded-2xl overflow-hidden aspect-[3/4] border-2 transition-all ${picked ? 'border-[#6B2737]' : 'border-transparent'}`}>
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                {picked && (
                  <div className="absolute inset-0 bg-[#6B2737]/20 flex items-end justify-end p-2">
                    <span className="bg-[#6B2737] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {selectedStyles.indexOf(img.id) + 1}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <button
          disabled={selectedStyles.length < 3}
          onClick={() => setStep(3)}
          className="w-full bg-[#6B2737] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#8B3A4A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Generate Styles
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-700 transition-colors text-lg">&#8592;</button>
        <h1 className="text-2xl font-bold text-gray-900" style={playfair}>Pick An Event</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {events.map((event, i) => {
          const featured = i === 0
          return (
            <button
              key={event.id}
              onClick={() => { setSelectedEvent(event.id); setSelectedStyles([]); setStep(2) }}
              className={`relative overflow-hidden rounded-2xl text-left group ${featured ? 'col-span-2 h-44' : 'h-36'}`}>
              <img
                src={event.img}
                alt={event.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-white font-semibold text-sm">{event.label}</p>
                <p className="text-white/70 text-xs mt-0.5">{event.sub}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

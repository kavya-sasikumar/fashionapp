import Link from 'next/link'

const features = [
  {
    title: 'Pick an Event',
    description: 'From parties to corporate — get AI outfit inspiration tailored to your occasion.',
    href: '/events',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=224&fit=crop&crop=center&q=80',
    position: 'object-center',
  },
  {
    title: 'Find Your Fit',
    description: 'Know your size in any brand. No more guessing, no more returns.',
    href: '/fit',
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&h=224&fit=crop&crop=center&q=80',
    position: 'object-center',
  },
  {
    title: 'Chat with Stylist',
    description: 'Your personal AI stylist, available 24/7 to answer any style question.',
    href: '/chat',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600&h=224&fit=crop&crop=center&q=80',
    position: 'object-center',
  },
]

export default function HomePage() {
  return (
    <div>

      {/* Hero */}
      <section className="grid md:grid-cols-2 min-h-[580px]">
        <div className="flex flex-col justify-center px-10 py-16 md:py-24">
          <span className="text-xs font-semibold tracking-widest text-[#6B2737] uppercase mb-4">
            AI-Powered Fashion
          </span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900 mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
            Your Style,{' '}
            <span className="text-[#6B2737] italic">Elevated.</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
            Discover outfits for every occasion, find your perfect fit across brands, and get instant advice from your AI stylist.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/events"
              className="bg-[#6B2737] text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-[#8B3A4A] transition-colors shadow-md">
              Get Styled
            </Link>
            <Link href="/chat"
              className="border-2 border-[#6B2737] text-[#6B2737] px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-rose-50 transition-colors">
              Chat with Stylist
            </Link>
          </div>
        </div>

        {/* Hero images — tall editorial layout */}
        <div className="hidden md:flex gap-3 p-6 h-[460px]">
          <div className="rounded-3xl overflow-hidden flex-1">
            <img
              src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&q=80"
              alt="Fashion clothing"
              className="w-full h-full object-cover object-center" />
          </div>
          <div className="rounded-3xl overflow-hidden flex-1 mt-8">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80"
              alt="Fashion shopping"
              className="w-full h-full object-cover object-center" />
          </div>
        </div>
      </section>

      {/* Wine red banner */}
      <section className="bg-[#6B2737] px-10 py-5 flex items-center justify-between">
        <p className="text-white font-medium text-sm tracking-wide">
          Powered by AI — styled for you. Get your look in seconds.
        </p>
        <Link href="/chat" className="text-white text-sm font-bold underline underline-offset-4 whitespace-nowrap">
          Try it now →
        </Link>
      </section>

      {/* Features */}
      <section className="px-10 py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-[#6B2737] uppercase mb-2">What We Offer</p>
          <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-playfair)" }}>Everything you need to<br />dress your best.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(feature => (
            <Link key={feature.title} href={feature.href}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#6B2737] transition-all">
              <div className="h-44 overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className={`w-full h-full object-cover ${feature.position} group-hover:scale-105 transition-transform duration-500`}
                  />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
                <span className="inline-block mt-3 text-[#6B2737] text-xs font-semibold">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-10 mb-16 rounded-3xl bg-gradient-to-r from-[#6B2737] to-[#9B4A5A] px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-playfair)" }}>Ready to find your look?</h3>
          <p className="text-red-200 text-sm">Tell us the occasion and we'll do the rest.</p>
        </div>
        <Link href="/events"
          className="bg-white text-[#6B2737] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-red-50 transition-colors whitespace-nowrap shadow-md">
          Pick an Event
        </Link>
      </section>

    </div>
  )
}

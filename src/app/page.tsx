import { Navbar } from '@/components/navbar'
import Hero from '@/components/hero'
import Features from '@/components/features'
import HowItWorks from '@/components/how-it-works'
import Pricing from '@/components/pricing'
import Footer from '@/components/footer'
import Testimonials from '@/components/testimonials'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials/>
      <Pricing />
      <Footer />
    </main>
  )
}
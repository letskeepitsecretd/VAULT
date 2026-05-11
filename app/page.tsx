import Hero from '@/components/Hero';
import ProductShowcase from '@/components/ProductShowcase';
import WatchShowcase from '@/components/WatchShowcase';
import ShoeShowcase from '@/components/ShoeShowcase';
import AudioShowcase from '@/components/AudioShowcase';
import Navbar from '@/components/Navbar';
import SmoothScroll from '@/components/SmoothScroll';

export default function Home() {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="bg-[#050505]">
        <Hero />
        
        <WatchShowcase />

        <ShoeShowcase />

        <AudioShowcase />
      </main>
    </SmoothScroll>
  );
}
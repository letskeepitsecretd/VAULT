"use client";
import { useLenis } from 'lenis/react';

export default function Navbar() {
  const lenis = useLenis();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(targetId);
    } else {
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 bg-black/20 backdrop-blur-md">
      <div className="text-white font-bold text-2xl tracking-widest">VAULT</div>
      <div className="flex gap-6 text-sm text-gray-300">
        <a href="#watches" onClick={(e) => handleScroll(e, '#watches')} className="hover:text-white transition-colors">WATCHES</a>
        <a href="#footwear" onClick={(e) => handleScroll(e, '#footwear')} className="hover:text-white transition-colors">FOOTWEAR</a>
        <a href="#audio" onClick={(e) => handleScroll(e, '#audio')} className="hover:text-white transition-colors">AUDIO</a>
      </div>
      <div>
        <button className="text-white font-medium hover:text-cyan-400 transition-colors">CART</button>
      </div>
    </nav>
  );
}

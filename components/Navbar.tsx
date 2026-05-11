"use client";
import { useState } from 'react';
import { useLenis } from 'lenis/react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const lenis = useLenis();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (lenis) {
      lenis.scrollTo(targetId);
    } else {
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-10 py-4 sm:py-6 bg-black/20 backdrop-blur-md">
      <div className="text-white font-bold text-lg sm:text-2xl tracking-widest">VAULT</div>
      
      {/* Desktop Nav */}
      <div className="hidden md:flex gap-6 text-sm text-gray-300">
        <a href="#watches" onClick={(e) => handleScroll(e, '#watches')} className="hover:text-white transition-colors">WATCHES</a>
        <a href="#footwear" onClick={(e) => handleScroll(e, '#footwear')} className="hover:text-white transition-colors">FOOTWEAR</a>
        <a href="#audio" onClick={(e) => handleScroll(e, '#audio')} className="hover:text-white transition-colors">AUDIO</a>
      </div>
      <div className="hidden md:block">
        <button className="text-white font-medium hover:text-cyan-400 transition-colors">CART</button>
      </div>

      {/* Mobile Hamburger */}
      <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl flex flex-col items-center gap-6 py-8 md:hidden border-t border-white/10">
          <a href="#watches" onClick={(e) => handleScroll(e, '#watches')} className="text-white text-lg tracking-widest">WATCHES</a>
          <a href="#footwear" onClick={(e) => handleScroll(e, '#footwear')} className="text-white text-lg tracking-widest">FOOTWEAR</a>
          <a href="#audio" onClick={(e) => handleScroll(e, '#audio')} className="text-white text-lg tracking-widest">AUDIO</a>
          <button className="text-cyan-400 font-medium text-lg tracking-widest">CART</button>
        </div>
      )}
    </nav>
  );
}

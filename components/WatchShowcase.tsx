"use client";
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Cpu, ShieldCheck, Waves } from 'lucide-react';

export default function WatchShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const frameCount = 232;
    const currentFrame = (index: number) => 
      `/sequences/watch/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

    const images: HTMLImageElement[] = [];
    const seq = { frame: 1 };

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    images[0].onload = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    function render() { if (!canvas || !context) return;
      if (images[seq.frame - 1] && images[seq.frame - 1].complete) {
        const img = images[seq.frame - 1];
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.height * imgRatio;
          drawHeight = canvas.height;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // Added 1 duration unit delay before any transitions begin
      tl.to({}, { duration: 1 }); 

      tl.to(titleRef.current, {
        opacity: 0,
        scale: 0.8,
        filter: "blur(20px)",
        duration: 1.5,
      })
      .fromTo(canvasRef.current, 
        { scale: 1.4, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 2 }, 
        "-=1"
      )
      .to(seq, {
        frame: frameCount,
        snap: "frame",
        ease: "none",
        duration: 2.5, 
        onUpdate: render,
      }, "-=2")
      .fromTo(contentRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5 },
        "-=1.5"
      );
    });

    const handleResize = () => { if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [addToCart]);

  return (
    <section id="watches" ref={sectionRef} className="relative h-screen w-full bg-[#050505] overflow-hidden">
      <canvas 
        ref={canvasRef}
        style={{ opacity: 0, transform: 'scale(1.4)' }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-center items-center w-full h-full">
        <h2 
          ref={titleRef}
          className="text-[12vw] font-black text-white/90 uppercase whitespace-nowrap text-center"
          style={{ letterSpacing: '0.1em', paddingLeft: '0.1em', textShadow: '0 0 30px rgba(255, 255, 255, 0.2)' }}
        >
          WATCHES
        </h2>
      </div>
      <div className="relative z-30 h-full flex items-center px-10 md:px-20 pointer-events-none">
        <div ref={contentRef} className="max-w-xl space-y-8 opacity-0 pointer-events-auto">
          <div className="space-y-2">
            <span className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-sm">Chronograph Series</span>
            <h3 className="text-5xl md:text-7xl font-bold text-white uppercase leading-none">Vault V-1</h3>
            <p className="text-gray-400 text-lg max-w-md">
              Engineered with aerospace-grade steel and a sapphire crystal interface. Precision redefined.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-white/70">
            <div className="flex items-center gap-3">
              <Cpu className="text-cyan-400 w-5 h-5" />
              <span className="text-xs uppercase tracking-widest">Swiss Movement</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-cyan-400 w-5 h-5" />
              <span className="text-xs uppercase tracking-widest">Sapphire Glass</span>
            </div>
            <div className="flex items-center gap-3">
              <Waves className="text-cyan-400 w-5 h-5" />
              <span className="text-xs uppercase tracking-widest">10 ATM Water</span>
            </div>
          </div>
          <div className="flex items-center gap-8 pt-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase tracking-widest">Price</span>
              <span className="text-3xl font-bold text-white">$799.00</span>
            </div>
            <button 
              onClick={() => addToCart({ id: 'watch-v1', name: 'Vault V-1 Watch', price: 799, category: 'Watches', image: '/watch-thumb.jpg' })}
              className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-cyan-400 transition-all transform hover:scale-105"
            >
              <ShoppingCart size={20} />
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-30 hidden md:block">
        <div className="flex flex-col gap-4 items-center">
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="w-1 h-12 bg-gradient-to-b from-cyan-500 to-transparent rounded-full" />
          <span className="[writing-mode:vertical-lr] text-[10px] tracking-[0.5em] text-cyan-500 uppercase font-bold">Evolution</span>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Zap, Wind, Cloud } from 'lucide-react';

export default function ShoeShowcase() {
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

    const frameCount = 150; // Capped to exactly 5 seconds worth of frames (assuming 30fps)
    const currentFrame = (index: number) => 
      `/sequences/shoe/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

    const images: HTMLImageElement[] = [];
    const seq = { frame: 1 };

    // Load first image immediately
    const firstImg = new Image();
    firstImg.src = currentFrame(1);
    images.push(firstImg);

    firstImg.onload = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
      
      // Progressively load the rest so we don't crash mobile browsers
      let i = 2;
      const loadNext = () => {
        if (i <= frameCount) {
          const img = new Image();
          img.src = currentFrame(i);
          images.push(img);
          i++;
          setTimeout(loadNext, 10); // Throttle loading
        }
      };
      loadNext();
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

      // 1-second delay for consistency
      tl.to({}, { duration: 1 });

      // 1. Initial State: Title "SHOES" fades and zooms out (scales UP to 2)
      tl.to(titleRef.current, {
        opacity: 0,
        scale: 2, 
        filter: "blur(30px)",
        duration: 1.5,
      })
      // 2. Video Transition: The shoe enters with a smooth scale-up
      .fromTo(canvasRef.current, 
        { scale: 0.6, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 2 }, 
        "-=1"
      )
      // Play the shoe sequence concurrently
      .to(seq, {
        frame: frameCount,
        snap: "frame",
        ease: "none",
        duration: 2.5, 
        onUpdate: render,
      }, "-=2")
      // 3. Product Info Reveal: Details slide in from the left
      .fromTo(contentRef.current,
        { x: -100, opacity: 0 },
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
    <section id="footwear" ref={sectionRef} className="relative h-screen w-full bg-[#050505] overflow-hidden">
      {/* Background Video - Shoe Animation */}
      <canvas 
        ref={canvasRef}
        style={{ opacity: 0, transform: 'scale(0.6)' }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Cinematic Dark Overlay (Flipped for right-side content) */}
      <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-transparent z-10 pointer-events-none" />

      {/* 1. The Big Title (Visible First) - Absolute Bulletproof Centering */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-center items-center w-full h-full">
        <h2 
          ref={titleRef}
          className="text-[15vw] font-black tracking-tighter text-white/90 uppercase whitespace-nowrap text-center"
        >
          Shoes
        </h2>
      </div>

      {/* 2. Product Details (Reveals on Scroll) */}
      <div className="relative z-30 h-full flex items-center justify-end px-10 md:px-20 pointer-events-none">
        <div ref={contentRef} className="max-w-xl space-y-8 text-right flex flex-col items-end opacity-0 pointer-events-auto">
          <div className="space-y-2">
            <span className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-sm">Velocity Line</span>
            <h3 className="text-5xl md:text-7xl font-bold text-white uppercase leading-none">Aero-Step G1</h3>
            <p className="text-gray-400 text-lg max-w-md ml-auto">
              Defy gravity with our proprietary nitrogen-infused cushioning. Maximum energy return, minimum weight.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-white/70 w-full">
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs uppercase tracking-widest">Ultra Light</span>
              <Wind className="text-cyan-400 w-5 h-5" />
            </div>
            <div className="flex items-center justify-end gap-3">
              <span className="text-xs uppercase tracking-widest">Energy Return</span>
              <Zap className="text-cyan-400 w-5 h-5" />
            </div>
            <div className="flex items-center justify-end gap-3 col-span-2">
              <span className="text-xs uppercase tracking-widest">Breathable Mesh</span>
              <Cloud className="text-cyan-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex items-center gap-8 pt-6">
            <div className="flex flex-col items-end">
              <span className="text-gray-500 text-xs uppercase tracking-widest">Price</span>
              <span className="text-3xl font-bold text-white">$249.00</span>
            </div>
            <button 
              onClick={() => addToCart({ id: 'shoe-g1', name: 'Aero-Step G1', price: 249, category: 'Shoes', image: '/shoe-thumb.jpg' })}
              className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-cyan-400 transition-all transform hover:scale-105"
            >
              <ShoppingCart size={20} />
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute left-10 bottom-10 z-30 opacity-20 pointer-events-none">
        <span className="text-8xl font-bold text-white select-none">02</span>
      </div>
    </section>
  );
}

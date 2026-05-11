"use client";
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Volume2, Bluetooth, Battery, Mic } from 'lucide-react';

export default function AudioShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const buyBarRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const frameCount = 174;
    const currentFrame = (index: number) => 
      `/sequences/headphones/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

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
      
      let i = 2;
      const loadNext = () => {
        if (i <= frameCount) {
          const img = new Image();
          img.src = currentFrame(i);
          images.push(img);
          i++;
          setTimeout(loadNext, 10);
        }
      };
      loadNext();
    };

    function render() {
      if (!canvas || !context) return;
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
          end: "+=350%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      tl.to({}, { duration: 1 });

      tl.to(titleRef.current, {
        opacity: 0,
        letterSpacing: "5em",
        filter: "blur(20px)",
        duration: 1.5,
      })
      .fromTo(canvasRef.current, 
        { scale: 1.2, opacity: 0 }, 
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
      .fromTo(".feature-label", 
        { y: 40, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.3, duration: 1.5 },
        "-=1.5"
      )
      .fromTo(buyBarRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.8"
      );
    });

    const handleResize = () => {
      if (!canvas) return;
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
    <section id="audio" ref={sectionRef} className="relative h-screen w-full bg-[#050505] overflow-hidden">
      {/* Background Video - Exploded Components */}
      <canvas 
        ref={canvasRef}
        style={{ opacity: 0, transform: 'scale(1.2)' }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex justify-center items-center w-full h-full">
        <h2 
          ref={titleRef}
          className="text-[16vw] md:text-[12vw] font-black tracking-[0.1em] text-white/90 uppercase whitespace-nowrap text-center"
        >
          Audio
        </h2>
      </div>

      {/* Floating Feature Labels */}
      <div ref={labelsRef} className="absolute inset-0 z-30 pointer-events-none">
        {/* Top Left */}
        <div className="feature-label absolute top-[15%] left-[5%] md:top-[20%] md:left-[15%] bg-white/5 backdrop-blur-xl border border-white/10 p-2 md:p-4 rounded-xl">
            <Volume2 className="text-cyan-400 mb-1 md:mb-2" size={16} />
            <p className="text-white font-bold text-[10px] md:text-xs uppercase tracking-tighter">Spatial Audio 2.0</p>
        </div>
        
        {/* Bottom Left */}
        <div className="feature-label absolute bottom-[35%] left-[3%] md:bottom-[30%] md:left-[10%] bg-white/5 backdrop-blur-xl border border-white/10 p-2 md:p-4 rounded-xl">
            <Mic className="text-cyan-400 mb-1 md:mb-2" size={16} />
            <p className="text-white font-bold text-[10px] md:text-xs uppercase tracking-tighter">Studio Mics</p>
        </div>

        {/* Top Right */}
        <div className="feature-label absolute top-[18%] right-[5%] md:top-[25%] md:right-[15%] bg-white/5 backdrop-blur-xl border border-white/10 p-2 md:p-4 rounded-xl">
            <Bluetooth className="text-cyan-400 mb-1 md:mb-2" size={16} />
            <p className="text-white font-bold text-[10px] md:text-xs uppercase tracking-tighter">Low Latency</p>
        </div>

        {/* Bottom Right */}
        <div className="feature-label absolute bottom-[30%] right-[3%] md:bottom-[25%] md:right-[10%] bg-white/5 backdrop-blur-xl border border-white/10 p-2 md:p-4 rounded-xl">
            <Battery className="text-cyan-400 mb-1 md:mb-2" size={16} />
            <p className="text-white font-bold text-[10px] md:text-xs uppercase tracking-tighter">48H Battery</p>
        </div>
      </div>

      {/* Bottom Buy Bar */}
      <div 
        ref={buyBarRef}
        className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-40 w-[95%] md:w-[90%] max-w-4xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 opacity-0 pointer-events-auto"
      >
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg md:text-2xl font-bold text-white uppercase italic tracking-tighter">Sonic-X Headphones</h3>
          <p className="text-cyan-400 text-[10px] md:text-xs font-bold tracking-widest uppercase">Pure Sound Geometry</p>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="text-right">
            <span className="block text-gray-500 text-[10px] uppercase tracking-widest leading-none">Investment</span>
            <span className="text-xl md:text-3xl font-black text-white">$599.00</span>
          </div>
          <button 
            onClick={() => addToCart({ id: 'audio-x', name: 'Sonic-X Headphones', price: 599, category: 'Audio', image: '/audio-thumb.jpg' })}
            className="group relative flex items-center gap-2 md:gap-3 bg-cyan-500 text-black px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all hover:bg-white overflow-hidden"
          >
            <ShoppingCart size={16} className="relative z-10 md:w-5 md:h-5" />
            <span className="relative z-10">ORDER NOW</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-cyan-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-blue-500/5 blur-[150px] pointer-events-none" />
    </section>
  );
}

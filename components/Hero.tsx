"use client";
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const frameCount = 232;
    const currentFrame = (index: number) => 
      `/sequences/sequence1/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

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
      // Create the ScrollTimeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%", // Scroll distance for the animation
          scrub: 1,      // Smoothly follows scroll
          pin: true,     // Keeps the section fixed while animating
          anticipatePin: 1,
        }
      });

      // 1. Initial State: Title is visible, Video is slightly scaled down
      tl.to(titleRef.current, {
        opacity: 0,
        scale: 1.5,
        filter: "blur(20px)",
        duration: 1,
      })
      // 2. Video zooms in and becomes fully clear as title fades
      .to(canvasRef.current, {
        scale: 1.1,
        opacity: 1,
        duration: 2,
      }, "-=0.8") // Start slightly before title finishes fading
      // 3. Play image sequence
      .to(seq, {
        frame: frameCount,
        snap: "frame",
        ease: "none",
        duration: 2,
        onUpdate: render,
      }, "-=2")
      // 4. Subtitle reveals late
      .fromTo(subtitleRef.current, 
        { opacity: 0, y: 50 }, 
        { opacity: 1, y: 0, duration: 1 }, 
        "-=0.5"
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
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden bg-[#050505]"
    >
      {/* Background Sequence Canvas */}
      <canvas 
        ref={canvasRef}
        style={{ opacity: 0.4 }}
        className="absolute inset-0 w-full h-full object-cover z-0 scale-100"
      />

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full pointer-events-none">
        <h1 
          ref={titleRef}
          className="text-[15vw] font-black tracking-tighter text-white leading-none select-none will-change-transform"
          style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.2)' }}
        >
          VAULT
        </h1>
        
        <div 
          ref={subtitleRef}
          className="mt-4 flex flex-col items-center"
        >
          <p className="text-cyan-400 text-lg md:text-2xl font-light tracking-[0.4em] uppercase">
            Beyond Imagination
          </p>
          <div className="mt-10 animate-bounce">
            <div className="w-[1px] h-20 bg-gradient-to-b from-cyan-500 to-transparent" />
          </div>
        </div>
      </div>

      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
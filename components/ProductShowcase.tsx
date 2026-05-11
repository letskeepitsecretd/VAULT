"use client";
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useCart } from '@/context/CartContext';

interface Props {
  title: string;
  subtitle: string;
  price: number;
  sequenceDir: string;
  frameCount: number;
  features: string[];
  reversed?: boolean;
  id: string;
}

export default function ProductShowcase({ title, subtitle, price, sequenceDir, frameCount, features, reversed, id }: Props) {
  const sectionRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const currentFrame = (index: number) => 
      `/sequences/${sequenceDir}/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

    const images: HTMLImageElement[] = [];
    const seq = { frame: 1 };

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    images[0].onload = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
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
      gsap.to(seq, {
        frame: frameCount,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.5,
        },
        onUpdate: render,
      });

      gsap.from(".feature-item-" + id, {
        x: reversed ? 50 : -50,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "top 20%",
          scrub: true,
        }
      });
    });

    const handleResize = () => { if (!canvas) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
      render();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [frameCount, id, reversed, sequenceDir]);

  return (
    <section ref={sectionRef} className="min-h-screen w-full bg-[#050505] flex flex-col md:flex-row items-center justify-center py-20 px-10 gap-10">
      <div className={`w-full md:w-1/2 flex flex-col ${reversed ? 'md:order-2' : ''}`}>
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">{title}</h2>
        <p className="text-cyan-400 text-xl mb-8 font-medium">{subtitle}</p>
        
        <div className="space-y-4 mb-10">
          {features.map((f, i) => (
            <div key={i} className={`feature-item-${id} flex items-center gap-4 text-gray-400 border-l border-cyan-500/30 pl-4`}>
              <span className="text-lg">{f}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <span className="text-3xl font-bold text-white">${price}</span>
          <button 
            onClick={() => addToCart({ id, name: title, price, category: 'Premium', image: '' })}
            className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-all"
          >
            ADD TO CART
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-[60vh] md:h-[80vh] relative rounded-2xl overflow-hidden group">
        <canvas 
          ref={canvasRef}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
import {Logout} from '../components/Logout'
import { Link } from 'react-router-dom'
import { GetModulo, LoopModule } from '../components/Modulo'
import { GetNameUser} from '../components/Users'
import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from "gsap";





export function Home() {
  // Cria estado para armazenar texto da pesquisa
  const [termoBusca, setTermoBusca] = useState('')

  // Função para evitar que a página recarregue ao apertar enter ou clicar no submit
  const handlePesquisa = (e) => {
    e.preventDefault()
  }

  return (
    <main>
      <HeroSection />
      {/*
      
      <section className="header">
        <div className="grid grid-cols-2 p-5 items-center">
          <div className="col-span-1 flex items-center">
            <p className='mt-9' style={{fontSize: '20px'}}>Olá,</p>
            <GetNameUser />
          </div>
          <div className="col-span-2 md:col-span-1 gap-5 flex justify-end">
            <Link to="/equipes" className='self-center' style={{color: '#606c38', opacity: '0.5'}}>Equipes</Link>
            <Logout />
            </div>
        </div>
      </section>
      */}

    

     {/* Seção Módulos */}
     <section className='modulos mt-30 lg:mt-70'>
      {/* Container: Titulo Modulos e Input pesquisa */}
      <div className="grid grid-cols-1 ">
        <div className="flex flex-col items-center">
          <h2 className='text-7xl font-black'>Módulos</h2>
          <div className="line mt-5"></div>
          <div className="pesquisa  w-full mt-5">
            <form onSubmit={handlePesquisa} className='flex align-center justify-center gap-5 p-2'>
              <p className='flex flex-col justify-center'>
                Nome
              </p>
              <input className='w-full p-1 max-w-md' type="text" placeholder='Digite o nome do módulo' value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)}/>
              <button className='text-center' style={{backgroundColor: '#283618'}}>
                <svg className="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
                </svg>
              </button>
            </form>
          </div>
          <Link to="/criarmodulo" className='createModuleLink mt-10 text-2xl' style={{color: '#283618'}}>Criar Modulo</Link>
        </div>

      </div>

      {/* Container - Cards e Submodulos */}
      <div className='mt-10 p-5'>
        <LoopModule termoBusca={termoBusca}/>
      </div>
     </section>
        
    </main>
  )
}


// Posições separadas por breakpoint
const CARDS = [
  {
    id: 1,
    label: "DailyWorkout",
    icon: "🏋️",
    color: "#606c38",
    ahref: "https://daily-checkout-team.vercel.app/",
    pos: { default: { x: "-180px", y: "0px" }, sm: { x: "0px", y: "-130px" } },
    depth: 1.4,   // ← mais rápido = mais "próximo" do usuário
  },
  {
    id: 2,
    label: "HelpDesk",
    icon: "✅",
    color: "#425a26",
    ahref: "https://helpdeskbot.vercel.app/",
    pos: { default: { x: "180px", y: "80px" }, sm: { x: "0px", y: "-20px" } },
    depth: 1.1,
  },
  {
    id: 3,
    label: "RemindMe",
    icon: "🔔",
    color: "#dda15e",
    ahref: "https://remind-me-roan.vercel.app/",
    pos: { default: { x: "-180px", y: "-160px" }, sm: { x: "0px", y: "130px" } },
    depth: 0.7,   // ← mais lento = mais "distante"

  },
   {
    id: 4,
    label: "Sys.Out",
    icon: "📠",
    color: "#dd4e4e",
    ahref: "https://sys-out.vercel.app/",
    pos: { default: { x: "90px", y: "-120px" }, sm: { x: "0px", y: "50px" } },
    depth: 0.5,   // ← mais lento = mais "distante"

  },
   {
    id: 5,
    label: "SAC-Dash",
    icon: "🧑‍💻",
    color: "#000000",
    ahref: "https://sac-dash.vercel.app/",
    pos: { default: { x: "-90px", y: "100px" }, sm: { x: "40px", y: "80px" } },
    depth: 2.0,   // ← mais lento = mais "distante"

  },
];
 
// Hook de breakpoint
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}
 
export function HeroSection() {
  const desktopRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);
  const rafRef      = useRef(null);       // requestAnimationFrame handle
  const basePos     = useRef([]);         // posições-base após a timeline abrir
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
 
  // Recria a timeline quando muda o breakpoint
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Estado inicial: no centro do âncora, invisível
      gsap.set(cardsRef.current, {
        opacity: 0,
        scale: 0.6,
        x: 0,
        y: 0,
        pointerEvents: "none",
      });
 
      const cardTargetPos = CARDS.map((card) =>
        isMobile ? card.pos.sm : card.pos.default
      );
 
      tlRef.current = gsap
        .timeline({ paused: true })
        .to(".mydesktop p", {
          opacity: 0.2,
          color: "#606c38",
          cursor: 'default',
          duration: 0.35,
          ease: "power2.out",
        })
        .to(
          cardsRef.current,
          {
            opacity: 1,
            scale: 1,
            pointerEvents: "auto",
            duration: 0.5,
            stagger: 0.09,
            ease: "back.out(1.7)",
            x: (i) => cardTargetPos[i].x,  // posição individual por card
            y: (i) => cardTargetPos[i].y,
            onComplete() {
              cardsRef.current.forEach((el, i) => {
                if (!el) return;
                basePos.current[i] = {
                  x: gsap.getProperty(el, "x"),
                  y: gsap.getProperty(el, "y"),
                };
              });
            },
          },
          "-=0.15"
        );
    }, desktopRef);
 
    return () => ctx.revert();
  }, [isMobile]); // recria ao trocar breakpoint
 
  // ─── parallax: segue o mouse com profundidades diferentes ────────────────
  const handleMouseMove = useCallback(
    (e) => {
      if (!open || isMobile) return;
 
      const rect   = desktopRef.current.getBoundingClientRect();
      // posição normalizada do mouse dentro do elemento [-1, 1]
      const normX  = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
      const normY  = ((e.clientY - rect.top)   / rect.height - 0.5) * 2;
      const RANGE  = 28; // px máximos de deslocamento parallax
 
      // cancela frame anterior e agenda novo (throttle via rAF)
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        cardsRef.current.forEach((el, i) => {
          if (!el || basePos.current[i] == null) return;
          const { depth } = CARDS[i];
          gsap.to(el, {
            x: basePos.current[i].x + normX * RANGE * depth,
            y: basePos.current[i].y + normY * RANGE * depth,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      });
    },
    [open, isMobile]
  );

  // reset suave ao sair com o mouse
  const handleMouseLeave = useCallback(() => {
    if (!open || isMobile) return;
    cancelAnimationFrame(rafRef.current);
    cardsRef.current.forEach((el, i) => {
      if (!el || basePos.current[i] == null) return;
      gsap.to(el, {
        x: basePos.current[i].x,
        y: basePos.current[i].y,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    });
  }, [open, isMobile]);
 

  const toggleCards = () => {
  if (open) {
    closeCards();
  } else {
    setOpen(true);
    tlRef.current.play();
  }
};
 
  const closeCards = useCallback(() => {
    if (!open) return;
    // reseta parallax antes de reverter
    cancelAnimationFrame(rafRef.current);
    cardsRef.current.forEach((el, i) => {
      if (!el || basePos.current[i] == null) return;
      gsap.set(el, {
        x: basePos.current[i].x,
        y: basePos.current[i].y,
      });
    });
    setOpen(false);
    tlRef.current.reverse();
  }, [open]);
 
  useEffect(() => {
    const handleOutside = (e) => {
      if (desktopRef.current && !desktopRef.current.contains(e.target)) {
        closeCards();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [closeCards]);
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
 
  return (
    <section   
      onMouseMove={handleMouseMove}    // ← parallax
        onMouseLeave={handleMouseLeave}  // ← reset suave
    >
      <section className="header">
        <div className="grid grid-cols-2 p-5 items-center">
          <div className="col-span-1 flex items-center">
            <p className="mt-9" style={{ fontSize: "20px" }}>Olá,</p>
            <GetNameUser />
          </div>
          <div className="col-span-2 md:col-span-1 gap-5 flex justify-end">
            <Link to="/equipes" className="self-center" style={{ color: "#606c38", opacity: "0.5" }}>
              Equipes
            </Link>
            <Logout />
          </div>
        </div>
      </section>
 
      <section className="Hero text-6xl lg:text-9xl text-center p-30">
        <div
          className="mydesktop"
          ref={desktopRef}
          onClick={toggleCards}
          
          style={{
            position: "relative",   // ← FIX 1: ancora o container de cards
            cursor: "pointer",
            userSelect: "none",
            display: "inline-block",
          }}
        >
          {/* Texto */}
          <div className="grid grid-cols-1">
            <div className="col-span-1"><p>MY</p></div>
          </div>
          <div className="grid grid-cols-2">
            <div className="col-span-1 text-end"><p>DESK</p></div>
          </div>
          <div className="grid grid-cols-1">
            <div className="col-span-1"><p>TOP</p></div>
          </div>
 
          {/*
            Ponto âncora central: width/height 0 para não influenciar o layout.
            O GSAP anima x/y de cada card a partir daqui.
          */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 0,
              height: 0,
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            {CARDS.map((card, i) => (
              <div
                key={card.id}
                ref={(el) => (cardsRef.current[i] = el)}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(card.ahref, "_blank");
                }}
                style={{
                  position: "absolute",
                  transform: "translate(-50%, -50%)", // centraliza no ponto âncora
                  background: "#fff",
                  borderRadius: "16px",
                  padding: isMobile ? "12px 16px" : "20px 28px",  // responsivo
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  minWidth: isMobile ? "85px" : "110px",           // responsivo
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  borderTop: `4px solid ${card.color}`,
                  fontSize: isMobile ? "0.7rem" : "1rem",          // responsivo
                  fontWeight: 600,
                  color: "#283618",
                  willChange: "transform", // hint GPU para parallax suave
                  transition: "box-shadow 0.2s",
                  // sombra mais profunda para cards com maior depth (efeito z)
                  filter: `drop-shadow(0 ${4 * card.depth}px ${12 * card.depth}px rgba(0,0,0,${0.1 * card.depth}))`,
                  pointerEvents: "none", // GSAP ativa via timeline
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "0 12px 40px rgba(0, 0, 0, 0.68)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)")
                }
              >
                <span style={{ fontSize: isMobile ? "1.4rem" : "2rem" }}>
                  {card.icon}
                </span>
                {card.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
import {Logout} from '../components/Logout'
import { Link } from 'react-router-dom'
import { GetModulo, LoopModule } from '../components/Modulo'
import { GetNameUser} from '../components/Users'
import { useState, useRef, useEffect } from 'react'
import gsap from "gsap";





export function Home() {
  // Cria estado para armazenar texto da pesquisa
  const [termoBusca, setTermoBusca] = useState('')
const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
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

      <section className='hero'>
        {/* Container Principal: 1 coluna no mobile, 2 no desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-5">
          {/* Coluna da esquerda */}
          <div className="flex flex-col p-5 gap-10 mt-10 lg:mt-32">
            {/* Card 1 */}
            <div className="flex flex-col gap-2 max-w-lg">
                <p className='heroTopic'>Sistema para Anotações</p>
                <a className='buttonDaily' href="https://daily-checkout-team.vercel.app/" target='_blank'>Daily Workout</a>
                <small className='descHero text-justify'>
                  <strong>Descrição:</strong> Gestão de tarefas com interface interativa, controle de equipes e relatórios automatizados. Organize seu cronograma diário com movimentação intuitiva e tenha o histórico completo da sua produtividade sempre à mão.
                </small>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col">
                <p className='heroTopic'>Sistema Gerador de Relatórios Analiticos</p>
                <a className='buttonHelp' href="https://helpdeskbot.vercel.app/relatos/u5wlM3UCYKfX7kSPEFBs" target='_blank'>Help Desk - AI Support</a>
                <small className='descHero text-justify'>
                  <strong>Descrição:</strong> Um assistente inteligente de triagem técnica que utiliza IA Generativa para atuar como um Analista de TI especializado. O sistema processa relatos brutos de usuários, extrai o contexto essencial e gera diagnósticos precisos acompanhados de soluções recomendadas, padronizando a comunicação entre a ponta e a equipe de suporte.
                </small>
            </div>

          </div>

          {/* Coluna da Direita: My Desktop */}
          <div className="mydesktop flex flex-col justify-center mt-12 lg:mt-0 relative cursor-pointer" onClick={toggleMenu} >
            <div className="w-full max-w-lg lg:max-w-sm flex flex-col text-6xl lg:text-9xl font-black items-center lg:items-end">
              <div className="w-1/6 text-right">
                <p>MY</p>
              </div>
              <div className="w-4/6 text-start lg:text-right">
                <p>DESK</p>
              </div>
              <div className="w-1/6 text-right">
                <p>TOP</p>
              </div>
            </div>
            {/* O Menu Flutuante */}
            {isMenuOpen && (
              <div 
                // onClick={(e) => e.stopPropagation()} // Impede que clicar no menu feche ele mesmo acidentalmente
                className="absolute ballon-menu right-50 md:right-10  p-2"
              >
                <p className="text-sm text-neutral-400">Acesse</p>
               <Link to="https://remind-me-roan.vercel.app/" style={{color: 'white'}}>RemindMe</Link>
                {/* Adicione mais opções aqui */}
              </div>
            )}
          </div>
        </div>
      </section>

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

const CARDS = [
  { id: 1, label: "Projetos", icon: "📁", color: "#606c38" },
  { id: 2, label: "Tarefas",  icon: "✅", color: "#283618" },
  { id: 3, label: "Equipes",  icon: "👥", color: "#dda15e" },
  { id: 4, label: "Agenda",   icon: "📅", color: "#bc6c25" },
];

export function HeroSection() {
  const desktopRef  = useRef(null);   // ref na div .mydesktop
  const cardsRef    = useRef([]);     // refs individuais de cada card
  const tlRef       = useRef(null);   // timeline reutilizável
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // estado inicial dos cards: invisíveis e deslocados
      gsap.set(cardsRef.current, { opacity: 0, y: 40, scale: 0.7, pointerEvents: "none" });
 
      tlRef.current = gsap
        .timeline({ paused: true })
        // texto: desbota e muda de cor
        .to(".mydesktop p", {
          opacity: 0.25,
          color: "#606c38",
          duration: 0.35,
          ease: "power2.out",
        })
        // cards sobem em cascata
        .to(
          cardsRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: "auto",
            duration: 0.45,
            stagger: 0.08,
            ease: "back.out(1.6)",
          },
          "-=0.15"   // começa um pouco antes do step anterior terminar
        );
    }, desktopRef);
 
    return () => ctx.revert();
  }, []);
 const openCards = () => {
    if (open) return;
    setOpen(true);
    tlRef.current.play();
  };
 
  const closeCards = () => {
    if (!open) return;
    setOpen(false);
    tlRef.current.reverse();
  };
 
  // clique fora da .mydesktop fecha
  useEffect(() => {
    const handleOutside = (e) => {
      if (desktopRef.current && !desktopRef.current.contains(e.target)) {
        closeCards();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
 
  return (
    <>
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
      <section className='Hero text-6xl lg:text-9xl bg-gray-500 text-center p-30'>
        <div className="mydesktop"  ref={desktopRef}
          onClick={openCards}>

          <div className='grid grid-cols-1'>
            <div className="col-span-1">
              <p>MY</p>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="col-span-1 text-end">
              <p>DESK</p>
            </div>
          </div>
          <div className="grid grid-cols-1">
            <div className="col-span-1">
              <p>TOP</p>
            </div>
          </div>
           <div
            className="cards-container"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              justifyContent: "center",
              pointerEvents: "none", // o gsap ativa por card
              zIndex: 10,
            }}
          >
            {CARDS.map((card, i) => (
              <div
                key={card.id}
                ref={(el) => (cardsRef.current[i] = el)}
                onClick={(e) => {
                  e.stopPropagation(); // não propaga para .mydesktop
                  alert(`Você clicou em: ${card.label}`);
                }}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "20px 28px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  minWidth: "110px",
                  cursor: "pointer",
                  borderTop: `4px solid ${card.color}`,
                  fontSize: "1rem",        // sobrescreve o text-6xl do pai
                  fontWeight: 600,
                  color: "#283618",
                  transition: "box-shadow 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(0,0,0,0.28)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(0,0,0,0.18)")
                }
              >
                <span style={{ fontSize: "2rem" }}>{card.icon}</span>
                {card.label}
              </div>
            ))}
          </div>
        </div>
        
      </section>
    </>
      
  )
}
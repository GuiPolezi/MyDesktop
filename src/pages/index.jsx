import {Logout} from '../components/Logout'
import { Link } from 'react-router-dom' //
import { GetModulo, LoopModule } from '../components/Modulo'
import { GetNameUser} from '../components/Users'
import { useState } from 'react'




export function Home() {
  // Cria estado para armazenar texto da pesquisa
  const [termoBusca, setTermoBusca] = useState('')

  // Função para evitar que a página recarregue ao apertar enter ou clicar no submit
  const handlePesquisa = (e) => {
    e.preventDefault()
  }

  return (
    <main>
      <section className="header">
        <div className="grid grid-cols-2 p-5 items-center">
          <div className="col-span-1 flex items-center">
            <p className='mt-9' style={{fontSize: '20px'}}>Olá,</p>
            <GetNameUser />
          </div>
          <div className="col-span-1 text-end">
            <Logout />
          </div>
        </div>
      </section>

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
          <div className="mydesktop flex flex-col justify-center mt-12 lg:mt-0">
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
                <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
                </svg>
              </button>
            </form>
          </div>
          <Link to="/criarmodulo" className='mt-10 text-2xl' style={{color: '#283618'}}>Criar Modulo</Link>
        </div>

      </div>

      {/* Container - Cards e Submodulos */}
      <div className='mt-10 p-5'>
        <LoopModule termoBusca={termoBusca}/>
      </div>
     </section>

     {/*
      <div className='header'>
        <h1>Hello</h1>
        <GetNameUser />
      </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Link to="/criarmodulo" style={{border: '1px solid', marginBottom: '10px'}}>Criar Modulo</Link>
          <Logout />
        </div>


        <div>
          <h3>Modulos Criados</h3>
          {/*<GetModulo idModulo={2}/> -> Isso aqui obtem o modulo individualmente 
          <LoopModule />

        </div>
      */}
        
    </main>
  )
}
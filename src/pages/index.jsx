import {Logout} from '../components/Logout'
import { Link } from 'react-router-dom' //
import { GetModulo, LoopModule } from '../components/Modulo'
import { GetNameUser} from '../components/Users'




export function Home() {
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
                  Descrição: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi placerat, ex ut gravida aliquam, nulla nisl pretium lectus, 
                </small>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col">
                <p className='heroTopic'>Sistema Gerador de Relatórios Analiticos</p>
                <a className='buttonHelp' href="https://helpdeskbot.vercel.app/relatos/u5wlM3UCYKfX7kSPEFBs" target='_blank'>Help Desk - AI Support</a>
                <small className='descHero' style={{textAlign: 'justify'}}>
                  Descrição: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi placerat, ex ut gravida aliquam, nulla nisl pretium lectus, 
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

      {/*
      <section className='hero p-5'>
        <div className="grid grid-cols-2">
          <div className="col-span-1 mt-30">
            <div className="grid grid-cols-4">
              <div className="col-span-2 mb-20 flex flex-col">
                <p className='heroTopic'>Sistema para Anotações</p>
                <a className='buttonDaily' href="https://daily-checkout-team.vercel.app/" target='_blank'>Daily Workout</a>
                <small className='descHero' style={{textAlign: 'justify'}}>
                  Descrição: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi placerat, ex ut gravida aliquam, nulla nisl pretium lectus, 
                </small>
              </div>

              <div className="col-span-3 flex flex-col">
                <p className='heroTopic'>Sistema Gerador de Relatórios Analiticos</p>
                <a className='buttonHelp' href="https://helpdeskbot.vercel.app/relatos/u5wlM3UCYKfX7kSPEFBs" target='_blank'>Help Desk - AI Support</a>
                <small className='descHero' style={{textAlign: 'justify'}}>
                  Descrição: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi placerat, ex ut gravida aliquam, nulla nisl pretium lectus, 
                </small>
              </div>
            </div>
          </div>

          
          <div className="col-span-1 mydesktop">
            <div className="grid grid-cols-3 ">
              <div className="col-span-3">


                <div className="grid grid-cols-6">
                  <div className="col-span-5 text-end ">
                    <p>My</p>
                  </div>
                </div>

                <div className="grid grid-cols-6">
                  <div className="col-span-4  text-end">
                    <p>DESK</p>
                  </div>
                </div>

                <div className="grid grid-cols-6">
                  <div className="col-span-5  text-end">
                    <p>TOP</p>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>
       */}
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
          {/*<GetModulo idModulo={2}/> -> Isso aqui obtem o modulo individualmente */ } 
          <LoopModule />

        </div>

        
    </main>
  )
}
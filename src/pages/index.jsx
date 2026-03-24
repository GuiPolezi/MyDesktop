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
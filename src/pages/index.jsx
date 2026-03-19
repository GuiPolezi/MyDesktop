import {Logout} from '../components/Logout'
import { Link } from 'react-router-dom' //
import { GetModulo } from '../components/Modulo'
import { GetUser } from '../components/Users'



export function Home() {
  return (
    <section>
      <div className='flex'></div>
        <h1>Hello</h1>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Link to="/criarmodulo" style={{border: '1px solid', marginBottom: '10px'}}>Criar Modulo</Link>
          <Logout />
        </div>


        <div>
          <h3>Modulos Criados</h3>
          <GetModulo idModulo={1}/>
          <GetModulo idModulo={2}/>
        </div>

        
    </section>
  )
}
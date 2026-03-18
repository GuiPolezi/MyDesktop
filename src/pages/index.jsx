import {Logout} from '../components/Logout'
import { Link } from 'react-router-dom' //

export function Home() {
  return (
    <section>
        <h1>Home (Usuário logado)</h1>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Link to="/criarmodulo" style={{border: '1px solid', marginBottom: '10px'}}>Criar Modulo</Link>
          <Logout />
        </div>
    </section>
  )
}
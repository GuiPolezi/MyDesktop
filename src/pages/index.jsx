import {Logout} from '../components/Logout'

export function Home() {
  return (
    <section>
        <h1>Home (Usuário logado)</h1>
        <Logout />
    </section>
  )
}
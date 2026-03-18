import { authService } from '../services/authService'

export function Home() {
  return (
    <section>
        <h1>Home (Usuário logado)</h1>
        <button onClick={authService.signOut}>Sair</button>
    </section>
  )
}
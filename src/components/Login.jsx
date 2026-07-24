import { use, useState } from 'react'
import { authService } from '../services/authService'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate(); // 🔹 hook para redirecionar

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await authService.signIn(email, password)
            alert("Login realizado com sucesso!")
            navigate("/"); // ou "/login" se sua rota for essa
        } catch (error) {
            alert("Erro ao entrar: " + error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
  // Wrapper que centraliza tudo na tela sobre o fundo escuro
  <div className="min-h-screen flex items-center justify-center p-4">

    {/* Card Principal */}
    <div className="w-full max-w-md glass-card p-8">

      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-mist tracking-tight">Bem-vindo de volta</h2>
        <p className="text-fog mt-2 text-sm">Insira suas credenciais para acessar o sistema</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">

        {/* Campo: E-mail */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="field px-4 py-3"
          />
        </div>

        {/* Campo: Senha */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="field px-4 py-3"
          />
        </div>

        {/* Botão de Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-4 py-3 px-4 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {loading ? (
            // Spinner de Loading Animado
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </span>
          ) : (
            'Entrar no Sistema'
          )}
        </button>
      </form>

      {/* Link para Criar Conta */}
      <p className="mt-8 text-center text-sm text-fog">
        Ainda não tem uma conta?{' '}
        <Link
          to="/register"
          className="font-bold hover:underline transition-all text-leaf-bright"
        >
          Criar conta
        </Link>
      </p>

    </div>
  </div>
)
}
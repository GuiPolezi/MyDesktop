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
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Acessar Sistema</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Seu email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Sua senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <Link to="/register">Criar conta</Link>
    </div>
  )
}
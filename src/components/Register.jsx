import { use, useState } from 'react'
import { authService } from '../services/authService'
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [ nome, setNome] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate(); // 🔹 hook para redirecionar


    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await authService.signUp(nome, email, password)

            alert("Registro realizado com sucesso!")

             navigate("/login"); // ou "/login" se sua rota for essa
        } catch (error) {
            alert("Erro ao Registrar: " + error.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Cadastre-se no Sistema</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Seu nome" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
          required 
        />
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
          {loading ? 'Cadastrando...' : 'Cadastrar-se'}
        </button>
      </form>
      <Link to="/login">Fazer login</Link>
    </div>
  )
}
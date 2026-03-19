import { useState } from 'react'
import { dbService } from '../services/dbService'

export function CriarModulo() {
    const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCriar = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
        const novoModulo = await dbService.criarModulo(titulo, descricao)
        alert(`Módulo "${novoModulo.titulo}" criado com sucesso! ID: ${novoModulo.id_modulo}`)
        setTitulo('')
        setDescricao('')
        // Aqui você poderia atualizar uma lista de módulos na tela
    } catch (error) {
        alert("Erro ao criar: " + error.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    <form onSubmit={handleCriar} style={{ marginBottom: '2rem' }}>
      <h3>1. Criar Novo Módulo</h3>
      <input 
        placeholder="Título do Módulo" 
        value={titulo} 
        onChange={e => setTitulo(e.target.value)} 
        required 
      />
      <input 
        placeholder="Descrição" 
        value={descricao} 
        onChange={e => setDescricao(e.target.value)} 
      />
      <button type="submit" disabled={loading}>Salvar Módulo</button>
    </form>
  )
}


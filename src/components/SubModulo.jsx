import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { dbService } from '../services/dbService'

export function CriarSubModulo() {
// 1. Obtém o idModulo da URL definida na rota (:idModulo)
  const { idModulo } = useParams();
    
     const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCriar = async (e) => {
    e.preventDefault()

    // Validação de segurança: não deixa criar se não houver um ID de módulo pai
    if (!idModulo) {
      alert("Erro: Este submódulo precisa estar vinculado a um módulo!")
      return
    }

    setLoading(true)
    
    try {
        const novoModulo = await dbService.criarSubmodulo(titulo, descricao, idModulo)
        alert(`Módulo "${novoModulo.titulo}" criado com sucesso! ID: ${novoModulo.id_submodulo}`)
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
        <h4>Adicionar Submódulo ao Módulo #{idModulo}</h4>
      <h3>1. Criar Novo SubMódulo</h3>
      <input 
        placeholder="Título do SubMódulo" 
        value={titulo} 
        onChange={e => setTitulo(e.target.value)} 
        required 
      />
      <input 
        placeholder="Descrição" 
        value={descricao} 
        onChange={e => setDescricao(e.target.value)} 
      />
      <button type="submit" disabled={loading}>Salvar SubMódulo</button>
    </form>
  )
}
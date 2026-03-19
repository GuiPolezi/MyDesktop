import { useEffect, useState } from 'react'
import { dbService } from '../services/dbService'
import { Link } from 'react-router-dom' //
import { GetSubModulo } from './SubModulo'
import { useNavigate } from "react-router-dom";

export function CriarModulo() {
    const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate(); // 🔹 hook para redirecionar


  const handleCriar = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
        const novoModulo = await dbService.criarModulo(titulo, descricao)
        alert(`Módulo "${novoModulo.titulo}" criado com sucesso! ID: ${novoModulo.id_modulo}`)
        setTitulo('')
        setDescricao('')
        // Aqui você poderia atualizar uma lista de módulos na tela
        navigate('/') // Redireciona para página inicial após criação
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

// Função para obter Modulo

export function GetModulo({idModulo}) {
  // Estados para guardar os dados e status de carregamento
  const [modulo, setModulos] = useState(null) // UseState para esperar por um modulo (um objeto)
  const [loading, setLoading] = useState(true)

  // UseEffect: Roda automaticamente a função quando o componente for montado na tela
  useEffect(() => {
    if (!idModulo) {
      setLoading(false)
      return 
    }
    async function carregarDados() {
      try {
        const dados = await dbService.getModulo(idModulo)
        setModulos(dados)
      } catch (error) {
        alert("Erro ao buscar módulos: " + error.message)
      } finally {
        setLoading(false) // Tira o aviso de carregando
      }
    }

    if (idModulo) {
      carregarDados();
    }
    
  }, [idModulo]) // Colocamos idModulo aqui para o React atualizar se o ID mudar

  // O que aparece na tela enquando os dados carregam
  if (loading) {
    return <p>Carregando Módulos...</p>
  }

  if (!modulo) {
    return <p>Módulo Não encontrado</p>
  }
  // O que aparece na tela depois que os dados chegam
  return (
    <section>
      <h1>{modulo.titulo}</h1>
      <p>{modulo.descricao}</p>
      <div className='submodulos'>
        {/* Chamamos o componente de lista passando o ID do módulo atual */}
        <GetSubModulo idModulo={modulo.id_modulo} />
      </div>
      {/* Link dinâmico usando o ID do módulo vindo do banco */}
      <Link 
        to={`/criarsubmodulo/${modulo.id_modulo}`} 
        style={{ border: '1px solid', padding: '5px', textDecoration: 'none' }}
      >
        + Criar Submódulo para este módulo
      </Link>
    </section>
  )
}


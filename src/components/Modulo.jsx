import { useEffect, useState } from 'react'
import { dbService } from '../services/dbService'
import { Link } from 'react-router-dom' //
import { GetSubModulo } from './SubModulo'
import { useNavigate } from "react-router-dom";
import { GetCardsModule } from './Cards';
import { supabase } from '../services/supabase'; // Importe a instância do supabase para pegar o usuário

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

  const [ usuarioLogado, setUsuarioLogado ] = useState(null)
  const navigate = useNavigate(); // 🔹 hook para redirecionar


  // UseEffect: Roda automaticamente a função quando o componente for montado na tela
  useEffect(() => {
    if (!idModulo) {
      setLoading(false)
      return 
    }
    async function carregarDados() {
      try {
        const {data: {user}} = await supabase.auth.getUser();
        setUsuarioLogado(user);

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

  // Excluindo Card Submodule
   const handleExcluir = async (id_modulo, titulo) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o módulo "${titulo}"?`);

    if (confirmar) {
      try {
        await dbService.deleteModule(id_modulo);
        alert("Módulo excluído com sucesso!");

        navigate("/");
      } catch (error) {
        alert("Erro ao excluir: " + error.message);
      }
    }
   };

  // O que aparece na tela depois que os dados chegam
  return (
    <section>
      <h1>{modulo.titulo}</h1>
      <p>{modulo.descricao}</p>
      {usuarioLogado && usuarioLogado.id === modulo.criado_por_id && (
                  <button 
                    onClick={() => handleExcluir(modulo.id_modulo, modulo.titulo)} 
                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', marginTop: '5px' }}
                  >
                    Excluir
                  </button>
                )}
      <div className="cards">
        {/* Chamamos o componente de lista passando o ID do módulo atual */}
        <GetCardsModule idModulo={modulo.id_modulo} />
      </div>

      <div className='submodulos'>
        {/* Chamamos o componente de lista passando o ID do módulo atual */}
        <GetSubModulo idModulo={modulo.id_modulo} />
        {/* Link dinâmico usando o ID do módulo vindo do banco */}
        <Link 
          to={`/criarsubmodulo/${modulo.id_modulo}`} 
          style={{ border: '1px solid', padding: '5px', textDecoration: 'none' }}
          >
          + Criar Submódulo para este módulo
        </Link>
      </div>

      {/* 🔹 Passamos APENAS o id do módulo. O React Router entende que não há submódulo */}
      <Link to={`/criarcard/${modulo.id_modulo}`}>
        + Criar Card para este Módulo
      </Link>
    
    </section>
  )
}


// Contagem de modulos em LOOP para exibição na página

export function LoopModule() {
  const [ listaModulos, setListaModulos ] = useState([])

  useEffect(() => {
    async function carregarQuantidade() {
      try {
        const qtd = await dbService.getLoopModules();
        setListaModulos(qtd);
      } catch (error) {
        console.error("Erro ao contar módulos:", error.message);
      }
    }
    carregarQuantidade();
  }, []);

  return (
    <div>
      {listaModulos.map((m) => (
        <GetModulo key={m.id_modulo} idModulo={m.id_modulo} />
      ))}
    </div>
  )
}
import { useEffect, useState } from 'react'
import { dbService } from '../services/dbService'
import { Link } from 'react-router-dom' //
import { GetSubModulo } from './SubModulo'
import { useNavigate } from "react-router-dom";
import { GetCardsModule, GetCardsTitle } from './Cards';
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

  // Novos estados para edição de Módulo
  const [editando, setEditando] = useState(false); // Controla se mostra o texto ou o <input>
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [salvando, setSalvando] = useState(false); // Para mostrar um "Salvando..." no botão

  // Modal para cards
  const [isModalAberto, setIsModalAberto] = useState(false);

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

  // Excluindo modulo
   const handleExcluir = async (id_modulo, titulo) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o módulo "${titulo}"?`);

    if (confirmar) {
      try {
        await dbService.deleteModule(id_modulo);
        alert("Módulo excluído com sucesso!");

        // 🔹 Dispara um evento global avisando que este ID foi excluído
        window.dispatchEvent(new CustomEvent('moduloDeletado', { detail: id_modulo }));

        navigate("/");
      } catch (error) {
        alert("Erro ao excluir: " + error.message);
      }
    }
   };

    // 🔹 NOVA FUNÇÃO: Ativar o modo de edição
  const iniciarEdicao = (module) => {
    setEditando(module.id_modulo) // Agora guardamos o ID do card específico
    setNovoTitulo(module.titulo); // Preenche o input com o título atual
    setNovaDescricao(module.descricao); // Preenche o input com a descrição atual
  };

   // Nova função para salvar alterações no banco
   const handleSalvarEdicao = async () => {
    if (!novoTitulo.trim()) {
      alert("O titulo não pode estar vázio")
      return;
    }
   

    setSalvando(true);
    try {
      const dadosAtualizados = {
        titulo: novoTitulo,
        descricao: novaDescricao,
      }
      
      // Salva no banco de dados usando a função que criamos no dvservice
      await dbService.updateModule(editando, dadosAtualizados)
      
      // atualiza o estado local
      setModulos({ ...modulo, ...dadosAtualizados });

      // sai do modo edição
      setEditando(null);
    } catch (error) {
      alert("Erro ao salvar: " + error.message)
    } finally {
      setSalvando(false);
    }
  };

  // O que aparece na tela depois que os dados chegam
  
  return (

    <section>
      <div className="grid grid-cols-1 bg-amber-400 lg:grid-cols-3">
        {/* Coluna do Módulo - Submodulo */}
        <div className="col-span-1 bg-amber-200 items-center lg:items-start flex flex-col">
          {/* Titulo modulo */}
          <div className="title bg-blue-200 w-full max-w-lg">
            <h2 className='text-5xl'>{modulo.titulo}</h2>
            <small>{modulo.descricao}</small>
              {/* Botões de Gestão (Dono) */}
              {usuarioLogado && usuarioLogado.id === modulo.criado_por_id && (
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <button 
                    onClick={() => iniciarEdicao(modulo)} 
                    style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
                  >
                    📝 Editar Módulo
                  </button>

                  <button 
                    onClick={() => handleExcluir(modulo.id_modulo, modulo.titulo)} 
                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
                  >
                    🗑️ Excluir Módulo
                  </button>
                  <Link 
                    to={`/criarsubmodulo/${modulo.id_modulo}`} 

                  >
                    + Criar Submódulo
                  </Link>
                  <Link to={`/criarcard/${modulo.id_modulo}`} style={{ fontWeight: 'bold' }}>
                    + Criar Card
                  </Link>
                </div>
              )}
          </div>
          
          {/* Submodulos */}
          <div className="submodulos bg-pink-200 w-full max-w-lg flex">
              <GetSubModulo idModulo={modulo.id_modulo} />
          </div>
        </div>

        {/* Coluna dos Cards*/}
        <div className="col-span-2 bg-red-500">
          <p>Cards</p>
          <div className="cards bg-amber-400 p-2">
            <GetCardsTitle idModulo={modulo.id_modulo} abrirModal={() => setIsModalAberto(true)}/>
          </div>
         {/*<GetCardsModule idModulo={modulo.id_modulo} /> */}
        </div>
      </div>

      {/* Estrutura do Modal de Cards */}
      {isModalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          {/* Caixa do Modal */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col relative m-4">
            
            {/* Cabeçalho do Modal com Botão Fechar */}
            <div className="flex justify-between items-center p-4 border-b">
              <GetCardsTitle idModulo={modulo.id_modulo}/>
              <button
                onClick={() => setIsModalAberto(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold px-2"
              >
                &times;
              </button>
            </div>

            {/* Conteúdo (Scrollável se for muito grande) */}
            <div className="p-4 overflow-y-auto">
              <GetCardsModule idModulo={modulo.id_modulo} />
            </div>
          </div>
        </div>
      )}
    </section>

    /* 
    <section>
      
      {/* --- MODO EDIÇÃO --- 
      {editando === modulo.id_modulo ? (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Título do Módulo:</label>
          <input 
            type="text" 
            value={novoTitulo} 
            onChange={(e) => setNovoTitulo(e.target.value)} 
            style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px' }}
          />

          <label style={{ display: 'block', fontWeight: 'bold' }}>Descrição:</label>
          <textarea 
            value={novaDescricao} 
            onChange={(e) => setNovaDescricao(e.target.value)} 
            style={{ display: 'block', width: '100%', padding: '8px', height: '80px', marginBottom: '10px' }}
          />

          <button 
            onClick={handleSalvarEdicao} 
            disabled={salvando}
            style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer', marginRight: '10px' }}
          >
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </button>
          
          <button 
            onClick={() => setEditando(null)} 
            style={{ padding: '8px 15px', cursor: 'pointer' }}
          >
            Cancelar
          </button>
        </div>
      ) : (
        // --- MODO VISUALIZAÇÃO ---
        <div style={{ marginBottom: '20px' }}>
          <h1>{modulo.titulo}</h1>
          <p>{modulo.descricao}</p>

          {/* Botões de Gestão (Dono) 
          {usuarioLogado && usuarioLogado.id === modulo.criado_por_id && (
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button 
                onClick={() => iniciarEdicao(modulo)} 
                style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
              >
                📝 Editar Módulo
              </button>

              <button 
                onClick={() => handleExcluir(modulo.id_modulo, modulo.titulo)} 
                style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
              >
                🗑️ Excluir Módulo
              </button>
            </div>
          )}
        </div>
      )}

      <hr />

      {/* Seção de Cards e Submódulos permanecem iguais 
      <div className="cards" style={{ marginTop: '20px' }}>
        <GetCardsModule idModulo={modulo.id_modulo} />
      </div>

      <div className='submodulos' style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9' }}>
        <GetSubModulo idModulo={modulo.id_modulo} />
        <Link 
          to={`/criarsubmodulo/${modulo.id_modulo}`} 
          style={{ display: 'inline-block', marginTop: '10px', border: '1px solid', padding: '5px', textDecoration: 'none' }}
        >
          + Criar Submódulo para este módulo
        </Link>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to={`/criarcard/${modulo.id_modulo}`} style={{ fontWeight: 'bold' }}>
          + Criar Card para este Módulo
        </Link>
      </div>
    
    </section>
    */
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

    // 🔹 Função que vai rodar quando escutar o evento
    const removerDaLista = (evento) => {
      const idDeletado = evento.detail; // Pega o ID que enviamos lá no GetModulo
      setListaModulos((listaAtual) => 
        listaAtual.filter((modulo) => modulo.id_modulo !== idDeletado)
      );
    };

    // 🔹 Começa a escutar o evento global
    window.addEventListener('moduloDeletado', removerDaLista);

    // 🔹 Limpeza: Para de escutar quando o LoopModule sair da tela
    return () => {
      window.removeEventListener('moduloDeletado', removerDaLista);
    };
  }, []);

  return (
    <div>
      {listaModulos.map((m) => (
        <GetModulo key={m.id_modulo} idModulo={m.id_modulo} />
      ))}
    </div>
  )
}
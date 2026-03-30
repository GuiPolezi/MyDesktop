import { useEffect, useState } from 'react'
import { dbService } from '../services/dbService'
import { Link } from 'react-router-dom' //
import { GetSubModulo } from './SubModulo'
import { useNavigate } from "react-router-dom";
import { GetCardsModule } from './Cards';
import { supabase } from '../services/supabase'; // Importe a instância do supabase para pegar o usuário
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'; // Importe o ícone específico

export function CriarModulo() {
    const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [setorPermitido, setSetorPermitido] = useState('todos')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate(); // 🔹 hook para redirecionar


  const handleCriar = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
        const novoModulo = await dbService.criarModulo(titulo, descricao, setorPermitido)
        alert(`Módulo "${novoModulo.titulo}" criado com sucesso! ID: ${novoModulo.id_modulo}`)
        setTitulo('')
        setDescricao('')
        setSetorPermitido('todos')
        // Aqui você poderia atualizar uma lista de módulos na tela
        navigate('/') // Redireciona para página inicial após criação
    } catch (error) {
        alert("Erro ao criar: " + error.message)
    } finally {
        setLoading(false)
    }
  }

  return (
    // Fundo da página e centralização (ideal caso seja uma página isolada)
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      
      {/* Card do Formulário */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-fit">
        
        {/* Cabeçalho */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h2 className="text-3xl font-extrabold text-gray-800">Criar Novo Módulo</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Preencha os detalhes abaixo para estruturar uma nova categoria no sistema.
          </p>
        </div>

        <form onSubmit={handleCriar} className="flex flex-col gap-6">
          
          {/* Campo: Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título do Módulo <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              placeholder="Ex: Gestão de Projetos" 
              value={titulo} 
              onChange={e => setTitulo(e.target.value)} 
              required 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Campo: Descrição (Agora usando textarea) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição
            </label>
            <textarea 
              placeholder="Descreva brevemente o propósito deste módulo..." 
              value={descricao} 
              onChange={e => setDescricao(e.target.value)} 
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Campo: Setor Permitido */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Público-Alvo (Setor Permitido) <span className="text-red-500">*</span>
            </label>
            <select
              value={setorPermitido} 
              onChange={e => setSetorPermitido(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 cursor-pointer text-gray-700"
            >
              <option value="todos">Todos (Visível para qualquer setor)</option>
              <option value="administrador">Administrador (Exclusivo)</option>
              <option value="suporte">Suporte</option>
              <option value="comum">Comum</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">
              Apenas usuários deste setor conseguirão visualizar este módulo na página inicial.
            </p>
          </div>

          {/* Rodapé com Botões */}
          <div className="pt-6 flex justify-end items-center gap-4 mt-2">
            
            {/* Botão Cancelar */}
            <Link 
              to="/" 
              className="px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>

            {/* Botão Salvar com Loader */}
            <button 
              type="submit" 
              disabled={loading}
              className="text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
              style={{ backgroundColor: '#283618' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando...
                </span>
              ) : (
                'Criar Módulo'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Coluna do Módulo - Submodulo */}
        <div className="col-span-1 p-2  items-center lg:items-start flex flex-col">
          { editando === modulo.id_modulo ? (
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
            // Titulo modulo
            <div className="title  w-full max-w-lg">
              <div className='flex justify-between'>
                <h2 className='text-5xl font-bold'>{modulo.titulo}</h2>
                {/* Botões de Gestão (Dono) */}
                {usuarioLogado && usuarioLogado.id === modulo.criado_por_id && (
                  <div className='items-center flex gap-2 iconsManagementModule'>
                    <button 
                      onClick={() => iniciarEdicao(modulo)} 
                      style={{border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>

                    <button 
                      onClick={() => handleExcluir(modulo.id_modulo, modulo.titulo)} className='buttonDelete'
                      style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>

                  </div>
                )}
              </div>
              <p className='text-1xl'>{modulo.descricao}</p>
              <div className='linksModule flex gap-5 mt-2'>
                 <Link style={{fontWeight: 'bold',}} className='linksCreate'
                      to={`/criarsubmodulo/${modulo.id_modulo}`} 

                    >
                      + Criar Submódulo
                    </Link>
                    <Link to={`/criarcard/${modulo.id_modulo}`} style={{ fontWeight: 'bold', }} className='linksCreate'>
                      + Criar Card
                    </Link>
                
              </div>

            </div>
          )}
          
          {/* Submodulos */}
          <div className="submodulos w-full max-w-lg flex">
              <GetSubModulo idModulo={modulo.id_modulo} />
          </div>
        </div>

        {/* Coluna dos Cards*/}
        <div className="col-span-2 p-2 h-full mb-5">
          <p className='text-4xl font-bold mb-2'>Cards</p>
          <GetCardsModule idModulo={modulo.id_modulo} />
        </div>
      </div>

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

export function LoopModule({termoBusca = ''}) {
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

  // filtra os módulos baseado no que foi digitado (prop termoBusca)
  const modulosFiltrados = listaModulos.filter((m) => {
    // se a busca for vazia, mostra tudo
    if (!termoBusca) return true;

    // converte os dois para minusculo para a busca nar ser sensivel a maiusculas
    return m.titulo?.toLowerCase().includes(termoBusca.toLowerCase());
  })

  if (listaModulos.length == 0 ) {
    return <p>nenhum módulo encontrado</p>
  }

  if (modulosFiltrados.length == 0 ) {
    return (
      <div className='text-center text-3xl'>
        <p>Nenhum módulo encontrado para "{termoBusca}"</p>
      </div>

      
    )
  }

  return (
    <div>
      {modulosFiltrados.map((m) => (
        <GetModulo key={m.id_modulo} idModulo={m.id_modulo} />
      ))}
    </div>
  )
}
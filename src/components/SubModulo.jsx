import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { dbService } from '../services/dbService'
import { Link } from 'react-router-dom' //
import { useNavigate } from "react-router-dom";
import { GetCardsSubModule } from './Cards';
import { supabase } from '../services/supabase'; // Importe a instância do supabase para pegar o usuário


export function CriarSubModulo() {
// 1. Obtém o idModulo da URL definida na rota (:idModulo)
  const { idModulo } = useParams();
    
     const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)
    const navigate = useNavigate(); // 🔹 hook para redirecionar


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
        alert(`SubMódulo "${novoModulo.titulo}" criado com sucesso! ID: ${novoModulo.id_submodulo}`)
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
    // Fundo da página e alinhamento
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      
      {/* Card do Formulário com uma borda superior de destaque para diferenciar da criação de Módulos */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100 border-t-4 h-fit" style={{ borderTopColor: '#283618' }}>
        
        {/* Cabeçalho */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          {/* Badges de Identificação (Evita a confusão do usuário) */}
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Submódulo
            </span>
            <span className="text-sm font-medium" style={{ color: '#283618' }}>
              Vinculado ao Módulo #{idModulo}
            </span>
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-800">Criar Nova Seção</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Adicione um submódulo para dividir e organizar o conteúdo do módulo principal de forma mais específica.
          </p>
        </div>

        <form onSubmit={handleCriar} className="flex flex-col gap-6">
          
          {/* Campo: Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título do Submódulo <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              placeholder="Ex: Aula 01 - Introdução" 
              value={titulo} 
              onChange={e => setTitulo(e.target.value)} 
              required 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Campo: Descrição (Convertido para Textarea para melhor usabilidade) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descrição
            </label>
            <textarea 
              placeholder="Descreva o que será abordado neste submódulo..." 
              value={descricao} 
              onChange={e => setDescricao(e.target.value)} 
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Rodapé com Botões */}
          <div className="pt-6 flex justify-end items-center gap-4 mt-2">
            
            {/* Botão Cancelar (Volta para a Home) */}
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
                  Salvando...
                </span>
              ) : (
                'Salvar Submódulo'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export function GetSubModulo({idModulo}) {
    // 1. Iniciamos com uma array vazia
  const [submodulos, setSubmodulos] = useState([])
  const [loading, setLoading] = useState(true)

  // Obtendo usuarios para nao mostrar botão de excluir caso condição nao seja verdadeira
  const [ usuarioLogado, setUsuarioLogado ] = useState(null)
  const navigate = useNavigate(); // 🔹 hook para redirecionar

  // Novos estados para edição de card
  const [editando, setEditando] = useState(false); // Controla se mostra o texto ou o <input>
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoPai, setNovoPai] = useState("");
  const [salvando, setSalvando] = useState(false); // Para mostrar um "Salvando..." no botão

  useEffect(() => {
    async function carregarSubs() {
      if (!idModulo) return // Segurança: não busca se não tiver ID

      try {
        setLoading(true)
        
        const {data: {user}} = await supabase.auth.getUser();
        setUsuarioLogado(user);

        const dados = await dbService.getSubmodulo(idModulo)
        setSubmodulos(dados)
      } catch (error) {
        console.error("Erro ao buscar submódulos:", error.message)
      } finally {
        setLoading(false)
      }
    }

    carregarSubs()
  }, [idModulo]) // Recarrega se o ID do módulo mudar

  if (loading) return <p>Carregando submódulos...</p>

  if (submodulos.length == 0) {
    return <p className='p-2 mt-2 font-bold' style={{fontSize: '20px', opacity:'0.3'}}>Nenhum submodulo encontrado</p>
  }

  // Excluindo Submodule
   const handleExcluir = async (id_submodulo, titulo) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o submódulo "${titulo}"?`);

    if (confirmar) {
      try {
        await dbService.deleteSubModule(id_submodulo);
        alert("SubMódulo excluído com sucesso!");
        // 🔹 A SOLUÇÃO: Atualiza a lista na tela imediatamente
        setSubmodulos((prevSubmodulos) => 
          prevSubmodulos.filter((sub) => sub.id_submodulo !== id_submodulo)
        );
      } catch (error) {
        alert("Erro ao excluir: " + error.message);
      }
    }
   };

    // 🔹 NOVA FUNÇÃO: Ativar o modo de edição
  const iniciarEdicao = (submodule) => {
    setEditando(submodule.id_submodulo) // Agora guardamos o ID do card específico
    setNovoTitulo(submodule.titulo); // Preenche o input com o título atual
    setNovaDescricao(submodule.descricao); // Preenche o input com a descrição atual
   // setNovoPai(submodule.id_modulo) // Preenche o input com o id do modulo pai atual
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
       // id_modulo: novoPai
      }
      
      // Salva no banco de dados usando a função que criamos no dvservice
      await dbService.updateSubmodule(editando, dadosAtualizados)
      
      // 🔹 AJUSTE: Atualiza apenas o card editado dentro da array
      setSubmodulos(prev => 
        prev.map(submodule => 
          submodule.id_submodulo === editando ? { ...submodule, ...dadosAtualizados } : submodule
        )
      );

      // sai do modo edição
      setEditando(null);
    } catch (error) {
      alert("Erro ao salvar: " + error.message)
    } finally {
      setSalvando(false);
    }
  };


  return (
    <section className='w-full p-2'>
      <p className='mt-2 font-bold' style={{fontSize: '20px', opacity:'0.3'}}>Submodulos</p>
      <div>
        {submodulos.map((sub) => (
          <div  key={sub.id_submodulo}>

            {editando === sub.id_submodulo ? (
              <div>
                  <input 
                  value={novoTitulo} 
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  style={{ display: 'block', marginBottom: '5px', width: '100%' }}
                  />

                <button onClick={handleSalvarEdicao} disabled={salvando} style={{ color: 'green', marginRight: '10px' }}>
                  {salvando ? "Salvando..." : "Salvar"}
                </button>
                <button onClick={() => setEditando(null)}>Cancelar</button>
              </div>
              
            ): (
              <div className='flex'>
                
                <Link to={`/submodulo/${sub.id_submodulo}`}>{sub.titulo} | </Link>
                {/*
                <a href="#" className='flex items-center text-2xl' key={sub.id_submodulo}>{sub.titulo} | </a>
                <li key={sub.id_submodulo} style={{ marginBottom: '8px' }} className='listSubModules'>
                  {sub.titulo}
                </li> */}

                {usuarioLogado && usuarioLogado.id === sub.criado_por_id && (
                      <div className='buttonsSubmodule flex self-end'>
                        <button 
                          onClick={() => iniciarEdicao(sub)} // Passa o card para a função
                        >
                          Editar Submódulo
                        </button>
                        <p className='self-center'>-</p>
                        <button className='buttonSubmoduleDelete'
                          onClick={() => handleExcluir(sub.id_submodulo, sub.titulo)} 
                        >
                          Excluir
                        </button>
                      </div>
                    )}
              </div>
            )}
          
          </div>

        ))}
      </div>
    </section>
  )
}


/* 

  return (
    <section>
      <p className='mt-2 font-bold' style={{fontSize: '20px', opacity:'0.3'}}>Submodulos</p>
      <ul style={{ paddingLeft: '20px' }}>
        {submodulos.map((sub) => (
          <li key={sub.id_submodulo} style={{ marginBottom: '8px' }}>
            {editando === sub.id_submodulo ? (
              // --- MODO EDIÇÃO ---
            <div>
              <input 
                value={novoTitulo} 
                onChange={(e) => setNovoTitulo(e.target.value)}
                style={{ display: 'block', marginBottom: '5px', width: '100%' }}
              />
              <textarea 
                value={novaDescricao} 
                onChange={(e) => setNovaDescricao(e.target.value)}
                style={{ display: 'block', marginBottom: '5px', width: '100%' }}
              />

            {/* 
                <input 
                  value={novoPai}
                  onChange={(e) => setNovoPai(e.target.value)}
                  style={{display: 'block', marginBottom: '5px', width: '100%'}}
                />
            
              
              <button onClick={handleSalvarEdicao} disabled={salvando} style={{ color: 'green', marginRight: '10px' }}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button onClick={() => setEditando(null)}>Cancelar</button>
            </div>
            ) : (
              <div className='bg-red-600'>
                <strong>{sub.titulo}</strong>
                {sub.descricao && <p style={{ margin: 0, fontSize: '0.85rem' }}>{sub.descricao}</p>}
                {usuarioLogado && usuarioLogado.id === sub.criado_por_id && (
                      <div>
                        <button 
                          onClick={() => iniciarEdicao(sub)} // Passa o card para a função
                          style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px', fontSize: '0.8rem' }}
                        >
                          Editar Submódulo
                        </button>

                        <button 
                          onClick={() => handleExcluir(sub.id_submodulo, sub.titulo)} 
                          style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', marginTop: '5px' }}
                        >
                          Excluir
                        </button>
                      </div>
                    )}
              </div>
            )}
            {/* 🔹 Aqui passamos OS DOIS IDs na URL 
            <Link to={`/criarcard/${idModulo}/${sub.id_submodulo}`}>
              + Criar Card neste Submódulo
            </Link>
            <div className="cards">
                {/* Chamamos o componente de lista passando o ID do módulo atual 
                <GetCardsSubModule idSubModulo={sub.id_submodulo}/>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )


*/
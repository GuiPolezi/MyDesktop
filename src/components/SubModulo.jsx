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
        alert(`Módulo "${novoModulo.titulo}" criado com sucesso! ID: ${novoModulo.id_submodulo}`)
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

        navigate("/");
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
          <div>

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
                
                <a href="#" className='flex items-center' key={sub.id_submodulo}>{sub.titulo} | </a>
                {/*
                <li key={sub.id_submodulo} style={{ marginBottom: '8px' }} className='listSubModules'>
                  {sub.titulo}
                </li> */}

                {usuarioLogado && usuarioLogado.id === sub.criado_por_id && (
                      <div className='buttonsSubmodule flex'>
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
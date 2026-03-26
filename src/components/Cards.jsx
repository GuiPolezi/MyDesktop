import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { dbService } from '../services/dbService'
import { useNavigate } from "react-router-dom";
import { supabase } from '../services/supabase'; // Importe a instância do supabase para pegar o usuário

export function CriarCards() {
    const { idModulo, idSubModulo } = useParams();
    const navigate = useNavigate(); // 🔹 hook para redirecionar

    const [titulo, setTitulo] = useState('')
    const [conteudo, setConteudo] = useState('')
    const [arquivos, setArquivos] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleCriar = async (e) => {
        e.preventDefault()

        // Validação de segurança: não deixa criar se não houver um ID de módulo pai
        if (!idModulo) {
            alert("Erro: Este Card precisa estar vinculado a um módulo!")
            return
        }

        setLoading(true)

        try {
            const novoCard = await dbService.criarCard(titulo, conteudo, arquivos, idModulo, idSubModulo)
            alert(`Card "${novoCard.titulo}" criado com sucesso! ID: ${novoCard.id_card}`)

            navigate('/') // Redireciona para página inicial após criação
        } catch (error) {
            alert("Erro ao criar: " + error.message)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <form onSubmit={handleCriar} style={{ marginBottom: '2rem' }}>
            <h4>Adicionar Card ao Módulo {idModulo}</h4>
            {idSubModulo && <p>Vinculado ao Submódulo: {idSubModulo}</p>}

            <h3>1. Criar Novo Card</h3>
            <input 
                placeholder="Título do Card" 
                value={titulo} 
                onChange={e => setTitulo(e.target.value)} 
                required 
            />
            <input 
                placeholder="Conteúdo do card" 
                value={conteudo} 
                onChange={e => setConteudo(e.target.value)} 
            />
            {/*  Para arquivos, não usamos 'value'. 
                Se for apenas o nome do arquivo para o JSONB: */}
            <input 
                type="file" 
                onChange={e => setArquivos(e.target.files[0]?.name)} 
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Card'}
            </button>
        </form>
    )
}



export function GetCardsModule({idModulo}) {
    // 1. Iniciamos com uma array vazia
  const [ cardmodule, setCardmodule ] = useState([])
  const [loading, setLoading] = useState(true)
  // Obtendo usuarios para nao mostrar botão de excluir caso condição nao seja verdadeira
  const [ usuarioLogado, setUsuarioLogado ] = useState(null)

   // Novos estados para edição de card
  const [editando, setEditando] = useState(false); // Controla se mostra o texto ou o <input>
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoConteudo, setNovoConteudo] = useState("");
  const [salvando, setSalvando] = useState(false); // Para mostrar um "Salvando..." no botão

  useEffect(() => {
    async function carregarCardsModule() {
      if (!idModulo) return // Segurança: não busca se não tiver ID

      try {
        setLoading(true)

        const {data: {user}} = await supabase.auth.getUser();
        setUsuarioLogado(user);

        const dados = await dbService.getCardsModule(idModulo)
        setCardmodule(dados)
      } catch (error) {
        console.error("Erro ao buscar cards:", error.message)
      } finally {
        setLoading(false)
      }
    }

    carregarCardsModule()
  }, [idModulo]) // Recarrega se o ID do módulo mudar

  if (loading) return <p>Carregando submódulos...</p>

  if (cardmodule.length == 0) {
    return <p>Nenhum card encontrado</p>
  }

  // Excluindo Card Submodule
   const handleExcluir = async (id_card, titulo) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o card "${titulo}"?`);

    if (confirmar) {
      try {
        await dbService.deleteCard(id_card);

        setCardmodule(prev => prev.filter(card => card.id_card !== id_card));

        alert("Card excluído com sucesso!");
      } catch (error) {
        alert("Erro ao excluir: " + error.message);
      }
    }
   };

    // 🔹 NOVA FUNÇÃO: Ativar o modo de edição
  const iniciarEdicao = (card) => {
    setEditando(card.id_card) // Agora guardamos o ID do card específico
    setNovoTitulo(card.titulo); // Preenche o input com o título atual
    setNovoConteudo(card.conteudo); // Preenche o input com a descrição atual
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
        conteudo: novoConteudo
      }
      
      // Salva no banco de dados usando a função que criamos no dvservice
      await dbService.updateCard(editando, dadosAtualizados)
      
      // 🔹 AJUSTE: Atualiza apenas o card editado dentro da array
      setCardmodule(prev => 
        prev.map(card => 
          card.id_card === editando ? { ...card, ...dadosAtualizados } : card
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
    <section>
      <ul style={{ paddingLeft: '20px' }}>
        {cardmodule.map((card) => (
            <div key={card.id_card} style={{ marginBottom: '8px' }}>
                 {/* 🔹 VERIFICAÇÃO: Este card é o que estou editando? */}
          {editando === card.id_card ? (
            // --- MODO EDIÇÃO ---
            <div>
              <input 
                value={novoTitulo} 
                onChange={(e) => setNovoTitulo(e.target.value)}
                style={{ display: 'block', marginBottom: '5px', width: '100%' }}
              />
              <textarea 
                value={novoConteudo} 
                onChange={(e) => setNovoConteudo(e.target.value)}
                style={{ display: 'block', marginBottom: '5px', width: '100%' }}
              />
              <button onClick={handleSalvarEdicao} disabled={salvando} style={{ color: 'green', marginRight: '10px' }}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button onClick={() => setEditando(null)}>Cancelar</button>
            </div>
          ) : (
            // --- MODO VISUALIZAÇÃO ---
            <div>
              <strong>{card.titulo}</strong> 
              {card.conteudo && <p style={{ margin: 0, fontSize: '0.85rem' }}>{card.conteudo}</p>}
              {card.arquivos && <div>{card.arquivos}</div>}

              {/* Botões de Ação (Apenas para o dono) */}
              {usuarioLogado && usuarioLogado.id === card.criado_por_id && (
                <div style={{ marginTop: '5px' }}>
                  <button 
                    onClick={() => iniciarEdicao(card)} // Passa o card para a função
                    style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px', fontSize: '0.8rem' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleExcluir(card.id_card, card.titulo)} 
                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          )}
            </div>
        ))}
      </ul>
    </section>
  )
}


export function GetCardsSubModule({idSubModulo}) {
     // 1. Iniciamos com uma array vazia
  const [ cardsubmodule, setCardSubmodule ] = useState([])
  const [loading, setLoading] = useState(true)
  // Obtendo usuarios para nao mostrar botão de excluir caso condição nao seja verdadeira
  const [ usuarioLogado, setUsuarioLogado ] = useState(null)

  // Novos estados para edição de card
  const [editando, setEditando] = useState(false); // Controla se mostra o texto ou o <input>
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoConteudo, setNovoConteudo] = useState("");
  const [salvando, setSalvando] = useState(false); // Para mostrar um "Salvando..." no botão

  useEffect(() => {
    async function carregarCardsSubModule() {
      if (!idSubModulo) return // Segurança: não busca se não tiver ID

      try {
        setLoading(true)

        const {data: {user}} = await supabase.auth.getUser();
        setUsuarioLogado(user);

        const dados = await dbService.getCardsSubmodule(idSubModulo)
        setCardSubmodule(dados)
      } catch (error) {
        console.error("Erro ao buscar cards:", error.message)
      } finally {
        setLoading(false)
      }
    }

    carregarCardsSubModule()
  }, [idSubModulo]) // Recarrega se o ID do módulo mudar

   if (loading) return <p>Carregando Cards de Submodulos...</p>

   if (cardsubmodule.length == 0) {
    return <p>Nenhum card encontrado</p>
   }

   // Excluindo Card Submodule
   const handleExcluir = async (id_card, titulo) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o card "${titulo}"?`);

    if (confirmar) {
      try {
        await dbService.deleteCard(id_card);

        setCardSubmodule(prev => prev.filter(card => card.id_card !== id_card));

        alert("Card excluído com sucesso!");
      } catch (error) {
        alert("Erro ao excluir: " + error.message);
      }
    }
   };

   // 🔹 NOVA FUNÇÃO: Ativar o modo de edição
  const iniciarEdicao = (card) => {
    setEditando(card.id_card) // Agora guardamos o ID do card específico
    setNovoTitulo(card.titulo); // Preenche o input com o título atual
    setNovoConteudo(card.conteudo); // Preenche o input com a descrição atual
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
        conteudo: novoConteudo
      }
      
      // Salva no banco de dados usando a função que criamos no dvservice
      await dbService.updateCard(editando, dadosAtualizados)
      
      // 🔹 AJUSTE: Atualiza apenas o card editado dentro da array
      setCardSubmodule(prev => 
        prev.map(card => 
          card.id_card === editando ? { ...card, ...dadosAtualizados } : card
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
    <section>
    <ul style={{ paddingLeft: '20px', listStyle: 'none' }}>
      {cardsubmodule.map((card) => (
        <div key={card.id_card} style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          
          {/* 🔹 VERIFICAÇÃO: Este card é o que estou editando? */}
          {editando === card.id_card ? (
            // --- MODO EDIÇÃO ---
            <div>
              <input 
                value={novoTitulo} 
                onChange={(e) => setNovoTitulo(e.target.value)}
                style={{ display: 'block', marginBottom: '5px', width: '100%' }}
              />
              <textarea 
                value={novoConteudo} 
                onChange={(e) => setNovoConteudo(e.target.value)}
                style={{ display: 'block', marginBottom: '5px', width: '100%' }}
              />
              <button onClick={handleSalvarEdicao} disabled={salvando} style={{ color: 'green', marginRight: '10px' }}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button onClick={() => setEditando(null)}>Cancelar</button>
            </div>
          ) : (
            // --- MODO VISUALIZAÇÃO ---
            <div>
              <strong>{card.titulo}</strong>
              {card.conteudo && <p style={{ margin: 0, fontSize: '0.85rem' }}>{card.conteudo}</p>}
              {card.arquivos && <div>{card.arquivos}</div>}

              {/* Botões de Ação (Apenas para o dono) */}
              {usuarioLogado && usuarioLogado.id === card.criado_por_id && (
                <div style={{ marginTop: '5px' }}>
                  <button 
                    onClick={() => iniciarEdicao(card)} // Passa o card para a função
                    style={{ color: 'blue', border: 'none', background: 'none', cursor: 'pointer', marginRight: '10px', fontSize: '0.8rem' }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleExcluir(card.id_card, card.titulo)} 
                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </ul>
  </section>
  )
}

/*
export function GetCardsTitle({ idModulo, abrirModal }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarCards() {
      if (!idModulo) return; // Segurança: não busca se não tiver ID

      try {
        setLoading(true);
        // Usamos a mesma função do seu dbService
        const dados = await dbService.getCardsModule(idModulo);
        setCards(dados);
      } catch (error) {
        console.error("Erro ao buscar cards:", error.message);
      } finally {
        setLoading(false);
      }
    }

    carregarCards();
  }, [idModulo]);

  if (loading) return <p>Carregando títulos...</p>;
  if (cards.length === 0) return "Nenhum Card encontrado";

  return (
   <button className='cardModal'
      onClick={abrirModal} 

    >
        {cards.map((card) => (
            <p key={card.id_card}>{card.titulo}</p>
        ))}

    </button>
  );
}

*/
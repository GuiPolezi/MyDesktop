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

  return (
    <section>
      <ul style={{ paddingLeft: '20px' }}>
        {cardmodule.map((card) => (
            <div key={card.id_card} style={{ marginBottom: '8px' }}>
                <strong>{card.titulo}</strong>
                {card.conteudo && <p style={{ margin: 0, fontSize: '0.85rem' }}>{card.conteudo}</p>}
                {card.arquivos && <div>{card.arquivos}</div>}
                {/* 🔹 Renderização Condicional: Só mostra o botão se o ID do logado for igual ao criado_por_id */}
                {usuarioLogado && usuarioLogado.id === card.criado_por_id && (
                  <button 
                    onClick={() => handleExcluir(card.id_card, card.titulo)} 
                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', marginTop: '5px' }}
                  >
                    Excluir
                  </button>
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

   return (
    <section>
      <ul style={{ paddingLeft: '20px' }}>
        {cardsubmodule.map((card) => (
            <div key={card.id_card} style={{ marginBottom: '8px' }}>
                <strong>{card.titulo}</strong>
                {card.conteudo && <p style={{ margin: 0, fontSize: '0.85rem' }}>{card.conteudo}</p>}
                {card.arquivos && <div>{card.arquivos}</div>}
                {/* 🔹 Renderização Condicional: Só mostra o botão se o ID do logado for igual ao criado_por_id */}
                {usuarioLogado && usuarioLogado.id === card.criado_por_id && (
                  <button 
                    onClick={() => handleExcluir(card.id_card, card.titulo)} 
                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', marginTop: '5px' }}
                  >
                    Excluir
                  </button>
                )}
            </div>
        ))}
      </ul>
    </section>
  )
}

/*

export function DeleteCard() {
    const [loading, setLoading] = useState(true)

    const handleExcluir = async (id, titulo) => {
        const confirmar = window.confirm(`Tem certeza que deseja excluir o card"${titulo}"?`);

        if (confirmar) {
            try {
                await dbService.deleteCard(id)

                alert("Card excluído com sucesso");
            } catch (error) {
                console.error("Erro ao deletar card:", error.message)
            } finally {
                setLoading(false) // Tira o aviso de carregando
            }
        }
    }
}
*/
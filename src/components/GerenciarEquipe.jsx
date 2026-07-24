import { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GetModulo } from './Modulo';


export function CriarEquipe() {
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCriar = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const novaEquipe = await dbService.criarEquipe(nome);
      alert(`Equipe "${novaEquipe.nome}" criada com sucesso!`);
      
      // Redireciona o usuário direto para a página da equipe recém-criada
      navigate(`/equipe/${novaEquipe.id_equipe}`);
    } catch (error) {
      alert("Erro ao criar equipe: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 flex justify-center">
      <div className="w-full max-w-lg glass-card p-8 h-fit">
        <h2 className="text-3xl font-extrabold text-mist mb-2">Nova Equipe</h2>
        <p className="text-fog text-sm mb-6">Crie um espaço de trabalho colaborativo.</p>

        <form onSubmit={handleCriar} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Nome da Equipe *</label>
            <input
              type="text"
              placeholder="Ex: Time de Marketing"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              className="field px-4 py-3"
            />
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Link to="/equipes" className="px-6 py-3 text-fog font-medium hover:bg-white/10 rounded-lg">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 px-8"
            >
              {loading ? 'Criando...' : 'Criar Equipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MembrosEquipe() {
  const { idEquipe } = useParams();
  const [membros, setMembros] = useState([]);
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [adicionando, setAdicionando] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Busca quem já está na equipe
        const membrosAtuais = await dbService.getMembrosDaEquipe(idEquipe);
        setMembros(membrosAtuais);

        // Busca todos os usuários do sistema para o dropdown de convite
        const usuarios = await dbService.getAllUsers();
        setTodosUsuarios(usuarios);
      } catch (error) {
        alert("Erro ao carregar dados: " + error.message);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [idEquipe]);

  const handleAdicionarMembro = async (e) => {
    e.preventDefault();
    if (!usuarioSelecionado) return;
    
    setAdicionando(true);
    try {
      await dbService.adicionarMembroEquipe(idEquipe, usuarioSelecionado);
      alert("Convite enviado com sucesso!");
      
      // Recarrega a lista de membros atualizada
      const membrosAtualizados = await dbService.getMembrosDaEquipe(idEquipe);
      setMembros(membrosAtualizados);
      setUsuarioSelecionado(''); // Limpa o select
    } catch (error) {
      alert(error.message);
    } finally {
      setAdicionando(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando membros...</div>;

  return (
    <div className="p-8 mx-auto min-h-screen">

      {/* Cabeçalho e Navegação */}
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-mist">Membros da Equipe</h1>
          <Link to={`/equipe/${idEquipe}`} className="text-leaf-bright hover:underline text-sm mt-2 inline-block">
            &larr; Voltar para os Módulos da Equipe
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Formulário para Convidar novos membros */}
        <div className="col-span-1 glass-card p-6 h-fit">
          <h3 className="text-lg font-bold text-mist mb-4">Convidar Membro</h3>
          <form onSubmit={handleAdicionarMembro} className="flex flex-col gap-4">
            <select
              value={usuarioSelecionado}
              onChange={e => setUsuarioSelecionado(e.target.value)}
              className="field px-4 py-2"
              required
            >
              <option value="">Selecione um usuário...</option>
              {todosUsuarios.map(user => (
                <option key={user.id_user} value={user.id_user}>
                  {user.nome} ({user.email})
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={adicionando || !usuarioSelecionado}
              className="btn-primary py-2 disabled:opacity-50"
            >
              {adicionando ? 'Enviando...' : 'Enviar Convite'}
            </button>
          </form>
        </div>

        {/* Lista de membros atuais */}
        <div className="col-span-2 glass-card p-6">
          <h3 className="text-lg font-bold text-mist mb-4">Integrantes ({membros.length})</h3>

          <div className="flex flex-col gap-3">
            {membros.map(membro => (
              <div key={membro.id_user} className="flex justify-between items-center p-4 border border-white/10 rounded-lg bg-white/5">
                <div>
                  <p className="font-bold text-mist">{membro.nome}</p>
                  <p className="text-sm text-fog">{membro.email}</p>
                </div>
                {/* 🔹 Estilização dinâmica baseada no status */}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  membro.status === 'pendente'
                    ? 'bg-amber-400/15 text-amber-300'
                    : 'bg-leaf/20 text-leaf-bright'
                }`}>
                  {membro.status === 'pendente' ? 'Aguardando Aceite' : 'Aceito'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}



// Contagem de modulos de equipe em LOOP

export function LoopModuleEquipe({ idEquipe, termoBusca = ''}) {
  const [ listaModulos, setListaModulos ] = useState([])
// Novos estados para a Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalModulos, setTotalModulos] = useState(0);
  const itensPorPagina = 5; // Você pode alterar quantos módulos aparecem por vez aqui  
  useEffect(() => {
    async function carregarQuantidade() {
      try {
        const {dados, total} = await dbService.getModulosDaEquipePaginado(
          idEquipe,
          paginaAtual,
          itensPorPagina, 
          termoBusca,
        );

        setListaModulos(dados);
        setTotalModulos(total);
      } catch (error) {
        console.error("Erro ao contar módulos:", error.message);
      }
    }
    if (idEquipe) {
      carregarQuantidade();
    }

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
  }, [idEquipe, paginaAtual, termoBusca ]);

  // 🔹 Se o usuário começar a digitar uma nova busca, voltamos para a página 1 automaticamente
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoBusca]);
  // Calcula quantas páginas existem no total
  const totalPaginas = Math.ceil(totalModulos / itensPorPagina);

  /*
  // filtra os módulos baseado no que foi digitado (prop termoBusca)
  const modulosFiltrados = listaModulos.filter((m) => {
    // se a busca for vazia, mostra tudo
    if (!termoBusca) return true;

    // converte os dois para minusculo para a busca nar ser sensivel a maiusculas
    return m.titulo?.toLowerCase().includes(termoBusca.toLowerCase());
  })
    */

  /*


  if (modulosFiltrados.length == 0 ) {
    return (
      <div className='text-center text-3xl'>
        <p>Nenhum módulo encontrado para "{termoBusca}"</p>
      </div>

      
    )
  }
  */
  if (listaModulos.length == 0 ) {
    return (
      <div className='text-center text-3xl mt-5'>
          {termoBusca 
            ? <p>Nenhum módulo encontrado para "{termoBusca}"</p>
            : <p>Nenhum módulo criado ainda.</p>
          }
      </div>
    )
  }

  return (
    <div>
      {/* Renderiza os módulos da página atual */}
      {listaModulos.map((m) => (
        <GetModulo key={m.id_modulo} idModulo={m.id_modulo} />
      ))}

      {/* 🔹 Controles de Paginação */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 mb-8">
          <button 
            onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
            disabled={paginaAtual === 1}
            className="btn-ghost px-4 py-2 font-bold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <span className="font-semibold text-lg">
            Página {paginaAtual} de {totalPaginas}
          </span>
          
          <button 
            onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
            className="btn-ghost px-4 py-2 font-bold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  )
}
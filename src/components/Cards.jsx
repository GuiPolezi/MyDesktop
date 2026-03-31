import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { dbService } from '../services/dbService'
import { useNavigate } from "react-router-dom";
import { supabase } from '../services/supabase'; // Importe a instância do supabase para pegar o usuário
import { Link } from 'react-router-dom'

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
    // Container principal centralizado e responsivo
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      
      {/* Card do Formulário (borda superior com a cor do tema) */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100 border-t-4 h-fit" style={{ borderTopColor: '#283618' }}>
        
        {/* Cabeçalho */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          
          {/* Badges de Localização (Mostra onde o usuário está criando o card) */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Card de Conteúdo
            </span>
            <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              Módulo #{idModulo}
            </span>
            {/* Só exibe o badge do Submódulo se ele existir */}
            {idSubModulo && (
              <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                Submódulo #{idSubModulo}
              </span>
            )}
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-800 mt-2">Criar Novo Card</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Adicione informações detalhadas e anexe arquivos ao seu bloco de conteúdo.
          </p>
        </div>

        <form onSubmit={handleCriar} className="flex flex-col gap-6">
          
          {/* Campo: Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título do Card <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              placeholder="Ex: Material de Apoio - Aula 01" 
              value={titulo} 
              onChange={e => setTitulo(e.target.value)} 
              required 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Campo: Conteúdo (Textarea grande) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Conteúdo
            </label>
            <textarea 
              placeholder="Digite o conteúdo principal deste card..." 
              value={conteudo} 
              onChange={e => setConteudo(e.target.value)} 
              rows="6" // Mais alto para caber bastante texto
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-y"
            />
          </div>

          {/* Campo: Upload de Arquivo Estilizado */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Anexar Arquivo
            </label>
            <div className="mt-1 flex items-center">
              <input 
                type="file" 
                onChange={e => setArquivos(e.target.files[0] || null)}
                // O Tailwind tem pseudo-classes específicas para estilizar o botão de file upload (file:)
                className="w-full text-sm text-gray-500
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-gray-100 file:text-gray-700
                  hover:file:bg-gray-200 file:cursor-pointer file:transition-colors
                  border border-gray-300 rounded-lg bg-gray-50 cursor-pointer"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Selecione um arquivo relevante para complementar o conteúdo deste card.
            </p>
          </div>

          {/* Rodapé com Botões */}
          <div className="pt-6 flex justify-end items-center gap-4 mt-2 border-t border-gray-100">
            
            {/* Botão Cancelar (Não se esqueça do import { Link } from 'react-router-dom') */}
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
                'Salvar Card'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
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
  
  // 🔹 NOVOS ESTADOS PARA CONTROLE DE ARQUIVOS NA EDIÇÃO
  const [arquivoAtual, setArquivoAtual] = useState(null); // Guarda o JSON do arquivo que já existe
  const [removerArquivo, setRemoverArquivo] = useState(false); // Flag para saber se o usuário clicou em excluir
  const [novoArquivo, setNovoArquivo] = useState(null); // Guarda o File (novo arquivo selecionado)

  // Declarando controles do modal
  const [cardSelecionado, setCardSelecionado] = useState(false)

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

  if (loading) return <p>Carregando Cards...</p>

  if (cardmodule.length == 0) {
    return <p>Nenhum card encontrado</p>
  }

  // Excluindo Card module
   const handleExcluir = async (id_card, titulo) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o card "${titulo}"?`);

    if (confirmar) {
      try {
        await dbService.deleteCard(id_card);

        setCardmodule(prev => prev.filter(card => card.id_card !== id_card));

        // fecha o modal limpando card selecionado
        setCardSelecionado(null);

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

    // 🔹 PREPARA OS ARQUIVOS
    setArquivoAtual(card.arquivos); // Puxa o JSON salvo no banco
    setRemoverArquivo(false); // Reseta a vontade de remover
    setNovoArquivo(null); // Limpa o input file
  };

   // Nova função para salvar alterações no banco
   const handleSalvarEdicao = async () => {
    if (!novoTitulo.trim()) {
      alert("O titulo não pode estar vázio")
      return;
    }
   

    setSalvando(true);
    try {
      // 1. Define qual será o valor final da coluna 'arquivos' no banco
      let metadadosFinais = arquivoAtual;
      // Se o usuário clicou em remover, apagamos a referência do arquivo
      if (removerArquivo) {
        metadadosFinais = null;
        
        // Opcional: Aqui você também poderia chamar supabase.storage.remove() 
        // para apagar o arquivo fisicamente do bucket e economizar espaço.
        // Só tenta apagar se realmente existir um caminho salvo
        if (arquivoAtual && arquivoAtual.caminho_storage) {
          const { error: removeError } = await supabase.storage
            .from('card-arquivos') // ⚠️ Confirme se o nome do seu bucket é esse mesmo
            .remove([arquivoAtual.caminho_storage]); // Passa o caminho dentro de uma array []

          if (removeError) {
            // Se der erro ao apagar do Storage, mostramos no console para debugar, 
            // mas NÃO travamos o código (o update do card no banco ainda vai acontecer).
            console.error("Aviso: Falha ao apagar arquivo antigo da nuvem:", removeError);
          }
        }
      }

      // Se o usuário selecionou um NOVO arquivo no input, fazemos o upload
      if (novoArquivo) {
        const extensao = novoArquivo.name.split('.').pop();
        const nomeUnico = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extensao}`;

        const { error: uploadError } = await supabase.storage
          .from('card-arquivos')
          .upload(nomeUnico, novoArquivo);

        if (uploadError) throw new Error("Falha ao enviar o novo arquivo para a nuvem.");

        const { data: urlData } = supabase.storage
          .from('card-arquivos')
          .getPublicUrl(nomeUnico);

        // Atualiza os metadados com o arquivo que acabou de subir
        metadadosFinais = {
          nome_original: novoArquivo.name,
          url_publica: urlData.publicUrl,
          caminho_storage: nomeUnico
        };
      }

      const dadosAtualizados = {
        titulo: novoTitulo,
        conteudo: novoConteudo,
        arquivos: metadadosFinais,
      }
      
      // Salva no banco de dados usando a função que criamos no dvservice
      await dbService.updateCard(editando, dadosAtualizados)
      
      // 🔹 AJUSTE: Atualiza apenas o card editado dentro da array
      setCardmodule(prev => 
        prev.map(card => 
          card.id_card === editando ? { ...card, ...dadosAtualizados } : card
        )
      );

      // 🔹 A SOLUÇÃO: Atualiza o card que está aberto no Modal AGORA
      setCardSelecionado((cardAntigo) => ({
        ...cardAntigo,
        ...dadosAtualizados
      }));

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
      <ul className='flex gap-5 mb-30 items-center'>
        {cardmodule.map((card) => (
            <div key={card.id_card}>
              <button onClick={() => setCardSelecionado(card)} className='buttonModalCard w-full md:w-48 h-12 md:h-20'>{card.titulo}</button>
            
            </div>
        ))}
        
      </ul>
      {cardSelecionado && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
  
                  {/* Caixa Principal do Modal (Apenas ELE controla a altura agora) */}
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
                    
                    {/* 🔹 VERIFICAÇÃO: Este card é o que estou editando? */}
                    {editando === cardSelecionado.id_card ? (
                      
                      // --- MODO EDIÇÃO ---
                      <>
                        {/* Cabeçalho Edição (Fixo: flex-shrink-0) */}
                        <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                          <h3 className="text-xl font-bold text-gray-800">Editar Card</h3>
                          <button 
                            className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full" 
                            onClick={() => setEditando(null)}
                          >
                            &times;
                          </button>
                        </div>

                        {/* Formulário de Edição (Com Scroll: flex-1 overflow-y-auto min-h-0) */}
                        <div className="flex-1 overflow-y-auto p-6 min-h-0 flex flex-col gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                            <input 
                              value={novoTitulo} 
                              onChange={(e) => setNovoTitulo(e.target.value)}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                            />
                          </div>
                          
                          <div className="flex flex-col flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Conteúdo</label>
                            <textarea 
                              value={novoConteudo} 
                              onChange={(e) => setNovoConteudo(e.target.value)}
                              rows="12"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-y"
                            />
                          </div>

                          <div>
                            {/* Se o card TIVER um arquivo salvo e o usuário NÃO clicou em remover */}
                            {arquivoAtual && !removerArquivo ? (
                              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                                <div className="flex items-center gap-2 overflow-hidden pr-4">
                                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                  </svg>
                                  <span className="text-sm font-medium text-gray-700 truncate">{arquivoAtual.nome_original}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setRemoverArquivo(true)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded text-sm font-semibold transition-colors flex-shrink-0"
                                >
                                  Excluir Arquivo
                                </button>
                              </div>
                            ) : (
                              /* Se não tiver arquivo salvo OU se o usuário clicou em excluir o antigo, mostra o input para um novo */
                              <div className="flex flex-col gap-2">
                                {removerArquivo && (
                                  <span className="text-xs text-red-500 font-medium italic">Arquivo anterior marcado para exclusão.</span>
                                )}
                                <input 
                                  type="file" 
                                  onChange={(e) => setNovoArquivo(e.target.files[0])}
                                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f0f2eb] file:text-[#606c38] hover:file:bg-[#e6e8e0] cursor-pointer"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Rodapé de Edição (Fixo: flex-shrink-0) */}
                        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                          <button 
                            onClick={() => setEditando(null)} 
                            className="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Cancelar
                          </button>
                          <button 
                            onClick={handleSalvarEdicao} 
                            disabled={salvando} 
                            className="px-5 py-2.5 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all disabled:opacity-70 flex items-center gap-2"
                            style={{ backgroundColor: '#283618' }}
                          >
                            {salvando ? "Salvando..." : "Salvar Alterações"}
                          </button>
                        </div>
                      </>

                    ) : (
                      
                      // --- MODO VISUALIZAÇÃO ---
                      <>
                        {/* Cabeçalho Visualização (Fixo) */}
                        <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                          <h3 className="text-2xl font-extrabold text-gray-800 pr-4 break-words">{cardSelecionado.titulo}</h3>
                          <button 
                            className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0" 
                            onClick={() => setCardSelecionado(null)}
                          >
                            &times;
                          </button>
                        </div>

                        {/* Corpo do Modal (Com Scroll: flex-1 overflow-y-auto) */}
                        <div className="flex-1 overflow-y-auto p-6 min-h-0">
                          {cardSelecionado.conteudo ? (
                            // break-words garante que não corte os lados, whitespace-pre-wrap preserva quebras de linha
                            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap break-words">
                              {cardSelecionado.conteudo}
                            </p>
                          ) : (
                            <p className="text-gray-400 italic">Nenhum conteúdo adicionado a este card.</p>
                          )}

                          {/* Área de Arquivo Anexado (ATUALIZADA PARA O NOVO JSONB) */}
                          {cardSelecionado.arquivos && cardSelecionado.arquivos.url_publica && (
                            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between w-fit pr-8 max-w-full">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <svg className="w-6 h-6 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                </svg>
                                <div className="overflow-hidden">
                                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Anexo</p>
                                  <p className="text-sm font-medium text-gray-800 truncate" title={cardSelecionado.arquivos.nome_original}>
                                    {cardSelecionado.arquivos.nome_original}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Botão de Download ou Visualização */}
                              <a 
                                href={cardSelecionado.arquivos.url_publica} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-6 flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                </svg>
                                Abrir
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Rodapé de Ações (Fixo) */}
                        {usuarioLogado && usuarioLogado.id === cardSelecionado.criado_por_id && (
                          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button 
                              onClick={() => iniciarEdicao(cardSelecionado)} 
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                            >
                              Editar Card
                            </button>
                            <button 
                              onClick={() => handleExcluir(cardSelecionado.id_card, cardSelecionado.titulo)} 
                              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                            >
                              Excluir
                            </button>
                          </div>
                        )}
                      </>

                    )}
                  </div>
              </div>
            )}
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

  // Declarando controles do modal
  const [cardSelecionado, setCardSelecionado] = useState(false)

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
       <ul className='flex gap-5 mb-30 items-center'>
        {cardsubmodule.map((card) => (
            <div key={card.id_card}>
              <button onClick={() => setCardSelecionado(card)} className='buttonModalCard w-full md:w-48 h-12 md:h-20'>{card.titulo}</button>
            
            </div>
        ))}
        
      </ul>

      {cardSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          {/* Caixa Principal do Modal (Apenas ELE controla a altura agora) */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* 🔹 VERIFICAÇÃO: Este card é o que estou editando? */}
            {editando === cardSelecionado.id_card ? (
              // Modo Edição
              <>
                {/*  Cabeçalho edição */}
                <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-xl font-bold text-gray-800">Editar Card</h3>
                  <button 
                    className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full" 
                    onClick={() => setEditando(null)}
                    >
                    &times;
                  </button>
                </div>

                {/* Formulário de Edição (Com Scroll: flex-1 overflow-y-auto min-h-0) */}
                <div className="flex-1 overflow-y-auto p-6 min-h-0 flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                    <input 
                      value={novoTitulo} 
                      onChange={(e) => setNovoTitulo(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Conteúdo</label>
                    <textarea 
                              value={novoConteudo} 
                              onChange={(e) => setNovoConteudo(e.target.value)}
                              rows="12"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 resize-y"
                    />
                  </div>
                </div>

                {/* Rodapé de Edição (Fixo: flex-shrink-0) */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                  <button 
                            onClick={() => setEditando(null)} 
                            className="px-5 py-2.5 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Cancelar
                  </button>
                  <button onClick={handleSalvarEdicao} 
                            disabled={salvando} 
                            className="px-5 py-2.5 text-white font-semibold rounded-lg shadow hover:shadow-lg transition-all disabled:opacity-70 flex items-center gap-2"
                            style={{ backgroundColor: '#283618' }}
                            >
                              {salvando ? "Salvando..." : "Salvar Alterações"}
                            </button>
                </div>
              </>
            ) : (
              // Modo visualização
              <>
                {/* Cabeçalho Visualização (Fixo) */}
                        <div className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                          <h3 className="text-2xl font-extrabold text-gray-800 pr-4 break-words">{cardSelecionado.titulo}</h3>
                          <button 
                            className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0" 
                            onClick={() => setCardSelecionado(null)}
                          >
                            &times;
                          </button>
                        </div>

                        {/* Corpo do Modal (Com Scroll: flex-1 overflow-y-auto) */}
                        <div className="flex-1 overflow-y-auto p-6 min-h-0">
                          {cardSelecionado.conteudo ? (
                            // break-words garante que não corte os lados, whitespace-pre-wrap preserva quebras de linha
                            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap break-words">
                              {cardSelecionado.conteudo}
                            </p>
                          ) : (
                            <p className="text-gray-400 italic">Nenhum conteúdo adicionado a este card.</p>
                          )}

                          {/* Área de Arquivo Anexado (ATUALIZADA PARA O NOVO JSONB) */}
                          {cardSelecionado.arquivos && cardSelecionado.arquivos.url_publica && (
                            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between w-fit pr-8 max-w-full">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <svg className="w-6 h-6 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                </svg>
                                <div className="overflow-hidden">
                                  <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Anexo</p>
                                  <p className="text-sm font-medium text-gray-800 truncate" title={cardSelecionado.arquivos.nome_original}>
                                    {cardSelecionado.arquivos.nome_original}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Botão de Download ou Visualização */}
                              <a 
                                href={cardSelecionado.arquivos.url_publica} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-6 flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                </svg>
                                Abrir
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Rodapé de Ações (Fixo) */}
                        {usuarioLogado && usuarioLogado.id === cardSelecionado.criado_por_id && (
                          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button 
                              onClick={() => iniciarEdicao(cardSelecionado)} 
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                            >
                              Editar Card
                            </button>
                            <button 
                              onClick={() => handleExcluir(cardSelecionado.id_card, cardSelecionado.titulo)} 
                              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                            >
                              Excluir
                            </button>
                          </div>
                        )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );

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
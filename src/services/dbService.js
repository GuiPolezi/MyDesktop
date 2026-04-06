import { supabase } from './supabase'

export const dbService = {
  // 1. Criar Módulo
  async criarModulo(titulo, descricao) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('modulos')
      .insert([{ 
        titulo, 
        descricao, 
        criado_por_id: user.id,
      }])
      .select()

    if (error) throw error
    return data[0] // Retorna o módulo recém-criado (com o ID dele)
  },

  // 1.1 Obter Modulo (Exige ID modulo criado)
  async getModulo(idModulo) {
    const { data, error } = await supabase
    .from('modulos')
    .select('*') // Pega todas as colunas
    .eq('id_modulo', idModulo) // Onde a coluna id_modulo seja igual ao ID passado
    .maybeSingle() // Garante que retorne apenas 1 objeto e nao um array
    

    if (error) throw error
    return data
  },

 // 1.1.1 Obter lista de Modulo
  async getModuloList() {
    const { data, error } = await supabase
    .from('modulos')
    .select('*') // Pega todas as colunas
    .order('id_modulo')

    if (error) throw error
    return data
  },

  // 2. Criar Submódulo (Exige o ID do Módulo pai)
  async criarSubmodulo(titulo, descricao, idModulo) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('submodulos')
      .insert([{ 
        titulo, 
        descricao, 
        id_modulo: idModulo, 
        criado_por_id: user.id 
      }])
      .select()

    if (error) throw error
    return data[0]
  },

  // 2.2 Obter Submodulo (Exige ID_Modulo)
  async getSubmodulo(idModulo) {
    const { data, error } = await supabase
    .from('submodulos')
    .select('*')
    .eq('id_modulo', idModulo)
    .order('id_submodulo', {ascending: false})
    
    if (error) throw error
    return data
  },
  

  // 3. Criar Card (Exige ID do Módulo e do Submódulo)
  async criarCard(titulo, conteudo, arquivoObjeto = null, idModulo, idSubmodulo = null) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Variável para guardar os dados do arquivo (URL e Nome) que vai para o JSONB
    let metadadosArquivo = null;

    // Se o usuário selecionou um arquivo, fazemos o upload primeiro
    if (arquivoObjeto) {
      // 1. Gera um nome único para não sobrescrever arquivos com o mesmo nome
      const extensao = arquivoObjeto.name.split('.').pop();
      const nomeUnico = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extensao}`;
      
      // 2. Faz o upload para o bucket 'card-arquivos'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('card-arquivos')
        .upload(nomeUnico, arquivoObjeto);

      if (uploadError) {
        console.error("Erro no upload do arquivo:", uploadError);
        throw new Error("Falha ao enviar o arquivo para a nuvem.");
      }

      // 3. Pega a URL pública do arquivo recém-enviado
      const { data: urlData } = supabase.storage
        .from('card-arquivos')
        .getPublicUrl(nomeUnico);

      // 4. Monta o objeto JSONB que será salvo na coluna 'arquivos' da tabela 'cards'
      metadadosArquivo = {
        nome_original: arquivoObjeto.name,
        url_publica: urlData.publicUrl,
        caminho_storage: nomeUnico // Guardamos isso caso precise excluir do storage no futuro
      };
    }

    // Agora sim, insere os dados do card na tabela, enviando o JSONB
    const { data, error } = await supabase
      .from('cards')
      .insert([{ 
        titulo, 
        conteudo, 
        arquivos: metadadosArquivo, // Envia o objeto JSON ou null se não tiver arquivo
        id_modulo: idModulo, 
        id_submodulo: idSubmodulo, 
        criado_por_id: user.id 
      }])
      .select();

    if (error) throw error;
    return data[0];
  },
  // 3.3 Obter cards modulo (Exige ID_Modulo)
  async getCardsModule(idModulo) {
    const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id_modulo', idModulo)
    .is('id_submodulo', null)
    .order('id_card', {ascending: false})
    
    if (error) throw error
    return data
  },
  

  // 3.3.3 obter Cards Submodulo (Exige ID_submodulo) 
  async getCardsSubmodule(idSubModulo) {
    const {data, error} = await supabase
    .from('cards')
    .select('*')
    .eq('id_submodulo', idSubModulo)
    .order('id_card', {ascending: false})
    
    if (error) throw error
    return data
  },

  
  // 4. Obter Lista de modulos do usuário logado
  async getLoopModules() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Filtramos diretamente pelo ID do usuário criador
    const { data, error } = await supabase
      .from('modulos')
      .select('*')
      .eq('criado_por_id', user.id) // <- O filtro principal agora é esse
      .is('id_equipe', null)
      .order('id_modulo', { ascending: true }); 
    
    if (error) throw error;
    return data;
  },

  // 4.4 Obter Lista de Modulos paginado
  async getLoopModulesPaginado(paginaAtual = 1, itensPorPagina = 5, termoBusca = '') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Calcula os índices do range para o Supabase (Ex: Página 1 = 0 a 4)
    const from = (paginaAtual - 1) * itensPorPagina;
    const to = from + itensPorPagina - 1;

    // Montamos a base da query, pedindo também a contagem total
    let query = supabase
      .from('modulos')
      .select('*', { count: 'exact' }) 
      .eq('criado_por_id', user.id)
      .is('id_equipe', null)
      .order('id_modulo', { ascending: true })
      .range(from, to);

    // Se o usuário digitou algo na busca, adicionamos o filtro ILIKE (não sensível a maiúsculas)
    if (termoBusca) {
      query = query.ilike('titulo', `%${termoBusca}%`);
    }

    const { data, count, error } = await query;
    
    if (error) throw error;
    
    // Retornamos os dados daquela página E o número total de módulos encontrados
    return { dados: data, total: count }; 
  },

  // 5. Obter nome do usuario
  async getNameUser(idUser) {
    const {data, error} = await supabase
    .from('usuarios')
    .select('*')
    .eq('id_user', idUser)
    .single() // Obtendo apenas o objeto e nao a lista

    if (error) throw error
    return data
  },

  // 6. Obter usuario completo
  async getUsers() {
    const {data: {user} } = await supabase.auth.getUser()
    if (!user) return null;

    const {data, error} = await supabase
    .from('usuarios')
    .select('*')
    .eq('id_user', user.id)
    .single()

    if (error) throw error
    return data
  },


  // 7. Obter todos os usuarios (para painel admin)
  async getAllUsers() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome', { ascending: true })

    if (error) throw error
    return data
  },

  // 8 Obter apenas um submodulo por id
  async getSubmoduloById(idSubmodulo) {
    const { data, error } = await supabase
      .from('submodulos')
      .select('*')
      .eq('id_submodulo', idSubmodulo)
      .maybeSingle(); // 🔹 .maybeSingle() garante que o Supabase devolva apenas UM objeto, e não uma array (lista)

    if (error) {
      console.error("Erro no getSubmoduloById:", error);
      throw error;
    }
    
    return data;
  },

  /* ------------ EXCLUSÕES --------- */

 // Excluir Card (e o arquivo atrelado a ele no Storage)
  async deleteCard(idCard) {
    // 1. Apaga a linha do banco de dados e traz os dados dela de volta
    const { data, error } = await supabase
      .from('cards')
      .delete()
      .eq('id_card', idCard)
      .select() 
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      throw new Error("Ação não permitida. Apenas o criador pode excluir este card.");
    }

    // Pega o objeto do card que acabou de ser apagado
    const cardDeletado = data[0];

    // 2. Verifica se havia um arquivo atrelado a este card
    if (cardDeletado.arquivos && cardDeletado.arquivos.caminho_storage) {
      
      // 3. Pede para o Storage excluir o arquivo usando o nome único salvo
      const { error: storageError } = await supabase.storage
        .from('card-arquivos') // Confirme se o nome do bucket é esse mesmo
        .remove([cardDeletado.arquivos.caminho_storage]);

      if (storageError) {
        // Se der erro no storage, mostramos no console, mas não travamos o app, 
        // pois o card já foi apagado do banco de dados com sucesso.
        console.error("Atenção: O card foi excluído, mas houve um erro ao apagar o arquivo da nuvem:", storageError);
      }
    }

    return data;
  },

  // Excluir Modulo
  async deleteModule(idModulo) {
    const {data, error} = await supabase
    .from('modulos')
    .delete()
    .eq('id_modulo', idModulo) // Filtra pelo id
    .select() // 🔹 Obriga o Supabase a devolver a linha que foi apagada

    if (error) throw error
    // Aqui nós forçamos o erro para o React entender que falhou!
    if (!data || data.length === 0) {
      throw new Error("Ação não permitida. Apenas o criador pode excluir este modulo.");
    }
    return data

  },

  // Excluir SubModulo
  async deleteSubModule(idSubModulo) {
    const { data, error } = await supabase
    .from('submodulos')
    .delete()
    .eq('id_submodulo', idSubModulo) // Filtra pelo id
    .select() // Obriga o supabase devolver a linha que foi apagada

    if (error) throw error
    // Aqui nós forçamos o erro para o React entender que falhou!
    if (!data || data.length === 0) {
      throw new Error("Ação não permitida. Apenas o criador pode excluir este submodulo.");
    }
    return data
  },


  /* ------------- Edições ------------ */

  // Editar Card
  async updateCard(idCard, dadosAtualizados) {
    try {
      const { data, error } = await supabase
      .from('cards') // Nome da tabela
      .update(dadosAtualizados) // Passando objeto com as alterações
      .eq('id_card', idCard) // Garante que apenas o card com id especificado seja alterado
      .select() // Opcional: Faz o supabase devolver o objeto atualizado
  
      if (error) {
        throw new Error(error.message)
      }
  
      return data;
    } catch (error) {
      console.error("Erro no dbservice ao tentar atualizar dados de Card")
      throw error;
    }
    
  },

  // Editar Módulo
  async updateModule(idModulo, dadosAtualizados) {
    try {
      const {data, error} = await supabase
      .from('modulos') // Nome da tabela
      .update(dadosAtualizados) // Passando objeto com as alterações
      .eq('id_modulo', idModulo) // Garante que apenas o modulo com id especificado seja alterado
      .select() // Opcional: Faz supabase devolver o objeto atualizado
    
      if (error) {
        throw new Error(error.message)
      }

      return data;
    } catch (error) {
      console.error("Erro no dbservice ao tentar atualizar Módulo")
      throw error;
    }
  },

  // Editar submódulo
  async updateSubmodule(idSubModulo, dadosAtualizados) {
    try {
      const {data, error } = await supabase
      .from('submodulos')
      .update(dadosAtualizados)
      .eq('id_submodulo', idSubModulo)
      .select()

      if (error) {
        throw new Error(error.message)
      }

      return data;
    } catch (error) {
      console.error("Erro no dbservice ao tentar atualizar SubMódulo")
      throw error;
    }
  },



/* --------------- Funções de Equipe ---------------------- */

  // Criar nova equipe
  async criarEquipe(nome) {
    const {data: {user}} = await supabase.auth.getUser();

    // Cria a equipe
    const {data: equipe, error: equipeError} = await supabase
    .from('equipes')
    .insert([{nome, criado_por_id: user.id}])
    .select()
    .single();

    if (equipeError) throw equipeError;
    
    // Adiciona o criador automaticamente como membro aceito
    const {error: membroError} = await supabase
    .from('membros_equipe')
    .insert([{
      id_equipe: equipe.id_equipe,
      id_user: user.id,
      status: 'aceito'
    }]);

    if (membroError) throw membroError;

    return equipe
  },


// Criar Módulo vinculado a uma Equipe
  async criarModuloEquipe(titulo, descricao, idEquipe) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('modulos')
      .insert([{ 
        titulo, 
        descricao, 
        criado_por_id: user.id,
        id_equipe: idEquipe // A mágica acontece aqui
      }])
      .select();

    if (error) throw error;
    return data[0];
  },


  // Buscar todas as equipes que o usuário logado participa
  async getMinhasEquipes() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    // Busca na tabela de junção (membros_equipe) e traz os dados da tabela equipes
    const { data, error } = await supabase
      .from('membros_equipe')
      .select(`
        id_equipe,
        status,
        equipes (
          id_equipe,
          nome,
          criado_por_id
        )
      `)
      .eq('id_user', user.id)
      .eq('status', 'aceito'); // Traz apenas as que ele já aceitou participar

    if (error) throw error;

    // O Supabase retorna um objeto aninhado. Vamos mapear para facilitar o uso no React:
    // Exemplo de retorno formatado: [ { id_equipe: '...', nome: '...', criado_por_id: '...' } ]
    return data.map(item => item.equipes);
  },

  // Buscar os módulos que pertencem a uma equipe específica
  async getModulosDaEquipe(idEquipe) {
    const { data, error } = await supabase
      .from('modulos')
      .select('*')
      .eq('id_equipe', idEquipe) // Filtra apenas os módulos desta equipe
      .order('id_modulo', { ascending: true }); 
    
    if (error) throw error;
    return data;
  },

  // Adicionar um usuário à equipe
  async adicionarMembroEquipe(idEquipe, idUserAdicionado) {
    // No futuro, você pode mudar para 'pendente' e criar uma tela de "Convites Recebidos".
    const { data, error } = await supabase
      .from('membros_equipe')
      .insert([{ 
        id_equipe: idEquipe, 
        id_user: idUserAdicionado,
        status: 'pendente' 
      }])
      .select();

    if (error) {
      // Tratamento amigável caso tente adicionar alguém que já está na equipe
      if (error.code === '23505') { 
        throw new Error("Este usuário já é membro ou ja foi convidado para esta equipe.");
      }
      throw error;
    }
    return data[0];
  },

  // Buscar os membros de uma equipe específica
  async getMembrosDaEquipe(idEquipe) {
    // Vamos fazer um JOIN com a sua tabela 'usuarios' para pegar o nome e email deles
    const { data, error } = await supabase
      .from('membros_equipe')
      .select(`
        status,
        criado_em,
        usuarios (
          id_user,
          nome,
          email
        )
      `)
      .eq('id_equipe', idEquipe);

    if (error) throw error;
    
    // Formatando o retorno para ficar mais fácil de usar no React
    return data.map(membro => ({
      ...membro.usuarios,
      status: membro.status,
      entrou_em: membro.criado_em
    }));
  },

  // Buscar convites de equipe
  async getConvitesPendentes() {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('membros_equipe')
      .select(`
        id_equipe,
        equipes ( nome )
      `)
      .eq('id_user', user.id)
      .eq('status', 'pendente');

    if (error) throw error;
    
    // Retorna formatado: [{ id_equipe: '...', nome: 'Time X' }]
    return data.map(convite => ({
      id_equipe: convite.id_equipe,
      nome: convite.equipes.nome
    }));
  },

  // Resposta ao convite
  async responderConvite(idEquipe, aceito) {
    const { data: { user } } = await supabase.auth.getUser();

    if (aceito) {
      // Se aceitou, muda o status para 'aceito'
      const { error } = await supabase
        .from('membros_equipe')
        .update({ status: 'aceito' })
        .eq('id_equipe', idEquipe)
        .eq('id_user', user.id);
      if (error) throw error;
    } else {
      // Se recusou, simplesmente apaga a linha da tabela
      const { error } = await supabase
        .from('membros_equipe')
        .delete()
        .eq('id_equipe', idEquipe)
        .eq('id_user', user.id);
      if (error) throw error;
    }
  },


}


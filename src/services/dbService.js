import { supabase } from './supabase'

export const dbService = {
  // 1. Criar Módulo
  // Atualizando para receber setorPermitido
  async criarModulo(titulo, descricao, setorPermitido = 'todos') {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('modulos')
      .insert([{ 
        titulo, 
        descricao, 
        criado_por_id: user.id,
        setor_permitido: setorPermitido,
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

  // 4. Obter Lista de modulos com funções de filtragem
  async getLoopModules() {
    // Primeiro descobre o usuario e qual o setor dele
    const usuario = await this.getUsers();
    if (!usuario) throw new Error('usuario não autenticado');

    const setorDoUser = usuario.setor;

    let query = supabase
      .from('modulos')
      .select('*') // Traz a lista de objetos
      .order('id_modulo', { ascending: true }); 
    
    // Regra de negocio: se não for admin, filtra os modulos
    if (setorDoUser !== 'administrador') {
      // retorna os modulos onde setor_permitido é 'todos' ou igual ao setor do usuario
      query = query.or(`setor_permitido.eq.todos,setor_permitido.eq.${setorDoUser}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;

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

   // Editar setor do usuario (para painel admin)
  async updateSetorUser(idUser, novoSetor) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ setor: novoSetor })
      .eq('id_user', idUser)
      .select()

    if (error) throw error
    return data
  },

  // Editar setor Permitido do modulo (para painek admin)
  async updateSetorPermitido(idModulo, novoSetorPermitido) {
    const {data, error} = await supabase
    .from('modulos')
    .update({setor_permitido: novoSetorPermitido})
    .eq('id_modulo', idModulo)
    .select()

    if (error) throw error
    return data
  }

}

# 🔧 INSTRUÇÕES DE CONFIGURAÇÃO DO SUPABASE

Este arquivo contém todas as instruções necessárias para configurar corretamente o backend Supabase para o sistema VyntrixHost funcionar adequadamente.

## 📋 PRÉ-REQUISITOS

Antes de começar, certifique-se de que você tem:
- Uma conta no Supabase (https://supabase.com)
- Um projeto criado no Supabase
- Acesso ao painel administrativo do seu projeto

---

## 🔐 SEÇÃO 1: CONFIGURAÇÃO DE AUTENTICAÇÃO

### Desativar Confirmação de Email (Desenvolvimento)

Para facilitar o desenvolvimento e testes, você deve desativar a confirmação obrigatória de email:

1. **Acesse seu painel do Supabase**
2. **Navegue para**: `Authentication` → `Providers` → `Email`
3. **Localize a opção**: `Confirm email`
4. **Desative** esta opção (toggle para OFF)
5. **Clique em** `Save` para salvar as alterações

> ⚠️ **IMPORTANTE**: Em produção, recomenda-se manter a confirmação de email ativada para maior segurança.

---

## 🛡️ SEÇÃO 2: POLÍTICAS DE SEGURANÇA DE NÍVEL DE LINHA (RLS)

As políticas RLS são essenciais para garantir que os usuários só possam acessar seus próprios dados na tabela `profiles`.

### Execute os seguintes comandos SQL no Editor SQL do Supabase:

```sql
-- Habilitar RLS na tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política de SELECT: Usuários podem ler apenas seu próprio perfil
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Política de INSERT: Usuários podem criar apenas seu próprio perfil
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Política de UPDATE: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
```

### Como executar:

1. **Acesse**: `SQL Editor` no painel do Supabase
2. **Cole o código SQL** acima
3. **Clique em** `Run` para executar
4. **Verifique** se não há erros na execução

---

## ⚡ SEÇÃO 3: GATILHO DE SINCRONIZAÇÃO DE PERFIL

É necessário criar um sistema automático que sincronize a tabela `auth.users` com a `public.profiles` sempre que um novo usuário se registrar.

### Execute o seguinte código SQL:

```sql
-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Verificar se o perfil já existe para evitar duplicatas
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = new.id) THEN
    RETURN new;
  END IF;
  
  INSERT INTO public.profiles (id, name, email, role, created_at, updated_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'client',
    now(),
    now()
  );
  
  -- Log para debug (opcional)
  RAISE NOTICE 'Perfil criado para usuário: %', new.email;
  
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- Se já existe, apenas retorna sem erro
    RETURN new;
  WHEN OTHERS THEN
    -- Log do erro mas não falha o registro
    RAISE NOTICE 'Erro ao criar perfil para %: %', new.email, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que executa a função após inserção na auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### Como executar:

1. **Acesse**: `SQL Editor` no painel do Supabase
2. **Cole o código SQL** acima
3. **Clique em** `Run` para executar
4. **Verifique** se a função e o trigger foram criados com sucesso

---

## 🔑 SEÇÃO 4: CONFIGURAÇÃO DAS VARIÁVEIS DE AMBIENTE

No seu projeto React, crie um arquivo `.env` na raiz com as seguintes variáveis:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### Como obter essas informações:

1. **Acesse**: `Settings` → `API` no painel do Supabase
2. **Copie a URL** do projeto (Project URL)
3. **Copie a chave anônima** (anon/public key)
4. **Cole no arquivo** `.env` substituindo os valores

---

## 🧪 SEÇÃO 5: TESTE DE VALIDAÇÃO

Após seguir todas as instruções acima, teste o sistema:

### Teste de Registro:
1. **Acesse a página de registro** do seu aplicativo
2. **Preencha os campos**: nome, email e senha
3. **Clique em** "Criar Conta"
4. **Verifique** se o usuário foi criado em `Authentication` → `Users`
5. **Verifique** se o perfil foi criado na tabela `profiles`

### Teste de Login:
1. **Acesse a página de login**
2. **Use as credenciais** do usuário criado
3. **Clique em** "Entrar"
4. **Verifique** se o redirecionamento funciona corretamente

---

## 🆘 SOLUÇÃO DE PROBLEMAS

### Erro: "Row Level Security policy violation"
- **Causa**: Políticas RLS não configuradas corretamente
- **Solução**: Execute novamente os comandos da Seção 2

### Erro: "User not found in profiles table"
- **Causa**: Trigger de sincronização não funcionando
- **Solução**: Execute novamente os comandos da Seção 3 e verifique se o trigger está ativo

### Erro: "Usuário consegue criar conta mas não consegue logar"
- **Causa**: Perfil não foi criado automaticamente ou há delay na sincronização
- **Solução**: 
  1. Verifique se o trigger está funcionando: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';`
  2. Se necessário, execute manualmente: `SELECT public.handle_new_user();`
  3. Verifique se existem perfis órfãos: `SELECT * FROM auth.users WHERE id NOT IN (SELECT id FROM public.profiles);`

### Erro: "Invalid API key"
- **Causa**: Variáveis de ambiente incorretas
- **Solução**: Verifique e atualize o arquivo `.env` conforme Seção 4

---

## ✅ CHECKLIST FINAL

Marque cada item conforme completar:

- [ ] Confirmação de email desativada (Seção 1)
- [ ] Políticas RLS criadas e ativas (Seção 2)
- [ ] Função e trigger de sincronização criados (Seção 3)
- [ ] Variáveis de ambiente configuradas (Seção 4)
- [ ] Teste de registro realizado com sucesso (Seção 5)
- [ ] Teste de login realizado com sucesso (Seção 5)

---

## 📞 SUPORTE

Se você encontrar problemas após seguir todas as instruções:

1. **Verifique os logs** no console do navegador (F12)
2. **Consulte a documentação** do Supabase: https://supabase.com/docs
3. **Verifique se todas as etapas** foram executadas corretamente

---

**🎉 Parabéns! Seu sistema de autenticação VyntrixHost está configurado e funcionando!**
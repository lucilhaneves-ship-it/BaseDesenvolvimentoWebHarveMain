# CRM de Clientes — Projeto-modelo da oficina

Repositório-modelo para a oficina em que a turma transforma uma planilha de
clientes em um aplicativo web. A estrutura base (projeto, estilo e conexão
com o banco de dados) já está pronta — a lista, o formulário, a busca e a
edição de clientes serão construídos durante a aula, em
[app/page.tsx](app/page.tsx).

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) via `@supabase/supabase-js`
- Sem autenticação (fora do escopo desta oficina)

## Passo a passo de setup

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.local.example .env.local
```

Abra `.env.local` e preencha com os dados do seu projeto Supabase
(painel do Supabase: **Project Settings > API**):

- `NEXT_PUBLIC_SUPABASE_URL` → campo "Project URL"
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → campo "Project API keys > anon public"

> O arquivo `.env.local` nunca deve ser commitado — ele já está listado no
> `.gitignore`.

### 3. Criar a tabela no Supabase

No painel do Supabase, vá em **SQL Editor > New query**, cole o conteúdo de
[supabase/schema.sql](supabase/schema.sql) e clique em **Run**.

Isso cria a tabela `clientes` com os campos: `id`, `nome`, `telefone`,
`email`, `cidade`, `status` (`ativo`/`inativo`), `observacoes` e `criado_em`.

Se quiser começar com alguns clientes de exemplo, descomente os `insert`
comentados no final do arquivo antes de rodar.

### 4. Rodar o projeto

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura do projeto

```
app/
  layout.tsx        # layout raiz (fonte, metadata)
  page.tsx           # tela inicial — aqui a turma vai construir a lista e o formulário
  globals.css         # estilos globais (Tailwind)
lib/
  supabase.ts         # cliente do Supabase, pronto para uso
supabase/
  schema.sql           # SQL para criar a tabela "clientes"
.env.local.example      # modelo das variáveis de ambiente
```

## Durante a oficina

A partir daqui, a turma vai:

1. Buscar os clientes cadastrados no Supabase (`lib/supabase.ts`).
2. Exibir a lista de clientes na tela.
3. Criar um formulário de cadastro.
4. Adicionar busca/filtro.
5. Permitir editar e excluir clientes.

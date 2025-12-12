# Brevly 🔗

Encurtador de URLs moderno e eficiente, desenvolvido com Node.js, React e PostgreSQL.

## 📋 Funcionalidades

- **Criar links encurtados** - Transforme URLs longas em links curtos e personalizados
- **Listagem de links** - Visualize todos os seus links encurtados em uma interface limpa
- **Contador de acessos** - Acompanhe quantas vezes cada link foi acessado
- **Redirecionamento automático** - Acesse o link encurtado e seja redirecionado automaticamente
- **Deletar links** - Remova links que não são mais necessários
- **Exportar para CSV** - Baixe um relatório com todos os seus links

## 🛠️ Tecnologias

### Backend
- **Node.js** com **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Tipagem estática para maior segurança
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM moderno para TypeScript
- **Zod** - Validação de schemas
- **Cloudflare R2** - Armazenamento de arquivos CSV

### Frontend
- **React** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário

## 🚀 Como rodar o projeto

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **pnpm** - Gerenciador de pacotes
- **Docker** - Para rodar o banco de dados PostgreSQL

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd <pasta-do-repositorio>
```

### 2. Configurar o Backend

```bash
# Navegar para a pasta do backend
cd back

# Instalar dependências
pnpm install

# Copiar arquivo de exemplo das variáveis de ambiente
cp .env.example .env
```

**Edite o arquivo `.env`** e configure as variáveis necessárias:

```env
# Cloudflare R2 (para exportação de CSV)
CLOUDFLARE_ACCOUNT_ID="seu-account-id"
CLOUDFLARE_ACCESS_KEY_ID="sua-access-key"
CLOUDFLARE_SECRET_ACCESS_KEY="sua-secret-key"
CLOUDFLARE_BUCKET="nome-do-bucket"
CLOUDFLARE_PUBLIC_URL="url-publica-do-bucket"
```

> **Nota:** Se você não tiver Cloudflare R2 configurado, a funcionalidade de exportar CSV não funcionará, mas as outras funcionalidades continuarão operando normalmente.

```bash
# Subir o banco de dados PostgreSQL com Docker
docker-compose up -d

# Gerar as migrações do banco
pnpm db:generate

# Executar as migrações
pnpm db:migrate

# Iniciar o servidor de desenvolvimento
pnpm run dev
```

O backend estará rodando em `http://localhost:3333`

### 3. Configurar o Frontend

Abra um **novo terminal** e execute:

```bash
# Navegar para a pasta do frontend
cd front/web

# Instalar dependências
pnpm install

# Criar arquivo de variáveis de ambiente
echo "VITE_API_URL=http://localhost:3333" > .env

# Iniciar o servidor de desenvolvimento
pnpm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 📝 Como usar

1. Acesse `http://localhost:5173` no seu navegador
2. No formulário "Novo link":
   - Insira a URL original (ex: `https://www.google.com.br`)
   - Defina um slug personalizado (ex: `google`)
   - Clique em "Salvar link"
3. Seu link encurtado será `http://localhost:5173/google`
4. Compartilhe o link encurtado - ao acessá-lo, será redirecionado para a URL original
5. Acompanhe os acessos na lista "Meus links"


## 📚 Documentação da API

Com o backend rodando, acesse `http://localhost:3333/docs` para visualizar a documentação completa da API com Swagger UI.


## 📄 Licença

ISC

📦 Online Shop – Projeto Acadêmico
Aplicação web desenvolvida em React + TypeScript + Vite, utilizando Redux Toolkit para gerenciamento de estado, Ant Design para componentes visuais e armazenamento em LocalStorage para persistência de dados.
O objetivo é simular um e-commerce completo, contendo gestão de produtos, clientes, usuários administradores e compras.

🚀 Tecnologias Utilizadas
React 18 + Vite


TypeScript


Ant Design (UI)


Redux Toolkit


React Router DOM


LocalStorage (persistência)


Axios (requisições API)


Dayjs (datas)


Fakestore API (base inicial dos produtos)
🔧 Como Executar o Projeto
1️⃣ Instale o Node.js
Baixe em: https://nodejs.org/

 Versão recomendada: LTS
Verifique no terminal:
node -v
npm -v


2️⃣ Instale o Yarn
O projeto é baseado em Yarn:
npm install --global yarn


3️⃣ Baixe o projeto
Via git:
git clone https://github.com/lucasSanto5s/LojaOnline.git
cd LojaOnline
Ou copie manualmente para o PC.

4️⃣ Instale as dependências
yarn


5️⃣ Execute o projeto
yarn dev

Abra no navegador:
 👉 http://localhost:5173/

6️⃣ Build para produção
yarn build
yarn preview


🔑 Credenciais de Acesso (Seed)
Estão definidas em utils/seed.ts e salvas no LocalStorage ao iniciar o projeto pela primeira vez.
ADMIN:
E-mail: admin@admin.com
Senha: admin123
Função: Administrador

USUÁRIO:
E-mail: user@demo.com
Senha: user123
Função: Usuário comum

🛒 Funcionalidades do Sistema
🔐 Autenticação
Login com email e senha.


Logout.


Usuário logado fica salvo no LocalStorage.


Proteção de rotas com ProtectedRoute.


Rotas exclusivas para admin com AdminRoute.



🛍️ Produtos
✔ Listagem
 ✔ Busca por nome
 ✔ Edição (apenas admin)
 ✔ Exclusão (apenas admin)
 ✔ Criação de novo produto
 ✔ Persistência via LocalStorage
 ✔ Dados iniciais carregados da FakeStore API
 ✔ Botão Buy que adiciona ao carrinho
 ✔ Aviso ao tentar comprar sem login

👥 Clientes
✔ Listagem com tabela Ant Design
 ✔ Edição (apenas admin)
 ✔ Exclusão com modal de confirmação
 ✔ Criação de novo cliente
 ✔ Agrupamento de colunas (First Name / Last Name)
 ✔ Datas aleatórias geradas automaticamente
 ✔ Ordenação por Nome, Data e Status
 ✔ Persistência via LocalStorage
 ✔ Dados iniciais carregados de API externa (jsonplaceholder)

🧑‍💼 Usuários (Admins e Usuários Comuns)
✔ Listagem de usuários
 ✔ Criação de novos usuários
 ✔ Edição
 ✔ Exclusão
 ✔ Persistência LocalStorage
 ✔ Atualização sincronizada com usuário logado

🧾 Pedidos (Orders)
✔ Cada compra gera um pedido salvo no LocalStorage
 ✔ Pedido contém: itens, preço total, usuário, data
 ✔ Visível futuramente no perfil do usuário

👤 Perfil do Usuário
✔ Exibe dados pessoais
 ✔ Permite editar Nome / Email / Avatar
 ✔ Avatar permite upload de imagem LOCAL BASE64 (sem servidor)
 ✔ Histórico de compras integrado ao OrdersSlice

🧺 Carrinho
✔ Adicionar produtos
 ✔ Alterar quantidade
 ✔ Remover item
 ✔ Limpar carrinho
 ✔ Finalizar compra → gera um Order
 ✔ Carrinho salvo no LocalStorage
 ✔ Bloqueado para usuários não logados

🎨 Estilo e Layout
Toda a interface usa:
Ant Design Theme


Light/Dark mode global


Componentes reutilizáveis (AppLayout, HeaderBar etc.)


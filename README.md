# Zebra Tours Moçambique - Portal Web & Plataforma de Gestão

Plataforma profissional e independente desenvolvida para a **Zebra Tours Moçambique**, inspirada na estrutura funcional de portais de turismo de referência internacional e nacional, com identidade visual própria, motor de reservas/cotações, base de dados relacional SQLite e painel administrativo completo.

---

## 1. Identidade e Dados Institucionais
- **Nome Oficial:** Zebra Tours Moçambique
- **Slogan:** *O seu próximo destino começa aqui!*
- **Mensagem de Marca:** *Mais do que organizar viagens, criamos oportunidades para descobrir o mundo.*
- **Telefone / WhatsApp Oficial:** `+258 85 104 1826`
- **Sede:** Maputo, Moçambique
- **Moeda Padrão:** Metical Moçambicano (MZN / MT)
- **Serviços Principais:** Passagens aéreas nacionais e internacionais, reservas de hotel e alojamento, pacotes turísticos completos, viagens de lazer e negócios, escapadinhas de fim de semana, assistência ao viajante 24/7 e orientação sobre vistos.

---

## 2. Arquitetura do Sistema

A aplicação é executada num ambiente full-stack moderno e unificado:
- **Runtime:** Node.js 22 + TypeScript + Express + Vite
- **Frontend SPA:** React 19, TypeScript, Tailwind CSS e Lucide Icons
- **Base de Dados:** SQLite nativa de alto desempenho através de `node:sqlite` (`DatabaseSync`) em `./database/zebratours.db`
- **API RESTful:** Autenticação com sessões persistentes e Bearer token, registos de auditoria, gerador de códigos de cotação únicos (`ZT-2026-XXXX`), exportação de reservas para CSV e geração dinâmica de `sitemap.xml` e `robots.txt`
- **Interface e Conversão:** Responsiva (mobile-first), com ligação direta ao WhatsApp e formulários validados

---

## 3. Estrutura de Ficheiros

```text
├── database/
│   ├── schema.sql           # Schema SQL relacional com chaves estrangeiras e índices
│   ├── seed.sql             # Dados iniciais, destinos, pacotes e definições
│   ├── migrations/          # Scripts de migração incremental da base de dados
│   └── zebratours.db        # Base de dados SQLite persistente
├── public/
│   └── assets/              # Logótipos e recursos visuais estáticos
├── src/                     # Frontend React SPA
│   ├── components/          # Header, Hero, SearchEngine, PackageCard, Modals, AdminDashboard
│   ├── types/               # Tipagem TypeScript estrita
│   ├── utils/               # Lógica de negócio, validações, gerador de referência e links WhatsApp
│   ├── App.tsx              # Aplicação principal
│   ├── index.css            # Tailwind CSS e tipografia
│   └── main.tsx             # Ponto de montagem React
├── server.ts                # Servidor Express Full-stack com SQLite nativo e Vite middleware
├── package.json             # Dependências e scripts
└── README.md                # Documentação técnica e operacional
```

---

## 4. Instruções de Instalação e Execução

```bash
# 1. Instalar dependências
npm install

# 2. Executar testes de unidade de lógica pura
npm test

# 3. Iniciar servidor de desenvolvimento (Porta 3000)
npm run dev

# 4. Compilar para produção
npm run build
npm run start
```

---

## 5. Acesso Administrativo e Credenciais
- **URL de Acesso:** Clique em **"Área de Gestão"** no cabeçalho superior do website ou aceda à interface administrativa.
- **Email do Administrador:** `admin@zebratours.co.mz`
- **Palavra-passe Inicial:** `ZebraAdmin2026!`
- **Capacidades do Painel:**
  - Métricas e dashboard em tempo real.
  - Gestão de pedidos de cotação: alteração de estado (*Pendente*, *Em análise*, *Contactado*, *Confirmado*, *Cancelado*) e adição de **notas internas confidenciais** visíveis apenas para os consultores.
  - CRUD completo de pacotes turísticos com edição de preços em MT, datas, validade, condições e estado (*Publicado*, *Rascunho*, *Pendente de Validação*).
  - CRUD de destinos turísticos.
  - Gestão de mensagens recebidas.
  - Definições globais da empresa (telefones, WhatsApp, morada, slogan, missão e visão).
  - Consulta de histórico de auditoria.

---

## 6. Nota de Conformidade do Pacote Promocional Cape Town
Em cumprimento estrito das diretrizes do projeto:
- O pacote de **Cape Town** foi registado com base nos dados do cartaz de referência:
  - Destino: Cape Town, África do Sul
  - Período anunciado: 31 de Outubro a 02 de Novembro (2 noites)
  - Preço anunciado: 59.500 MT por pessoa (base quarto duplo)
  - Inclui: Passagem aérea de ida e volta, 2 noites de hotel e assistência na viagem.
  - Telefone para reservas: `+258 85 104 1826`
- **Estado Inicial:** Registado como **Pendente de Validação Operacional** com aviso transparente ao utilizador de que as datas operacionais, companhia aérea e disponibilidade efetiva dependem de validação e confirmação da agência no momento do pedido de cotação.
- O administrador pode alterar as datas, preços e estado diretamente pelo painel administrativo.

---

## 7. Testes Executados
1. **Testes de Unidade (`src/utils/travel-logic.test.ts`):**
   - Geração de código de referência no padrão `ZT-2026-XXXX`.
   - Formatação monetária em Meticais com separador de milhares em ponto (`59.500 MT`).
   - Construção de link de WhatsApp com codificação URI limpa para o número `+258 85 104 1826`.
   - Validação de datas (partida válida e regresso posterior à partida).
   - Validação de campos obrigatórios e formato de email/telefone.
   - Filtros combinados e ordenação por preço e duração.
   - **Resultado:** 6 de 6 testes passaram com sucesso.

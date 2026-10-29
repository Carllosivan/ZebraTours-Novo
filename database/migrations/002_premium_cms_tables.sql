-- ========================================================
-- Zebra Tours Moçambique - Migração 002: Premium CMS & Centro de Gestão
-- Adiciona tabelas de páginas editoriais, banners, navegação,
-- biblioteca multimédia e histórico de pedidos comerciais
-- ========================================================

PRAGMA foreign_keys = ON;

-- 1. Páginas Editoriais do Website (CMS de Conteúdos)
CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    status TEXT NOT NULL DEFAULT 'publicado' CHECK (status IN ('publicado', 'rascunho')),
    seo_title TEXT,
    seo_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Banners e Campanhas Promocionais
CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    button_text TEXT,
    button_url TEXT,
    start_date TEXT,
    end_date TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Itens de Navegação Configuráveis
CREATE TABLE IF NOT EXISTS navigation_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    is_external INTEGER NOT NULL DEFAULT 0,
    location TEXT NOT NULL DEFAULT 'header' CHECK (location IN ('header', 'footer', 'both')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Biblioteca Multimédia Centralizada
CREATE TABLE IF NOT EXISTS media_library (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    title TEXT,
    alt_text TEXT,
    category TEXT DEFAULT 'geral',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Histórico de Seguimento Comercial de Reservas e Pedidos
CREATE TABLE IF NOT EXISTS booking_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL REFERENCES booking_requests(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    action TEXT NOT NULL,
    notes TEXT,
    old_status TEXT,
    new_status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Índices para Otimização
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_banners_status ON banners(status);
CREATE INDEX IF NOT EXISTS idx_media_filename ON media_library(filename);
CREATE INDEX IF NOT EXISTS idx_booking_history_bid ON booking_history(booking_id);

-- 7. Seeds Iniciais para Páginas Institucionais
INSERT OR IGNORE INTO pages (id, title, slug, excerpt, content, status, seo_title, seo_description) VALUES
(1, 'Sobre a Zebra Tours', 'sobre-nos', 
 'Conheça a história, missão e valores da agência de viagens líder em consultoria personalizada em Moçambique.',
 '<p class="lead text-lg text-slate-700 leading-relaxed mb-4">A <strong>Zebra Tours Moçambique</strong> é uma agência dedicada à prestação de serviços de viagens e turismo, com foco em soluções práticas e personalizadas para deslocações nacionais e internacionais.</p><p class="mb-4 text-slate-600 leading-relaxed">Sediada no coração de Maputo, operamos com padrões internacionais de atendimento e consultoria turística, garantindo total conforto, segurança e transparência tarifária em cada viagem.</p><h3 class="text-xl font-bold text-slate-900 mt-6 mb-3">Missão & Valores</h3><p class="text-slate-600 leading-relaxed mb-4">Proporcionar experiências de viagem seguras, cómodas e acessíveis, colocando sempre as necessidades dos clientes no centro da nossa atuação com confiança, profissionalismo e paixão pelo turismo.</p>',
 'publicado', 'Sobre a Zebra Tours Moçambique | Agência de Viagens em Maputo', 'Conheça a história, missão, visão e equipa de consultores da Zebra Tours Moçambique.'),

(2, 'Informação e Requisitos de Vistos', 'requisitos-vistos',
 'Guia consultivo sobre documentação, passaportes, vacinas e procedimentos de visto para os principais destinos.',
 '<p class="lead text-lg text-slate-700 leading-relaxed mb-4">Viajar com tranquilidade começa pelo cumprimento rigoroso dos requisitos de imigração e alfandegários do seu país de destino.</p><p class="text-slate-600 leading-relaxed mb-4">A equipa de consultores da <strong>Zebra Tours Moçambique</strong> presta assistência especializada e orientação quanto a documentação requerida, validade mínima de passaportes (6 meses), cartas de convite e certificados internacionais de vacinação.</p><div class="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-amber-900 text-sm mb-4"><strong>Nota Importante:</strong> A concessão de vistos é prerrogativa exclusiva das embaixadas e consulados dos respetivos países. A Zebra Tours atua no apoio consultivo e na organização do processo.</div>',
 'publicado', 'Vistos e Requisitos de Viagem | Zebra Tours Moçambique', 'Informações e apoio consultivo sobre vistos, passaportes e requisitos sanitários.');

-- 8. Seeds Iniciais para Banners Promocionais
INSERT OR IGNORE INTO banners (id, title, subtitle, image_url, button_text, button_url, sort_order, status) VALUES
(1, 'Descubra a Elegância de Cape Town', 'Fim de semana exclusivo com voos, hotel 4* e assistência 24/7 a partir de 59.500 MT.', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=80', 'Explorar Oferta', '#pacotes-seccao', 1, 'ativo'),
(2, 'Bazaruto: O Paraíso das Dunas & Corais', 'Escapadinha de sonho nas águas cristalinas de Vilankulos com tudo organizado.', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80', 'Pedir Cotação', '#motor-pesquisa', 2, 'ativo');

-- 9. Seeds para Itens de Navegação
INSERT OR IGNORE INTO navigation_items (id, label, url, sort_order, is_active, location) VALUES
(1, 'Início', 'inicio', 1, 1, 'header'),
(3, 'Pacotes', 'pacotes', 2, 1, 'header'),
(2, 'Destinos', 'destinos', 3, 1, 'header'),
(6, 'Serviços', 'servicos', 4, 1, 'header'),
(7, 'Sobre Nós', 'sobre', 5, 1, 'header'),
(8, 'Contactos', 'contactos', 6, 1, 'header');

-- 10. Seeds para Biblioteca Multimédia Inicial
INSERT OR IGNORE INTO media_library (id, filename, file_path, original_name, mime_type, file_size, title, alt_text, category) VALUES
(1, 'cape-town-coast.jpg', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80', 'cape-town-coast.jpg', 'image/jpeg', 245000, 'Costa e Montanhas de Cape Town', 'Costa oceânica e montanhas de Cape Town, África do Sul', 'destinos'),
(2, 'bazaruto-beach.jpg', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80', 'bazaruto-beach.jpg', 'image/jpeg', 310000, 'Praia de Bazaruto e Dhow', 'Águas turquesa e dunas de Bazaruto, Moçambique', 'destinos'),
(3, 'lisboa-alfama.jpg', 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1200&q=80', 'lisboa-alfama.jpg', 'image/jpeg', 280000, 'Lisboa e Rio Tejo', 'Vista panorâmica de Lisboa e do Rio Tejo, Portugal', 'destinos'),
(4, 'gorongosa-safari.jpg', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80', 'gorongosa-safari.jpg', 'image/jpeg', 350000, 'Fauna Selvagem da Gorongosa', 'Safari e vida selvagem no Parque Nacional da Gorongosa', 'destinos'),
(5, 'luxury-travel-hero.jpg', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80', 'luxury-travel-hero.jpg', 'image/jpeg', 420000, 'Viagem Premium e Aventura', 'Fotografia panorâmica de viagem de luxo no mundo', 'hero');

-- 11. Definições Globais do Hero e Visual Editorial (geridas pelo CMS)
INSERT OR REPLACE INTO settings (setting_key, setting_value, description) VALUES
('hero_title', 'O mundo espera por si.', 'Título editorial de grande impacto da homepage'),
('hero_subtitle', 'Descubra novos destinos com experiências de viagem pensadas à sua medida.', 'Subtítulo refinado da homepage'),
('hero_cta_primary', 'Explorar Destinos', 'Texto do botão principal da homepage'),
('hero_cta_secondary', 'Planear a Minha Viagem', 'Texto do botão secundário da homepage'),
('hero_bg_image', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80', 'Imagem de fundo panorâmica do Hero'),
('color_primary', '#0B1E36', 'Azul-marinho profundo oficial'),
('color_accent', '#D4AF37', 'Dourado suave/champagne de destaque');

-- 12. Utilizadores com Papéis Diferenciados (Superadmin, Gestor Comercial, Editor, Atendimento)
INSERT OR IGNORE INTO users (id, name, email, password_hash, role, status) VALUES
(2, 'Leonel Sitoe (Gestor Comercial)', 'comercial@zebratours.co.mz', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gestor_comercial', 'ativo'),
(3, 'Mariana Macamo (Editora de Conteúdo)', 'editorial@zebratours.co.mz', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'editor', 'ativo'),
(4, 'Edson Nhantumbo (Atendimento)', 'atendimento@zebratours.co.mz', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'atendimento', 'ativo');

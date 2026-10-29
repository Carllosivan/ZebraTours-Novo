-- ========================================================
-- Zebra Tours Moçambique - Base de Dados SQLite
-- Schema de Dados Relacional com Chaves Estrangeiras e Índices
-- ========================================================

PRAGMA foreign_keys = ON;

-- 1. Utilizadores Administrativos
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'editor')),
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'bloqueado')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Destinos Turísticos
CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'publicado' CHECK (status IN ('publicado', 'rascunho')),
    is_featured INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Categorias de Pacotes / Viagens
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Pacotes Turísticos
CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    primary_destination_id INTEGER REFERENCES destinations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    total_price REAL,
    price_per_person REAL,
    currency TEXT NOT NULL DEFAULT 'MT',
    price_type TEXT NOT NULL DEFAULT 'indicativo' CHECK (price_type IN ('fixo', 'indicativo', 'sob_consulta')),
    duration_days INTEGER NOT NULL DEFAULT 3,
    duration_nights INTEGER NOT NULL DEFAULT 2,
    travel_dates TEXT,
    validity_date TEXT,
    is_featured INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'publicado' CHECK (status IN ('publicado', 'rascunho', 'pendente_validacao')),
    included_services TEXT,
    excluded_services TEXT,
    conditions TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Destinos Associados ao Pacote (Multidestino)
CREATE TABLE IF NOT EXISTS package_destinations (
    package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    destination_id INTEGER NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (package_id, destination_id)
);

-- 6. Itinerários do Pacote
CREATE TABLE IF NOT EXISTS itineraries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 7. Galeria de Imagens do Pacote
CREATE TABLE IF NOT EXISTS package_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- 8. Relação Pacotes e Categorias
CREATE TABLE IF NOT EXISTS package_categories (
    package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (package_id, category_id)
);

-- 9. Pedidos de Cotação e Pré-Reserva
CREATE TABLE IF NOT EXISTS booking_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_code TEXT NOT NULL UNIQUE,
    package_id INTEGER REFERENCES packages(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    phone_country_code TEXT NOT NULL DEFAULT '+258',
    service_type TEXT NOT NULL,
    destination TEXT,
    preferred_dates TEXT,
    travelers_count INTEGER NOT NULL DEFAULT 1,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Em análise', 'Contactado', 'Confirmado', 'Cancelado')),
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Mensagens de Contacto
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Pendente', 'Respondida', 'Arquivada')),
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. Definições e Configurações Globais
CREATE TABLE IF NOT EXISTS settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. Registos de Auditoria (Audit Logs)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id INTEGER,
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para Optimização de Pesquisas e Relações
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_status ON destinations(status);
CREATE INDEX IF NOT EXISTS idx_packages_slug ON packages(slug);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_destination ON packages(primary_destination_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_ref ON booking_requests(reference_code);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

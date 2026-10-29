-- ========================================================
-- Zebra Tours Moçambique - Seed Inicial de Dados
-- Dados institucionais, destinos, pacotes turísticos e definições
-- ========================================================

-- 1. Utilizador Administrador Inicial
-- Palavra-passe predefinida para teste local: ZebraAdmin2026!
-- Hash gerado com bcrypt (Node crypto / bcrypt)
INSERT OR IGNORE INTO users (id, name, email, password_hash, role, status) VALUES
(1, 'Administrador Zebra Tours', 'admin@zebratours.co.mz', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', 'ativo');

-- 2. Definições Globais da Empresa
INSERT OR REPLACE INTO settings (setting_key, setting_value, description) VALUES
('site_name', 'Zebra Tours Moçambique', 'Nome oficial da agência de viagens'),
('slogan', 'O seu próximo destino começa aqui!', 'Slogan oficial da agência'),
('brand_message', 'O seu próximo destino começa aqui! Realize o seu sonho com segurança e apoio em todo o processo.', 'Mensagem de posicionamento de marca'),
('phone', '+258 85 104 1826', 'Contacto telefónico oficial'),
('whatsapp', '+258 85 104 1826', 'Número de WhatsApp para reservas e apoio'),
('location', 'Rua Marconi 134 R/C, Maputo, Moçambique', 'Morada física oficial da sede'),
('currency', 'MT', 'Símbolo da moeda predefinida'),
('currency_name', 'Metical Moçambicano (MZN)', 'Nome por extenso da moeda'),
('email', 'info@ztours.co.mz', 'Email geral de contacto'),
('email_reservas', 'reservas@ztours.co.mz', 'Email exclusivo para reservas de pacotes'),
('facebook_url', 'https://facebook.com/zebratoursmoz', 'Página oficial de Facebook'),
('instagram_url', 'https://instagram.com/zebratoursmoz', 'Perfil oficial de Instagram'),
('working_hours', 'Segunda a Sexta: 08:00 - 17:00 | Sábado: 08:30 - 13:00', 'Horário de atendimento ao público'),
('about_mission', 'Proporcionar experiências de viagem seguras, cómodas e acessíveis, oferecendo soluções personalizadas em passagens aéreas, alojamento, pacotes turísticos e assistência ao viajante.', 'Missão da Zebra Tours'),
('about_vision', 'Ser uma agência de viagens de referência em Moçambique, reconhecida pela qualidade dos serviços, pela confiança dos clientes e pela capacidade de conectar pessoas a destinos nacionais e internacionais.', 'Visão da Zebra Tours'),
('about_values', 'Confiança, profissionalismo, qualidade, transparência, compromisso com o cliente e paixão por viajar.', 'Valores da Zebra Tours');

-- 3. Categorias de Pacotes
INSERT OR IGNORE INTO categories (id, name, slug, description, status) VALUES
(1, 'Escapadinhas e Fins de Semana', 'escapadinhas-fins-de-semana', 'Viagens curtas ideais para recarregar energias e aproveitar momentos especiais.', 'ativo'),
(2, 'Férias em Família', 'ferias-em-familia', 'Roteiros pensados para todas as idades com máximo conforto e lazer.', 'ativo'),
(3, 'Viagens de Negócios e Corporativas', 'viagens-de-negocios', 'Soluções eficientes, voos pontuais e alojamentos executivos.', 'ativo'),
(4, 'Safaris e Natureza', 'safaris-natureza', 'Experiências fascinantes na vida selvagem africana e paisagens intocadas.', 'ativo'),
(5, 'Praia e Paraísos Tropicais', 'praia-tropicais', 'Águas cristalinas, praias paradisíacas e resorts de encanto.', 'ativo'),
(6, 'Cultura e História', 'cultura-historia', 'Descubra monumentos, gastronomia e tradições milenares pelo mundo.', 'ativo');

-- 4. Destinos Turísticos
INSERT OR IGNORE INTO destinations (id, name, slug, country, summary, description, cover_image, status, is_featured, seo_title, seo_description) VALUES
(1, 'África do Sul', 'africa-do-sul', 'África do Sul',
'Cidades vibrantes, praias deslumbrantes, montanhas icónicas como a Table Mountain e safaris inesquecíveis.',
'A África do Sul é um dos destinos mais procurados pelos viajantes moçambicanos. Desde a cosmopolita Cidade do Cabo (Cape Town) até à energia pulsante de Joanesburgo e a fauna selvagem do Parque Nacional Kruger, oferece opções completas de compras, gastronomia de nível mundial, vinhedos históricos e paisagens oceânicas arrebatadoras.',
'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
'publicado', 1, 'Viagens para África do Sul | Zebra Tours Moçambique', 'Descubra pacotes e passagens para Cape Town, Joanesburgo e Durban com a Zebra Tours Moçambique.'),

(2, 'Portugal', 'portugal', 'Portugal',
'História fascinante, cidades acolhedoras, gastronomia de referência e pontes culturais profundas com Moçambique.',
'Portugal encanta com a luz dourada de Lisboa, o charme ribeirinho do Porto, os castelos românticos de Sintra e as praias de sonho do Algarve. É a porta de entrada ideal para a Europa, perfeita para turismo de lazer, reencontros familiares ou viagens académicas e de negócios.',
'https://images.unsplash.com/photo-1513688275180-81775f7d2cf4?auto=format&fit=crop&w=1200&q=80',
'publicado', 1, 'Pacotes e Voos para Portugal | Zebra Tours Moçambique', 'Reserve a sua viagem a Lisboa, Porto e Sintra com assistência personalizada da Zebra Tours.'),

(3, 'Harare & Zimbabwe', 'harare-zimbabwe', 'Zimbabwe',
'Cultura vizinha, hospitalidade calorosa, paisagens verdejantes e proximidade com as grandiosas Cataratas Vitória.',
'Harare, a capital do Zimbabwe, conjuga vida urbana, mercados de artesanato tradicional de escultura em pedra shona e áreas botânicas tranquilas. Destino chave para comércio regional, visitas familiares e porta de acesso para o circuito das Cataratas Vitória.',
'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
'publicado', 1, 'Viagens a Harare e Zimbabwe | Zebra Tours Moçambique', 'Conecte-se ao Zimbabwe com as melhores tarifas aéreas e apoio em itinerários com a Zebra Tours.'),

(4, 'China', 'china', 'China',
'Potência comercial global, metrópoles futuristas, maravilhas antigas e oportunidades de negócios sem paralelo.',
'A China une milénios de história na Grande Muralha e na Cidade Proibida em Pequim com o dinamismo comercial e futurista de Guangzhou, Xangai e Shenzhen. Destino privilegiado para empreendedores, importadores e viajantes fascinados pela cultura oriental.',
'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
'publicado', 1, 'Viagens de Negócios e Turismo para a China | Zebra Tours', 'Consultoria e apoio em passagens para Guangzhou, Pequim e Xangai com a Zebra Tours Moçambique.'),

(5, 'Bazaruto & Vilankulos', 'bazaruto-vilankulos', 'Moçambique',
'Dunas douradas que mergulham em águas turquesa, recifes de coral intocados e hospitalidade moçambicana de excelência.',
'O Arquipélago de Bazaruto e a costa de Vilankulos são joias do turismo moçambicano. Ideais para luas de mel, mergulho com dugongos e tartarugas, passeios tradicionais de dhow e momentos de puro relaxamento nas praias mais deslumbrantes do Índico.',
'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
'publicado', 1, 'Escapadinhas em Bazaruto e Vilankulos | Zebra Tours Moçambique', 'Descubra as maravilhas nacionais de Moçambique com os pacotes exclusivos da Zebra Tours.'),

(6, 'Parque Nacional da Gorongosa', 'gorongosa', 'Moçambique',
'O coração selvagem de Moçambique, um dos maiores projectos mundiais de restauração ecológica e biodiversidade.',
'A Gorongosa oferece safaris autênticos onde manadas de elefantes, leões, antílopes raros e aves exuberantes cruzam savanas e lagoas. Uma experiência educativa e inspiradora que valoriza o património natural do nosso país.',
'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
'publicado', 0, 'Safari no Parque Nacional da Gorongosa | Zebra Tours', 'Viva a emoção do safari moçambicano na Gorongosa com organização completa Zebra Tours.');

-- 5. Pacotes Turísticos
-- NOTA IMPORTANTE DE CONFORMIDADE:
-- Pacote 1 (Cape Town): Criado como pendente de validação operacional/datas conforme o cartaz fornecido.
INSERT OR IGNORE INTO packages (
    id, primary_destination_id, title, slug, summary, description,
    total_price, price_per_person, currency, price_type, duration_days, duration_nights,
    travel_dates, validity_date, is_featured, status, included_services, excluded_services, conditions
) VALUES
(
    1, 1, 'Cape Town Especial Fim de Semana Promocional', 'cape-town-especial-promocional',
    'Escapadinha de 2 noites a Cape Town com passagens aéreas de ida e volta, hotel e assistência durante a viagem.',
    'Aproveite esta oportunidade para descobrir a deslumbrante Cidade do Cabo! Inspirado na campanha promocional da Zebra Tours Moçambique, este pacote oferece a combinação perfeita de voo e estadia para explorar praias, restaurantes e a icónica Table Mountain. ATENÇÃO: As datas operacionais, companhia aérea e disponibilidade efectiva dependem de validação e confirmação da agência no momento do pedido de cotação.',
    NULL, 59500.0, 'MT', 'indicativo', 3, 2,
    '31 de Outubro a 02 de Novembro (Sujeito a confirmação de calendário)', 'Oferta sujeita a confirmação de disponibilidade', 1, 'pendente_validacao',
    'Passagem aérea de ida e volta; 2 noites de alojamento em hotel selecionado; Assistência personalizada durante toda a viagem pela equipa Zebra Tours.',
    'Despesas de carácter pessoal; Refeições não especificadas; Seguro de viagem opcional; Vistos ou taxas alfandegárias caso aplicável.',
    'Preço anunciado de 59.500 MT por pessoa com base em ocupação dupla. Valor indicativo sujeito a alterações cambiais e disponibilidade de classe tarifária aérea no momento da confirmação. A submissão deste formulário constitui um pedido de cotação e não uma reserva confirmada.'
),
(
    2, 2, 'Lisboa Encantadora e Sintra Histórica', 'lisboa-encantadora-sintra',
    'Sete dias a percorrer os miradouros de Lisboa, bairros históricos e os palácios de conto de fadas em Sintra.',
    'Roteiro completo desenhado para quem deseja explorar o melhor da capital portuguesa com tempo, conforto e acompanhamento. Inclui sugestões gastronómicas com os famosos pastéis de Belém e passeios à beira-mar em Cascais.',
    NULL, 89000.0, 'MT', 'indicativo', 7, 6,
    'Saídas semanais sob consulta', 'Tarifa indicativa para época baixa e média', 1, 'publicado',
    'Passagem aérea internacional ida e volta (classe económica); 6 noites de hotel 4 estrelas com pequeno-almoço; Transfer aeroporto-hotel-aeroporto; Assistência ao viajante 24/7.',
    'Almoços e jantares livres; Entradas individuais em museus e monumentos; Seguro de saúde de viagem (disponível como suplemento).',
    'Preço indicativo por pessoa em quarto duplo. Sujeito a variação conforme a antecedência da reserva e época do ano.'
),
(
    3, 3, 'Harare Cultural & Conexão Victoria Falls', 'harare-cultural-victoria-falls',
    'Descubra a vibração cultural de Harare e viva momentos memoráveis na natureza envolvente do Zimbabwe.',
    'Um pacote prático e dinâmico, excelente para escapadinhas de lazer ou viagens combinadas de negócios. Conheça as galerias de arte em pedra de Harare e relaxe em hotéis confortáveis com acesso rápido aos centros empresariais.',
    NULL, 42000.0, 'MT', 'indicativo', 4, 3,
    'Datas flexíveis à medida do cliente', 'Válido durante o ano em curso', 1, 'publicado',
    'Passagem aérea Maputo - Harare - Maputo; 3 noites de alojamento com pequeno-almoço; Assistência local na chegada.',
    'Taxas de visto fronteiriço caso aplicável; Despesas pessoais e gorjetas.',
    'Valores sujeitos a alteração sem aviso prévio em função de taxas aeroportuárias.'
),
(
    4, 4, 'China Comercial & Turismo: Guangzhou e Pequim', 'china-comercial-turismo',
    'Pacote corporativo e turístico para feiras, importação e descoberta das grandes maravilhas milenares chinesas.',
    'Pensado especialmente para empresários e delegações comerciais de Moçambique que pretendem visitar os centros de produção e comércio em Guangzhou, com opção de extensão cultural para a Muralha da China em Pequim. A Zebra Tours oferece apoio integral no planeamento de datas e itinerários.',
    NULL, 165000.0, 'MT', 'sob_consulta', 10, 9,
    'Datas personalizadas para eventos e feiras comerciais', 'Cotação sob medida', 0, 'publicado',
    'Passagens aéreas internacionais; 9 noites em hotéis executivos de 4 e 5 estrelas; Carta de convite e apoio informativo para processos de visto; Seguro de viagem com ampla cobertura internacional.',
    'Despesas alfandegárias de mercadorias; Tradutor privado exclusivo (orçamentado à parte); Despesas pessoais.',
    'Preço sob consulta em função das datas e eventos específicos em território chinês.'
),
(
    5, 5, 'Bazaruto Tropical Paradise & Dhow Safari', 'bazaruto-tropical-paradise',
    'Águas mornas cristalinas, praias desertas e safari marinho no icónico arquipélago moçambicano.',
    'Desfrute do que Moçambique tem de mais exclusivo e puro. Este pacote oferece descanso absoluto em Vilankulos com travessia em dhow até às dunas de Bazaruto, mergulho nas barreiras de corais e piquenique de marisco fresco na ilha.',
    NULL, 38500.0, 'MT', 'indicativo', 5, 4,
    'Partidas regulares a partir de Maputo', 'Válido para residentes e turistas', 1, 'publicado',
    'Passagem aérea Maputo - Vilankulos - Maputo; 4 noites em resort à beira-mar com pequeno-almoço; Excursão de dia inteiro ao Parque Nacional do Arquipélago de Bazaruto com almoço incluído.',
    'Bebidas alcoólicas e despesas individuais no lodge; Actividades motorizadas aquáticas não incluídas.',
    'Tarifa promocional sujeita à disponibilidade de lugares em voos domésticos.'
),
(
    6, 6, 'Aventura Selvagem no Parque Nacional da Gorongosa', 'gorongosa-aventura-safari',
    'Quatro dias de imersão na maior reserva de vida selvagem e conservação ambiental de Moçambique.',
    'Uma experiência memorável para famílias, fotógrafos e apaixonados pela natureza. Safaris em viatura aberta de manhã e ao pôr-do-sol acompanhados por guias especializados do parque, com conforto e gastronomia no Montebelo Gorongosa Lodge.',
    NULL, 34000.0, 'MT', 'indicativo', 4, 3,
    'Fins de semana e saídas a meio da semana', 'Época seca de safari', 0, 'publicado',
    'Passagem aérea Maputo - Beira - Maputo; Transfer terrestre Beira - Gorongosa - Beira; 3 noites em bungalow climatizado; 4 safaris guiados.',
    'Taxa de conservação do parque paga à entrada; Despesas pessoais.',
    'Recomendado vestuário confortável de cores neutras e repelente.'
),
(
    7, 1, 'Joanesburgo Shopping & Sun City Resort', 'joanesburgo-shopping-sun-city',
    'Três noites de compras nos melhores centros comerciais de Sandton e diversão nas piscinas de ondas do Valley of Waves.',
    'O pacote perfeito para um fim de semana prolongado! Combine compras em Sandton City e Rosebank com um dia emocionante ou pernoita no mítico complexo de Sun City Resort.',
    NULL, 45000.0, 'MT', 'indicativo', 4, 3,
    'Quintas a Domingos ou datas sob medida', 'Válido todo o ano', 1, 'publicado',
    'Passagem aérea de ida e volta Maputo - Joanesburgo - Maputo; 3 noites de alojamento de qualidade superior; Entrada no complexo de lazer.',
    'Refeições não indicadas; Compras e deslocações privadas não programadas.',
    'Valores calculados em meticais com base no câmbio de referência.'
),
(
    8, 1, 'Durban Golden Mile & Praias Cálidas', 'durban-golden-mile-costa',
    'Clima subtropical agradável, passeios pelo passeio marítimo da Golden Mile e diversão no uShaka Marine World.',
    'Durban é famosa pela sua água morna durante todo o ano, rica herança cultural zulu e indiana, e excelentes hotéis à beira-mar. Uma opção acessível e descontraída para toda a família.',
    NULL, 39500.0, 'MT', 'indicativo', 4, 3,
    'Disponível todo o ano', 'Tarifas promocionais sob consulta', 0, 'publicado',
    'Passagens aéreas Maputo - Durban - Maputo; 3 noites de alojamento com pequeno-almoço incluído; Transfer de chegada e partida.',
    'Passeios opcionais e despesas pessoais.',
    'Preço indicativo por pessoa em regime de quarto duplo.'
);

-- 6. Associação Pacote x Destino
INSERT OR IGNORE INTO package_destinations (package_id, destination_id, sort_order) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 1, 1),
(8, 1, 1);

-- 7. Associação Pacote x Categoria
INSERT OR IGNORE INTO package_categories (package_id, category_id) VALUES
(1, 1), -- Cape Town -> Escapadinhas
(2, 6), -- Lisboa -> Cultura
(3, 3), -- Harare -> Negócios
(4, 3), -- China -> Negócios
(5, 5), -- Bazaruto -> Praias
(6, 4), -- Gorongosa -> Safaris
(7, 1), -- Joanesburgo -> Escapadinhas
(8, 5); -- Durban -> Praias

-- 8. Itinerário Cape Town (Referência)
INSERT OR IGNORE INTO itineraries (package_id, day_number, title, description, sort_order) VALUES
(1, 1, 'Chegada a Cape Town e Instalação no Hotel', 'Partida de Maputo em voo regular com destino a Cape Town. Chegada à Cidade do Cabo, assistência de viagem e transfer para o hotel. Resto do dia livre para passear pelo animado V&A Waterfront.', 1),
(1, 2, 'Exploração Livre de Cape Town e Table Mountain', 'Pequeno-almoço no hotel. Dia livre para visitar a icónica Table Mountain, a praia de Camps Bay ou os famosos jardins botânicos de Kirstenbosch.', 2),
(1, 3, 'Manhã Livre e Regresso a Moçambique', 'Pequeno-almoço. Tempo para compras de lembranças e últimos passeios. Transfer para o aeroporto internacional e voo de regresso a Maputo.', 3);

-- 9. Galeria de Imagens Cape Town
INSERT OR IGNORE INTO package_images (package_id, image_url, alt_text, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=80', 'Table Mountain e Baía de Cape Town', 1),
(1, 'https://images.unsplash.com/photo-1576485375217-d6c41b655519?auto=format&fit=crop&w=1000&q=80', 'Casas coloridas de Bo-Kaap em Cape Town', 2),
(1, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', 'Praia de Camps Bay ao entardecer', 3);

-- 10. Pedido de Cotação Exemplo Inicial
INSERT OR IGNORE INTO booking_requests (
    id, reference_code, package_id, customer_name, customer_email, customer_phone,
    phone_country_code, service_type, destination, preferred_dates, travelers_count,
    message, status, admin_notes
) VALUES
(
    1, 'ZT-2026-0001', 1, 'Armando Mondlane', 'armando.mondlane@exemplo.co.mz', '84 123 4567',
    '+258', 'Pacote Turístico', 'Cape Town, África do Sul', '31 Outubro - 02 Novembro', 2,
    'Gostaria de confirmar a disponibilidade para duas pessoas no pacote anunciado de Cape Town para o fim de semana.',
    'Pendente', 'Cliente aguarda contacto telefónico durante a tarde para confirmação de voo.'
);

-- 11. Mensagem de Contacto Exemplo
INSERT OR IGNORE INTO contact_messages (
    id, name, email, phone, subject, message, status
) VALUES
(
    1, 'Teresa Cossa', 'teresa.cossa@exemplo.co.mz', '+258 82 987 6543',
    'Pedido de Informação sobre Visto para China',
    'Boa tarde equipa da Zebra Tours. Gostaria de saber como apoiam na organização de viagem para uma feira em Guangzhou no próximo mês.',
    'Pendente'
);

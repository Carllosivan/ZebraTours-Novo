/**
 * Zebra Tours Moçambique - Lógica Pura de Viagens e Negócio
 * Módulo desacoplado para cálculos, formatação, validação e links
 */

export interface PackageItem {
  id: number;
  primary_destination_id?: number;
  destination_name?: string;
  country?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  total_price?: number | null;
  price_per_person?: number | null;
  currency: string;
  price_type: 'fixo' | 'indicativo' | 'sob_consulta';
  duration_days: number;
  duration_nights: number;
  travel_dates?: string | null;
  validity_date?: string | null;
  is_featured: number | boolean;
  status: 'publicado' | 'rascunho' | 'pendente_validacao';
  category_slugs?: string[];
  cover_image?: string;
}

export interface PackageFilters {
  destinationId?: number | string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  durationDays?: number;
  searchQuery?: string;
  sortBy?: 'recommended' | 'price-asc' | 'price-desc' | 'duration-asc' | 'duration-desc';
}

/**
 * Gera um código de referência único e profissional para pedidos de cotação
 * Ex: ZT-2026-K7M2
 */
export function generateReferenceCode(date: Date = new Date()): string {
  const year = date.getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomPart += chars[randomIndex];
  }
  return `ZT-${year}-${randomPart}`;
}

/**
 * Formata valores monetários no formato padrão de Moçambique (ex: 59.500 MT)
 */
export function formatMZN(amount?: number | null, currency = 'MT', priceType = 'indicativo'): string {
  if (priceType === 'sob_consulta' || amount === null || amount === undefined || isNaN(amount)) {
    return 'Sob Consulta';
  }
  // Formatação com ponto como separador de milhares conforme o cartaz e padrão comercial moçambicano (59.500 MT)
  const integerPart = Math.round(amount).toString();
  const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${formatted} ${currency}`;
}

/**
 * Constrói URL de WhatsApp com mensagem limpa e estruturada
 */
export function buildWhatsAppLink(options: {
  phone: string;
  customerName?: string;
  packageTitle?: string;
  serviceType?: string;
  referenceCode?: string;
}): string {
  // Limpa o número de telefone de espaços e caracteres especiais mantendo dígitos
  const cleanPhone = options.phone.replace(/[^0-9]/g, '');
  
  let message = `Olá, Zebra Tours Moçambique! `;
  if (options.customerName) {
    message += `O meu nome é ${options.customerName.trim()}. `;
  }
  
  if (options.packageTitle) {
    message += `Gostaria de solicitar informações sobre o pacote: "${options.packageTitle.trim()}". `;
  } else if (options.serviceType) {
    message += `Gostaria de solicitar uma cotação para o serviço de: "${options.serviceType.trim()}". `;
  } else {
    message += `Gostaria de solicitar uma cotação de viagem personalizada. `;
  }

  if (options.referenceCode) {
    message += `(Ref. Pedido: ${options.referenceCode})`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Validação rigorosa de datas de viagem
 */
export function validateTravelDates(departureDateStr: string, returnDateStr?: string): {
  valid: boolean;
  error?: string;
} {
  if (!departureDateStr) {
    return { valid: false, error: 'A data de partida é obrigatória.' };
  }

  const departure = new Date(departureDateStr);
  if (isNaN(departure.getTime())) {
    return { valid: false, error: 'Data de partida inválida.' };
  }

  if (returnDateStr) {
    const returnDate = new Date(returnDateStr);
    if (isNaN(returnDate.getTime())) {
      return { valid: false, error: 'Data de regresso inválida.' };
    }
    if (returnDate < departure) {
      return { valid: false, error: 'A data de regresso deve ser posterior à data de partida.' };
    }
  }

  return { valid: true };
}

/**
 * Validação de dados do pedido de cotação
 */
export function validateQuoteRequest(data: {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  service_type?: string;
  travelers_count?: number;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.customer_name || data.customer_name.trim().length < 2) {
    errors.customer_name = 'Por favor indique o seu nome completo.';
  }

  if (!data.customer_phone || data.customer_phone.trim().replace(/[^0-9]/g, '').length < 8) {
    errors.customer_phone = 'Por favor indique um contacto telefónico válido.';
  }

  if (data.customer_email && data.customer_email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.customer_email.trim())) {
      errors.customer_email = 'Por favor indique um endereço de email válido.';
    }
  }

  if (!data.service_type || data.service_type.trim().length === 0) {
    errors.service_type = 'Selecione o serviço pretendido.';
  }

  if (data.travelers_count === undefined || data.travelers_count < 1 || isNaN(data.travelers_count)) {
    errors.travelers_count = 'O número de viajantes deve ser pelo menos 1.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Filtragem e ordenação combinada de pacotes turísticos
 */
export function filterAndSortPackages(
  packages: PackageItem[],
  filters: PackageFilters
): PackageItem[] {
  let result = [...packages];

  // Filtro por destino
  if (filters.destinationId && filters.destinationId !== 'all') {
    const destId = Number(filters.destinationId);
    result = result.filter(pkg => pkg.primary_destination_id === destId);
  }

  // Filtro por categoria
  if (filters.categorySlug && filters.categorySlug !== 'all') {
    result = result.filter(pkg => pkg.category_slugs?.includes(filters.categorySlug!));
  }

  // Filtro por preço mínimo
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    result = result.filter(pkg => {
      const price = pkg.price_per_person ?? pkg.total_price;
      return price ? price >= filters.minPrice! : true;
    });
  }

  // Filtro por preço máximo
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    result = result.filter(pkg => {
      const price = pkg.price_per_person ?? pkg.total_price;
      return price ? price <= filters.maxPrice! : true;
    });
  }

  // Filtro por duração em dias
  if (filters.durationDays !== undefined && filters.durationDays > 0) {
    result = result.filter(pkg => pkg.duration_days <= filters.durationDays!);
  }

  // Pesquisa por texto
  if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
    const q = filters.searchQuery.trim().toLowerCase();
    result = result.filter(pkg =>
      pkg.title.toLowerCase().includes(q) ||
      pkg.summary.toLowerCase().includes(q) ||
      pkg.description.toLowerCase().includes(q) ||
      (pkg.destination_name && pkg.destination_name.toLowerCase().includes(q)) ||
      (pkg.country && pkg.country.toLowerCase().includes(q))
    );
  }

  // Ordenação
  switch (filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => (a.price_per_person ?? 999999) - (b.price_per_person ?? 999999));
      break;
    case 'price-desc':
      result.sort((a, b) => (b.price_per_person ?? 0) - (a.price_per_person ?? 0));
      break;
    case 'duration-asc':
      result.sort((a, b) => a.duration_days - b.duration_days);
      break;
    case 'duration-desc':
      result.sort((a, b) => b.duration_days - a.duration_days);
      break;
    case 'recommended':
    default:
      // Pacotes em destaque primeiro
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
      break;
  }

  return result;
}

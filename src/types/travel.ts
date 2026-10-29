export interface Destination {
  id: number;
  name: string;
  slug: string;
  country: string;
  summary: string;
  description: string;
  cover_image: string;
  status: 'publicado' | 'rascunho';
  is_featured: number | boolean;
  package_count?: number;
  seo_title?: string;
  seo_description?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  status: 'ativo' | 'inativo';
}

export interface ItineraryItem {
  id: number;
  package_id: number;
  day_number: number;
  title: string;
  description: string;
  sort_order: number;
}

export interface PackageImage {
  id: number;
  package_id: number;
  image_url: string;
  alt_text?: string;
  sort_order: number;
}

export interface TravelPackage {
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
  included_services?: string;
  excluded_services?: string;
  conditions?: string;
  cover_image?: string;
  category_slugs?: string[];
  itineraries?: ItineraryItem[];
  images?: PackageImage[];
  categories?: Category[];
}

export interface BookingHistoryItem {
  id: number;
  booking_id: number;
  author_name: string;
  action: string;
  notes?: string;
  old_status?: string;
  new_status?: string;
  created_at: string;
}

export interface BookingRequest {
  id: number;
  reference_code: string;
  package_id?: number | null;
  package_title?: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone: string;
  phone_country_code: string;
  service_type: string;
  destination?: string | null;
  preferred_dates?: string | null;
  travelers_count: number;
  message?: string | null;
  status: 'Pendente' | 'Em análise' | 'Contactado' | 'Cotação enviada' | 'Confirmado' | 'Cancelado';
  admin_notes?: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: 'Pendente' | 'Respondida' | 'Arquivada';
  admin_notes?: string | null;
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
}

export interface CmsPage {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  status: 'publicado' | 'rascunho';
  seo_title?: string;
  seo_description?: string;
  updated_at?: string;
}

export interface CmsBanner {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  button_text?: string;
  button_url?: string;
  status: 'ativo' | 'inativo';
  sort_order: number;
  start_date?: string;
  end_date?: string;
}

export interface NavigationItem {
  id: number;
  label: string;
  url: string;
  sort_order: number;
  is_active: number | boolean;
  is_external?: number | boolean;
  location?: 'header' | 'footer' | 'both';
}

export interface MediaAsset {
  id: number;
  filename: string;
  file_path: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  title?: string;
  alt_text?: string;
  category?: string;
  created_at: string;
}

export interface SiteSettings {
  site_name?: string;
  slogan?: string;
  brand_message?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  currency?: string;
  email?: string;
  facebook_url?: string;
  instagram_url?: string;
  about_mission?: string;
  about_vision?: string;
  about_values?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_primary?: string;
  hero_cta_secondary?: string;
  hero_bg_image?: string;
  [key: string]: string | undefined;
}

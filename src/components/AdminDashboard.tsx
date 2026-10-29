import React, { useState, useEffect } from 'react';
import {
  Shield,
  LayoutDashboard,
  Luggage,
  MapPin,
  FileText,
  Mail,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
  Search,
  Filter,
  Download,
  Image,
  Users,
  Compass,
  FileSpreadsheet,
  Globe,
  Sliders,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  History,
  MessageSquare,
  UploadCloud,
  Video,
  Music,
  File,
  ExternalLink,
  Check,
  Copy,
  FolderOpen,
} from 'lucide-react';
import {
  TravelPackage,
  Destination,
  BookingRequest,
  ContactMessage,
  SiteSettings,
  AdminUser,
  CmsPage,
  CmsBanner,
  NavigationItem,
  MediaAsset,
  BookingHistoryItem,
} from '../types/travel.ts';
import { formatMZN } from '../utils/travel-logic.ts';
import { BrandLogo } from './BrandLogo.tsx';

interface AdminDashboardProps {
  token: string;
  adminUser: AdminUser;
  onLogout: () => void;
  onClose: () => void;
  onRefreshPublicData: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'bookings'
  | 'packages'
  | 'destinations'
  | 'content'
  | 'pages'
  | 'banners'
  | 'media'
  | 'navigation'
  | 'users'
  | 'messages'
  | 'reports'
  | 'settings'
  | 'audit';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  adminUser,
  onLogout,
  onClose,
  onRefreshPublicData,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [banners, setBanners] = useState<CmsBanner[]>([]);
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Package Form modal with 7 tabs
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null);
  const [isPackageFormOpen, setIsPackageFormOpen] = useState(false);
  const [packageFormActiveTab, setPackageFormActiveTab] = useState<number>(1);

  // Destination Form modal & actions state
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [isDestinationFormOpen, setIsDestinationFormOpen] = useState(false);
  const [destinationSaving, setDestinationSaving] = useState(false);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [destinationToDelete, setDestinationToDelete] = useState<{ id: number; name: string } | null>(null);
  const [destinationDeleting, setDestinationDeleting] = useState(false);
  const [destinationCoverImage, setDestinationCoverImage] = useState<string>('');

  // Page Form modal
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [isPageFormOpen, setIsPageFormOpen] = useState(false);

  // Banner Form modal
  const [editingBanner, setEditingBanner] = useState<CmsBanner | null>(null);
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);

  // Media upload & centralized library state
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false);
  const [mediaUploadMode, setMediaUploadMode] = useState<'file' | 'url'>('file');
  const [mediaSelectedFile, setMediaSelectedFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [mediaIsUploading, setMediaIsUploading] = useState(false);
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaTitleInput, setMediaTitleInput] = useState('');
  const [mediaAltInput, setMediaAltInput] = useState('');
  const [mediaCategoryInput, setMediaCategoryInput] = useState('geral');
  const [mediaFilterType, setMediaFilterType] = useState('all');
  const [mediaSearch, setMediaSearch] = useState('');
  const [copiedMediaId, setCopiedMediaId] = useState<number | null>(null);

  // Centralized Media Picker modal state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);

  // Booking detail / note modal with timeline history
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [bookingHistory, setBookingHistory] = useState<BookingHistoryItem[]>([]);
  const [bookingNoteText, setBookingNoteText] = useState('');
  const [bookingStatusText, setBookingStatusText] = useState<any>('Pendente');

  // Search and filters in bookings
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');

  // Search and filters in packages
  const [packageSearch, setPackageSearch] = useState('');
  const [packageFilterStatus, setPackageFilterStatus] = useState('all');
  const [packageFilterDestination, setPackageFilterDestination] = useState('all');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        bookRes,
        pkgRes,
        destRes,
        msgRes,
        setRes,
        pagesRes,
        bannersRes,
        mediaRes,
        navRes,
        usersRes,
        auditRes,
      ] = await Promise.all([
        fetch('/api/admin/stats', { headers: authHeaders }),
        fetch('/api/bookings', { headers: authHeaders }),
        fetch('/api/packages?status=all', { headers: authHeaders }),
        fetch('/api/destinations', { headers: authHeaders }),
        fetch('/api/contact', { headers: authHeaders }),
        fetch('/api/settings'),
        fetch('/api/pages', { headers: authHeaders }),
        fetch('/api/banners', { headers: authHeaders }),
        fetch('/api/media', { headers: authHeaders }),
        fetch('/api/navigation'),
        fetch('/api/users', { headers: authHeaders }),
        fetch('/api/admin/audit-logs', { headers: authHeaders }),
      ]);

      if (statsRes.status === 401) {
        onLogout();
        return;
      }

      if (statsRes.ok) setStats(await statsRes.json());
      if (bookRes.ok) setBookings(await bookRes.json());
      if (pkgRes.ok) setPackages(await pkgRes.json());
      if (destRes.ok) setDestinations(await destRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
      if (setRes.ok) setSettings(await setRes.json());
      if (pagesRes.ok) setPages(await pagesRes.json());
      if (bannersRes.ok) setBanners(await bannersRes.json());
      if (mediaRes.ok) setMediaList(await mediaRes.json());
      if (navRes.ok) setNavItems(await navRes.json());
      if (usersRes.ok) setUsersList(await usersRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Load Booking History
  const loadBookingTimeline = async (id: number) => {
    try {
      const res = await fetch(`/api/bookings/${id}/history`, { headers: authHeaders });
      if (res.ok) {
        setBookingHistory(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Booking with History Log
  const handleUpdateBookingWithTimeline = async () => {
    if (!selectedBooking) return;
    try {
      const res = await fetch(`/api/bookings/${selectedBooking.id}/history`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          action: `Estado alterado para ${bookingStatusText}`,
          notes: bookingNoteText,
          new_status: bookingStatusText,
        }),
      });

      if (res.ok) {
        showNotification(`Pedido ${selectedBooking.reference_code} atualizado com sucesso!`);
        setSelectedBooking(null);
        setBookingNoteText('');
        loadAllData();
        onRefreshPublicData();
      }
    } catch (e) {
      alert('Erro ao atualizar pedido');
    }
  };

  // Export Bookings CSV
  const handleExportCsv = () => {
    window.open('/api/bookings/export-csv', '_blank');
  };

  // Save Package (with 7 tabs support)
  const handleSavePackage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = (formData.get('title') as string || '').trim();
    const summary = (formData.get('summary') as string || '').trim();
    const description = (formData.get('description') as string || '').trim();

    if (!title) {
      setPackageFormActiveTab(1);
      alert('Por favor preencha o Título do Pacote no Separador 1 (Geral).');
      return;
    }
    if (!summary) {
      setPackageFormActiveTab(1);
      alert('Por favor preencha o Resumo Comercial no Separador 1 (Geral).');
      return;
    }
    if (!description) {
      setPackageFormActiveTab(4);
      alert('Por favor preencha a Descrição Editorial no Separador 4 (Descrição).');
      return;
    }

    const payload: any = {
      title,
      summary,
      description,
      primary_destination_id: formData.get('primary_destination_id') ? Number(formData.get('primary_destination_id')) : null,
      total_price: formData.get('total_price') ? Number(formData.get('total_price')) : null,
      price_per_person: formData.get('price_per_person') ? Number(formData.get('price_per_person')) : null,
      currency: formData.get('currency') || 'MT',
      price_type: formData.get('price_type') || 'indicativo',
      duration_days: Number(formData.get('duration_days') || 3),
      duration_nights: Number(formData.get('duration_nights') || 2),
      travel_dates: formData.get('travel_dates') || '',
      validity_date: formData.get('validity_date') || '',
      status: formData.get('status') || 'publicado',
      is_featured: formData.get('is_featured') === 'on' ? 1 : 0,
      included_services: formData.get('included_services') || '',
      excluded_services: formData.get('excluded_services') || '',
      conditions: formData.get('conditions') || '',
      cover_image: formData.get('cover_image') || '',
    };

    try {
      const isEdit = !!editingPackage;
      const url = isEdit ? `/api/packages/${editingPackage.id}` : '/api/packages';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showNotification(isEdit ? 'Pacote atualizado com sucesso!' : 'Novo pacote criado!');
        setIsPackageFormOpen(false);
        setEditingPackage(null);
        loadAllData();
        onRefreshPublicData();
      } else {
        alert(data.error || 'Erro ao guardar pacote no servidor.');
      }
    } catch (e: any) {
      alert('Erro de comunicação ao guardar pacote: ' + e.message);
    }
  };

  // Delete Package
  const handleDeletePackage = async (id: number, title: string) => {
    if (!window.confirm(`Tem a certeza que deseja eliminar o pacote "${title}"?`)) return;
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        showNotification('Pacote eliminado.');
        loadAllData();
        onRefreshPublicData();
      }
    } catch (e) {
      alert('Erro ao eliminar pacote.');
    }
  };

  // Save Media Asset (Upload de Ficheiro Real ou Registo de URL)
  const handleSaveMedia = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mediaUploadMode === 'file') {
      if (!mediaSelectedFile) {
        alert('Por favor selecione um ficheiro multimédia do seu computador.');
        return;
      }

      setMediaIsUploading(true);
      try {
        const reader = new FileReader();
        reader.readAsDataURL(mediaSelectedFile);
        reader.onload = async () => {
          try {
            const base64Data = reader.result as string;
            const res = await fetch('/api/media', {
              method: 'POST',
              headers: authHeaders,
              body: JSON.stringify({
                file_data: base64Data,
                original_name: mediaSelectedFile.name,
                title: mediaTitleInput.trim() || mediaSelectedFile.name.replace(/\.[^.]+$/, ''),
                alt_text: mediaAltInput.trim(),
                category: mediaCategoryInput,
              }),
            });

            const data = await res.json();
            if (!res.ok) {
              alert(data.error || 'Erro ao fazer upload do ficheiro.');
              return;
            }

            showNotification(`Ficheiro "${mediaSelectedFile.name}" carregado com sucesso para a Biblioteca Multimédia!`);
            setIsMediaUploadOpen(false);
            setMediaSelectedFile(null);
            setMediaPreviewUrl(null);
            setMediaTitleInput('');
            setMediaAltInput('');
            loadAllData();
          } catch (err: any) {
            alert('Falha na comunicação ao enviar ficheiro: ' + err.message);
          } finally {
            setMediaIsUploading(false);
          }
        };
        reader.onerror = () => {
          setMediaIsUploading(false);
          alert('Erro ao ler ficheiro local.');
        };
      } catch (e: any) {
        setMediaIsUploading(false);
        alert('Erro ao processar ficheiro: ' + e.message);
      }
    } else {
      // Registo por URL externo
      if (!mediaUrlInput.trim()) {
        alert('Por favor introduza o URL do ficheiro.');
        return;
      }

      setMediaIsUploading(true);
      try {
        const res = await fetch('/api/media', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            url: mediaUrlInput.trim(),
            title: mediaTitleInput.trim(),
            alt_text: mediaAltInput.trim(),
            category: mediaCategoryInput,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Erro ao registar URL.');
          return;
        }

        showNotification('Recurso multimédia adicionado com sucesso!');
        setIsMediaUploadOpen(false);
        setMediaUrlInput('');
        setMediaTitleInput('');
        setMediaAltInput('');
        loadAllData();
      } catch (e) {
        alert('Erro ao registar recurso.');
      } finally {
        setMediaIsUploading(false);
      }
    }
  };

  // Helper para abrir o Seletor Centralizado de Multimédia
  const openMediaPicker = (onSelectUrl: (url: string) => void) => {
    setMediaPickerCallback(() => onSelectUrl);
    setIsMediaPickerOpen(true);
  };

  // Delete Media
  const handleDeleteMedia = async (id: number) => {
    if (!window.confirm('Tem a certeza que deseja eliminar esta imagem da biblioteca?')) return;
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        showNotification('Imagem eliminada.');
        loadAllData();
      }
    } catch (e) {
      alert('Erro ao eliminar imagem.');
    }
  };

  // Save Page
  const handleSavePage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      cover_image: formData.get('cover_image'),
      status: formData.get('status') || 'publicado',
      seo_title: formData.get('seo_title'),
      seo_description: formData.get('seo_description'),
    };

    try {
      const isEdit = !!editingPage;
      const url = isEdit ? `/api/pages/${editingPage.id}` : '/api/pages';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showNotification(isEdit ? 'Página atualizada com sucesso!' : 'Nova página criada!');
        setIsPageFormOpen(false);
        setEditingPage(null);
        loadAllData();
        onRefreshPublicData();
      } else {
        alert(data.error || 'Erro ao guardar página.');
      }
    } catch (e: any) {
      alert('Erro de rede ao guardar página: ' + e.message);
    }
  };

  // Delete Page
  const handleDeletePage = async (id: number, title: string) => {
    if (!window.confirm(`Tem a certeza que deseja eliminar a página "${title}"?`)) return;
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        showNotification('Página eliminada.');
        loadAllData();
        onRefreshPublicData();
      } else {
        alert('Erro ao eliminar página.');
      }
    } catch (e: any) {
      alert('Erro ao eliminar página: ' + e.message);
    }
  };

  // Save Banner
  const handleSaveBanner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title'),
      subtitle: formData.get('subtitle'),
      image_url: formData.get('image_url'),
      button_text: formData.get('button_text'),
      button_url: formData.get('button_url'),
      status: formData.get('status') || 'ativo',
      sort_order: formData.get('sort_order') || 0,
    };

    try {
      const isEdit = !!editingBanner;
      const url = isEdit ? `/api/banners/${editingBanner.id}` : '/api/banners';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showNotification(isEdit ? 'Banner atualizado!' : 'Novo banner criado!');
        setIsBannerFormOpen(false);
        setEditingBanner(null);
        loadAllData();
      } else {
        alert(data.error || 'Erro ao guardar banner.');
      }
    } catch (e: any) {
      alert('Erro ao guardar banner: ' + e.message);
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (id: number) => {
    if (!window.confirm('Eliminar este banner?')) return;
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (res.ok) {
        showNotification('Banner eliminado.');
        loadAllData();
      } else {
        alert('Erro ao eliminar banner.');
      }
    } catch (e: any) {
      alert('Erro ao eliminar banner: ' + e.message);
    }
  };

  // Save Destination
  const handleSaveDestination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDestinationSaving(true);
    setDestinationError(null);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      country: formData.get('country'),
      summary: formData.get('summary'),
      description: formData.get('description'),
      cover_image: destinationCoverImage || formData.get('cover_image'),
      status: formData.get('status') || 'publicado',
      is_featured: formData.get('is_featured') === 'on' ? 1 : 0,
      seo_title: formData.get('seo_title'),
      seo_description: formData.get('seo_description'),
    };

    try {
      const isEdit = !!editingDestination;
      const url = isEdit ? `/api/destinations/${editingDestination.id}` : '/api/destinations';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showNotification(isEdit ? 'Destino atualizado com sucesso!' : 'Novo destino criado com sucesso!');
        setIsDestinationFormOpen(false);
        setEditingDestination(null);
        setDestinationCoverImage('');
        await loadAllData();
        onRefreshPublicData();
      } else {
        setDestinationError(data.error || 'Erro ao guardar destino. Verifique os campos.');
      }
    } catch (e: any) {
      setDestinationError('Erro de ligação ao guardar destino: ' + (e.message || 'Falha de rede'));
    } finally {
      setDestinationSaving(false);
    }
  };

  // Confirm Delete Destination (sem window.confirm)
  const confirmDeleteDestination = async () => {
    if (!destinationToDelete) return;
    setDestinationDeleting(true);
    try {
      const res = await fetch(`/api/destinations/${destinationToDelete.id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showNotification(data.message || `Destino "${destinationToDelete.name}" eliminado com sucesso.`);
        setDestinationToDelete(null);
        await loadAllData();
        onRefreshPublicData();
      } else {
        showNotification(data.error || 'Não foi possível eliminar o destino.');
      }
    } catch (e: any) {
      showNotification('Erro de comunicação ao eliminar destino: ' + (e.message || 'Erro de rede'));
    } finally {
      setDestinationDeleting(false);
    }
  };

  // Save Global Settings (inclui textos do Hero e visual)
  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates: Record<string, string> = {};
    formData.forEach((val, key) => {
      updates[key] = val.toString();
    });

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        showNotification('Definições e conteúdos atualizados com sucesso!');
        loadAllData();
        onRefreshPublicData();
      }
    } catch (e) {
      alert('Erro ao atualizar definições.');
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilterStatus !== 'all' && b.status !== bookingFilterStatus) return false;
    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      return (
        b.reference_code.toLowerCase().includes(q) ||
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_phone.includes(q) ||
        (b.destination && b.destination.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered Packages for Backoffice
  const filteredAdminPackages = packages.filter((pkg) => {
    if (packageFilterStatus !== 'all' && pkg.status !== packageFilterStatus) return false;
    if (packageFilterDestination !== 'all' && String(pkg.primary_destination_id) !== packageFilterDestination) return false;
    if (packageSearch.trim()) {
      const q = packageSearch.toLowerCase();
      return (
        pkg.title.toLowerCase().includes(q) ||
        (pkg.destination_name && pkg.destination_name.toLowerCase().includes(q)) ||
        (pkg.summary && pkg.summary.toLowerCase().includes(q)) ||
        (pkg.travel_dates && pkg.travel_dates.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered Media for Centralized Media Library
  const filteredMedia = mediaList.filter((m) => {
    if (mediaFilterType !== 'all') {
      const isImg = /\.(jpe?g|png|webp|svg)/i.test(m.file_path) || (m.mime_type && m.mime_type.startsWith('image/'));
      const isVideo = /\.mp4/i.test(m.file_path) || (m.mime_type && m.mime_type.startsWith('video/'));
      const isAudio = /\.mp3/i.test(m.file_path) || (m.mime_type && m.mime_type.startsWith('audio/'));
      const isPdf = /\.pdf/i.test(m.file_path) || (m.mime_type && m.mime_type === 'application/pdf');

      if (mediaFilterType === 'image' && !isImg) return false;
      if (mediaFilterType === 'video' && !isVideo) return false;
      if (mediaFilterType === 'audio' && !isAudio) return false;
      if (mediaFilterType === 'pdf' && !isPdf) return false;
      if (['pacotes', 'destinos', 'hero', 'geral', 'documentos'].includes(mediaFilterType)) {
        if (m.category !== mediaFilterType) return false;
      }
    }
    if (mediaSearch.trim()) {
      const q = mediaSearch.toLowerCase();
      return (
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.original_name && m.original_name.toLowerCase().includes(q)) ||
        (m.alt_text && m.alt_text.toLowerCase().includes(q)) ||
        (m.category && m.category.toLowerCase().includes(q)) ||
        m.filename.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#111827] flex flex-col font-sans">
      {/* Top Admin Header Bar - SaaS Executive Feel */}
      <header className="bg-[#071629] text-white px-5 py-3 border-b border-blue-950 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <BrandLogo variant="dark" />
          <div className="hidden sm:block border-l border-blue-900/60 pl-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-300">Backoffice Gestão</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-600/50 px-2 py-0.5 rounded font-mono font-bold">
                SQLite Ativo
              </span>
            </div>
            <span className="text-[11px] text-stone-400">
              {adminUser.name} • Perfil: <strong className="text-[#D4AF37] capitalize">{adminUser.role.replace('_', ' ')}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadAllData()}
            className="p-1.5 rounded bg-[#0D2646] hover:bg-blue-900 text-stone-300 hover:text-white transition-colors"
            title="Recarregar Dados da Base de Dados"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200 transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Ver Website</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800/60 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Categorized by Business Areas */}
        <aside className="w-full md:w-64 bg-[#071629] border-r border-stone-800 p-3 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-y-auto text-xs">
          {/* Section: Comercial */}
          <div className="hidden md:block px-3 py-1.5 text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            Área Comercial
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#D4AF37] text-[#071629] font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#0D2646]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Executivo</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'bg-[#D4AF37] text-[#071629] font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#0D2646]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>Pedidos & Reservas</span>
            </div>
            {stats?.pendingBookings > 0 && (
              <span className="text-[10px] bg-[#D4AF37] text-[#071629] px-2 py-0.5 rounded-full font-black">
                {stats.pendingBookings}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'packages'
                ? 'bg-[#D4AF37] text-[#071629] font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#0D2646]'
            }`}
          >
            <Luggage className="w-4 h-4" />
            <span>Pacotes Turísticos</span>
          </button>

          <button
            onClick={() => setActiveTab('destinations')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'destinations'
                ? 'bg-[#D4AF37] text-[#071629] font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#0D2646]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Destinos</span>
          </button>

          {/* Section: CMS Editorial */}
          <div className="hidden md:block px-3 pt-3 pb-1 text-[10px] uppercase font-bold text-stone-400 tracking-wider border-t border-stone-800/80 mt-2">
            Gestão Editorial (CMS)
          </div>

          <button
            onClick={() => setActiveTab('pages')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'pages'
                ? 'bg-[#D4AF37] text-[#071629] font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#0D2646]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Páginas Editoriais</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'media'
                ? 'bg-[#D4AF37] text-[#071629] font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#0D2646]'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Biblioteca Multimédia</span>
          </button>

          {/* Section: Gestão & Operação */}
          <div className="hidden md:block px-3 pt-3 pb-1 text-[10px] uppercase font-bold text-stone-400 tracking-wider border-t border-stone-800/80 mt-2">
            Gestão & Controlo
          </div>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'messages'
                ? 'bg-[#D4AF37] text-[#071629] font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#0D2646]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4" />
              <span>Mensagens</span>
            </div>
            {stats?.pendingContacts > 0 && (
              <span className="text-[10px] bg-sky-400 text-[#071629] px-2 py-0.5 rounded-full font-bold">
                {stats.pendingContacts}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-[#D4AF37] text-[#071629] font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#0D2646]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Utilizadores & Papéis</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'reports'
                ? 'bg-[#D4AF37] text-[#071629] font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#0D2646]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Relatórios & Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#D4AF37] text-[#071629] font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#0D2646]'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Definições da Agência</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'audit'
                ? 'bg-[#D4AF37] text-[#071629] font-bold'
                : 'text-stone-300 hover:text-white hover:bg-[#0D2646]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Auditoria</span>
          </button>
        </aside>

        {/* Workspace Body with White Ivory Clean Background */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 overflow-y-auto space-y-6">
          {actionSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-sm animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* TAB 1: DASHBOARD EXECUTIVO */}
          {activeTab === 'dashboard' && !stats && (
            <div className="flex flex-col items-center justify-center p-16 text-stone-500 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#D4AF37]" />
              <p className="text-sm font-medium">A carregar métricas executivas do sistema...</p>
            </div>
          )}

          {activeTab === 'dashboard' && stats && (
            <div className="space-y-6">
              {/* Executive Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-sm space-y-1">
                  <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">
                    Pedidos Pendentes
                  </span>
                  <div className="text-3xl font-bold text-[#071629]">
                    {stats.pendingBookings}
                  </div>
                  <span className="text-[11px] text-stone-400">Total de {stats.totalBookings} pedidos</span>
                </div>

                <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-sm space-y-1">
                  <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">
                    Reservas Confirmadas
                  </span>
                  <div className="text-3xl font-bold text-emerald-700">
                    {stats.confirmedBookings || 0}
                  </div>
                  <span className="text-[11px] text-stone-400">Conversão de {stats.conversionRate || 0}%</span>
                </div>

                <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-sm space-y-1">
                  <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">
                    Pacotes no Catálogo
                  </span>
                  <div className="text-3xl font-bold text-[#071629]">
                    {stats.totalPackages}
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {stats.publishedPackages} ativos | {stats.pendingValidationPackages} pend. validação
                  </span>
                </div>

                <div className="bg-white border border-stone-200/90 rounded-xl p-5 shadow-sm space-y-1">
                  <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">
                    Biblioteca Multimédia
                  </span>
                  <div className="text-3xl font-bold text-[#D4AF37]">
                    {stats.totalMedia || 0}
                  </div>
                  <span className="text-[11px] text-stone-400">Imagens reutilizáveis ativas</span>
                </div>
              </div>

              {/* Cape Town Alert Status Card */}
              <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Estado do Pacote Promocional Cape Town (31 Out - 02 Nov)</span>
                </div>
                <p className="text-xs text-amber-950/80 leading-relaxed">
                  O pacote anunciado no cartaz promocional oficial (59.500 MT/pessoa com passagem aérea, 2 noites de hotel e assistência) encontra-se registado na base de dados com o estado <strong>Pendente de Validação Operacional</strong>. Na aba de Pacotes, os gestores comerciais podem confirmar as datas definitivas de calendário e ativar a publicação.
                </p>
              </div>

              {/* Recent Bookings Table */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#071629] uppercase tracking-wider">
                    Últimos Pedidos de Cotação Recebidos
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    <span>Ver todos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="text-[10px] uppercase bg-stone-100 text-stone-600 border-b border-stone-200">
                      <tr>
                        <th className="p-3">Referência</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Serviço / Destino</th>
                        <th className="p-3">Contacto</th>
                        <th className="p-3">Data</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {stats.recentBookings.map((b: any) => (
                        <tr key={b.id} className="hover:bg-stone-50">
                          <td className="p-3 font-mono font-bold text-[#071629]">{b.reference_code}</td>
                          <td className="p-3 font-medium text-stone-900">{b.customer_name}</td>
                          <td className="p-3">{b.service_type} - {b.destination || 'Geral'}</td>
                          <td className="p-3">{b.phone_country_code} {b.customer_phone}</td>
                          <td className="p-3 text-stone-500">{new Date(b.created_at).toLocaleDateString('pt-MZ')}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                b.status === 'Pendente'
                                  ? 'bg-amber-100 text-amber-800'
                                  : b.status === 'Confirmado'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setBookingStatusText(b.status);
                                setBookingNoteText(b.admin_notes || '');
                                loadBookingTimeline(b.id);
                              }}
                              className="px-2.5 py-1 rounded bg-[#071629] text-white hover:bg-[#0D2646] font-semibold text-[11px]"
                            >
                              Gerir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GESTÃO DE PEDIDOS E RESERVAS (CRM COMERCIAL) */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Pesquisar por referência, cliente, telefone..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#071629]"
                    />
                  </div>

                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:outline-none"
                  >
                    <option value="all">Todos os Estados</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Em análise">Em análise</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Cotação enviada">Cotação enviada</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-500">
                    {filteredBookings.length} pedidos
                  </span>
                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar CSV</span>
                  </button>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="text-[10px] uppercase bg-stone-100 text-stone-600 border-b border-stone-200">
                      <tr>
                        <th className="p-3">Ref. Única</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Contacto</th>
                        <th className="p-3">Serviço / Pacote</th>
                        <th className="p-3">Datas Pretendidas</th>
                        <th className="p-3">Pax</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Notas Internas</th>
                        <th className="p-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-stone-50">
                          <td className="p-3 font-mono font-bold text-[#071629]">{b.reference_code}</td>
                          <td className="p-3 font-medium text-stone-900">
                            <div>{b.customer_name}</div>
                            {b.customer_email && <div className="text-[10px] text-stone-400">{b.customer_email}</div>}
                          </td>
                          <td className="p-3">{b.phone_country_code} {b.customer_phone}</td>
                          <td className="p-3">
                            <span className="font-semibold text-stone-800">{b.service_type}</span>
                            {b.destination && <div className="text-[11px] text-stone-500">{b.destination}</div>}
                          </td>
                          <td className="p-3 text-stone-600">{b.preferred_dates || 'Flexíveis'}</td>
                          <td className="p-3 text-center">{b.travelers_count}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                b.status === 'Pendente'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : b.status === 'Em análise'
                                  ? 'bg-blue-100 text-blue-800'
                                  : b.status === 'Contactado'
                                  ? 'bg-purple-100 text-purple-800'
                                  : b.status === 'Cotação enviada'
                                  ? 'bg-sky-100 text-sky-800'
                                  : b.status === 'Confirmado'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3 max-w-[180px] truncate text-[11px] text-stone-500 italic">
                            {b.admin_notes || '—'}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setBookingStatusText(b.status);
                                setBookingNoteText(b.admin_notes || '');
                                loadBookingTimeline(b.id);
                              }}
                              className="px-2.5 py-1 rounded bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-semibold text-[11px]"
                            >
                              Histórico & Estado
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GESTÃO DE PACOTES (COM 7 SEPARADORES) */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#071629]">Catálogo de Pacotes Turísticos</h2>
                    <span className="text-[11px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                      {filteredAdminPackages.length} {filteredAdminPackages.length === 1 ? 'pacote' : 'pacotes'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">Gestão comercial de preços, validades, itinerários e publicação</p>
                </div>

                <button
                  onClick={() => {
                    setEditingPackage(null);
                    setPackageFormActiveTab(1);
                    setIsPackageFormOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold text-xs uppercase tracking-wider self-start sm:self-auto cursor-pointer shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Pacote</span>
                </button>
              </div>

              {/* Package Search & Filter Toolbar */}
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Pesquisar por título, destino ou resumo..."
                      value={packageSearch}
                      onChange={(e) => setPackageSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#071629]"
                    />
                  </div>

                  <select
                    value={packageFilterStatus}
                    onChange={(e) => setPackageFilterStatus(e.target.value)}
                    className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:outline-none"
                  >
                    <option value="all">Todos os Estados</option>
                    <option value="publicado">Publicado</option>
                    <option value="pendente_validacao">Pendente Validação</option>
                    <option value="rascunho">Rascunho</option>
                    <option value="arquivado">Arquivado</option>
                  </select>

                  <select
                    value={packageFilterDestination}
                    onChange={(e) => setPackageFilterDestination(e.target.value)}
                    className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium focus:outline-none"
                  >
                    <option value="all">Todos os Destinos</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id.toString()}>
                        {d.name} ({d.country})
                      </option>
                    ))}
                  </select>

                  {(packageSearch || packageFilterStatus !== 'all' || packageFilterDestination !== 'all') && (
                    <button
                      onClick={() => {
                        setPackageSearch('');
                        setPackageFilterStatus('all');
                        setPackageFilterDestination('all');
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline px-1 cursor-pointer"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>

                <div className="text-xs text-stone-400 self-end sm:self-auto font-mono">
                  Total no sistema: {packages.length}
                </div>
              </div>

              {/* Package Grid */}
              {filteredAdminPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAdminPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#D4AF37] hover:shadow-md transition-all group"
                    >
                      {/* Flyer / Cover Photo Thumbnail */}
                      <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                        <img
                          src={pkg.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#071629]/90 text-white backdrop-blur-sm border border-white/20">
                            {pkg.destination_name || 'Destino'}
                          </span>
                          {pkg.is_featured === 1 && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-stone-950">
                              Destaque
                            </span>
                          )}
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-sm ${
                              pkg.status === 'publicado'
                                ? 'bg-emerald-500 text-white'
                                : pkg.status === 'pendente_validacao'
                                ? 'bg-amber-500 text-stone-950 border border-amber-300'
                                : 'bg-stone-600 text-white'
                            }`}
                          >
                            {pkg.status}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <span className="text-[10px] text-stone-300">
                            {pkg.duration_nights} Noites / {pkg.duration_days} Dias
                          </span>
                          <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                            {pkg.title}
                          </h3>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                            {pkg.summary}
                          </p>
                          {pkg.travel_dates && (
                            <div className="text-[11px] text-stone-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#D4AF37]" />
                              <span className="truncate">{pkg.travel_dates}</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">Preço</span>
                            <div className="text-sm font-bold text-[#071629]">
                              {formatMZN(pkg.price_per_person ?? pkg.total_price, pkg.currency, pkg.price_type)}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingPackage(pkg);
                                setPackageFormActiveTab(1);
                                setIsPackageFormOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#071629] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Edit2 className="w-3 h-3 text-[#071629]" />
                              <span>Editar</span>
                            </button>

                            <button
                              onClick={() => handleDeletePackage(pkg.id, pkg.title)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer transition-colors"
                              title="Eliminar Pacote"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-xl border border-dashed border-stone-300 space-y-3 shadow-sm">
                  <Luggage className="w-12 h-12 text-stone-400 mx-auto" />
                  <h3 className="text-base font-bold text-stone-800">
                    {packages.length === 0
                      ? 'Nenhum pacote turístico registado'
                      : 'Nenhum pacote corresponde aos filtros de pesquisa'}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    {packages.length === 0
                      ? 'Pode criar um novo pacote turístico utilizando o botão abaixo com todos os 7 separadores comerciais.'
                      : 'Tente alterar os termos da pesquisa ou limpar os filtros de estado e destino.'}
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    {packages.length > 0 && (
                      <button
                        onClick={() => {
                          setPackageSearch('');
                          setPackageFilterStatus('all');
                          setPackageFilterDestination('all');
                        }}
                        className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold"
                      >
                        Limpar Filtros
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingPackage(null);
                        setPackageFormActiveTab(1);
                        setIsPackageFormOpen(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] text-xs font-bold uppercase tracking-wider"
                    >
                      Criar Novo Pacote
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DESTINOS TURÍSTICOS */}
          {activeTab === 'destinations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#071629]">Destinos Turísticos</h2>
                  <p className="text-xs text-stone-500">Gestão dos destinos nacionais e internacionais do portfólio</p>
                </div>

                <button
                  onClick={() => {
                    setEditingDestination(null);
                    setDestinationCoverImage('');
                    setDestinationError(null);
                    setIsDestinationFormOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Destino</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinations.map((d) => (
                  <div key={d.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="h-32 w-full relative bg-stone-800">
                        <img src={d.cover_image} alt={d.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071629] via-transparent" />
                        <div className="absolute top-2 right-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            d.status === 'publicado' ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-white'
                          }`}>
                            {d.status === 'publicado' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-3 right-3 text-white">
                          <span className="text-[10px] uppercase font-bold text-[#D4AF37]">{d.country}</span>
                          <h3 className="text-base font-bold">{d.name}</h3>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <p className="text-xs text-stone-600 line-clamp-2">{d.summary}</p>
                        {d.is_featured ? (
                          <span className="inline-block text-[10px] bg-[#FFF4D6] text-[#8F5B00] border border-[#F8AE07]/30 font-bold px-2 py-0.5 rounded">
                            ★ Em Destaque
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        <span className="text-xs text-stone-500 font-medium">
                          {d.package_count || 0} pacotes
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingDestination(d);
                              setDestinationCoverImage(d.cover_image || '');
                              setDestinationError(null);
                              setIsDestinationFormOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-800 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3 h-3 text-stone-600" />
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => setDestinationToDelete({ id: d.id, name: d.name })}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer transition-colors"
                            title={`Eliminar ${d.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CMS EDITORIAL - HOMEPAGE & HERO */}
          {activeTab === 'content' && (
            <div className="max-w-3xl space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[#071629]">Gestor de Conteúdos da Homepage</h2>
                <p className="text-xs text-stone-500">
                  Edite os títulos, chamadas de ação e imagens principais da página pública sem programar.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm text-xs">
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Título Principal do Hero (H1)
                    </label>
                    <input
                      type="text"
                      name="hero_title"
                      defaultValue={settings.hero_title || 'O mundo espera por si.'}
                      className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Subtítulo do Hero
                    </label>
                    <textarea
                      rows={2}
                      name="hero_subtitle"
                      defaultValue={settings.hero_subtitle || 'Descubra novos destinos com experiências de viagem pensadas à sua medida.'}
                      className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Texto do Botão Primário
                      </label>
                      <input
                        type="text"
                        name="hero_cta_primary"
                        defaultValue={settings.hero_cta_primary || 'Explorar Destinos'}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Texto do Botão Secundário
                      </label>
                      <input
                        type="text"
                        name="hero_cta_secondary"
                        defaultValue={settings.hero_cta_secondary || 'Planear a Minha Viagem'}
                        className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-stone-700 uppercase tracking-wider">
                        URL da Imagem de Fundo Panorâmica
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((url) => {
                            const el = document.getElementById('hero_bg_image_input') as HTMLInputElement;
                            if (el) el.value = url;
                          })
                        }
                        className="text-xs font-bold text-[#071629] hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Escolher da Biblioteca</span>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="hero_bg_image_input"
                        name="hero_bg_image"
                        defaultValue={settings.hero_bg_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80'}
                        className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          openMediaPicker((url) => {
                            const el = document.getElementById('hero_bg_image_input') as HTMLInputElement;
                            if (el) el.value = url;
                          })
                        }
                        className="px-3 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold text-xs uppercase flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Biblioteca</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-stone-200">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold uppercase tracking-wider text-xs shadow-sm cursor-pointer"
                  >
                    Guardar Alterações da Homepage
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: PÁGINAS EDITORIAIS INSTITUCIONAIS */}
          {activeTab === 'pages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#071629]">Páginas Editoriais do Website</h2>
                  <p className="text-xs text-stone-500">Crie e edite páginas institucionais com conteúdos ricos e metadados SEO</p>
                </div>

                <button
                  onClick={() => {
                    setEditingPage(null);
                    setIsPageFormOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold text-xs uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Página</span>
                </button>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="text-[10px] uppercase bg-stone-100 text-stone-600 border-b border-stone-200">
                    <tr>
                      <th className="p-3">Título da Página</th>
                      <th className="p-3">URL / Slug</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Última Atualização</th>
                      <th className="p-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {pages.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50">
                        <td className="p-3 font-semibold text-[#071629]">{p.title}</td>
                        <td className="p-3 font-mono text-[11px] text-stone-500">/{p.slug}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'publicado' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="p-3 text-stone-400">
                          {p.updated_at ? new Date(p.updated_at).toLocaleDateString('pt-MZ') : '—'}
                        </td>
                        <td className="p-3 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingPage(p);
                              setIsPageFormOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-[#071629] font-medium text-xs"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeletePage(p.id, p.title)}
                            className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: BANNERS & CAMPANHAS */}
          {activeTab === 'banners' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#071629]">Banners & Campanhas Promocionais</h2>
                  <p className="text-xs text-stone-500">Gerir destaques visuais temporários e campanhas especiais</p>
                </div>

                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setIsBannerFormOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold text-xs uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Banner</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((b) => (
                  <div key={b.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="h-36 w-full relative bg-stone-900">
                      <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071629] via-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37]">{b.status}</span>
                        <h4 className="text-base font-bold font-editorial">{b.title}</h4>
                      </div>
                    </div>

                    <div className="p-4 space-y-2 text-xs">
                      <p className="text-stone-600 line-clamp-2">{b.subtitle}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        <span className="text-[11px] text-stone-400">Botão: {b.button_text}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingBanner(b);
                              setIsBannerFormOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-xs font-semibold"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(b.id)}
                            className="p-1 rounded bg-rose-50 text-rose-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: BIBLIOTECA MULTIMÉDIA CENTRALIZADA */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[#071629]">Biblioteca Multimédia Centralizada</h2>
                    <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                      {filteredMedia.length} {filteredMedia.length === 1 ? 'ficheiro' : 'ficheiros'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Repositório único para imagens, cartazes, vídeos, áudios e documentos (PDF) reutilizáveis em pacotes, destinos e campanhas
                  </p>
                </div>

                <button
                  onClick={() => {
                    setMediaUploadMode('file');
                    setMediaSelectedFile(null);
                    setMediaPreviewUrl(null);
                    setMediaUrlInput('');
                    setMediaTitleInput('');
                    setMediaAltInput('');
                    setIsMediaUploadOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Fazer Upload de Ficheiro</span>
                </button>
              </div>

              {/* Toolbar & Filters */}
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Pesquisar por título, nome original ou categoria..."
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#071629]"
                    />
                  </div>

                  <div className="text-xs text-stone-400 self-end sm:self-auto font-mono">
                    Total na biblioteca: {mediaList.length}
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Tipo:
                  </span>

                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'image', label: 'Imagens (JPG, PNG, WEBP)' },
                    { id: 'video', label: 'Vídeos (MP4)' },
                    { id: 'audio', label: 'Áudios (MP3)' },
                    { id: 'pdf', label: 'Documentos (PDF)' },
                    { id: 'pacotes', label: 'Pacotes' },
                    { id: 'destinos', label: 'Destinos' },
                    { id: 'hero', label: 'Hero & Banners' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setMediaFilterType(tab.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        mediaFilterType === tab.id
                          ? 'bg-[#071629] text-[#D4AF37] shadow-sm'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}

                  {(mediaSearch || mediaFilterType !== 'all') && (
                    <button
                      onClick={() => {
                        setMediaSearch('');
                        setMediaFilterType('all');
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline ml-auto px-1 cursor-pointer"
                    >
                      Limpar Filtros
                    </button>
                  )}
                </div>
              </div>

              {/* Multimedia Grid */}
              {filteredMedia.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMedia.map((m) => {
                    const isPdf = /\.pdf/i.test(m.file_path) || m.mime_type === 'application/pdf';
                    const isVideo = /\.mp4/i.test(m.file_path) || (m.mime_type && m.mime_type.startsWith('video/'));
                    const isAudio = /\.mp3/i.test(m.file_path) || (m.mime_type && m.mime_type.startsWith('audio/'));
                    const isCopied = copiedMediaId === m.id;

                    const ext = m.filename.split('.').pop()?.toUpperCase() || (isPdf ? 'PDF' : isVideo ? 'MP4' : isAudio ? 'MP3' : 'IMG');

                    return (
                      <div
                        key={m.id}
                        className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-[#D4AF37] hover:shadow-md transition-all"
                      >
                        {/* File Visual Preview */}
                        <div className="h-40 w-full bg-stone-900 overflow-hidden relative flex items-center justify-center">
                          {isPdf ? (
                            <div className="flex flex-col items-center justify-center p-4 text-center text-rose-300">
                              <File className="w-12 h-12 text-rose-500 mb-1" />
                              <span className="text-[11px] font-bold text-white line-clamp-1">{m.original_name || m.title}</span>
                              <span className="text-[10px] text-stone-400">Documento PDF</span>
                            </div>
                          ) : isVideo ? (
                            <div className="flex flex-col items-center justify-center p-4 text-center text-amber-300">
                              <Video className="w-12 h-12 text-amber-400 mb-1" />
                              <span className="text-[11px] font-bold text-white line-clamp-1">{m.title}</span>
                              <span className="text-[10px] text-stone-400">Vídeo MP4</span>
                            </div>
                          ) : isAudio ? (
                            <div className="flex flex-col items-center justify-center p-4 text-center text-sky-300">
                              <Music className="w-12 h-12 text-sky-400 mb-1" />
                              <span className="text-[11px] font-bold text-white line-clamp-1">{m.title}</span>
                              <span className="text-[10px] text-stone-400">Áudio MP3</span>
                            </div>
                          ) : (
                            <img
                              src={m.file_path}
                              alt={m.alt_text || m.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1200&q=80';
                              }}
                            />
                          )}

                          {/* Extension Badge */}
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#071629]/90 text-white backdrop-blur-sm border border-white/20 uppercase">
                            {ext}
                          </span>

                          {/* Category Badge */}
                          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-stone-950 uppercase">
                            {m.category || 'geral'}
                          </span>

                          {/* Action Overlay */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                              href={m.file_path}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-[#071629]/80 text-white hover:bg-[#071629]"
                              title="Abrir / Ver Ficheiro"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              onClick={() => handleDeleteMedia(m.id)}
                              className="p-1 rounded bg-rose-700/90 text-white hover:bg-rose-700"
                              title="Eliminar da Biblioteca"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* File Metadata & Actions */}
                        <div className="p-3.5 text-xs space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="font-bold text-stone-900 truncate" title={m.title}>
                              {m.title}
                            </div>
                            <div className="text-[11px] text-stone-400 truncate mt-0.5" title={m.original_name}>
                              {m.original_name || m.filename}
                            </div>
                            <div className="text-[10px] text-stone-400 font-mono mt-1">
                              {(m.file_size / 1024).toFixed(0)} KB • {m.mime_type || 'Desconhecido'}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(m.file_path);
                                setCopiedMediaId(m.id);
                                setTimeout(() => setCopiedMediaId(null), 2000);
                                showNotification('Caminho do ficheiro copiado para a área de transferência!');
                              }}
                              className="flex items-center gap-1 text-[11px] font-bold text-[#071629] hover:text-blue-900 transition-colors cursor-pointer"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                                  <span>Copiar URL</span>
                                </>
                              )}
                            </button>

                            <a
                              href={m.file_path}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-stone-500 hover:text-stone-800 font-semibold"
                            >
                              Visualizar
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-xl border border-dashed border-stone-300 space-y-3 shadow-sm">
                  <UploadCloud className="w-12 h-12 text-stone-400 mx-auto" />
                  <h3 className="text-base font-bold text-stone-800">
                    {mediaList.length === 0
                      ? 'Nenhum ficheiro na Biblioteca Multimédia'
                      : 'Nenhum ficheiro corresponde aos filtros aplicados'}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Faça upload de fotos dos pacotes, cartazes promocionais, vídeos ou documentos PDF de roteiros para armazenar e reutilizar em todo o website.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    {mediaList.length > 0 && (
                      <button
                        onClick={() => {
                          setMediaSearch('');
                          setMediaFilterType('all');
                        }}
                        className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer"
                      >
                        Limpar Filtros
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setMediaUploadMode('file');
                        setMediaSelectedFile(null);
                        setMediaPreviewUrl(null);
                        setIsMediaUploadOpen(true);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Fazer Upload de Ficheiro
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: MENU DE NAVEGAÇÃO */}
          {activeTab === 'navigation' && (
            <div className="max-w-2xl space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#071629]">Menu de Navegação</h2>
                <p className="text-xs text-stone-500">Configure os links e a ordem de apresentação no cabeçalho e rodapé</p>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="text-[10px] uppercase bg-stone-100 text-stone-600 border-b border-stone-200">
                    <tr>
                      <th className="p-3">Ordem</th>
                      <th className="p-3">Rótulo (Label)</th>
                      <th className="p-3">Destino (Secção/URL)</th>
                      <th className="p-3">Localização</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {navItems.map((n) => (
                      <tr key={n.id}>
                        <td className="p-3 font-bold text-stone-500">{n.sort_order}</td>
                        <td className="p-3 font-semibold text-stone-900">{n.label}</td>
                        <td className="p-3 font-mono text-[11px] text-stone-500">{n.url}</td>
                        <td className="p-3 uppercase text-[10px] text-stone-500">{n.location}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Ativo
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 10: UTILIZADORES E PAPÉIS */}
          {activeTab === 'users' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#071629]">Utilizadores & Controlo de Acesso (RBAC)</h2>
                  <p className="text-xs text-stone-500">Perfis de Superadministrador, Gestor Comercial, Editor e Atendimento</p>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="text-[10px] uppercase bg-stone-100 text-stone-600 border-b border-stone-200">
                    <tr>
                      <th className="p-3">Nome</th>
                      <th className="p-3">Email de Acesso</th>
                      <th className="p-3">Papel / Função</th>
                      <th className="p-3">Estado</th>
                      <th className="p-3">Data de Registo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-stone-50">
                        <td className="p-3 font-semibold text-stone-900">{u.name}</td>
                        <td className="p-3 font-mono text-[11px] text-stone-600">{u.email}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#071629] text-[#D4AF37]">
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Ativo
                          </span>
                        </td>
                        <td className="p-3 text-stone-400">
                          {u.status || 'Ativo'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 11: RELATÓRIOS E CONVERSÃO */}
          {activeTab === 'reports' && stats && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold text-[#071629]">Relatórios de Desempenho e Conversão</h2>
                <p className="text-xs text-stone-500">Métricas comerciais calculadas em tempo real a partir dos registos SQLite</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm">
                  <span className="text-xs uppercase font-bold text-stone-500">Taxa de Conversão</span>
                  <div className="text-3xl font-black text-emerald-700 mt-1">
                    {stats.conversionRate}%
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">Pedidos convertidos em reservas confirmadas</p>
                </div>

                <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm">
                  <span className="text-xs uppercase font-bold text-stone-500">Total de Pedidos Registados</span>
                  <div className="text-3xl font-black text-[#071629] mt-1">
                    {stats.totalBookings}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">{stats.pendingBookings} pendentes | {stats.confirmedBookings} confirmados</p>
                </div>

                <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm">
                  <span className="text-xs uppercase font-bold text-stone-500">Ofertas Comerciais Ativas</span>
                  <div className="text-3xl font-black text-[#D4AF37] mt-1">
                    {stats.publishedPackages}
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">Distribuídas por {stats.totalDestinations} destinos</p>
                </div>
              </div>

              {/* Status Breakdown Bar */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
                <h4 className="text-xs uppercase font-bold text-stone-700 tracking-wider">
                  Distribuição dos Pedidos por Estado
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-stone-600 mb-1">
                      <span>Pendentes ({stats.pendingBookings})</span>
                      <span>{stats.totalBookings > 0 ? Math.round((stats.pendingBookings / stats.totalBookings) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${stats.totalBookings > 0 ? (stats.pendingBookings / stats.totalBookings) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-600 mb-1">
                      <span>Contactados ({stats.contactedBookings || 0})</span>
                      <span>{stats.totalBookings > 0 ? Math.round(((stats.contactedBookings || 0) / stats.totalBookings) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${stats.totalBookings > 0 ? ((stats.contactedBookings || 0) / stats.totalBookings) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-600 mb-1">
                      <span>Confirmados ({stats.confirmedBookings || 0})</span>
                      <span>{stats.conversionRate}%</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${stats.conversionRate}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: MENSAGENS */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#071629]">Mensagens do Formulário de Contacto</h2>
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className="bg-white border border-stone-200 rounded-xl p-5 space-y-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#071629]">{m.subject}</h3>
                        <div className="text-xs text-stone-500">
                          De: <span className="font-semibold text-stone-800">{m.name}</span> ({m.email})
                          {m.phone && <span className="ml-2">| Tel: {m.phone}</span>}
                        </div>
                      </div>
                      <span className="text-xs text-stone-400">{new Date(m.created_at).toLocaleString('pt-MZ')}</span>
                    </div>
                    <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-lg leading-relaxed whitespace-pre-line">
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 13: DEFINIÇÕES GLOBAIS */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-5">
              <div>
                <h2 className="text-lg font-bold text-[#071629]">Definições Oficiais da Zebra Tours</h2>
                <p className="text-xs text-stone-500">Configuração de contactos, moeda, slogan e dados institucionais</p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-sm text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Nome da Agência</label>
                    <input
                      type="text"
                      name="site_name"
                      defaultValue={settings.site_name || 'Zebra Tours Moçambique'}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Slogan</label>
                    <input
                      type="text"
                      name="slogan"
                      defaultValue={settings.slogan || 'O seu próximo destino começa aqui!'}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Telefone Principal</label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={settings.phone || '+258 85 104 1826'}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">WhatsApp</label>
                    <input
                      type="text"
                      name="whatsapp"
                      defaultValue={settings.whatsapp || '+258 85 104 1826'}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Email Institucional</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={settings.email || 'info@zebratours.co.mz'}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase mb-1">Sede / Localização</label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={settings.location || 'Maputo, Moçambique'}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-stone-200">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold text-xs uppercase tracking-wider"
                  >
                    Guardar Definições
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 14: AUDITORIA */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#071629]">Histórico e Registos de Auditoria</h2>
              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="text-[10px] uppercase bg-stone-100 text-stone-600 border-b border-stone-200">
                    <tr>
                      <th className="p-3">Data / Hora</th>
                      <th className="p-3">Ação</th>
                      <th className="p-3">Entidade</th>
                      <th className="p-3">Operador</th>
                      <th className="p-3">Metadados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50">
                        <td className="p-3 text-stone-400">{new Date(log.created_at).toLocaleString('pt-MZ')}</td>
                        <td className="p-3 font-bold text-[#071629]">{log.action}</td>
                        <td className="p-3">{log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}</td>
                        <td className="p-3 text-stone-800 font-medium">{log.user_name || 'Admin'}</td>
                        <td className="p-3 text-stone-500 truncate max-w-xs">{log.metadata}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: SEGUIMENTO COMERCIAL E LINHA DO TEMPO DO PEDIDO */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 text-stone-800 space-y-4 shadow-2xl border border-stone-200 my-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#D4AF37]">{selectedBooking.reference_code}</span>
                <h3 className="text-base font-bold text-[#071629]">{selectedBooking.customer_name}</h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-stone-400 hover:text-stone-800">✕</button>
            </div>

            <div className="text-xs space-y-2 bg-[#F4F1EA] p-3 rounded-xl text-stone-700">
              <div className="grid grid-cols-2 gap-2">
                <div><strong>Telefone:</strong> {selectedBooking.phone_country_code} {selectedBooking.customer_phone}</div>
                {selectedBooking.customer_email && <div><strong>Email:</strong> {selectedBooking.customer_email}</div>}
                <div><strong>Serviço:</strong> {selectedBooking.service_type}</div>
                <div><strong>Destino:</strong> {selectedBooking.destination || 'Geral'}</div>
                <div><strong>Datas:</strong> {selectedBooking.preferred_dates || 'Flexíveis'}</div>
                <div><strong>Viajantes:</strong> {selectedBooking.travelers_count}</div>
              </div>
              {selectedBooking.message && (
                <div className="pt-2 border-t border-stone-300">
                  <strong>Mensagem do Viajante:</strong>
                  <p className="mt-0.5 italic text-stone-600">{selectedBooking.message}</p>
                </div>
              )}
            </div>

            {/* Timeline History */}
            {bookingHistory.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                  Histórico de Contactos e Alterações
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto text-xs pr-1">
                  {bookingHistory.map((h) => (
                    <div key={h.id} className="p-2 bg-stone-50 rounded border border-stone-200 space-y-0.5">
                      <div className="flex justify-between font-semibold text-stone-800">
                        <span>{h.author_name} • {h.action}</span>
                        <span className="text-[10px] text-stone-400">{new Date(h.created_at).toLocaleDateString('pt-MZ')}</span>
                      </div>
                      {h.notes && <p className="text-[11px] text-stone-600 italic">{h.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Update Status and Internal Note */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Alterar Estado Comercial
                </label>
                <select
                  value={bookingStatusText}
                  onChange={(e: any) => setBookingStatusText(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#071629]"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Contactado">Contactado</option>
                  <option value="Cotação enviada">Cotação enviada</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Nota Interna / Registo de Seguimento (Confidencial)
                </label>
                <textarea
                  rows={3}
                  value={bookingNoteText}
                  onChange={(e) => setBookingNoteText(e.target.value)}
                  placeholder="Ex: Cotação oficial enviada por WhatsApp. Aguarda aprovação do bilhete..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateBookingWithTimeline}
                className="px-5 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Gravar Atualização
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FORMULÁRIO DE PACOTE COM 7 SEPARADORES */}
      {isPackageFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 text-stone-800 space-y-4 my-auto max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#071629]">
                  {editingPackage ? 'Editar Pacote Turístico' : 'Criar Novo Pacote Turístico'}
                </h3>
                <span className="text-xs text-stone-500">Formulário comercial estruturado</span>
              </div>
              <button onClick={() => setIsPackageFormOpen(false)} className="text-stone-400 hover:text-stone-800">✕</button>
            </div>

            {/* 7 Tabs Navigation */}
            <div className="flex border-b border-stone-200 gap-1 overflow-x-auto text-xs pb-1">
              {[
                { id: 1, label: '1. Geral' },
                { id: 2, label: '2. Destinos' },
                { id: 3, label: '3. Preços & Datas' },
                { id: 4, label: '4. Descrição' },
                { id: 5, label: '5. Serviços' },
                { id: 6, label: '6. Imagem' },
                { id: 7, label: '7. Publicação' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPackageFormActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-colors ${
                    packageFormActiveTab === tab.id
                      ? 'bg-[#071629] text-[#D4AF37]'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              {/* TAB 1: GERAL */}
              <div className={packageFormActiveTab === 1 ? 'space-y-3' : 'hidden'}>
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Título do Pacote *</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingPackage?.title || ''}
                    placeholder="Ex: Cape Town Especial Fim de Semana"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-700">Resumo Comercial *</label>
                  <input
                    type="text"
                    name="summary"
                    defaultValue={editingPackage?.summary || ''}
                    placeholder="Escapadinha de 2 noites com voo e alojamento..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-stone-700">Duração Noites</label>
                    <input
                      type="number"
                      name="duration_nights"
                      defaultValue={editingPackage?.duration_nights || 2}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-stone-700">Duração Dias</label>
                    <input
                      type="number"
                      name="duration_days"
                      defaultValue={editingPackage?.duration_days || 3}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* TAB 2: DESTINOS */}
              <div className={packageFormActiveTab === 2 ? 'space-y-3' : 'hidden'}>
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Destino Principal</label>
                  <select
                    name="primary_destination_id"
                    defaultValue={editingPackage?.primary_destination_id || destinations[0]?.id}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.country})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TAB 3: PREÇOS & DATAS */}
              <div className={packageFormActiveTab === 3 ? 'space-y-3' : 'hidden'}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-stone-700">Preço por Pessoa (MT)</label>
                    <input
                      type="number"
                      name="price_per_person"
                      defaultValue={editingPackage?.price_per_person || ''}
                      placeholder="59500"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-stone-700">Tipo de Preço</label>
                    <select
                      name="price_type"
                      defaultValue={editingPackage?.price_type || 'indicativo'}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                    >
                      <option value="indicativo">Indicativo (A partir de)</option>
                      <option value="fixo">Fixo</option>
                      <option value="sob_consulta">Sob Consulta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-700">Período Anunciado / Datas de Viagem</label>
                  <input
                    type="text"
                    name="travel_dates"
                    defaultValue={editingPackage?.travel_dates || ''}
                    placeholder="Ex: 31 de Outubro a 02 de Novembro"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-700">Validade Comercial da Oferta</label>
                  <input
                    type="text"
                    name="validity_date"
                    defaultValue={editingPackage?.validity_date || ''}
                    placeholder="Sujeito a confirmação de disponibilidade"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* TAB 4: DESCRIÇÃO COMPLETA */}
              <div className={packageFormActiveTab === 4 ? 'space-y-3' : 'hidden'}>
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Descrição Editorial Detalhada *</label>
                  <textarea
                    rows={6}
                    name="description"
                    defaultValue={editingPackage?.description || ''}
                    placeholder="Descrição completa do roteiro, atrações, experiências..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* TAB 5: SERVIÇOS & CONDIÇÕES */}
              <div className={packageFormActiveTab === 5 ? 'space-y-3' : 'hidden'}>
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Serviços Incluídos (separados por ponto e vírgula ;)</label>
                  <input
                    type="text"
                    name="included_services"
                    defaultValue={editingPackage?.included_services || ''}
                    placeholder="Passagem aérea de ida e volta; 2 noites de hotel; Assistência de viagem"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-700">Serviços Excluídos (separados por ponto e vírgula ;)</label>
                  <input
                    type="text"
                    name="excluded_services"
                    defaultValue={editingPackage?.excluded_services || ''}
                    placeholder="Despesas de carácter pessoal; Vistos ou taxas alfandegárias"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-700">Condições de Reserva e Cancelamento</label>
                  <input
                    type="text"
                    name="conditions"
                    defaultValue={editingPackage?.conditions || ''}
                    placeholder="Tarifa indicativa em quarto duplo. Sujeito a confirmação da companhia aérea."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* TAB 6: IMAGEM */}
              <div className={packageFormActiveTab === 6 ? 'space-y-3' : 'hidden'}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-stone-700">URL / Ficheiro da Imagem de Capa</label>
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker((url) => {
                          const el = document.getElementById('package_cover_input') as HTMLInputElement;
                          if (el) el.value = url;
                        })
                      }
                      className="text-xs font-bold text-[#071629] hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Escolher da Biblioteca Multimédia</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="package_cover_input"
                      name="cover_image"
                      defaultValue={editingPackage?.cover_image || ''}
                      placeholder="https://... ou /uploads/multimedia/..."
                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        openMediaPicker((url) => {
                          const el = document.getElementById('package_cover_input') as HTMLInputElement;
                          if (el) el.value = url;
                        })
                      }
                      className="px-3 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold text-xs uppercase flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Biblioteca</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500">
                  Dica: Pode selecionar cartazes e fotos diretamente da <strong>Biblioteca Multimédia Centralizada</strong> ou inserir um link externo.
                </p>
              </div>

              {/* TAB 7: PUBLICAÇÃO & ESTADO */}
              <div className={packageFormActiveTab === 7 ? 'space-y-3' : 'hidden'}>
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Estado de Publicação</label>
                  <select
                    name="status"
                    defaultValue={editingPackage?.status || 'publicado'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="publicado">Publicado (Visível no site)</option>
                    <option value="pendente_validacao">Pendente de Validação Operacional</option>
                    <option value="rascunho">Rascunho (Privado)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    id="feat_pkg_box"
                    defaultChecked={!!editingPackage?.is_featured}
                    className="rounded"
                  />
                  <label htmlFor="feat_pkg_box" className="font-bold text-stone-800">
                    Colocar em Destaque na Homepage
                  </label>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-stone-200">
                <div className="text-stone-400 text-[11px]">
                  Passo {packageFormActiveTab} de 7
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPackageFormOpen(false)}
                    className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold uppercase tracking-wider"
                  >
                    Guardar Pacote
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD MULTIMÉDIA CENTRALIZADO (ARQUIVOS REAIS OU LINK) */}
      {isMediaUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 text-stone-800 space-y-4 shadow-2xl border border-stone-200 my-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#071629]">Upload para a Biblioteca Multimédia</h3>
                <p className="text-[11px] text-stone-500">Imagens (JPG, PNG, WEBP), Vídeos (MP4), Áudios (MP3) ou Documentos (PDF)</p>
              </div>
              <button
                onClick={() => {
                  setIsMediaUploadOpen(false);
                  setMediaSelectedFile(null);
                  setMediaPreviewUrl(null);
                }}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="flex rounded-lg bg-stone-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMediaUploadMode('file')}
                className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mediaUploadMode === 'file' ? 'bg-white text-[#071629] shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload do Computador</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaUploadMode('url')}
                className={`flex-1 py-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mediaUploadMode === 'url' ? 'bg-white text-[#071629] shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Registar por Link / URL</span>
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-3.5 text-xs">
              {mediaUploadMode === 'file' ? (
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Ficheiro Multimédia *</label>
                  <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center hover:border-[#D4AF37] transition-colors bg-stone-50/50">
                    <input
                      type="file"
                      id="file_upload_input"
                      accept="image/*,video/mp4,audio/mp3,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setMediaSelectedFile(file);
                          setMediaPreviewUrl(URL.createObjectURL(file));
                          if (!mediaTitleInput) {
                            setMediaTitleInput(file.name.replace(/\.[^.]+$/, ''));
                          }
                        }
                      }}
                      className="hidden"
                    />

                    {mediaSelectedFile ? (
                      <div className="space-y-2">
                        {mediaSelectedFile.type.startsWith('image/') && mediaPreviewUrl && (
                          <img
                            src={mediaPreviewUrl}
                            alt="Pré-visualização"
                            className="h-28 mx-auto rounded-lg object-cover shadow-sm border border-stone-200"
                          />
                        )}
                        {mediaSelectedFile.type === 'application/pdf' && (
                          <div className="flex flex-col items-center justify-center p-3 text-rose-600">
                            <File className="w-10 h-10 mb-1" />
                            <span className="font-bold text-xs text-stone-800">{mediaSelectedFile.name}</span>
                            <span className="text-[10px] text-stone-400">Documento PDF</span>
                          </div>
                        )}
                        {mediaSelectedFile.type.startsWith('video/') && (
                          <div className="flex flex-col items-center justify-center p-3 text-amber-600">
                            <Video className="w-10 h-10 mb-1" />
                            <span className="font-bold text-xs text-stone-800">{mediaSelectedFile.name}</span>
                          </div>
                        )}
                        {mediaSelectedFile.type.startsWith('audio/') && (
                          <div className="flex flex-col items-center justify-center p-3 text-sky-600">
                            <Music className="w-10 h-10 mb-1" />
                            <span className="font-bold text-xs text-stone-800">{mediaSelectedFile.name}</span>
                          </div>
                        )}

                        <div className="text-[11px] text-stone-600 font-mono">
                          {mediaSelectedFile.name} ({(mediaSelectedFile.size / 1024).toFixed(0)} KB)
                        </div>

                        <label
                          htmlFor="file_upload_input"
                          className="inline-block px-3 py-1 rounded bg-stone-200 hover:bg-stone-300 text-[10px] font-bold text-stone-700 cursor-pointer"
                        >
                          Trocar Ficheiro
                        </label>
                      </div>
                    ) : (
                      <label htmlFor="file_upload_input" className="cursor-pointer block space-y-1.5 py-4">
                        <UploadCloud className="w-8 h-8 text-[#071629] mx-auto" />
                        <div className="font-bold text-stone-800 text-xs">
                          Clique para selecionar do computador
                        </div>
                        <p className="text-[10px] text-stone-400">
                          Suporta Imagens (JPG, PNG, WEBP, SVG), Vídeos (MP4), Áudio (MP3) ou PDF até 25 MB
                        </p>
                      </label>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block font-bold mb-1 text-stone-700">URL do Ficheiro *</label>
                  <input
                    type="url"
                    required
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... ou https://..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#071629]"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold mb-1 text-stone-700">Título / Nome Identificador</label>
                <input
                  type="text"
                  value={mediaTitleInput}
                  onChange={(e) => setMediaTitleInput(e.target.value)}
                  placeholder="Ex: Cartaz Promocional Guangzhou 2026"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#071629]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700">Texto Alternativo (Alt Text para SEO e Acessibilidade)</label>
                <input
                  type="text"
                  value={mediaAltInput}
                  onChange={(e) => setMediaAltInput(e.target.value)}
                  placeholder="Ex: Folheto oficial da viagem de negócios a Guangzhou na China"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#071629]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700">Categoria na Biblioteca</label>
                <select
                  value={mediaCategoryInput}
                  onChange={(e) => setMediaCategoryInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                >
                  <option value="geral">Geral</option>
                  <option value="pacotes">Pacotes Turísticos</option>
                  <option value="destinos">Destinos</option>
                  <option value="hero">Hero e Campanhas</option>
                  <option value="documentos">Documentos / Roteiros</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsMediaUploadOpen(false);
                    setMediaSelectedFile(null);
                    setMediaPreviewUrl(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={mediaIsUploading}
                  className="px-5 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold uppercase tracking-wider cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {mediaIsUploading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{mediaIsUploading ? 'A Carregar...' : 'Guardar na Biblioteca'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SELETOR CENTRALIZADO DE MULTIMÉDIA (USADO POR PACOTES, BANNERS, DESTINOS) */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 text-stone-800 space-y-4 my-auto max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-base font-bold text-[#071629]">Selecionar da Biblioteca Multimédia Centralizada</h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">Clique em qualquer imagem para associar imediatamente</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMediaPickerOpen(false);
                    setMediaUploadMode('file');
                    setIsMediaUploadOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#071629] text-[#D4AF37] font-bold text-xs uppercase"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Ficheiro</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMediaPickerOpen(false);
                    setMediaPickerCallback(null);
                  }}
                  className="text-stone-400 hover:text-stone-800 text-sm font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Media Picker Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {mediaList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    if (mediaPickerCallback) {
                      mediaPickerCallback(m.file_path);
                    }
                    setIsMediaPickerOpen(false);
                    setMediaPickerCallback(null);
                    showNotification(`Imagem "${m.title}" selecionada!`);
                  }}
                  className="bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl overflow-hidden cursor-pointer hover:border-[#D4AF37] hover:shadow-md transition-all group p-2 text-center"
                >
                  <div className="h-28 w-full rounded-lg bg-stone-900 overflow-hidden relative mb-2">
                    <img
                      src={m.file_path}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded text-[8px] font-bold bg-amber-400 text-stone-950 uppercase">
                      {m.category}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-stone-800 truncate" title={m.title}>{m.title}</div>
                  <span className="text-[10px] text-blue-900 font-bold group-hover:underline block mt-0.5">
                    Escolher esta imagem →
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setIsMediaPickerOpen(false);
                  setMediaPickerCallback(null);
                }}
                className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PÁGINA EDITORIAL */}
      {isPageFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 text-stone-800 space-y-4 my-auto max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-[#071629]">
                {editingPage ? 'Editar Página Editorial' : 'Criar Nova Página Editorial'}
              </h3>
              <button onClick={() => setIsPageFormOpen(false)} className="text-stone-400 hover:text-stone-800">✕</button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-stone-700">Título da Página *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingPage?.title || ''}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700">Slug / URL Amigável</label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editingPage?.slug || ''}
                  placeholder="sobre-nos ou requisitos-vistos"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700">Resumo / Excerpt</label>
                <input
                  type="text"
                  name="excerpt"
                  defaultValue={editingPage?.excerpt || ''}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700">Conteúdo HTML Editorial *</label>
                <textarea
                  rows={8}
                  name="content"
                  required
                  defaultValue={editingPage?.content || ''}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-mono leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Estado</label>
                  <select
                    name="status"
                    defaultValue={editingPage?.status || 'publicado'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-semibold"
                  >
                    <option value="publicado">Publicado</option>
                    <option value="rascunho">Rascunho</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Título SEO</label>
                  <input
                    type="text"
                    name="seo_title"
                    defaultValue={editingPage?.seo_title || ''}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsPageFormOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#071629] text-[#D4AF37] font-bold uppercase tracking-wider"
                >
                  Guardar Página
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BANNERS */}
      {isBannerFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 text-stone-800 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-[#071629]">
                {editingBanner ? 'Editar Banner Promocional' : 'Novo Banner Promocional'}
              </h3>
              <button onClick={() => setIsBannerFormOpen(false)} className="text-stone-400 hover:text-stone-800">✕</button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-stone-700">Título *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingBanner?.title || ''}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700">Subtítulo</label>
                <input
                  type="text"
                  name="subtitle"
                  defaultValue={editingBanner?.subtitle || ''}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-stone-700">URL da Imagem *</label>
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((url) => {
                        const el = document.getElementById('banner_image_input') as HTMLInputElement;
                        if (el) el.value = url;
                      })
                    }
                    className="text-[11px] font-bold text-[#071629] hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Escolher da Biblioteca</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="banner_image_input"
                    name="image_url"
                    required
                    defaultValue={editingBanner?.image_url || ''}
                    placeholder="https://... ou /uploads/multimedia/..."
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((url) => {
                        const el = document.getElementById('banner_image_input') as HTMLInputElement;
                        if (el) el.value = url;
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Biblioteca</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Texto do Botão</label>
                  <input
                    type="text"
                    name="button_text"
                    defaultValue={editingBanner?.button_text || 'Saber Mais'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Destino do Botão</label>
                  <input
                    type="text"
                    name="button_url"
                    defaultValue={editingBanner?.button_url || '#pacotes-seccao'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Estado</label>
                  <select
                    name="status"
                    defaultValue={editingBanner?.status || 'ativo'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Ordem</label>
                  <input
                    type="number"
                    name="sort_order"
                    defaultValue={editingBanner?.sort_order || 0}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsBannerFormOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#071629] text-[#D4AF37] font-bold uppercase tracking-wider"
                >
                  Guardar Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DESTINOS (CRIAR E EDITAR) */}
      {isDestinationFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 text-stone-800 space-y-4 border border-stone-200 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#F8AE07]" />
                <h3 className="text-base font-bold text-[#071629]">
                  {editingDestination ? `Editar Destino: ${editingDestination.name}` : 'Criar Novo Destino'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsDestinationFormOpen(false);
                  setEditingDestination(null);
                  setDestinationError(null);
                }}
                className="text-stone-400 hover:text-stone-800 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {destinationError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{destinationError}</span>
              </div>
            )}

            <form
              key={editingDestination ? `dest-${editingDestination.id}` : 'dest-new'}
              onSubmit={handleSaveDestination}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Nome do Destino *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingDestination?.name || ''}
                    placeholder="Ex: Bazaruto, Cabo Delgado..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8AE07]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-700">País *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    defaultValue={editingDestination?.country || ''}
                    placeholder="Ex: Moçambique, Portugal..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8AE07]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-stone-700">Slug URL</label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingDestination?.slug || ''}
                    placeholder="auto-gerado (ex: bazaruto)"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-[11px] text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#F8AE07]"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">Vazio para gerar a partir do nome</span>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-stone-700">Estado de Publicação</label>
                  <select
                    name="status"
                    defaultValue={editingDestination?.status || 'publicado'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#F8AE07]"
                  >
                    <option value="publicado">Publicado (Visível no site)</option>
                    <option value="rascunho">Rascunho (Oculto)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-stone-700">Imagem de Capa (URL)</label>
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((url) => {
                        setDestinationCoverImage(url);
                      })
                    }
                    className="text-[11px] font-bold text-[#071629] hover:text-[#D4AF37] flex items-center gap-1 cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Escolher da Biblioteca</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="cover_image"
                    value={destinationCoverImage}
                    onChange={(e) => setDestinationCoverImage(e.target.value)}
                    placeholder="https://... ou /uploads/multimedia/..."
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#F8AE07]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      openMediaPicker((url) => {
                        setDestinationCoverImage(url);
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Biblioteca</span>
                  </button>
                </div>

                {destinationCoverImage && (
                  <div className="mt-2 relative h-24 w-full rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                    <img
                      src={destinationCoverImage}
                      alt="Pré-visualização do destino"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-1 right-1.5 bg-black/60 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded">
                      Pré-visualização
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700">Resumo Curto *</label>
                <input
                  type="text"
                  name="summary"
                  required
                  defaultValue={editingDestination?.summary || ''}
                  placeholder="Breve descrição em 1-2 frases para cartões e listagens"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8AE07]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-stone-700">Descrição Detalhada</label>
                <textarea
                  rows={3}
                  name="description"
                  defaultValue={editingDestination?.description || ''}
                  placeholder="Informação completa do destino para os viajantes..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8AE07]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  name="is_featured"
                  id="feat_dest_box"
                  defaultChecked={!!editingDestination?.is_featured}
                  className="w-4 h-4 rounded text-[#F8AE07] focus:ring-[#F8AE07] border-stone-300 cursor-pointer"
                />
                <label htmlFor="feat_dest_box" className="font-bold text-stone-800 cursor-pointer">
                  Destino em Destaque na Homepage
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsDestinationFormOpen(false);
                    setEditingDestination(null);
                    setDestinationError(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 font-semibold cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={destinationSaving}
                  className="px-6 py-2 rounded-lg bg-[#071629] hover:bg-[#0D2646] text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                >
                  {destinationSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>A guardar...</span>
                    </>
                  ) : (
                    <span>Guardar Destino</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IN-APP: CONFIRMAR ELIMINAÇÃO DE DESTINO (Sem window.confirm) */}
      {destinationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 text-stone-800 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Eliminar Destino</h3>
                <p className="text-xs text-stone-500">Ação irreversível</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Tem a certeza que deseja eliminar o destino{' '}
              <strong className="text-stone-900">"{destinationToDelete.name}"</strong>?
              Os pacotes turísticos associados serão desvinculados com segurança e permanecerão intactos na base de dados.
            </p>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-200">
              <button
                type="button"
                disabled={destinationDeleting}
                onClick={() => setDestinationToDelete(null)}
                className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={destinationDeleting}
                onClick={confirmDeleteDestination}
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
              >
                {destinationDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>A eliminar...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sim, Eliminar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Edit3, Eye, EyeOff } from "lucide-react";
import { ServiceCardCompact, ServiceCardDetailed } from "../../../components/sections/servicesSection";

// ========================
// Tipos usados localmente
// ========================
type Information = {
  id: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

// Tipo para dados vindos do backend
type ServiceFromBackend = {
  service_id: number;
  type: string;
  title: string;
  subtitle?: string;
  price: number;
  time: number;
  service_description?: string;
  image_url?: string;
  service_created_at?: string;
  service_updated_at?: string;
  informations?: Information[];
};

// Tipo usado no frontend
type Service = {
  id: number;
  type: string;
  title: string;
  subtitle?: string;
  price: number;
  time: number;
  description?: string;
  image_url?: string;
  createdAt?: string;
  updatedAt?: string;
  informations?: Information[];
};

// Opções para o select de tipos
const SERVICE_TYPES = [
  { value: "basico", label: "Básico" },
  { value: "completo", label: "Completo" },
  { value: "protecao", label: "Proteção" },
  { value: "premium", label: "Premium" },
  { value: "especializado", label: "Especializado" }
];

// Função para mapear dados do backend para o frontend
const mapBackendServiceToFrontend = (backendService: ServiceFromBackend): Service => {
  const validInformations = backendService.informations?.filter(info => 
    info && info.id && info.description && info.description.trim() !== ''
  ) || [];
  
  return {
    id: backendService.service_id,
    type: backendService.type,
    title: backendService.title,
    subtitle: backendService.subtitle,
    price: backendService.price,
    time: backendService.time,
    description: backendService.service_description,
    image_url: backendService.image_url,
    createdAt: backendService.service_created_at,
    updatedAt: backendService.service_updated_at,
    informations: validInformations,
  };
};

// Função para obter o template do grid baseado no variant
const getGridTemplate = (variant: "compact" | "detailed") => {
  return variant === "compact"
    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6";
};

// Componente Card personalizado para garantir tamanhos iguais
const UniformServiceCard = ({ service, viewMode }: { service: Service; viewMode: "compact" | "detailed" }) => {
  return (
    <div className={`h-full flex ${viewMode === "detailed" ? "min-h-[500px]" : "min-h-[400px]"}`}>
      {viewMode === "compact" ? (
        <ServiceCardCompact service={service} />
      ) : (
        <ServiceCardDetailed service={service} />
      )}
    </div>
  );
};

export default function AdminServiceManager() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<Partial<Service>>({
    type: "",
    title: "",
    subtitle: "",
    price: 0,
    time: 0,
    description: "",
    informations: [],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"compact" | "detailed">("compact");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/check", { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => router.push("/login"))
      .finally(() => setLoadingAuth(false));
  }, [router]);

  const fetchServices = async () => {
    try {
      const res = await axios.get<ServiceFromBackend[]>("http://localhost:3001/services", {
        withCredentials: true,
      });
      
      const mappedServices = res.data.map(mapBackendServiceToFrontend);
      setServices(mappedServices);
    } catch (err: any) {
      console.error("Erro ao carregar serviços:", err);
      if (err.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchServices();
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "time" ? Number(value) : value,
    }));
  };

  const handleInfoChange = (id: number, value: string) => {
    const newInfo = (formData.informations || []).map((info) =>
      info.id === id ? { ...info, description: value } : info
    );
    setFormData((prev) => ({ ...prev, informations: newInfo }));
  };

  const addInfo = () => {
    setFormData((prev) => ({
      ...prev,
      informations: [...(prev.informations || []), { id: Date.now(), description: "" }],
    }));
  };

  const removeInfo = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      informations: (prev.informations || []).filter((info) => info.id !== id),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "informations") {
        form.append("informations", JSON.stringify(value || []));
      } else if (value !== null && value !== undefined) {
        form.append(key, String(value));
      }
    });

    if (imageFile) {
      form.append("image", imageFile);
    }

    try {
      let response;
      if (editId) {
        response = await axios.put(`http://localhost:3001/services/${editId}`, form, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post("http://localhost:3001/services", form, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      alert(editId ? 'Serviço atualizado com sucesso!' : 'Serviço criado com sucesso!');
      resetForm();
      fetchServices();
      setShowForm(false);
      
    } catch (err: any) {
      console.error("Erro ao salvar serviço:", err);
      if (err.response) {
        alert(`Erro ao salvar: ${err.response.data?.error || err.response.data?.message || 'Erro desconhecido'}`);
      } else {
        alert('Erro de conexão com o servidor');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: "",
      title: "",
      subtitle: "",
      price: 0,
      time: 0,
      description: "",
      informations: [],
    });
    setImageFile(null);
    setImagePreview(null);
    setEditId(null);
  };

  const handleEdit = (service: Service) => {
    const mappedInformations = service.informations?.filter(info => 
      info && info.description && info.description.trim() !== ''
    ).map(info => ({
      id: info.id,
      description: info.description || ''
    })) || [];
    
    setFormData({ 
      ...service,
      informations: mappedInformations
    });
    
    setImagePreview(service.image_url || null);
    setEditId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este serviço?")) return;
    
    try {
      const numericId = Number(id);
      if (!Number.isInteger(numericId) || numericId <= 0) {
        alert('ID do serviço inválido');
        return;
      }
      
      const response = await axios.delete(`http://localhost:3001/services/${numericId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      alert('Serviço excluído com sucesso!');
      fetchServices();
      
    } catch (err: any) {
      console.error("Erro ao deletar serviço:", err);
      
      if (err.response) {
        if (err.response.status === 400) {
          alert(`Erro ao deletar: ${err.response.data?.error || err.response.data?.message || 'ID inválido'}`);
        } else if (err.response.status === 404) {
          alert('Serviço não encontrado. Talvez já tenha sido deletado.');
          fetchServices();
        } else if (err.response.status === 401) {
          alert('Não autorizado. Fazendo login novamente...');
          router.push('/login');
        } else {
          alert(`Erro no servidor: ${err.response.data?.error || err.response.data?.message || 'Erro desconhecido'}`);
        }
      } else if (err.request) {
        console.error("Sem resposta do servidor:", err.request);
        alert('Erro de conexão com o servidor. Verifique se o servidor está rodando.');
      } else {
        console.error("Erro na configuração:", err.message);
        alert(`Erro na requisição: ${err.message}`);
      }
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--muted-foreground)]">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-[var(--foreground)]">
                  Gerenciar Serviços
                </h1>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {services.length} serviços cadastrados
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode(prev => prev === "compact" ? "detailed" : "compact")}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] 
                           hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
              >
                {viewMode === "compact" ? <Eye size={16} /> : <EyeOff size={16} />}
                <span>Visualização {viewMode === "compact" ? "detalhada" : "compacta"}</span>
              </button>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(!showForm);
                }}
                className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm bg-[var(--primary)] text-white 
                           hover:bg-[var(--primary)]/90 transition-colors"
              >
                <Plus size={16} />
                <span>Novo Serviço</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulário */}
        {showForm && (
          <div className="mb-8">
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {editId ? 'Editar Serviço' : 'Novo Serviço'}
                </h2>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Título *
                    </label>
                    <input 
                      name="title" 
                      placeholder="Nome do serviço" 
                      value={formData.title || ""} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg 
                                 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Subtítulo
                    </label>
                    <input 
                      name="subtitle" 
                      placeholder="Descrição breve" 
                      value={formData.subtitle || ""} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg 
                                 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Tipo *
                    </label>
                    <select
                      name="type"
                      value={formData.type || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg 
                                 text-[var(--foreground)] 
                                 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      required
                    >
                      <option value="">Selecione um tipo</option>
                      {SERVICE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Preço (R$) *
                    </label>
                    <input 
                      name="price" 
                      type="number" 
                      placeholder="0" 
                      value={formData.price || 0} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg 
                                 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Duração (min) *
                    </label>
                    <input 
                      name="time" 
                      type="number" 
                      placeholder="0" 
                      value={formData.time || 0} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg 
                                 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                                 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                      Imagem
                    </label>
                    <input 
                      name="image" 
                      type="file" 
                      onChange={handleFileChange} 
                      className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg 
                                 text-[var(--foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                                 file:text-sm file:bg-[var(--muted)] file:text-[var(--muted-foreground)]
                                 hover:file:bg-[var(--muted)]/80"
                      accept="image/*" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    placeholder="Descrição detalhada do serviço"
                    value={formData.description || ""}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg 
                               text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                               focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                               resize-vertical"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Itens inclusos
                  </label>
                  <div className="space-y-2">
                    {(formData.informations || []).map((info, index) => (
                      <div key={`info-${info.id}`} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={info.description || ''}
                          onChange={(e) => handleInfoChange(info.id, e.target.value)}
                          className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg 
                                     text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                                     focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                          placeholder={`Item ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeInfo(info.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      type="button" 
                      onClick={addInfo} 
                      className="flex items-center space-x-2 text-sm text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Adicionar item</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-[var(--border)]">
                  <button 
                    type="submit" 
                    className="flex items-center space-x-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg 
                               hover:bg-[var(--primary)]/90 transition-colors"
                  >
                    <Save size={16} />
                    <span>{editId ? "Atualizar Serviço" : "Criar Serviço"}</span>
                  </button>
                  
                  {editId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        resetForm();
                        setShowForm(false);
                      }}
                      className="px-4 py-2 bg-[var(--muted)] text-[var(--muted-foreground)] rounded-lg 
                                 hover:bg-[var(--muted)]/80 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              {/* Preview */}
              {imagePreview && (
                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                  <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
                    Pré-visualização ({viewMode})
                  </h3>
                  <div className="max-w-md">
                    {viewMode === "compact" ? (
                      <ServiceCardCompact 
                        key={`preview-compact-${editId || 'new'}`}
                        service={{ ...(formData as Service), image_url: imagePreview }} 
                      />
                    ) : (
                      <ServiceCardDetailed 
                        key={`preview-detailed-${editId || 'new'}`}
                        service={{ ...(formData as Service), image_url: imagePreview }} 
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lista de Serviços */}
        <div className="space-y-6">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-8">
                <p className="text-lg text-[var(--muted-foreground)] mb-2">Nenhum serviço cadastrado</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Clique em "Novo Serviço" para adicionar o primeiro serviço
                </p>
              </div>
            </div>
          ) : (
            <div className={getGridTemplate(viewMode)}>
              {services.map((service) => (
                <div key={`service-${service.id}`} className="relative group">
                  {/* Container principal com altura fixa */}
                  <div className={`relative bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-hidden
                                   transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                                   ${viewMode === "compact" ? "rounded-xl h-full" : "rounded-lg h-full"}`}>
                    
                    {/* Card content - usando o componente uniforme */}
                    <div className="h-full">
                      <UniformServiceCard service={service} viewMode={viewMode} />
                    </div>
                    
                    {/* Overlay com ações */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                                     opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out
                                     flex flex-col justify-end p-6
                                     ${viewMode === "compact" ? "rounded-xl" : "rounded-lg"}`}>
                      
                      {/* Informações do serviço no overlay */}
                      <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out delay-75">
                        <h3 className="text-white font-semibold text-lg mb-1 truncate">
                          {service.title}
                        </h3>
                        {service.subtitle && (
                          <p className="text-white/80 text-sm truncate mb-2">
                            {service.subtitle}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-white/90 text-sm">
                          <span>R$ {service.price}</span>
                          <span>•</span>
                          <span>{service.time} min</span>
                        </div>
                      </div>
                      
                      {/* Botões de ação */}
                      <div className="flex space-x-3 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300 ease-out delay-100">
                        <button 
                          onClick={() => handleEdit(service)} 
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5
                                     bg-blue-600/90 backdrop-blur-sm text-white rounded-lg font-medium
                                     hover:bg-blue-600 transform hover:scale-105 transition-all duration-200
                                     shadow-lg border border-blue-500/30"
                          title="Editar serviço"
                        >
                          <Edit3 size={16} />
                          <span>Editar</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id)} 
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5
                                     bg-red-600/90 backdrop-blur-sm text-white rounded-lg font-medium
                                     hover:bg-red-600 transform hover:scale-105 transition-all duration-200
                                     shadow-lg border border-red-500/30"
                          title="Excluir serviço"
                        >
                          <Trash2 size={16} />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
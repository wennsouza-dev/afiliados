
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, Product, CategoryItem } from '../types';
import { generateProductDescription } from '../geminiService';

interface AdminProps {
  state: AppState;
  onAdd: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
  onAddCategory: (name: string) => void;
  onAddSubcategory: (categoryId: string, subcategory: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddBanner: (banner: any) => void;
  onRemoveBanner: (id: string) => void;
  onSync: () => void;
}

const Admin: React.FC<AdminProps> = ({ state, onAdd, onUpdate, onDelete, onAddCategory, onAddSubcategory, onDeleteCategory, onAddBanner, onRemoveBanner, onSync }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'banners'>('products');

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Banner Form State
  const [newBanner, setNewBanner] = useState({
    title: '',
    subtitle: '',
    linkUrl: '',
    desktopImageUrl: '',
    mobileImageUrl: ''
  });

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '', // initialized empty, user must select
    subcategory: '',
    price: 0,
    imageUrl: '',
    affiliateUrl: '',
    description: '',
    rating: 5,
    reviewsCount: 0,
    accepts_12x: false
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // Helper to get subcategories for currently selected category in form
  const currentCategorySubcategories = state.categories.find(c => c.name === formData.category)?.subcategories || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.imageUrl || !formData.affiliateUrl || !formData.category) return;

    const product: Product = {
      ...formData as Product,
      id: editingId || Date.now().toString(),
      price: Number(formData.price),
      isFeatured: true
    };

    if (editingId) {
      onUpdate(product);
    } else {
      onAdd(product);
    }

    setFormData({
      name: '',
      category: '',
      subcategory: '',
      price: 0,
      imageUrl: '',
      affiliateUrl: '',
      description: '',
      rating: 5,
      reviewsCount: 0,
      accepts_12x: false
    });
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAIEnhance = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const description = await generateProductDescription(formData.name, formData.category || 'Geral');
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName);
    setNewCategoryName('');
  };

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || !newSubcategoryName.trim()) return;
    onAddSubcategory(selectedCategoryId, newSubcategoryName);
    setNewSubcategoryName('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'desktopImageUrl' | 'mobileImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = field === 'desktopImageUrl' ? 1200 : 600;
        const scale = maxWidth / img.width;

        // Only resize if bigger
        if (scale < 1) {
          canvas.width = maxWidth;
          canvas.height = img.height * scale;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setNewBanner(prev => ({ ...prev, [field]: compressedDataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.desktopImageUrl || !newBanner.mobileImageUrl) {
      alert("Por favor, adicione ambas as imagens (Desktop e Mobile).");
      return;
    }

    onAddBanner({
      id: Date.now().toString(),
      ...newBanner
    });

    setNewBanner({
      title: '',
      subtitle: '',
      linkUrl: '',
      desktopImageUrl: '',
      mobileImageUrl: ''
    });
  };

  const toggleFeatured = (product: Product) => {
    const currentFeaturedCount = state.products.filter(p => p.isFeatured).length;
    if (!product.isFeatured && currentFeaturedCount >= 10) {
      alert("Você só pode ter até 10 destaques. Remova um destaque antes de adicionar outro.");
      return;
    }
    onUpdate({ ...product, isFeatured: !product.isFeatured });
  };

  return (
    <div className="pb-32">
      <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 p-4 justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/')} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold hidden md:block">Painel Admin</h2>
        </div>

        <div className="flex bg-gray-100 rounded-full p-1 gap-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${activeTab === 'products' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
          >
            Produtos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${activeTab === 'categories' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
          >
            Categorias
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${activeTab === 'banners' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
          >
            Banners
          </button>
        </div>

        <button
          onClick={onSync}
          className="ml-2 flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors"
          title="Sincronizar com Nuvem"
        >
          <span className="material-symbols-outlined text-sm">cloud_sync</span>
          <span className="hidden md:inline">Sincronizar</span>
        </button>
      </header>

      <div className="p-4">

        {activeTab === 'categories' ? (
          <section className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-4">Adicionar Categoria</h3>
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Nome da Categoria (ex: Games)"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                />
                <button type="submit" className="bg-primary text-white font-bold h-12 px-6 rounded-xl hover:bg-primary/90 transition-all">
                  Adicionar
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {state.categories.map(cat => (
                <div key={cat.id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 flex-1">
                      {editingId === cat.id ? (
                        <input
                          className="font-bold text-lg bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-2 focus:ring-2 focus:ring-primary w-full max-w-xs"
                          defaultValue={cat.name}
                          onBlur={(e) => {
                            if (e.target.value !== cat.name) {
                              onUpdateCategory({ ...cat, name: e.target.value });
                            }
                            setEditingId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              if (e.currentTarget.value !== cat.name) {
                                onUpdateCategory({ ...cat, name: e.currentTarget.value });
                              }
                              setEditingId(null);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-2 group">
                          <h4 className="font-bold text-lg">{cat.name}</h4>
                          <button onClick={() => setEditingId(cat.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-primary transition-opacity p-1">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <button onClick={() => onDeleteCategory(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>

                  <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cat.subcategories.map((sub, idx) => (
                        <span key={idx} className="group flex items-center gap-1 bg-gray-100 dark:bg-gray-800 pl-3 pr-1 py-1 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300">
                          <span
                            className="cursor-pointer hover:text-primary"
                            onClick={() => {
                              const newName = prompt("Editar nome da subcategoria:", sub);
                              if (newName && newName !== sub) {
                                const newSubs = [...cat.subcategories];
                                newSubs[idx] = newName;
                                onUpdateCategory({ ...cat, subcategories: newSubs });
                              }
                            }}
                          >
                            {sub}
                          </span>
                          <button
                            onClick={() => {
                              if (confirm(`Remover subcategoria "${sub}"?`)) {
                                const newSubs = cat.subcategories.filter((_, i) => i !== idx);
                                onUpdateCategory({ ...cat, subcategories: newSubs });
                              }
                            }}
                            className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                          >
                            <span className="material-symbols-outlined text-[14px] leading-none text-gray-400 hover:text-red-500 flex items-center justify-center">close</span>
                          </button>
                        </span>
                      ))}
                      {cat.subcategories.length === 0 && <span className="text-xs text-gray-400 italic">Nenhuma subcategoria</span>}
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newSubcategoryName.trim()) return;
                      onAddSubcategory(cat.id, newSubcategoryName);
                      setNewSubcategoryName('');
                    }} className="flex gap-2">
                      <input
                        className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg h-9 px-3 text-sm focus:ring-2 focus:ring-primary transition-all"
                        placeholder={`Nova subcategoria em ${cat.name}`}
                        value={selectedCategoryId === cat.id ? newSubcategoryName : ''}
                        onChange={e => {
                          setSelectedCategoryId(cat.id);
                          setNewSubcategoryName(e.target.value);
                        }}
                        onFocus={() => setSelectedCategoryId(cat.id)}
                      />
                      <button type="submit" className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold h-9 px-4 rounded-lg text-xs hover:bg-gray-300 transition-all">
                        Add
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : activeTab === 'banners' ? (
          <section className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-4">Adicionar Novo Banner</h3>
              <form onSubmit={handleAddBanner} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold block">Imagem Desktop (Horizontal)</label>
                    <div className={`border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center h-32 text-center cursor-pointer hover:bg-gray-50 transition ${newBanner.desktopImageUrl ? 'bg-green-50 border-green-300' : ''}`}>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'desktopImageUrl')} className="hidden" id="desktop-upload" />
                      <label htmlFor="desktop-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                        {newBanner.desktopImageUrl ? (
                          <span className="text-green-600 font-bold text-xs">Imagem Carregada!</span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-gray-400">desktop_windows</span>
                            <span className="text-xs text-gray-400 mt-1">Carregar Imagem</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold block">Imagem Mobile (Quadrada/Vertical)</label>
                    <div className={`border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center h-32 text-center cursor-pointer hover:bg-gray-50 transition ${newBanner.mobileImageUrl ? 'bg-green-50 border-green-300' : ''}`}>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'mobileImageUrl')} className="hidden" id="mobile-upload" />
                      <label htmlFor="mobile-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                        {newBanner.mobileImageUrl ? (
                          <span className="text-green-600 font-bold text-xs">Imagem Carregada!</span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-gray-400">smartphone</span>
                            <span className="text-xs text-gray-400 mt-1">Carregar Imagem</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="w-full bg-gray-50 rounded-xl h-10 px-4 border border-gray-200"
                    placeholder="Título (Opcional)"
                    value={newBanner.title}
                    onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                  />
                  <input
                    className="w-full bg-gray-50 rounded-xl h-10 px-4 border border-gray-200"
                    placeholder="Subtítulo (Opcional)"
                    value={newBanner.subtitle}
                    onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                  />
                </div>
                <input
                  className="w-full bg-gray-50 rounded-xl h-10 px-4 border border-gray-200"
                  placeholder="Link de Destino (ex: /category/Promoções)"
                  value={newBanner.linkUrl}
                  onChange={e => setNewBanner({ ...newBanner, linkUrl: e.target.value })}
                />

                <button type="submit" className="w-full bg-primary text-white font-bold h-12 rounded-xl hover:bg-primary/90 transition">
                  Adicionar Banner
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Banners Ativos</h3>
              {state.banners.map(banner => (
                <div key={banner.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex gap-4 items-center">
                  <img src={banner.mobileImageUrl} className="w-16 h-16 object-cover rounded-lg bg-gray-100" alt="Mobile Preview" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{banner.title || 'Sem Título'}</h4>
                    <p className="text-xs text-gray-500">{banner.linkUrl}</p>
                  </div>
                  <button onClick={() => onRemoveBanner(banner.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
              {state.banners.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Nenhum banner ativo.</p>}
            </div>
          </section>
        ) : (
          <>
            <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
              <h3 className="text-xl font-bold mb-1">{editingId ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
              <p className="text-slate-500 text-sm mb-6">Crie uma nova listagem de afiliado para seu estoque.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Nome do Produto</label>
                  <input
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary transition-all"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Smart TV 50\"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Categoria</label>
                    <select
                      required
                      className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary transition-all"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                    >
                      <option value="">Selecione...</option>
                      {state.categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory Selector */}
                  <div className="space-y-1">
                    <label className="text-sm font-semibold">Subcategoria</label>
                    <select
                      className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                      value={formData.subcategory || ''}
                      onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                      disabled={!formData.category || currentCategorySubcategories.length === 0}
                    >
                      <option value="">{currentCategorySubcategories.length === 0 ? 'Sem subcategorias' : 'Selecione...'}</option>
                      {currentCategorySubcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold">Preço (R$)</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary transition-all"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold">URL da Imagem</label>
                  <input
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary transition-all"
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://link-da-imagem.com/foto.jpg"
                  />
                  <p className="text-[10px] text-gray-500">Dica: Use links diretos para as imagens do Mercado Livre.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold">URL de Afiliado (Link de Venda)</label>
                  <input
                    required
                    className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-12 px-4 focus:ring-2 focus:ring-primary transition-all"
                    value={formData.affiliateUrl}
                    onChange={e => setFormData({ ...formData, affiliateUrl: e.target.value })}
                    placeholder="Cole aqui seu link encurtado (ex: mercadolivre.com/sec/...)"
                  />
                  <p className="text-[10px] text-gray-500">Este é o link para onde o cliente será enviado ao clicar em comprar.</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-semibold">Descrição</label>
                    <button
                      type="button"
                      onClick={handleAIEnhance}
                      disabled={isGenerating || !formData.name}
                      className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      {isGenerating ? 'Gerando...' : 'Gerar com IA'}
                    </button>
                  </div>
                  <textarea
                    className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-primary transition-all min-h-[100px]"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva os benefícios do produto..."
                  />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="accepts_12x"
                    className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300"
                    checked={formData.accepts_12x || false}
                    onChange={e => setFormData({ ...formData, accepts_12x: e.target.checked })}
                  />
                  <label htmlFor="accepts_12x" className="text-sm font-semibold select-none cursor-pointer">
                    Aceita Parcelamento em até 12x
                  </label>
                </div>

                <button type="submit" className="w-full bg-primary text-white font-bold h-14 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-4">
                  <span className="material-symbols-outlined">save</span>
                  {editingId ? 'Atualizar Produto' : 'Salvar Produto'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: '', category: '', subcategory: '', price: 0, imageUrl: '', affiliateUrl: '', description: '', rating: 5, reviewsCount: 0, accepts_12x: false });
                    }}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold h-14 rounded-2xl transition-all"
                  >
                    Cancelar Edição
                  </button>
                )}
              </form>
            </section>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Estoque Atual</h3>
              <span className="text-xs font-semibold bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full">
                {state.products.length} Itens
              </span>
            </div>

            <div className="space-y-3">
              {state.products.map(product => (
                <div key={product.id} className="bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <div className="h-16 w-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#0d141b] dark:text-white font-bold text-sm truncate">{product.name}</h4>
                    <p className="text-slate-500 text-[10px]">{product.category} {product.subcategory && `> ${product.subcategory}`}</p>
                    <p className="text-primary font-bold text-xs">R$ {product.price.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(product)} className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-colors">
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                      onClick={() => toggleFeatured(product)}
                      className={`p-2 rounded-xl transition-colors ${product.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:bg-gray-100'}`}
                      title={product.isFeatured ? "Remover Destaque" : "Destacar"}
                    >
                      <span className="material-symbols-outlined text-[20px]">{product.isFeatured ? 'star' : 'star_outline'}</span>
                    </button>
                    <button onClick={() => onDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;


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
}

const Admin: React.FC<AdminProps> = ({ state, onAdd, onUpdate, onDelete, onAddCategory, onAddSubcategory, onDeleteCategory }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');

  // Category Form State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '', // initialized empty, user must select
    subcategory: '',
    price: 0,
    imageUrl: '',
    affiliateUrl: '',
    description: '',
    rating: 5,
    reviewsCount: 0
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
      reviewsCount: 0
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

  return (
    <div className="pb-32">
      <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 p-4 justify-between">
        <button onClick={() => navigate('/')} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold">Painel Admin</h2>
        <button onClick={() => setActiveTab(activeTab === 'products' ? 'categories' : 'products')} className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${activeTab === 'categories' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
          {activeTab === 'products' ? 'Gerenciar Categorias' : 'Gerenciar Produtos'}
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
                    <h4 className="font-bold text-lg">{cat.name}</h4>
                    <button onClick={() => onDeleteCategory(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>

                  <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-3">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cat.subcategories.map((sub, idx) => (
                        <span key={idx} className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300">
                          {sub}
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

                <button type="submit" className="w-full bg-primary text-white font-bold h-14 rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-4">
                  <span className="material-symbols-outlined">save</span>
                  {editingId ? 'Atualizar Produto' : 'Salvar Produto'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: '', category: '', subcategory: '', price: 0, imageUrl: '', affiliateUrl: '', description: '', rating: 5, reviewsCount: 0 });
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

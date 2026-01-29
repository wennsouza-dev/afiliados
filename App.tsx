
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { Product, Category, AppState } from './types';
import { INITIAL_PRODUCTS } from './constants';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  return isAdmin ? children : null;
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('affiliate_store_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: Ensure categories exist if loading old state
      if (!parsed.categories) {
        parsed.categories = [
          { id: '1', name: 'Eletrônicos', subcategories: ['Celulares', 'TVs', 'Notebooks', 'Fones'] },
          { id: '2', name: 'Casa', subcategories: ['Eletrodomésticos', 'Decoração', 'Móveis'] },
          { id: '3', name: 'Moda', subcategories: ['Roupas', 'Sapatos', 'Acessórios'] },
          { id: '4', name: 'Beleza', subcategories: ['Perfumes', 'Maquiagem', 'Skincare'] }
        ];
      }
      return parsed;
    }
    return {
      products: INITIAL_PRODUCTS,
      favorites: [],
      categories: [
        { id: '1', name: 'Eletrônicos', subcategories: ['Celulares', 'TVs', 'Notebooks', 'Fones'] },
        { id: '2', name: 'Casa', subcategories: ['Eletrodomésticos', 'Decoração', 'Móveis'] },
        { id: '3', name: 'Moda', subcategories: ['Roupas', 'Sapatos', 'Acessórios'] },
        { id: '4', name: 'Beleza', subcategories: ['Perfumes', 'Maquiagem', 'Skincare'] }
      ]
    };
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('affiliate_store_state', JSON.stringify(state));
  }, [state]);

  const addProduct = (product: Product) => {
    setState(prev => ({
      ...prev,
      products: [product, ...prev.products]
    }));
  };

  const updateProduct = (product: Product) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === product.id ? product : p)
    }));
  };

  const deleteProduct = (id: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  const toggleFavorite = (id: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(id)
        ? prev.favorites.filter(f => f !== id)
        : [...prev.favorites, id]
    }));
  };

  const addCategory = (name: string) => {
    setState(prev => ({
      ...prev,
      categories: [...prev.categories, { id: Date.now().toString(), name, subcategories: [] }]
    }));
  };

  const addSubcategory = (categoryId: string, subcategory: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(cat =>
        cat.id === categoryId
          ? { ...cat, subcategories: [...cat.subcategories, subcategory] }
          : cat
      )
    }));
  };

  const deleteCategory = (id: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col w-full bg-background-light dark:bg-background-dark shadow-2xl relative overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home state={state} onToggleFavorite={toggleFavorite} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
          <Route path="/category/:categoryName" element={<CategoryPage state={state} onToggleFavorite={toggleFavorite} />} />
          <Route path="/product/:productId" element={<ProductDetail state={state} onToggleFavorite={toggleFavorite} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <RequireAuth>
              <Admin
                state={state}
                onAdd={addProduct}
                onUpdate={updateProduct}
                onDelete={deleteProduct}
                onAddCategory={addCategory}
                onAddSubcategory={addSubcategory}
                onDeleteCategory={deleteCategory}
              />
            </RequireAuth>
          } />
        </Routes>

        {/* Persistent Bottom Navigation - Mobile Only */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-6 py-3 flex justify-around items-center z-50">
          <Link to="/" className="flex flex-col items-center gap-1 text-primary">
            <span className="material-symbols-outlined text-[24px]">home</span>
            <span className="text-[10px] font-bold">Início</span>
          </Link>
          <Link to="/category/Tudo" className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500">
            <span className="material-symbols-outlined text-[24px]">explore</span>
            <span className="text-[10px] font-medium">Explorar</span>
          </Link>
        </nav>
      </div>
    </HashRouter>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { Product, Category, AppState, Banner, CategoryItem } from './types';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { dbService } from './services/dbService';
import { INITIAL_PRODUCTS } from './constants';

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
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<AppState>({
    products: [],
    favorites: [],
    categories: [],
    banners: []
  });

  const [searchQuery, setSearchQuery] = useState('');

  const loadLocalState = () => {
    try {
      const saved = localStorage.getItem('affiliate_store_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure defaults if missing in local storage
        if (!parsed.categories || parsed.categories.length === 0) {
          parsed.categories = [
            { id: '1', name: 'Eletrônicos', subcategories: ['Celulares', 'TVs', 'Notebooks', 'Fones'] },
            { id: '2', name: 'Casa', subcategories: ['Eletrodomésticos', 'Decoração', 'Móveis'] },
            { id: '3', name: 'Moda', subcategories: ['Roupas', 'Sapatos', 'Acessórios'] },
            { id: '4', name: 'Beleza', subcategories: ['Perfumes', 'Maquiagem', 'Skincare'] }
          ];
        }
        if (!parsed.banners || parsed.banners.length === 0) {
          parsed.banners = [
            {
              id: '1',
              desktopImageUrl: 'https://picsum.photos/seed/tech/1200/400',
              mobileImageUrl: 'https://picsum.photos/seed/tech/600/600',
              title: 'Semana Tech chegou!',
              subtitle: 'Economize até 40% nos melhores eletrônicos.',
              linkUrl: '/category/Eletrônicos'
            }
          ];
        }
        setState(parsed);
      } else {
        // Defaults
        setState({
          products: INITIAL_PRODUCTS,
          favorites: [],
          categories: [
            { id: '1', name: 'Eletrônicos', subcategories: ['Celulares', 'TVs', 'Notebooks', 'Fones'] },
            { id: '2', name: 'Casa', subcategories: ['Eletrodomésticos', 'Decoração', 'Móveis'] },
            { id: '3', name: 'Moda', subcategories: ['Roupas', 'Sapatos', 'Acessórios'] },
            { id: '4', name: 'Beleza', subcategories: ['Perfumes', 'Maquiagem', 'Skincare'] }
          ],
          banners: [
            {
              id: '1',
              desktopImageUrl: 'https://picsum.photos/seed/tech/1200/400',
              mobileImageUrl: 'https://picsum.photos/seed/tech/600/600',
              title: 'Semana Tech chegou!',
              subtitle: 'Economize até 40% nos melhores eletrônicos.',
              linkUrl: '/category/Eletrônicos'
            }
          ]
        });
      }
    } catch (e) {
      console.error("Local load failed", e);
    }
  };

  // Initial Data Load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Try fetching from Supabase first
        const [products, categories, banners] = await Promise.all([
          dbService.getProducts(),
          dbService.getCategories(),
          dbService.getBanners()
        ]);

        if (products.length > 0 || categories.length > 0) {
          // If Supabase has data, use it
          setState(prev => ({
            ...prev,
            products,
            categories: categories.length > 0 ? categories : prev.categories,
            banners: banners.length > 0 ? banners : prev.banners
          }));
        } else {
          // If Supabase is empty, fall back to LocalStorage or Defaults
          console.log("Supabase seems empty, falling back to local/default data.");
          loadLocalState();
        }
      } catch (error) {
        console.error("Error connecting to Supabase:", error);
        // Fallback to local on error
        loadLocalState();
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Sync current state to Supabase
  const syncToCloud = async () => {
    if (!confirm("Isso enviará todos os dados locais para o Supabase (Cloud). Deseja continuar?")) return;

    setIsLoading(true);
    try {
      console.log("Starting sync...");
      // Upsert all products
      await Promise.all(state.products.map(p => dbService.upsertProduct(p)));
      // Upsert all categories
      await Promise.all(state.categories.map(c => dbService.upsertCategory(c)));
      // Upsert all banners
      await Promise.all(state.banners.map(b => dbService.upsertBanner(b)));

      alert("Sincronização concluída com sucesso!");
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Erro ao sincronizar. Verifique o console.");
    } finally {
      setIsLoading(false);
    }
  };

  // Persist to local storage as backup whenever state changes
  useEffect(() => {
    localStorage.setItem('affiliate_store_state', JSON.stringify(state));
  }, [state]);

  const addProduct = async (product: Product) => {
    setState(prev => ({
      ...prev,
      products: [product, ...prev.products]
    }));
    await dbService.upsertProduct(product).catch(console.error);
  };

  const updateProduct = async (product: Product) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === product.id ? product : p)
    }));
    await dbService.upsertProduct(product).catch(console.error);
  };

  const deleteProduct = async (id: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
    await dbService.deleteProduct(id).catch(console.error);
  };

  const toggleFavorite = (id: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(id)
        ? prev.favorites.filter(f => f !== id)
        : [...prev.favorites, id]
    }));
  };

  const addCategory = async (name: string) => {
    const newCategory = { id: Date.now().toString(), name, subcategories: [] };
    setState(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
    await dbService.upsertCategory(newCategory).catch(console.error);
  };

  const addSubcategory = async (categoryId: string, subcategory: string) => {
    let updatedCategory: CategoryItem | undefined;

    setState(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id === categoryId) {
          updatedCategory = { ...cat, subcategories: [...cat.subcategories, subcategory] };
          return updatedCategory;
        }
        return cat;
      })
    }));

    if (updatedCategory) {
      await dbService.upsertCategory(updatedCategory).catch(console.error);
    }
  };

  const deleteCategory = async (id: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
    await dbService.deleteCategory(id).catch(console.error);
  };

  const addBanner = async (banner: Banner) => {
    setState(prev => ({
      ...prev,
      banners: [...prev.banners, banner]
    }));
    await dbService.upsertBanner(banner).catch(console.error);
  };

  const removeBanner = async (id: string) => {
    setState(prev => ({
      ...prev,
      banners: prev.banners.filter(b => b.id !== id)
    }));
    await dbService.deleteBanner(id).catch(console.error);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-primary font-bold">Carregando dados...</span>
      </div>
    );
  }

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
                onAddBanner={addBanner}
                onRemoveBanner={removeBanner}
                onSync={syncToCloud}
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

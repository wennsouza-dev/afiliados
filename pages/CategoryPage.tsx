import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppState } from '../types';

interface CategoryPageProps {
  state: AppState;
  onToggleFavorite: (id: string) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ state, onToggleFavorite }) => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  // Get current category subcategories
  const currentCategoryData = state.categories.find(c => c.name === categoryName);
  const subcategories = currentCategoryData?.subcategories || [];

  const filteredProducts = useMemo(() => {
    let products = state.products;

    // Filter by Category
    if (categoryName && categoryName !== 'Tudo') {
      products = products.filter(p => p.category === categoryName);
    }

    // Filter by Subcategory
    if (selectedSubcategory) {
      products = products.filter(p => p.subcategory === selectedSubcategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(query));
    }

    return products;
  }, [state.products, categoryName, searchQuery, selectedSubcategory]);

  return (
    <div className="pb-24 md:pb-8 max-w-7xl mx-auto">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center justify-between md:min-w-[200px]">
          <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden">
            <span className="material-symbols-outlined text-primary">arrow_back_ios_new</span>
          </button>
          <h2 className="text-lg font-bold flex-1 text-center md:text-left md:ml-2">{categoryName}</h2>
          <div className="w-10 md:hidden"></div>
        </div>

        <div className="relative flex-1 max-w-2xl">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            type="text"
            placeholder={`Buscar em ${categoryName}`}
            className="w-full bg-white dark:bg-gray-800 border-none rounded-xl h-11 pl-12 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Desktop Sidebar / Mobile Chips */}
        <aside className="md:w-64 md:shrink-0 md:p-6 md:sticky md:top-24 md:h-[calc(100vh-6rem)] md:overflow-y-auto">
          <h3 className="hidden md:block font-bold text-gray-900 dark:text-white mb-4">Filtrar por</h3>

          <div className="flex gap-2 p-4 pt-0 overflow-x-auto hide-scrollbar scroll-smooth md:p-0 md:flex-col md:gap-1">
            {categoryName === 'Tudo' ? (
              // Show Main Categories when "Tudo"
              <>
                <Link
                  to="/category/Tudo"
                  className={`flex h-9 md:h-10 shrink-0 items-center justify-center md:justify-start gap-x-2 rounded-full md:rounded-lg px-4 shadow-sm border md:border-transparent md:shadow-none transition-all ${categoryName === 'Tudo'
                    ? 'bg-primary text-white border-primary md:bg-primary/10 md:text-primary md:border-transparent'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  Todos
                </Link>
                {state.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.name}`}
                    className="flex h-9 md:h-10 shrink-0 items-center justify-center md:justify-start gap-x-2 rounded-full md:rounded-lg px-4 shadow-sm border md:border-transparent md:shadow-none transition-all bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {cat.name}
                  </Link>
                ))}
              </>
            ) : (
              // Show All Button + Subcategories when specific category
              <>
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`flex h-9 md:h-10 shrink-0 items-center justify-center md:justify-start gap-x-2 rounded-full md:rounded-lg px-4 shadow-sm border md:border-transparent md:shadow-none transition-all ${selectedSubcategory === null
                    ? 'bg-primary text-white border-primary md:bg-primary/10 md:text-primary md:border-transparent'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  Todos
                </button>
                {subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub === selectedSubcategory ? null : sub)}
                    className={`flex h-9 md:h-10 shrink-0 items-center justify-center md:justify-start gap-x-2 rounded-full md:rounded-lg px-4 shadow-sm border md:border-transparent md:shadow-none transition-all ${selectedSubcategory === sub
                      ? 'bg-primary text-white border-primary md:bg-primary/10 md:text-primary md:border-transparent'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    {sub}
                  </button>
                ))}
              </>
            )}
          </div>
        </aside>

        <div className="p-4 space-y-4 md:space-y-0 md:flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col transition-transform hover:scale-[1.01]">
                <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-800 group">
                  {product.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider z-20">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  {product.accepts_12x && (
                    <div className="absolute bottom-2 left-2 right-2 bg-green-600 text-white text-[9px] font-bold py-1 px-2 rounded-md text-center shadow-sm z-20">
                      PARCELE EM ATÉ 12X
                    </div>
                  )}
                  <button
                    onClick={() => onToggleFavorite(product.id)}
                    className={`absolute top-3 right-3 size-9 rounded-full flex items-center justify-center backdrop-blur-sm z-20 shadow-sm transition-colors ${state.favorites.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/80 dark:bg-black/40 text-gray-400'
                      }`}
                  >
                    <span className={`material-symbols-outlined text-[20px] ${state.favorites.includes(product.id) ? 'fill-1' : ''}`}>favorite</span>
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">{product.name}</h3>
                  </Link>

                  <div className="flex flex-col mb-4 mt-auto">
                    {product.originalPrice && <span className="text-xs text-gray-400 line-through">R$ {product.originalPrice.toLocaleString('pt-BR')}</span>}
                    <span className="text-gray-500 text-xs font-medium mb-1">A partir de</span>
                    <span className="text-primary text-2xl font-extrabold leading-none">R$ {product.price.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] text-gray-400 mt-1 font-medium">Preço sujeito a alteração</span>
                    <span className="text-slate-400 text-xs mt-1">Frete Grátis · Loja Oficial</span>
                  </div>

                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center h-12 px-4 bg-mercadolivre text-slate-900 text-sm font-bold rounded-xl shadow-sm hover:brightness-95 active:scale-[0.98] transition-all"
                  >
                    COMPRAR
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 col-span-full">
              <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p className="font-medium text-sm">Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CategoryPage;

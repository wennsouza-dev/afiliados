
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppState, Category, Product } from '../types';

interface HomeProps {
  state: AppState;
  onToggleFavorite: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Home: React.FC<HomeProps> = ({ state, onToggleFavorite, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();

  // Featured limit 10
  const featuredProducts = state.products.filter(p => p.isFeatured).slice(0, 10);
  // Use dynamic categories from state
  const categories = state.categories;

  const filteredProducts = searchQuery.trim()
    ? state.products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : featuredProducts;

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary">shopping_bag</span>
            </div>
            <h1
              onClick={() => {
                const now = Date.now();
                const lastClick = parseInt(localStorage.getItem('last_title_click') || '0');
                const clicks = parseInt(localStorage.getItem('title_clicks') || '0');

                if (now - lastClick < 1000) {
                  const newClicks = clicks + 1;
                  localStorage.setItem('title_clicks', newClicks.toString());
                  if (newClicks >= 5) {
                    localStorage.setItem('title_clicks', '0');
                    navigate('/login');
                  }
                } else {
                  localStorage.setItem('title_clicks', '1');
                }
                localStorage.setItem('last_title_click', now.toString());
              }}
              className="text-xl font-bold tracking-tight select-none cursor-default active:scale-95 transition-transform"
            >
              Wend Promoções
            </h1>
          </div>
        </div>


        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            type="text"
            placeholder="Buscar produtos"
            className="w-full bg-white dark:bg-gray-800 border-none rounded-xl h-11 pl-12 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-primary transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header >

      <main>
        {/* Banner */}
        {/* Banner */}
        {!searchQuery && state.banners && state.banners.length > 0 && (
          <div className="px-4 py-4">
            {/* Simple carousel or just show the last added banner for now (or random) */}
            {(() => {
              // Determine which banner to show (e.g., last one)
              const banner = state.banners[state.banners.length - 1];
              return (
                <Link to={banner.linkUrl || '#'} className="relative w-full overflow-hidden rounded-2xl aspect-square md:aspect-[3/1] shadow-lg group block">
                  {/* Overlay removed to show original colors */}
                  {(banner.title || banner.subtitle) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 z-10">
                      {banner.title && <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded w-fit mb-2">Oferta</span>}
                      {banner.title && <h3 className="text-white text-2xl font-bold leading-tight mb-1">{banner.title}</h3>}
                      {banner.subtitle && <p className="text-white/90 text-sm">{banner.subtitle}</p>}
                    </div>
                  )}
                  <picture>
                    <source media="(min-width: 768px)" srcSet={banner.desktopImageUrl} />
                    <img
                      src={banner.mobileImageUrl}
                      alt={banner.title || "Banner"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </picture>
                </Link>
              );
            })()}
          </div>
        )}

        {/* Categories Scroller */}
        <div className="flex gap-3 px-4 py-2 overflow-x-auto hide-scrollbar md:flex-wrap md:justify-center">
          <Link
            to="/category/Tudo"
            className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-5 shadow-sm transition-all bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white border border-gray-100 dark:border-gray-700 hover:bg-gray-50`}
          >
            <span className="text-sm font-semibold whitespace-nowrap">Tudo</span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.name}`}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-xl px-5 shadow-sm transition-all bg-white dark:bg-gray-800 text-[#0d141b] dark:text-white border border-gray-100 dark:border-gray-700 hover:bg-gray-50`}
            >
              <span className="text-sm font-semibold whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Featured Products Grid */}
        <div className="px-4 pt-6 flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {searchQuery ? `Resultados para "${searchQuery}"` : 'Destaques da Semana'}
          </h2>
          <Link to="/category/Tudo" className="text-primary text-sm font-semibold">Ver Tudo</Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 px-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col transition-transform active:scale-[0.98]">
              <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-900 group">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
                {product.accepts_12x && (
                  <div className="absolute bottom-2 left-2 right-2 bg-green-600 text-white text-[9px] font-bold py-1 px-2 rounded-md text-center shadow-sm z-20">
                    PARCELE EM ATÉ 12X
                  </div>
                )}
                <button
                  onClick={() => onToggleFavorite(product.id)}
                  className={`absolute top-2 right-2 size-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${state.favorites.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-white/80 dark:bg-black/40 text-gray-400'
                    }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${state.favorites.includes(product.id) ? 'fill-1' : ''}`}>favorite</span>
                </button>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase mb-1">{product.category}</h3>
                <Link to={`/product/${product.id}`}>
                  <p className="text-[#0d141b] dark:text-white text-sm font-semibold line-clamp-2 mb-2 leading-snug h-10">{product.name}</p>
                </Link>
                <div className="mt-auto">
                  <p className="text-[10px] text-gray-500 mb-0.5">A partir de</p>
                  <p className="text-primary text-lg font-bold">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-[9px] text-gray-400 mb-2 font-medium">Preço sujeito a alteração</p>
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-mercadolivre hover:bg-mercadolivre-dark text-[#0d141b] text-[11px] font-bold py-2.5 px-1 rounded-lg transition-colors flex items-center justify-center gap-1 uppercase tracking-tight"
                  >
                    COMPRAR
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 px-8 text-gray-500">
            <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
            <p>Nenhum produto encontrado.</p>
          </div>
        )}

        <footer className="px-8 pb-12 pt-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
            <span className="material-symbols-outlined text-sm">verified</span>
            <p className="text-[10px] font-medium uppercase tracking-widest">Parceiro Afiliado Oficial</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Como afiliado, podemos receber uma pequena comissão por compras feitas através dos links deste site.
          </p>
        </footer>
      </main>
    </div >
  );
};

export default Home;

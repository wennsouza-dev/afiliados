
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppState } from '../types';

interface ProductDetailProps {
  state: AppState;
  onToggleFavorite: (id: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ state, onToggleFavorite }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = state.products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Produto não encontrado.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold">Voltar ao Início</button>
      </div>
    );
  }

  const isFavorite = state.favorites.includes(product.id);

  return (
    <div className="pb-32 animate-in slide-in-from-right duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center p-4 h-16 justify-between">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-primary">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold truncate px-4">Detalhes</h2>
        <div className="flex items-center gap-2">
          <button className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button
            onClick={() => onToggleFavorite(product.id)}
            className={`size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
          >
            <span className={`material-symbols-outlined ${isFavorite ? 'fill-1' : ''}`}>favorite</span>
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-gray-900 overflow-hidden">
        <div className="aspect-square w-full bg-white flex items-center justify-center p-8">
          <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
        </div>
      </div>

      <div className="px-4 pt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
            {product.category}
          </span>
        </div>

        <h1 className="text-[#0d141b] dark:text-slate-50 text-2xl font-bold leading-tight mb-4">
          {product.name}
        </h1>

        <div className="mb-6">
          <p className="text-sm text-gray-500 font-medium mb-1">A partir de</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-primary text-3xl font-extrabold tracking-tight">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h2>
            {product.originalPrice && (
              <span className="text-slate-400 line-through text-sm">
                R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <p className="text-green-600 dark:text-green-400 text-sm font-semibold pt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">bolt</span>
            15% de desconto hoje no Pix
          </p>
          <p className="text-[10px] text-slate-400 mt-2 leading-tight">
            * O preço pode variar dependendo do dia, horários, estoque e forma de pagamento. O valor final é o apresentado no site do vendedor.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-primary mb-1">local_shipping</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase">Frete Grátis</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-primary mb-1">verified_user</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase">12 Meses</span>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-primary mb-1">workspace_premium</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase">Original</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">Sobre este item</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {product.description}
          </p>
          <ul className="space-y-3 pt-2">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
              <span className="text-sm text-slate-700 dark:text-slate-300">Garantia de procedência Mercado Livre</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
              <span className="text-sm text-slate-700 dark:text-slate-300">Melhor preço garantido do marketplace</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-40">
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 h-14 rounded-2xl bg-mercadolivre text-[#0d141b] font-bold text-lg shadow-xl hover:bg-mercadolivre-dark active:scale-[0.98] transition-all"
        >
          COMPRAR NO MERCADO LIVRE
          <span className="material-symbols-outlined text-xl">open_in_new</span>
        </a>
      </div>
    </div >
  );
};

export default ProductDetail;

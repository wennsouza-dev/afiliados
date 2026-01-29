
import { supabase } from '../supabaseClient';
import { Product, CategoryItem, Banner } from '../types';

// Database Types (snake_case matches Supabase columns)
interface DBProduct {
    id: string;
    name: string;
    category: string;
    subcategory?: string;
    price: number;
    original_price?: number;
    image_url: string;
    affiliate_url: string;
    description: string;
    is_featured: boolean;
    rating: number;
    reviews_count: number;
    accepts_12x: boolean;
    is_best_seller: boolean;
    has_pix_discount: boolean;
}

interface DBBanner {
    id: string;
    title?: string;
    subtitle?: string;
    link_url?: string;
    desktop_image_url: string;
    mobile_image_url: string;
}

interface DBCategory {
    id: string;
    name: string;
    subcategories: string[];
}

export const dbService = {
    // PRODUCTS
    getProducts: async (): Promise<Product[]> => {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;

        return (data as DBProduct[]).map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            subcategory: p.subcategory,
            price: p.price,
            originalPrice: p.original_price,
            imageUrl: p.image_url,
            affiliateUrl: p.affiliate_url,
            description: p.description,
            isFeatured: p.is_featured,
            rating: p.rating,
            reviewsCount: p.reviews_count,
            accepts_12x: p.accepts_12x,
            isBestSeller: p.is_best_seller,
            hasPixDiscount: p.has_pix_discount
        }));
    },

    upsertProduct: async (product: Product) => {
        const dbProduct: DBProduct = {
            id: product.id,
            name: product.name,
            category: product.category,
            subcategory: product.subcategory,
            price: product.price,
            original_price: product.originalPrice,
            image_url: product.imageUrl,
            affiliate_url: product.affiliateUrl,
            description: product.description,
            is_featured: product.isFeatured || false,
            rating: product.rating,
            reviews_count: product.reviewsCount,
            accepts_12x: product.accepts_12x || false,
            is_best_seller: product.isBestSeller || false,
            has_pix_discount: product.hasPixDiscount || false
        };

        const { error } = await supabase.from('products').upsert(dbProduct);
        if (error) throw error;
    },

    deleteProduct: async (id: string) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
    },

    // CATEGORIES
    getCategories: async (): Promise<CategoryItem[]> => {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;

        return (data as DBCategory[]).map(c => ({
            id: c.id,
            name: c.name,
            subcategories: c.subcategories || []
        }));
    },

    upsertCategory: async (category: CategoryItem) => {
        const dbCategory: DBCategory = {
            id: category.id,
            name: category.name,
            subcategories: category.subcategories
        };
        const { error } = await supabase.from('categories').upsert(dbCategory);
        if (error) throw error;
    },

    deleteCategory: async (id: string) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
    },

    // BANNERS
    getBanners: async (): Promise<Banner[]> => {
        const { data, error } = await supabase.from('banners').select('*');
        if (error) throw error;

        return (data as DBBanner[]).map(b => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            linkUrl: b.link_url,
            desktopImageUrl: b.desktop_image_url,
            mobileImageUrl: b.mobile_image_url
        }));
    },

    upsertBanner: async (banner: Banner) => {
        const dbBanner: DBBanner = {
            id: banner.id,
            title: banner.title,
            subtitle: banner.subtitle,
            link_url: banner.linkUrl,
            desktop_image_url: banner.desktopImageUrl,
            mobile_image_url: banner.mobileImageUrl
        };
        const { error } = await supabase.from('banners').upsert(dbBanner);
        if (error) throw error;
    },

    deleteBanner: async (id: string) => {
        const { error } = await supabase.from('banners').delete().eq('id', id);
        if (error) throw error;
    }
};

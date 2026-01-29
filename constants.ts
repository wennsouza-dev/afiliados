
import { Product, Category } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro - 128GB Titânio Azul',
    category: Category.ELECTRONICS,
    price: 7999.00,
    originalPrice: 8599.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0HQja3d8aO1MWsrA1ZfrBaxIs6g5DH18w2rzgkvSeiQ0KVOTSSxBd9kMm4SFCd0XkZA3aiuZRp6uM5v9rq5C4jg2HsPSStsBB1RJO9XRc99nwI60CI9-37M598HtVF__AQc1Ab4dNklV2xGE4DLE8YJzHhs3t0DePMqAJPzSYS4NGujqoM3jpjO2vYkBoG_vsf-tmdcsiq-XqdlQPzZD0GyMY--eXB4gjn5ICLzIjjzkuz06Br7-J7EQrsvrcqbC_8N3sUZ39xw',
    affiliateUrl: 'https://www.mercadolivre.com.br/',
    description: 'O iPhone 15 Pro é o primeiro iPhone com design em titânio de qualidade aeroespacial, feito com a mesma liga das naves espaciais enviadas em missões a Marte.',
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 1240
  },
  {
    id: '2',
    name: 'iPad Air M2 11" 128GB Wi-Fi Cinza Espacial',
    category: Category.ELECTRONICS,
    price: 5599.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXOXXNNLcN3gR4RvRXL6-1XT-sBsc56rhLxclSPJgGHmoWnhpRxJlmcE1UKoZZOH24m_uaLHJZM4Cyncht0rJTVqYR4yqdvddNJn9Burk4MlKfpgRq_ZHx4FFsypts4_isqORnP79vhU2O6L0AwYbdvtvhE0O6l3EL0q6YY5T3Tlpto-jMURi1rUuIAuXaYfhbU4T7LNDuD8n7pWdNcpfiXGuHZTvtCP5cIzLzuIYwUp5RA9JyQgqeZnxLyX5uhm4SDEWgmhOoAA',
    affiliateUrl: 'https://www.mercadolivre.com.br/',
    description: 'O iPad Air redesenhado. Agora com o chip M2 superveloz, tela Liquid Retina espetacular e disponível em dois tamanhos.',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 856
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Cancelamento de Ruído',
    category: Category.ELECTRONICS,
    price: 2499.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADpoeKm-E7sAELjoZGWwhOfJJ9Ks17jbFX97nOQw6STZONdC5f1Gt0gKjpbUwtMZJrBpPHhpoXo6cFvofQdrbAyT5ONafeWg5-zSYGePo_jYQHEKPxewtTJJE62ZlZcBI8g0uJumgC4RCTTV43kJfKv_pgzCnuDf6vJCKC8Np8u39K3SZaZHdgnkC10r9QqExMOTbXFAodNypxWyFn49DN5nd8sZPEHmmd8eF53r81mWjUF2gsjyIlbmS-x4yWpKIBQq6B40DO4g',
    affiliateUrl: 'https://www.mercadolivre.com.br/',
    description: 'Os fones de ouvido WH-1000XM5 redefinem a audição sem distrações e a nitidez das chamadas com dois processadores que controlam oito microfones.',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 2400
  },
  {
    id: '4',
    name: 'Elite Series X Smart Watch - Branco',
    category: Category.ELECTRONICS,
    price: 899.00,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi1ctKrQoCHLM1Sy_UwFvf5ClrcGxJML0Pp_iTdqQOf7mZkjMEvMa-TpwGSFTCTJ-1Vd2WpgQghb6gWHnICnsE85LYUqrbK-B5aAq5D2zT3zJ4REL22MPokf02ELbwNo0uFOKKPehRYzj-U7NrwLVXN24Qc9Hh3kXH0DJXmUWg_IT_XJXqlbLGoRyvfQbOvxaxwEdkJ-6Ti1SzAntYpM_c0roddkTxkL63A84mbX3Lb4A9JKxdKiml8rF_M7eW6-wyAAD1AeLG8g',
    affiliateUrl: 'https://www.mercadolivre.com.br/',
    description: 'O Elite Series X é o smartwatch definitivo para quem busca performance e elegância. Monitoramento de saúde avançado e bateria de longa duração.',
    isFeatured: true,
    rating: 4.5,
    reviewsCount: 120
  }
];

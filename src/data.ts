import { Product, Category } from './types';

export const categories: Category[] = [
  {
    id: 'food',
    name: 'FOOD',
    description: 'Everyday nutrition',
    image: 'https://picsum.photos/id/292/800/1200',
  },
  {
    id: 'coffee',
    name: 'COFFEE',
    description: 'Daily rituals',
    image: 'https://picsum.photos/id/43/800/1200',
  },
  {
    id: 'care',
    name: 'CARE',
    description: 'Personal essentials',
    image: 'https://picsum.photos/id/152/800/1200',
  },
  {
    id: 'skin',
    name: 'SKIN',
    description: 'Simple self-care',
    image: 'https://picsum.photos/id/28/800/1200',
  },
];

export const products: Product[] = [
  {
    id: 'reishi-gano-powder',
    name: 'Reishi Gano Powder',
    descriptor: 'Wellness essential',
    description: 'A premium blend of Reishi extract designed to support a balanced immune system and promote everyday vitality. Perfect for adding to your morning routine.',
    price: 1250,
    image: 'https://picsum.photos/id/493/800/1200',
    images: [
      'https://picsum.photos/id/493/800/1200',
      'https://picsum.photos/id/493/800/1200?blur=2',
    ],
    category: 'food',
    isBestseller: true,
    ingredients: '100% Organic Reishi Mushroom Extract (Ganoderma lucidum).',
    howToUse: 'Mix 1 teaspoon into hot water, coffee, or your favorite smoothie daily.',
  },
  {
    id: 'signature-espresso-blend',
    name: 'Signature Espresso Blend',
    descriptor: 'Rich & balanced',
    description: 'Our signature everyday espresso blend, sourced from sustainable farms. Notes of dark chocolate, hazelnut, and subtle cherry.',
    price: 950,
    image: 'https://picsum.photos/id/1060/800/1200',
    images: [
      'https://picsum.photos/id/1060/800/1200',
      'https://picsum.photos/id/1060/800/1200?blur=2',
    ],
    category: 'coffee',
    isBestseller: true,
  },
  {
    id: 'hydrating-face-serum',
    name: 'Hydrating Face Serum',
    descriptor: 'Deep moisture',
    description: 'A lightweight, deeply hydrating serum formulated to restore your skin\'s natural barrier. Leaves skin feeling calm, plump, and refreshed.',
    price: 1850,
    image: 'https://picsum.photos/id/28/800/1200',
    images: [
      'https://picsum.photos/id/28/800/1200',
      'https://picsum.photos/id/28/800/1200?blur=2',
    ],
    category: 'skin',
    isNew: true,
  },
  {
    id: 'natural-deodorant',
    name: 'Natural Deodorant',
    descriptor: 'Aluminum-free',
    description: 'A clean, effective deodorant that works. Scented with natural eucalyptus and cedarwood for an elevated everyday feeling.',
    price: 850,
    image: 'https://picsum.photos/id/49/800/1200',
    images: [
      'https://picsum.photos/id/49/800/1200',
    ],
    category: 'care',
  },
  {
    id: 'matcha-ceremonial-grade',
    name: 'Ceremonial Grade Matcha',
    descriptor: 'Smooth & vibrant',
    description: 'Premium organic ceremonial grade matcha from Uji, Japan. Vibrant green, naturally sweet, and rich in antioxidants.',
    price: 1450,
    image: 'https://picsum.photos/id/326/800/1200',
    images: [
      'https://picsum.photos/id/326/800/1200',
    ],
    category: 'coffee',
  },
  {
    id: 'daily-cleanser',
    name: 'Daily Cleanser',
    descriptor: 'Gentle wash',
    description: 'A gentle, pH-balanced cleanser that effectively removes impurities without stripping your skin of essential moisture.',
    price: 1100,
    image: 'https://picsum.photos/id/152/800/1200',
    images: [
      'https://picsum.photos/id/152/800/1200',
    ],
    category: 'skin',
  },
  {
    id: 'plant-protein',
    name: 'Plant Protein Blend',
    descriptor: 'Vanilla Bean',
    description: 'A clean, minimal-ingredient plant protein blend. Smooth texture with a subtle natural vanilla flavor.',
    price: 2100,
    image: 'https://picsum.photos/id/292/800/1200',
    images: [
      'https://picsum.photos/id/292/800/1200',
    ],
    category: 'food',
  },
  {
    id: 'hand-balm',
    name: 'Restorative Hand Balm',
    descriptor: 'Intense repair',
    description: 'A rich, fast-absorbing balm to restore dry hands. Scented with vetiver and bergamot.',
    price: 950,
    image: 'https://picsum.photos/id/63/800/1200',
    images: [
      'https://picsum.photos/id/63/800/1200',
    ],
    category: 'care',
  }
];

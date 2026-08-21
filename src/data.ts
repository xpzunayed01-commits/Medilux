import { Product, Category } from './types';

export const categories: Category[] = [
  {
    id: 'food',
    name: 'FOOD',
    description: 'Everyday nutrition',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop',
  },
  {
    id: 'coffee',
    name: 'COFFEE',
    description: 'Daily rituals',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 'care',
    name: 'CARE',
    description: 'Personal essentials',
    image: 'https://images.unsplash.com/photo-1615397323282-315dc6b5a305?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'skin',
    name: 'SKIN',
    description: 'Simple self-care',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop',
  },
];

export const products: Product[] = [
  {
    id: 'reishi-gano-powder',
    name: 'Reishi Gano Powder',
    descriptor: 'Wellness essential',
    description: 'A premium blend of Reishi extract designed to support a balanced immune system and promote everyday vitality. Perfect for adding to your morning routine.',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1611078693529-231a41c19b06?q=80&w=1964&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1611078693529-231a41c19b06?q=80&w=1964&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1974&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=1974&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608248593842-8021c6a8b15d?q=80&w=1974&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1953&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1953&auto=format&fit=crop',
    ],
    category: 'care',
  },
  {
    id: 'matcha-ceremonial-grade',
    name: 'Ceremonial Grade Matcha',
    descriptor: 'Smooth & vibrant',
    description: 'Premium organic ceremonial grade matcha from Uji, Japan. Vibrant green, naturally sweet, and rich in antioxidants.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'coffee',
  },
  {
    id: 'daily-cleanser',
    name: 'Daily Cleanser',
    descriptor: 'Gentle wash',
    description: 'A gentle, pH-balanced cleanser that effectively removes impurities without stripping your skin of essential moisture.',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1556228720-192a6af4e86e?q=80&w=1974&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556228720-192a6af4e86e?q=80&w=1974&auto=format&fit=crop',
    ],
    category: 'skin',
  },
  {
    id: 'plant-protein',
    name: 'Plant Protein Blend',
    descriptor: 'Vanilla Bean',
    description: 'A clean, minimal-ingredient plant protein blend. Smooth texture with a subtle natural vanilla flavor.',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=2070&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=2070&auto=format&fit=crop',
    ],
    category: 'food',
  },
  {
    id: 'hand-balm',
    name: 'Restorative Hand Balm',
    descriptor: 'Intense repair',
    description: 'A rich, fast-absorbing balm to restore dry hands. Scented with vetiver and bergamot.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2080&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2080&auto=format&fit=crop',
    ],
    category: 'care',
  }
];

import { Product, Category } from './types';

export const categories: Category[] = [
  {
    id: 'food',
    name: 'FOOD',
    description: 'Everyday nutrition',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'coffee',
    name: 'COFFEE',
    description: 'Daily rituals',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'care',
    name: 'CARE',
    description: 'Personal essentials',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'skin',
    name: 'SKIN',
    description: 'Simple self-care',
    image: 'https://images.unsplash.com/photo-1608248597359-009139f1c79e?auto=format&fit=crop&w=800&q=80',
  },
];

export const products: Product[] = [
  {
    id: 'reishi-gano-powder',
    name: 'Reishi Gano Powder',
    descriptor: 'Wellness essential',
    description: 'A premium blend of Reishi extract designed to support a balanced immune system and promote everyday vitality. Perfect for adding to your morning routine.',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-009139f1c79e?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'care',
  },
  {
    id: 'matcha-ceremonial-grade',
    name: 'Ceremonial Grade Matcha',
    descriptor: 'Smooth & vibrant',
    description: 'Premium organic ceremonial grade matcha from Uji, Japan. Vibrant green, naturally sweet, and rich in antioxidants.',
    price: 1450,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'coffee',
  },
  {
    id: 'daily-cleanser',
    name: 'Daily Cleanser',
    descriptor: 'Gentle wash',
    description: 'A gentle, pH-balanced cleanser that effectively removes impurities without stripping your skin of essential moisture.',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1556228722-d0b5be7490bf?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556228722-d0b5be7490bf?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'skin',
  },
  {
    id: 'plant-protein',
    name: 'Plant Protein Blend',
    descriptor: 'Vanilla Bean',
    description: 'A clean, minimal-ingredient plant protein blend. Smooth texture with a subtle natural vanilla flavor.',
    price: 2100,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'food',
  },
  {
    id: 'hand-balm',
    name: 'Restorative Hand Balm',
    descriptor: 'Intense repair',
    description: 'A rich, fast-absorbing balm to restore dry hands. Scented with vetiver and bergamot.',
    price: 950,
    image: 'https://images.unsplash.com/photo-1608248597359-009139f1c79e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1608248597359-009139f1c79e?auto=format&fit=crop&w=800&q=80',
    ],
    category: 'care',
  }
];

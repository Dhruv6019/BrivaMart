import { Product, Category, Review } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Kitchen Ware',
    slug: 'kitchen-ware',
    image: '/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png',
    description: 'Premium kitchen tools and appliances for cooking',
    productCount: 15
  },
  {
    id: '2',
    name: 'Hardware',
    slug: 'hardware',
    image: '/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png',
    description: 'Professional tools and hardware solutions',
    productCount: 28
  },
  {
    id: '3',
    name: 'Gardening Tools',
    slug: 'gardening-tools',
    image: '/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png',
    description: 'Essential tools for garden and outdoor care',
    productCount: 18
  },
  {
    id: '4',
    name: 'Home Ware',
    slug: 'home-ware',
    image: '/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png',
    description: 'Comfort and style for your living space',
    productCount: 22
  },
  {
    id: '5',
    name: 'Mobile Accessory',
    slug: 'mobile-accessory',
    image: '/lovable-uploads/dc13e94f-beeb-4671-8a22-0968498cdb4c.png',
    description: 'Latest accessories for your mobile devices',
    productCount: 12
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Professional Chef Knife Set',
    description: 'Premium stainless steel knife set with ergonomic handles. Includes chef\'s knife, paring knife, bread knife, and utility knife. Perfect for home and professional cooking.',
    price: 89,
    originalPrice: 129,
    images: [
      '/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png',
      '/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png'
    ],
    category: 'Kitchen Ware',
    subcategory: 'Knives',
    brand: 'ChefMaster',
    rating: 4.8,
    reviewCount: 127,
    inStock: true,
    stockQuantity: 15,
    lowStockAlert: 5,
    specifications: {
      'Material': 'German Stainless Steel',
      'Handle': 'Ergonomic Polymer',
      'Set Size': '4 Pieces',
      'Warranty': '5 Years',
      'Dishwasher Safe': 'Yes'
    },
    variants: [
      {
        id: 'v1',
        name: 'Color',
        type: 'color',
        value: 'Black Handle',
        stockQuantity: 10
      },
      {
        id: 'v2',
        name: 'Color',
        type: 'color',
        value: 'Wood Handle',
        stockQuantity: 5
      }
    ],
    tags: ['Kitchen', 'Knives', 'Professional', 'Cooking'],
    featured: true,
    isNew: false,
    onSale: true
  },
  {
    id: '2',
    name: 'Cordless Power Drill',
    description: 'Heavy-duty cordless drill with lithium-ion battery. Features 20V motor, LED work light, and 15 clutch settings. Includes carrying case and accessories.',
    price: 159,
    images: [
      '/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png'
    ],
    category: 'Hardware',
    subcategory: 'Power Tools',
    brand: 'PowerPro',
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    stockQuantity: 12,
    lowStockAlert: 3,
    specifications: {
      'Voltage': '20V MAX',
      'Chuck Size': '1/2 inch',
      'Battery': 'Lithium-Ion',
      'LED Light': 'Yes',
      'Case Included': 'Yes'
    },
    variants: [
      {
        id: 'v3',
        name: 'Battery',
        type: 'style',
        value: '1 Battery',
        stockQuantity: 8
      },
      {
        id: 'v4',
        name: 'Battery',
        type: 'style',
        value: '2 Batteries',
        price: 199,
        stockQuantity: 4
      }
    ],
    tags: ['Tools', 'Cordless', 'DIY', 'Construction'],
    featured: true,
    isNew: false,
    onSale: false
  },
  {
    id: '3',
    name: 'Garden Tool Set',
    description: 'Complete 5-piece garden tool set with stainless steel heads and comfortable grip handles. Includes trowel, weeder, cultivator, transplanter, and pruning shears.',
    price: 49,
    images: [
      '/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png'
    ],
    category: 'Gardening Tools',
    subcategory: 'Hand Tools',
    brand: 'GreenThumb',
    rating: 4.6,
    reviewCount: 203,
    inStock: true,
    stockQuantity: 25,
    lowStockAlert: 10,
    specifications: {
      'Material': 'Stainless Steel',
      'Handle': 'Ergonomic Grip',
      'Set Size': '5 Pieces',
      'Rust Resistant': 'Yes',
      'Storage Bag': 'Included'
    },
    variants: [
      {
        id: 'v5',
        name: 'Size',
        type: 'style',
        value: 'Standard',
        stockQuantity: 15
      },
      {
        id: 'v6',
        name: 'Size',
        type: 'style',
        value: 'Compact',
        price: 39,
        stockQuantity: 10
      }
    ],
    tags: ['Garden', 'Tools', 'Outdoor', 'Planting'],
    featured: false,
    isNew: false,
    onSale: false
  },
  {
    id: '4',
    name: 'Luxury Cotton Bed Sheets',
    description: 'Ultra-soft 100% cotton bed sheet set. Deep pocket fitted sheet fits mattresses up to 18 inches. Available in queen and king sizes with matching pillowcases.',
    price: 79,
    images: [
      '/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png'
    ],
    category: 'Home Ware',
    subcategory: 'Bedding',
    brand: 'ComfortHome',
    rating: 4.5,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 18,
    lowStockAlert: 5,
    specifications: {
      'Material': '100% Cotton',
      'Thread Count': '400TC',
      'Deep Pocket': '18 inches',
      'Care': 'Machine Washable',
      'Set Includes': 'Fitted, Flat, 2 Pillowcases'
    },
    variants: [
      {
        id: 'v7',
        name: 'Size',
        type: 'style',
        value: 'Queen',
        stockQuantity: 10
      },
      {
        id: 'v8',
        name: 'Size',
        type: 'style',
        value: 'King',
        price: 89,
        stockQuantity: 8
      }
    ],
    tags: ['Bedding', 'Cotton', 'Comfort', 'Sleep'],
    featured: false,
    isNew: true,
    onSale: false
  },
  {
    id: '5',
    name: 'Wireless Charging Stand',
    description: 'Fast wireless charging stand compatible with all Qi-enabled devices. Features adjustable viewing angle, LED charging indicator, and built-in cooling fan.',
    price: 35,
    images: [
      '/lovable-uploads/dc13e94f-beeb-4671-8a22-0968498cdb4c.png'
    ],
    category: 'Mobile Accessory',
    subcategory: 'Chargers',
    brand: 'TechCharge',
    rating: 4.4,
    reviewCount: 92,
    inStock: true,
    stockQuantity: 30,
    lowStockAlert: 10,
    specifications: {
      'Charging Speed': '15W Fast Charge',
      'Compatibility': 'Qi-Enabled Devices',
      'LED Indicator': 'Yes',
      'Cooling Fan': 'Built-in',
      'Cable Length': '4 feet'
    },
    variants: [
      {
        id: 'v9',
        name: 'Color',
        type: 'color',
        value: 'Black',
        stockQuantity: 20
      },
      {
        id: 'v10',
        name: 'Color',
        type: 'color',
        value: 'White',
        stockQuantity: 10
      }
    ],
    tags: ['Wireless', 'Charging', 'Mobile', 'Tech'],
    featured: true,
    isNew: true,
    onSale: false
  }
];

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    rating: 5,
    title: 'Excellent knife set!',
    comment: 'These knives are incredibly sharp and well-balanced. The ergonomic handles make cooking so much more enjoyable. Professional quality at a great price!',
    verified: true,
    helpful: 24,
    createdAt: new Date('2024-08-15')
  },
  {
    id: '2',
    productId: '2',
    userId: 'user2',
    userName: 'Michael Chen',
    rating: 5,
    title: 'Great drill for DIY projects',
    comment: 'This cordless drill has enough power for all my home projects. The battery lasts forever and the build quality is outstanding.',
    verified: true,
    helpful: 18,
    createdAt: new Date('2024-08-10')
  },
  {
    id: '3',
    productId: '3',
    userId: 'user3',
    userName: 'Emily Rodriguez',
    rating: 5,
    title: 'Perfect for my garden',
    comment: 'These tools make gardening so much easier. The stainless steel is rust-resistant and the handles are comfortable for long use.',
    verified: true,
    helpful: 31,
    createdAt: new Date('2024-08-20')
  },
  {
    id: '4',
    productId: '4',
    userId: 'user4',
    userName: 'David Wilson',
    rating: 4,
    title: 'Luxury feel and comfort',
    comment: 'The cotton quality is amazing and they feel so soft. Worth the investment for a good night\'s sleep.',
    verified: true,
    helpful: 15,
    createdAt: new Date('2024-08-12')
  },
  {
    id: '5',
    productId: '5',
    userId: 'user5',
    userName: 'Lisa Thompson',
    rating: 5,
    title: 'Fast charging works great',
    comment: 'Charges my phone quickly and the adjustable stand is perfect for video calls. No more tangled cables!',
    verified: true,
    helpful: 22,
    createdAt: new Date('2024-08-18')
  }
];
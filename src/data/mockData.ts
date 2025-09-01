import { Product, Category, Review } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Smart Robots',
    slug: 'smart-robots',
    image: '/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png',
    description: 'Advanced AI-powered robotic companions',
    productCount: 12
  },
  {
    id: '2',
    name: 'Home Automation',
    slug: 'home-automation',
    image: '/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png',
    description: 'Smart home devices and systems',
    productCount: 24
  },
  {
    id: '3',
    name: 'AI Assistants',
    slug: 'ai-assistants',
    image: '/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png',
    description: 'Intelligent personal and business assistants',
    productCount: 8
  },
  {
    id: '4',
    name: 'Healthcare Robots',
    slug: 'healthcare-robots',
    image: '/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png',
    description: 'Medical and healthcare robotic solutions',
    productCount: 6
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Atlas Pro Humanoid Robot',
    description: 'The ultimate AI companion featuring advanced natural language processing, precise movement capabilities, and adaptive learning algorithms. Perfect for home assistance and professional environments.',
    price: 24999,
    originalPrice: 29999,
    images: [
      '/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png',
      '/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png'
    ],
    category: 'Smart Robots',
    subcategory: 'Humanoid',
    brand: 'Atlas Robotics',
    rating: 4.8,
    reviewCount: 127,
    inStock: true,
    stockQuantity: 15,
    lowStockAlert: 5,
    specifications: {
      'Height': '5.8 feet',
      'Weight': '180 lbs',
      'Battery Life': '12 hours',
      'AI Processing': 'Advanced Neural Network',
      'Sensors': '50+ Environmental Sensors',
      'Connectivity': 'WiFi 6, Bluetooth 5.2, 5G'
    },
    variants: [
      {
        id: 'v1',
        name: 'Color',
        type: 'color',
        value: 'Orange & White',
        stockQuantity: 10
      },
      {
        id: 'v2',
        name: 'Color',
        type: 'color',
        value: 'Blue & Silver',
        stockQuantity: 5
      }
    ],
    tags: ['AI', 'Humanoid', 'Smart Home', 'Assistant'],
    featured: true,
    isNew: false,
    onSale: true
  },
  {
    id: '2',
    name: 'Companion Care Robot',
    description: 'Specialized healthcare assistant robot designed for elderly care and medical support. Features health monitoring, medication reminders, and emergency response capabilities.',
    price: 18999,
    images: [
      '/lovable-uploads/af412c03-21e4-4856-82ff-d1a975dc84a9.png'
    ],
    category: 'Healthcare Robots',
    subcategory: 'Care Assistant',
    brand: 'MediBot',
    rating: 4.9,
    reviewCount: 89,
    inStock: true,
    stockQuantity: 8,
    lowStockAlert: 3,
    specifications: {
      'Height': '4.5 feet',
      'Weight': '120 lbs',
      'Battery Life': '16 hours',
      'Medical Sensors': 'Heart Rate, Blood Pressure, Temperature',
      'Emergency Features': 'Fall Detection, Emergency Calling'
    },
    variants: [
      {
        id: 'v3',
        name: 'Configuration',
        type: 'style',
        value: 'Standard',
        stockQuantity: 5
      },
      {
        id: 'v4',
        name: 'Configuration',
        type: 'style',
        value: 'Advanced Medical',
        price: 21999,
        stockQuantity: 3
      }
    ],
    tags: ['Healthcare', 'Elderly Care', 'Medical', 'Emergency'],
    featured: true,
    isNew: true,
    onSale: false
  },
  {
    id: '3',
    name: 'Smart Home Hub Robot',
    description: 'Central command robot for your smart home ecosystem. Controls all connected devices, provides security monitoring, and offers voice-activated assistance throughout your home.',
    price: 12999,
    images: [
      '/lovable-uploads/22d31f51-c174-40a7-bd95-00e4ad00eaf3.png'
    ],
    category: 'Home Automation',
    subcategory: 'Hub',
    brand: 'SmartHome Co',
    rating: 4.6,
    reviewCount: 203,
    inStock: true,
    stockQuantity: 25,
    lowStockAlert: 10,
    specifications: {
      'Compatibility': 'All major smart home brands',
      'Voice Commands': '500+ supported commands',
      'Security Features': '360° camera, motion detection',
      'Range': 'Whole home coverage'
    },
    variants: [
      {
        id: 'v5',
        name: 'Package',
        type: 'style',
        value: 'Basic',
        stockQuantity: 15
      },
      {
        id: 'v6',
        name: 'Package',
        type: 'style',
        value: 'Professional',
        price: 15999,
        stockQuantity: 10
      }
    ],
    tags: ['Smart Home', 'Security', 'Voice Control', 'Automation'],
    featured: false,
    isNew: false,
    onSale: false
  },
  {
    id: '4',
    name: 'Industrial Assistant Robot',
    description: 'Heavy-duty robot designed for industrial and commercial applications. Features advanced lifting capabilities, precision tasks, and workplace safety protocols.',
    price: 45999,
    images: [
      '/lovable-uploads/dc13e94f-beeb-4671-8a22-0968498cdb4c.png'
    ],
    category: 'Smart Robots',
    subcategory: 'Industrial',
    brand: 'RoboTech Industries',
    rating: 4.7,
    reviewCount: 45,
    inStock: true,
    stockQuantity: 3,
    lowStockAlert: 2,
    specifications: {
      'Lifting Capacity': '500 lbs',
      'Operating Temperature': '-20°C to 60°C',
      'Precision': '±0.1mm',
      'Safety Certifications': 'ISO 10218, ANSI/RIA R15.06'
    },
    variants: [
      {
        id: 'v7',
        name: 'Configuration',
        type: 'style',
        value: 'Standard',
        stockQuantity: 2
      },
      {
        id: 'v8',
        name: 'Configuration',
        type: 'style',
        value: 'Heavy Duty',
        price: 52999,
        stockQuantity: 1
      }
    ],
    tags: ['Industrial', 'Heavy Duty', 'Precision', 'Safety'],
    featured: false,
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
    title: 'Amazing AI companion!',
    comment: 'The Atlas Pro exceeded all my expectations. The AI is incredibly responsive and the movement is so natural. Worth every penny!',
    verified: true,
    helpful: 24,
    createdAt: new Date('2024-08-15')
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'Michael Chen',
    rating: 5,
    title: 'Revolutionary technology',
    comment: 'This robot has transformed our household. The learning capabilities are impressive and it genuinely helps with daily tasks.',
    verified: true,
    helpful: 18,
    createdAt: new Date('2024-08-10')
  },
  {
    id: '3',
    productId: '2',
    userId: 'user3',
    userName: 'Dr. Emily Rodriguez',
    rating: 5,
    title: 'Perfect for elderly care',
    comment: 'We use this in our care facility and the residents love it. The health monitoring features are accurate and reliable.',
    verified: true,
    helpful: 31,
    createdAt: new Date('2024-08-20')
  }
];
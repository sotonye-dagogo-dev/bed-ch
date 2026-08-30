// Database query functions for categories

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

const mockCategories: Category[] = [
  { id: '1', name: 'Bedding', slug: 'bedding', description: 'Sheets, duvets, and bed covers', icon: '🛏️', sortOrder: 1, isActive: true, _count: { products: 4 } },
  { id: '2', name: 'Pillows', slug: 'pillows', description: 'Comfortable pillows for every sleeper', icon: '🛌', sortOrder: 2, isActive: true, _count: { products: 2 } },
  { id: '3', name: 'Rugs', slug: 'rugs', description: 'Soft rugs to warm your floors', icon: '🧵', sortOrder: 3, isActive: true, _count: { products: 2 } },
  { id: '4', name: 'Curtains', slug: 'curtains', description: 'Light-filtering and blackout curtains', icon: '🪟', sortOrder: 4, isActive: true, _count: { products: 2 } },
  { id: '5', name: 'Lighting', slug: 'lighting', description: 'Ambient and task lighting', icon: '💡', sortOrder: 5, isActive: true, _count: { products: 2 } },
  { id: '6', name: 'Storage', slug: 'storage', description: 'Smart storage solutions', icon: '📦', sortOrder: 6, isActive: true, _count: { products: 1 } },
  { id: '7', name: 'Nightwear', slug: 'nightwear', description: 'Comfortable sleepwear', icon: '👕', sortOrder: 7, isActive: true, _count: { products: 0 } },
  { id: '8', name: 'Function', slug: 'function', description: 'Functional bedroom accessories', icon: '🔧', sortOrder: 8, isActive: true, _count: { products: 1 } },
];

export async function getCategories(): Promise<Category[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockCategories.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockCategories.find(c => c.slug === slug && c.isActive) || null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockCategories.find(c => c.id === id && c.isActive) || null;
}
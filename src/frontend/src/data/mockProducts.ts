export type Category =
  | "Electronics"
  | "Fashion"
  | "Home & Kitchen"
  | "Beauty"
  | "Sports"
  | "Books";

export interface MockProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: Category;
  rating: number;
  reviews: number;
  badge?: string;
  discount: number;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "mock-1",
    name: "iPhone 15 Pro",
    price: 89999,
    originalPrice: 109999,
    image: "/assets/generated/product-iphone.dim_400x400.jpg",
    category: "Electronics",
    rating: 4.8,
    reviews: 2840,
    badge: "Best Seller",
    discount: 18,
  },
  {
    id: "mock-2",
    name: 'Samsung 4K OLED TV 55"',
    price: 45000,
    originalPrice: 65000,
    image: "/assets/generated/product-tv.dim_400x400.jpg",
    category: "Electronics",
    rating: 4.6,
    reviews: 1560,
    badge: "Hot Deal",
    discount: 31,
  },
  {
    id: "mock-3",
    name: "Pure Silk Banarasi Saree",
    price: 2499,
    originalPrice: 4999,
    image: "/assets/generated/product-saree.dim_400x400.jpg",
    category: "Fashion",
    rating: 4.7,
    reviews: 892,
    badge: "Trending",
    discount: 50,
  },
  {
    id: "mock-4",
    name: "Premium Men's Leather Jacket",
    price: 1999,
    originalPrice: 3499,
    image: "/assets/generated/product-jacket.dim_400x400.jpg",
    category: "Fashion",
    rating: 4.5,
    reviews: 643,
    discount: 43,
  },
  {
    id: "mock-5",
    name: "Digital Air Fryer 5.5L",
    price: 3499,
    originalPrice: 6499,
    image: "/assets/generated/product-airfryer.dim_400x400.jpg",
    category: "Home & Kitchen",
    rating: 4.6,
    reviews: 1230,
    badge: "Flash Sale",
    discount: 46,
  },
  {
    id: "mock-6",
    name: "Espresso Coffee Maker",
    price: 2299,
    originalPrice: 3999,
    image: "/assets/generated/product-coffee.dim_400x400.jpg",
    category: "Home & Kitchen",
    rating: 4.4,
    reviews: 782,
    discount: 43,
  },
  {
    id: "mock-7",
    name: "Retinol Anti-Aging Serum",
    price: 899,
    originalPrice: 1799,
    image: "/assets/generated/product-serum.dim_400x400.jpg",
    category: "Beauty",
    rating: 4.7,
    reviews: 1954,
    badge: "Top Rated",
    discount: 50,
  },
  {
    id: "mock-8",
    name: "Luxury Matte Lipstick Set (12 pcs)",
    price: 599,
    originalPrice: 999,
    image: "/assets/generated/product-lipstick.dim_400x400.jpg",
    category: "Beauty",
    rating: 4.5,
    reviews: 2103,
    discount: 40,
  },
  {
    id: "mock-9",
    name: "MRF Genius 7000 Cricket Bat",
    price: 1499,
    originalPrice: 2499,
    image: "/assets/generated/product-cricket.dim_400x400.jpg",
    category: "Sports",
    rating: 4.8,
    reviews: 456,
    badge: "Champion Pick",
    discount: 40,
  },
  {
    id: "mock-10",
    name: "CloudStride Pro Running Shoes",
    price: 2799,
    originalPrice: 4999,
    image: "/assets/generated/product-shoes.dim_400x400.jpg",
    category: "Sports",
    rating: 4.6,
    reviews: 987,
    discount: 44,
  },
  {
    id: "mock-11",
    name: "Harry Potter Complete Box Set",
    price: 1299,
    originalPrice: 2199,
    image: "/assets/generated/product-hpbooks.dim_400x400.jpg",
    category: "Books",
    rating: 4.9,
    reviews: 4521,
    badge: "Classic",
    discount: 41,
  },
  {
    id: "mock-12",
    name: "Atomic Habits + Think Like Monk Set",
    price: 799,
    originalPrice: 1399,
    image: "/assets/generated/product-selfhelp.dim_400x400.jpg",
    category: "Books",
    rating: 4.8,
    reviews: 3287,
    discount: 43,
  },
];

export const CATEGORIES: { name: Category; icon: string; color: string }[] = [
  { name: "Electronics", icon: "Cpu", color: "from-violet-500 to-purple-700" },
  { name: "Fashion", icon: "Shirt", color: "from-pink-500 to-rose-600" },
  {
    name: "Home & Kitchen",
    icon: "UtensilsCrossed",
    color: "from-amber-500 to-orange-600",
  },
  { name: "Beauty", icon: "Sparkles", color: "from-fuchsia-500 to-pink-600" },
  { name: "Sports", icon: "Dumbbell", color: "from-green-500 to-emerald-600" },
  { name: "Books", icon: "BookOpen", color: "from-blue-500 to-cyan-600" },
];

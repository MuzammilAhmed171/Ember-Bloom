export interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  price: number;
  description: string;
  notes: string[];
  roast: string;
  weight: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  brewingMethods: string[];
  intensity: number;
  acidity: number;
  body: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    origin: "Ethiopia",
    category: "Single Origin",
    price: 18.50,
    description: "A bright and complex coffee from the birthplace of arabica. Grown at high elevations in the Yirgacheffe region, this lot delivers an extraordinary cup with floral aromatics and a silky body that lingers on the palate.",
    notes: ["Blueberry", "Jasmine", "Lemon Zest"],
    roast: "Light",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop",
    rating: 4.9,
    reviews: 234,
    inStock: true,
    bestSeller: true,
    brewingMethods: ["Pour Over", "AeroPress", "Chemex"],
    intensity: 3,
    acidity: 5,
    body: 3
  },
  {
    id: 2,
    name: "Colombian Supremo",
    origin: "Colombia",
    category: "Single Origin",
    price: 16.00,
    description: "A classic Colombian coffee with exceptional balance. Grown in the Huila region by smallholder farmers, this bean offers a smooth, well-rounded cup with sweet caramel undertones and a clean finish.",
    notes: ["Caramel", "Red Apple", "Milk Chocolate"],
    roast: "Medium",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&h=600&fit=crop",
    rating: 4.7,
    reviews: 189,
    inStock: true,
    brewingMethods: ["Drip", "French Press", "Pour Over"],
    intensity: 3,
    acidity: 3,
    body: 4
  },
  {
    id: 3,
    name: "Midnight Velvet Blend",
    origin: "Brazil & Indonesia",
    category: "Blend",
    price: 15.00,
    description: "Our signature dark blend crafted for those who love bold, full-bodied coffee. Combining Brazilian Santos with Sumatran Mandheling, this blend delivers deep chocolate notes with a smoky, lingering finish.",
    notes: ["Dark Chocolate", "Cedar", "Tobacco"],
    roast: "Dark",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=600&h=600&fit=crop",
    rating: 4.6,
    reviews: 156,
    inStock: true,
    brewingMethods: ["Espresso", "Moka Pot", "French Press"],
    intensity: 5,
    acidity: 2,
    body: 5
  },
  {
    id: 4,
    name: "Kenya AA Nyeri",
    origin: "Kenya",
    category: "Single Origin",
    price: 21.00,
    description: "A prestigious AA-grade coffee from the Nyeri county. Known for its wine-like acidity and complex fruit character, this coffee is a favorite among specialty enthusiasts seeking a vibrant, juicy cup.",
    notes: ["Blackcurrant", "Grapefruit", "Brown Sugar"],
    roast: "Light-Medium",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=600&h=600&fit=crop",
    rating: 4.8,
    reviews: 201,
    inStock: true,
    newArrival: true,
    brewingMethods: ["Pour Over", "Chemex", "AeroPress"],
    intensity: 4,
    acidity: 5,
    body: 3
  },
  {
    id: 5,
    name: "Morning Ritual Blend",
    origin: "Central America",
    category: "Blend",
    price: 14.50,
    description: "A perfectly balanced everyday blend designed for your morning ritual. Combining beans from Guatemala and Costa Rica, this coffee offers a smooth, approachable cup with gentle sweetness and zero bitterness.",
    notes: ["Hazelnut", "Honey", "Vanilla"],
    roast: "Medium",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    rating: 4.5,
    reviews: 312,
    inStock: true,
    bestSeller: true,
    brewingMethods: ["Drip", "French Press", "Espresso"],
    intensity: 3,
    acidity: 2,
    body: 3
  },
  {
    id: 6,
    name: "Sumatra Mandheling",
    origin: "Indonesia",
    category: "Single Origin",
    price: 17.50,
    description: "A full-bodied, earthy coffee from the Sumatra highlands. Wet-hulled processing gives this bean its distinctive character — low acidity, heavy body, and complex herbal notes that develop beautifully as it cools.",
    notes: ["Earthy", "Dark Cocoa", "Herbal"],
    roast: "Dark",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=600&h=600&fit=crop",
    rating: 4.4,
    reviews: 143,
    inStock: true,
    brewingMethods: ["French Press", "Moka Pot", "Cold Brew"],
    intensity: 5,
    acidity: 1,
    body: 5
  },
  {
    id: 7,
    name: "Guatemala Antigua",
    origin: "Guatemala",
    category: "Single Origin",
    price: 17.00,
    description: "A rich, full-bodied coffee from the volcanic soils of Antigua valley. Grown at 1,500 meters, this bean develops complex chocolate and spice notes with a velvety mouthfeel.",
    notes: ["Cocoa", "Cinnamon", "Smoky"],
    roast: "Medium-Dark",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
    rating: 4.6,
    reviews: 178,
    inStock: true,
    brewingMethods: ["Pour Over", "French Press", "Drip"],
    intensity: 4,
    acidity: 3,
    body: 4
  },
  {
    id: 8,
    name: "Costa Rica Tarrazu",
    origin: "Costa Rica",
    category: "Single Origin",
    price: 19.00,
    description: "A bright, clean coffee from the renowned Tarrazu region. Grown by third-generation farmers at high elevation, this coffee offers exceptional clarity with citrus and honey notes.",
    notes: ["Orange", "Honey", "Almond"],
    roast: "Light-Medium",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=600&fit=crop",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    newArrival: true,
    brewingMethods: ["Pour Over", "Chemex", "AeroPress"],
    intensity: 3,
    acidity: 4,
    body: 3
  },
  {
    id: 9,
    name: "Espresso Classico",
    origin: "Brazil & Ethiopia",
    category: "Blend",
    price: 16.50,
    description: "Our house espresso blend crafted for perfect extraction. Combining Brazilian sweetness with Ethiopian brightness, this blend produces a rich crema with balanced acidity and body.",
    notes: ["Chocolate", "Citrus", "Caramel"],
    roast: "Medium",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=600&fit=crop",
    rating: 4.8,
    reviews: 267,
    inStock: true,
    bestSeller: true,
    brewingMethods: ["Espresso", "Moka Pot", "AeroPress"],
    intensity: 4,
    acidity: 3,
    body: 4
  },
  {
    id: 10,
    name: "Decaf Mountain Water",
    origin: "Mexico",
    category: "Single Origin",
    price: 18.00,
    description: "Chemical-free decaffeination using the Swiss Water Process. This high-altitude Mexican coffee retains its full flavor profile — smooth, nutty, with subtle chocolate undertones.",
    notes: ["Walnut", "Chocolate", "Maple"],
    roast: "Medium",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=600&h=600&fit=crop",
    rating: 4.3,
    reviews: 98,
    inStock: true,
    brewingMethods: ["Drip", "French Press", "Pour Over"],
    intensity: 2,
    acidity: 2,
    body: 3
  }
];

export const categories = ["All", "Single Origin", "Blend"];
export const roastLevels = ["All", "Light", "Light-Medium", "Medium", "Dark"];
export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "name", label: "Name A-Z" },
  { value: "newest", label: "Newest First" }
];

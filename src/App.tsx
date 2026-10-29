import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { products, categories, roastLevels, sortOptions, Product } from './data/products';
import { CartItem, WishlistItem } from './types/cart';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRoast, setSelectedRoast] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.notes.some(note => note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesRoast = selectedRoast === 'All' || product.roast === selectedRoast;
      return matchesSearch && matchesCategory && matchesRoast;
    });

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }
    return result;
  }, [searchQuery, selectedCategory, selectedRoast, sortBy]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2500);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`${product.name} added to cart`);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCartItems(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const removeItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        showNotification(`Removed from wishlist`);
        return prev.filter(item => item.product.id !== product.id);
      }
      showNotification(`Saved to wishlist`);
      return [...prev, { product, addedAt: Date.now() }];
    });
  };

  const isWishlisted = (productId: number) => wishlist.some(item => item.product.id === productId);

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 4);
    });
  };

  const handleCheckout = () => { setIsCartOpen(false); setIsCheckoutOpen(true); };
  const handleCheckoutComplete = () => { setIsCheckoutOpen(false); setCartItems([]); showNotification('Order confirmed'); };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[60]"
        >
          <div className="px-5 py-3 rounded-lg text-sm font-medium flex items-center gap-2.5"
            style={{ backgroundColor: 'var(--bg-surface-raised)', color: 'var(--text-primary)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)' }}>
            <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {notification}
          </div>
        </motion.div>
      )}

      {/* ── Header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(12, 10, 9, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(250, 250, 249, 0.08)' : '1px solid transparent',
        }}
      >
        <div className="container-page">
          <nav className="flex items-center justify-between h-16 md:h-18" aria-label="Main navigation">
            <a href="#" className="flex items-center gap-3 group" aria-label="Ember & Bloom home">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
                <svg className="w-4 h-4" style={{ color: 'var(--accent-contrast)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-base font-semibold tracking-tight" style={{ color: '#fafaf9' }}>Ember & Bloom</span>
            </a>

            <div className="hidden md:flex flex-1 max-w-sm mx-8">
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(250, 250, 249, 0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  placeholder="Search origins, flavors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: 'rgba(250, 250, 249, 0.1)', color: '#fafaf9', border: '1px solid transparent' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="w-9 h-9 rounded-lg flex items-center justify-center relative hover:bg-white/10 transition-colors"
                style={{ color: '#fafaf9' }}
                aria-label={`Wishlist, ${wishlistCount} items`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-contrast)' }}>
                    {wishlistCount}
                  </span>
                )}
              </button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsCartOpen(true)}
                className="h-9 px-3 rounded-lg flex items-center gap-2 text-sm font-medium"
                style={{ backgroundColor: 'rgba(250, 250, 249, 0.1)', color: '#fafaf9', border: '1px solid rgba(250, 250, 249, 0.15)' }}
                aria-label={`Cart, ${cartCount} items`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="tabular-nums text-xs font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-contrast)' }}>
                    {cartCount}
                  </span>
                )}
              </motion.button>
            </div>
          </nav>

          <div className="md:hidden pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(250, 250, 249, 0.5)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search origins, flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm"
                style={{ backgroundColor: 'rgba(250, 250, 249, 0.1)', color: '#fafaf9' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[700px] md:min-h-screen flex items-center overflow-hidden pt-16 md:pt-18">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&h=1080&fit=crop"
            alt="Freshly roasted coffee beans"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(12, 10, 9, 0.85) 0%, rgba(12, 10, 9, 0.7) 50%, rgba(12, 10, 9, 0.85) 100%)'
          }} />
        </div>

        <div className="container-page relative z-10 py-20 md:py-32">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm md:text-base mb-6 uppercase tracking-widest"
              style={{ color: 'var(--accent)', letterSpacing: '0.1em' }}
            >
              Roasted in small batches, shipped within 24 hours
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif mb-6"
              style={{ color: '#fafaf9' }}
            >
              Coffee from the world's<br />most distinguished origins.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base md:text-lg mb-10"
              style={{ color: 'rgba(250, 250, 249, 0.8)', maxWidth: '65ch' }}
            >
              Single-origin beans sourced directly from farmers in Ethiopia, Colombia, Kenya, and Indonesia. Each lot is cupped, graded, and roasted to reveal its unique character.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <motion.a
                href="#collection"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-contrast)' }}
              >
                Shop collection
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </motion.a>
              <span className="text-sm" style={{ color: 'rgba(250, 250, 249, 0.6)' }}>10 origins available</span>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="absolute bottom-0 left-0 right-0"
          style={{ backgroundColor: 'rgba(12, 10, 9, 0.6)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(250, 250, 249, 0.1)' }}
        >
          <div className="container-page">
            <div className="grid grid-cols-3 gap-4 py-6">
              <div>
                <p className="text-xs mb-1" style={{ color: 'rgba(250, 250, 249, 0.6)' }}>Direct trade partners</p>
                <p className="text-2xl md:text-3xl font-semibold tabular-nums" style={{ color: '#fafaf9' }}>47</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'rgba(250, 250, 249, 0.6)' }}>Average cupping score</p>
                <p className="text-2xl md:text-3xl font-semibold tabular-nums" style={{ color: '#fafaf9' }}>87.4</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'rgba(250, 250, 249, 0.6)' }}>Roast to ship</p>
                <p className="text-2xl md:text-3xl font-semibold tabular-nums" style={{ color: '#fafaf9' }}>&lt;24h</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Marquee Section ── */}
      <section className="py-8 overflow-hidden" style={{ backgroundColor: 'var(--accent)' }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center gap-8 px-4">
              {['Single Origin', 'Ethically Sourced', 'Freshly Roasted', 'Free Shipping $35+', 'Small Batch', 'Direct Trade', 'Specialty Grade', 'Peak Freshness', 'Artisan Blends', 'Subscribe & Save'].map((text, i) => (
                <React.Fragment key={i}>
                  <span className="text-lg md:text-xl font-semibold whitespace-nowrap" style={{ color: 'var(--accent-contrast)' }}>
                    {text}
                  </span>
                  <span className="text-2xl" style={{ color: 'var(--accent-contrast)' }}>•</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Collection ── */}
      <motion.section
        id="collection"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container-page pt-12 pb-16"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif" style={{ color: 'var(--text-primary)' }}>The collection</h2>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              {filteredProducts.length} coffee{filteredProducts.length !== 1 ? 's' : ''} from our current roster
            </p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 px-3 rounded-lg text-sm cursor-pointer"
            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
            aria-label="Sort products"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-4 mb-8 pb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Category</p>
            <div className="flex gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 rounded-md text-sm transition-colors"
                  style={{
                    backgroundColor: selectedCategory === cat ? 'var(--accent)' : 'transparent',
                    color: selectedCategory === cat ? 'var(--accent-contrast)' : 'var(--text-secondary)',
                    border: selectedCategory === cat ? 'none' : '1px solid var(--border-default)'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Roast</p>
            <div className="flex gap-1.5">
              {roastLevels.map(roast => (
                <button
                  key={roast}
                  onClick={() => setSelectedRoast(roast)}
                  className="px-3 py-1.5 rounded-md text-sm transition-colors"
                  style={{
                    backgroundColor: selectedRoast === roast ? 'var(--accent)' : 'transparent',
                    color: selectedRoast === roast ? 'var(--accent-contrast)' : 'var(--text-secondary)',
                    border: selectedRoast === roast ? 'none' : '1px solid var(--border-default)'
                  }}
                >
                  {roast}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredProducts.map(product => (
              <motion.div key={product.id} variants={staggerItem}>
                <ProductCard
                  product={product}
                  onViewDetails={viewProduct}
                  onAddToCart={(p) => addToCart(p)}
                  isWishlisted={isWishlisted(product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No results found</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search terms.</p>
          </div>
        )}
      </motion.section>

      {/* ── Yellow Feature Section 1 ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container-page py-12"
      >
        <div className="rounded-3xl p-8 md:p-12" style={{ backgroundColor: 'var(--accent)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: 'var(--accent-contrast)', opacity: 0.8, letterSpacing: '0.1em' }}>Why choose us</p>
              <h2 className="font-serif mb-4" style={{ color: 'var(--accent-contrast)' }}>Coffee that tells a story</h2>
              <p className="text-base md:text-lg mb-6" style={{ color: 'var(--accent-contrast)', opacity: 0.9, maxWidth: '65ch' }}>
                Every bag of Ember & Bloom coffee carries the legacy of its origin. From the misty highlands of Ethiopia to the volcanic slopes of Indonesia, we source beans that embody the terroir and tradition of their homeland.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Direct Trade', 'Organic', 'Fair Wage'].map(tag => (
                  <span key={tag} className="px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--accent-contrast)', color: 'var(--accent)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '47', label: 'Farm partners' },
                { number: '6', label: 'Countries' },
                { number: '87.4', label: 'Avg cupping score' },
                { number: '<24h', label: 'Roast to ship' },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl p-5" style={{ backgroundColor: 'var(--accent-contrast)', color: 'var(--accent)' }}>
                  <p className="text-3xl font-bold tabular-nums mb-1">{stat.number}</p>
                  <p className="text-xs opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Origin Section ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-16 md:py-24"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="font-serif mb-6" style={{ color: 'var(--text-primary)' }}>Sourced from the coffee belt</h2>
              <p className="text-base md:text-lg mb-6" style={{ color: 'var(--text-secondary)', maxWidth: '65ch' }}>
                We work directly with farming cooperatives across the equatorial coffee belt — from the highlands of Ethiopia at 2,200 meters to the volcanic soils of Sumatra. Every origin brings distinct terroir to the cup.
              </p>
              <div className="space-y-4">
                {[
                  { country: 'Ethiopia', region: 'Yirgacheffe, Sidamo', altitude: '1,800–2,200m', process: 'Washed, Natural' },
                  { country: 'Colombia', region: 'Huila, Nariño', altitude: '1,600–1,900m', process: 'Washed' },
                  { country: 'Kenya', region: 'Nyeri, Kiambu', altitude: '1,500–2,100m', process: 'Washed' },
                  { country: 'Indonesia', region: 'Sumatra, Sulawesi', altitude: '1,200–1,700m', process: 'Wet-hulled' },
                ].map(origin => (
                  <div key={origin.country} className="flex items-start gap-4 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-semibold"
                      style={{ backgroundColor: 'var(--accent-muted)', color: 'var(--accent)' }}>
                      {origin.country[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{origin.country}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{origin.region} · {origin.altitude}</p>
                    </div>
                    <p className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{origin.process}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square md:aspect-[4/5]" style={{ border: '1px solid var(--border-subtle)' }}>
              <img
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=1000&fit=crop"
                alt="Freshly roasted coffee beans"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Brewing Guide ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container-page py-16 md:py-24"
      >
        <h2 className="font-serif mb-2" style={{ color: 'var(--text-primary)' }}>Brewing reference</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Recommended parameters for each method. Adjust to taste.</p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { method: 'Pour over', time: '3–4 min', ratio: '1:16', temp: '96°C', grind: 'Medium-fine' },
            { method: 'French press', time: '4 min', ratio: '1:15', temp: '93°C', grind: 'Coarse' },
            { method: 'Espresso', time: '25–30 sec', ratio: '1:2', temp: '93°C', grind: 'Fine' },
            { method: 'Cold brew', time: '12–18 hrs', ratio: '1:8', temp: 'Room temp', grind: 'Extra coarse' },
          ].map(brew => (
            <motion.div key={brew.method} variants={staggerItem} className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary)' }}>{brew.method}</p>
              <dl className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <dt style={{ color: 'var(--text-muted)' }}>Time</dt>
                  <dd className="tabular-nums" style={{ color: 'var(--text-secondary)' }}>{brew.time}</dd>
                </div>
                <div className="flex justify-between text-xs">
                  <dt style={{ color: 'var(--text-muted)' }}>Ratio</dt>
                  <dd className="tabular-nums" style={{ color: 'var(--text-secondary)' }}>{brew.ratio}</dd>
                </div>
                <div className="flex justify-between text-xs">
                  <dt style={{ color: 'var(--text-muted)' }}>Temp</dt>
                  <dd className="tabular-nums" style={{ color: 'var(--text-secondary)' }}>{brew.temp}</dd>
                </div>
                <div className="flex justify-between text-xs">
                  <dt style={{ color: 'var(--text-muted)' }}>Grind</dt>
                  <dd style={{ color: 'var(--text-secondary)' }}>{brew.grind}</dd>
                </div>
              </dl>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Marquee Section 2 ── */}
      <section className="py-6 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="marquee-track" style={{ animationDirection: 'reverse', animationDuration: '35s' }}>
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center gap-6 px-4">
              {['Ethiopia', 'Colombia', 'Kenya', 'Indonesia', 'Brazil', 'Guatemala', 'Costa Rica', 'Sumatra', 'Yirgacheffe', 'Huila', 'Nyeri', 'Mandheling'].map((origin, i) => (
                <React.Fragment key={i}>
                  <span className="text-base md:text-lg font-medium whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{origin}</span>
                  <span className="text-lg" style={{ color: 'var(--accent)' }}>◆</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Subscription CTA ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container-page py-12"
      >
        <div className="rounded-3xl p-8 md:p-16 text-center" style={{ backgroundColor: 'var(--accent)' }}>
          <p className="text-xs mb-3 uppercase tracking-widest" style={{ color: 'var(--accent-contrast)', opacity: 0.8, letterSpacing: '0.1em' }}>Never run out</p>
          <h2 className="font-serif mb-4" style={{ color: 'var(--accent-contrast)' }}>Subscribe and save 15%</h2>
          <p className="text-base md:text-lg mb-8 mx-auto" style={{ color: 'var(--accent-contrast)', opacity: 0.9, maxWidth: '65ch' }}>
            Fresh coffee delivered to your door on your schedule. Choose weekly, biweekly, or monthly. Pause or cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            {['Weekly', 'Biweekly', 'Monthly'].map(freq => (
              <div key={freq} className="px-6 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: 'var(--accent-contrast)', color: 'var(--accent)' }}>
                {freq}
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: 'var(--accent-contrast)', color: 'var(--accent)' }}
          >
            Start your subscription
          </motion.button>
        </div>
      </motion.section>

      {/* ── Quality Promise ── */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container-page py-12"
      >
        <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: 'var(--accent)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              { title: 'Roasted to order', desc: 'Every batch is roasted within 24 hours of your order, ensuring peak flavor and aroma.', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg> },
              { title: 'Quality guaranteed', desc: 'If your coffee doesn\'t meet your expectations, we\'ll replace it or refund your purchase.', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              { title: 'Free shipping', desc: 'Complimentary shipping on all orders over $35. Delivered fresh to your doorstep.', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg> },
            ].map((item, i) => (
              <div key={i} className="p-8 md:p-10" style={{ borderRight: i < 2 ? '1px solid rgba(28, 25, 23, 0.1)' : 'none' }}>
                <div className="mb-4" style={{ color: 'var(--accent-contrast)' }}>{item.icon}</div>
                <h4 className="text-xl font-semibold mb-2" style={{ color: 'var(--accent-contrast)' }}>{item.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--accent-contrast)', opacity: 0.85 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container-page py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Ember & Bloom</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Specialty coffee roasters. Sourcing exceptional beans from the world's finest growing regions since 2019.
              </p>
            </div>
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Shop</p>
              <ul className="space-y-2">
                {['All coffee', 'Single origin', 'Blends', 'Subscriptions'].map(item => (
                  <li key={item}><a href="#" className="text-sm hover:underline" style={{ color: 'var(--text-secondary)' }}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Learn</p>
              <ul className="space-y-2">
                {['Brewing guides', 'Our story', 'Sustainability', 'Wholesale'].map(item => (
                  <li key={item}><a href="#" className="text-sm hover:underline" style={{ color: 'var(--text-secondary)' }}>{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Contact</p>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <li>hello@emberandbloom.co</li>
                <li>+1 (555) 234-5678</li>
                <li>Mon–Fri, 8am–6pm EST</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>© 2026 Ember & Bloom. All rights reserved.</p>
            <div className="flex gap-4 text-xs">
              <a href="#" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Privacy</a>
              <a href="#" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Terms</a>
              <a href="#" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Shipping</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          isWishlisted={isWishlisted(selectedProduct.id)}
          onToggleWishlist={toggleWishlist}
          onViewProduct={viewProduct}
        />
      )}
      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />
      {isWishlistOpen && (
        <div className="fixed inset-0 z-50" onClick={() => setIsWishlistOpen(false)}>
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md flex flex-col" style={{ backgroundColor: 'var(--bg-canvas)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Wishlist</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{wishlistCount} saved</p>
              </div>
              <button onClick={() => setIsWishlistOpen(false)} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ color: 'var(--text-secondary)' }} aria-label="Close wishlist">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No saved items</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Tap the heart on any product to save it here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                      <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.product.name}</p>
                        <p className="text-xs tabular-nums mt-0.5" style={{ color: 'var(--accent)' }}>${item.product.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => addToCart(item.product)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-contrast)' }} aria-label="Add to cart">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      </button>
                      <button onClick={() => toggleWishlist(item.product)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: 'var(--text-muted)' }} aria-label="Remove from wishlist">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isCheckoutOpen && (
        <Checkout items={cartItems} onClose={() => setIsCheckoutOpen(false)} onComplete={handleCheckoutComplete} />
      )}
    </div>
  );
}

export default App;

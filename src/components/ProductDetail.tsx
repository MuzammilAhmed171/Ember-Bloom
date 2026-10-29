import React, { useState } from 'react';
import { Product, products } from '../data/products';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onViewProduct: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart, isWishlisted, onToggleWishlist, onViewProduct }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'brewing' | 'reviews'>('details');

  const relatedProducts = products.filter(p => p.id !== product.id && (p.category === product.category || p.roast === product.roast)).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
      <div
        className="relative rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-canvas)', boxShadow: 'var(--shadow-xl)' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}
          aria-label="Close dialog"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            <img src={product.image} alt={product.name} className="w-full h-72 md:h-full object-cover md:rounded-l-2xl" />
          </div>

          {/* Content */}
          <div className="md:w-1/2 p-6 md:p-8">
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{product.category} · {product.weight}</p>
            <h2 className="text-xl md:text-2xl font-serif tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>{product.name}</h2>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5" style={{ color: i < Math.floor(product.rating) ? 'var(--accent)' : 'var(--border-default)' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                {product.rating} · {product.reviews} reviews
              </span>
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>{product.description}</p>

            {/* Tasting Notes */}
            <div className="mb-5">
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Tasting notes</p>
              <div className="flex flex-wrap gap-1.5">
                {product.notes.map((note, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Flavor Profile */}
            <div className="mb-5 space-y-2.5">
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Profile</p>
              {[
                { label: 'Intensity', value: product.intensity },
                { label: 'Acidity', value: product.acidity },
                { label: 'Body', value: product.body },
              ].map(attr => (
                <div key={attr.label} className="flex items-center gap-3">
                  <span className="text-xs w-16" style={{ color: 'var(--text-secondary)' }}>{attr.label}</span>
                  <div className="flex gap-0.5 flex-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: i < attr.value ? 'var(--accent)' : 'var(--border-subtle)' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="mb-5 flex gap-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {(['details', 'brewing', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="pb-2.5 text-xs font-medium capitalize transition-colors relative"
                  style={{ color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-px" style={{ backgroundColor: 'var(--accent)' }} />
                  )}
                </button>
              ))}
            </div>

            <div className="mb-6 min-h-[72px]">
              {activeTab === 'details' && (
                <dl className="space-y-2">
                  {[
                    ['Origin', product.origin],
                    ['Roast level', product.roast],
                    ['Process', 'Washed'],
                    ['Altitude', '1,800–2,200m'],
                    ['Variety', 'Heirloom'],
                  ].map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <dt style={{ color: 'var(--text-muted)' }}>{key}</dt>
                      <dd style={{ color: 'var(--text-secondary)' }}>{val}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {activeTab === 'brewing' && (
                <div>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Recommended methods:</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.brewingMethods.map(method => (
                      <span key={method} className="text-xs px-2.5 py-1 rounded" style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                        {method}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Use a 1:16 ratio with water at {product.roast.includes('Light') ? '96°C' : product.roast === 'Medium' ? '93°C' : '90°C'}.
                  </p>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  {[
                    { name: 'Sarah M.', rating: 5, text: 'The flavor notes are accurate. Clean cup with excellent clarity.' },
                    { name: 'James K.', rating: 4, text: 'Fresh roast, great aroma. Will reorder.' },
                  ].map((review, i) => (
                    <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-muted)' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{review.name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <svg key={j} className="w-2.5 h-2.5" style={{ color: j < review.rating ? 'var(--accent)' : 'var(--border-default)' }} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Add to Cart */}
            <div style={{ borderTop: '1px solid var(--border-subtle)' }} className="pt-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>${product.price.toFixed(2)}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>/ {product.weight}</span>
                </div>
                <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-default)' }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center text-sm" style={{ color: 'var(--text-secondary)' }} aria-label="Decrease quantity">−</button>
                  <span className="w-9 h-9 flex items-center justify-center text-xs font-semibold tabular-nums" style={{ color: 'var(--text-primary)', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 flex items-center justify-center text-sm" style={{ color: 'var(--text-secondary)' }} aria-label="Increase quantity">+</button>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { onAddToCart(product, quantity); onClose(); }}
                  className="flex-1 h-10 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-contrast)' }}
                >
                  Add to cart — ${(product.price * quantity).toFixed(2)}
                </button>
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                  style={{ border: '1px solid var(--border-default)', color: isWishlisted ? '#ef4444' : 'var(--text-muted)' }}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Related */}
            {relatedProducts.length > 0 && (
              <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>You may also like</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {relatedProducts.map(rp => (
                    <button
                      key={rp.id}
                      onClick={() => onViewProduct(rp)}
                      className="flex-shrink-0 flex items-center gap-2 rounded-lg p-2 pr-3 transition-colors text-left"
                      style={{ backgroundColor: 'var(--bg-muted)' }}
                    >
                      <img src={rp.image} alt={rp.name} className="w-9 h-9 rounded object-cover" />
                      <div>
                        <p className="text-xs font-medium truncate w-20" style={{ color: 'var(--text-primary)' }}>{rp.name}</p>
                        <p className="text-xs tabular-nums" style={{ color: 'var(--accent)' }}>${rp.price.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

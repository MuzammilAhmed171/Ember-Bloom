import React from 'react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onAddToCart, isWishlisted, onToggleWishlist }) => {
  return (
    <article className="group rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-xl"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
      
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          style={{ backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)' }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth={2}
            style={{ color: isWishlisted ? '#ef4444' : 'var(--text-secondary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
              {product.name}
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {product.origin} · {product.roast} roast
            </p>
          </div>
          <p className="text-sm font-semibold tabular-nums flex-shrink-0" style={{ color: 'var(--text-primary)' }}>
            ${product.price.toFixed(2)}
          </p>
        </div>

        {/* Tasting Notes */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.notes.map((note, i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded"
              style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
              {note}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3 h-3" style={{ color: i < Math.floor(product.rating) ? 'var(--accent)' : 'var(--border-default)' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            ))}
          </div>
          <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Action */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full h-9 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-contrast)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add to cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;

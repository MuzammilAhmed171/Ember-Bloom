import React from 'react';
import { CartItem } from '../types/cart';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, isOpen, onClose, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md flex flex-col"
        style={{ backgroundColor: 'var(--bg-canvas)', boxShadow: 'var(--shadow-xl)' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Cart</h2>
            <p className="text-xs mt-0.5 tabular-nums" style={{ color: 'var(--text-muted)' }}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close cart"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Your cart is empty</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add coffee to get started.</p>
              <button
                onClick={onClose}
                className="mt-6 px-5 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-contrast)' }}
              >
                Browse collection
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.product.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.product.weight} · {item.product.roast}</p>
                      </div>
                      <button onClick={() => onRemoveItem(item.product.id)} className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded" style={{ color: 'var(--text-muted)' }} aria-label={`Remove ${item.product.name}`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded overflow-hidden" style={{ border: '1px solid var(--border-default)' }}>
                        <button onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-7 h-7 flex items-center justify-center text-xs" style={{ color: 'var(--text-secondary)' }} aria-label="Decrease">−</button>
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-medium tabular-nums" style={{ color: 'var(--text-primary)', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-xs" style={{ color: 'var(--text-secondary)' }} aria-label="Increase">+</button>
                      </div>
                      <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            {/* Free shipping progress */}
            {subtotal < 35 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span style={{ color: 'var(--text-secondary)' }}>${(35 - subtotal).toFixed(2)} until free shipping</span>
                  <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{Math.round((subtotal / 35) * 100)}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / 35) * 100)}%`, backgroundColor: 'var(--accent)' }} />
                </div>
              </div>
            )}

            <dl className="space-y-1.5 mb-4">
              <div className="flex justify-between text-sm">
                <dt style={{ color: 'var(--text-secondary)' }}>Subtotal</dt>
                <dd className="tabular-nums" style={{ color: 'var(--text-primary)' }}>${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt style={{ color: 'var(--text-secondary)' }}>Shipping</dt>
                <dd className="tabular-nums" style={{ color: shipping === 0 ? 'var(--accent)' : 'var(--text-primary)' }}>
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </dd>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 mt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <dt style={{ color: 'var(--text-primary)' }}>Total</dt>
                <dd className="tabular-nums" style={{ color: 'var(--text-primary)' }}>${total.toFixed(2)}</dd>
              </div>
            </dl>

            <button
              onClick={onCheckout}
              className="w-full h-11 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-contrast)' }}
            >
              Checkout
            </button>
            <p className="text-[11px] text-center mt-3" style={{ color: 'var(--text-muted)' }}>Free returns within 30 days</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

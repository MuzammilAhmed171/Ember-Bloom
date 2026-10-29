import React, { useState } from 'react';
import { CartItem } from '../types/cart';

interface CheckoutProps {
  items: CartItem[];
  onClose: () => void;
  onComplete: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onClose, onComplete }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubscription, setIsSubscription] = useState(false);
  const [frequency, setFrequency] = useState('monthly');
  const [formData, setFormData] = useState({ email: '', name: '', address: '', city: '', zip: '', card: '', expiry: '', cvv: '' });

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 35 ? 0 : 5.99;
  const discount = isSubscription ? subtotal * 0.15 : 0;
  const total = subtotal - discount + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => setStep('success'), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onComplete}>
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
        <div className="relative rounded-2xl max-w-sm w-full p-8 text-center" style={{ backgroundColor: 'var(--bg-canvas)', boxShadow: 'var(--shadow-xl)' }} onClick={e => e.stopPropagation()}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'var(--accent-muted)' }}>
            <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Order confirmed</h2>
          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Thank you for your order.</p>
          <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            Confirmation #{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </p>
          {isSubscription && (
            <div className="rounded-lg p-3 mb-4 text-left" style={{ backgroundColor: 'var(--accent-muted)', border: '1px solid var(--border-subtle)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Subscription active</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Delivered every {frequency}. 15% discount applied.</p>
            </div>
          )}
          <div className="rounded-lg p-4 mb-6 text-left" style={{ backgroundColor: 'var(--bg-muted)' }}>
            <div className="space-y-1.5">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-xs">
                  <span style={{ color: 'var(--text-secondary)' }}>{item.product.name} x{item.quantity}</span>
                  <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {isSubscription && (
                <div className="flex justify-between text-xs">
                  <span style={{ color: 'var(--accent)' }}>Subscription discount</span>
                  <span className="tabular-nums" style={{ color: 'var(--accent)' }}>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold pt-2 mt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-primary)' }}>Total</span>
                <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button onClick={onComplete} className="w-full h-10 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-contrast)' }}>
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
        <div className="relative rounded-2xl max-w-xs w-full p-8 text-center" style={{ backgroundColor: 'var(--bg-canvas)' }}>
          <div className="w-10 h-10 rounded-full mx-auto mb-4" style={{ border: '2px solid var(--border-subtle)', borderTopColor: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Processing payment</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
      <div className="relative rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--bg-canvas)', boxShadow: 'var(--shadow-xl)' }} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Checkout">
        
        {/* Header */}
        <div className="sticky top-0 z-10 p-6" style={{ backgroundColor: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Checkout</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ color: 'var(--text-secondary)' }} aria-label="Close checkout">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {/* Steps */}
          <div className="flex items-center gap-2">
            {['Cart', 'Shipping', 'Payment'].map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: currentStep > i ? 'var(--accent)' : currentStep === i + 1 ? 'var(--accent)' : 'var(--bg-muted)', color: currentStep >= i + 1 ? 'var(--accent-contrast)' : 'var(--text-muted)' }}>
                    {currentStep > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block" style={{ color: currentStep >= i + 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</span>
                </div>
                {i < 2 && <div className="flex-1 h-px" style={{ backgroundColor: currentStep > i + 1 ? 'var(--accent)' : 'var(--border-subtle)' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Cart Review */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Subscription */}
              <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--accent-muted)', border: '1px solid var(--border-subtle)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Subscribe and save 15%</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Regular deliveries. Cancel anytime.</p>
                  </div>
                  <button type="button" onClick={() => setIsSubscription(!isSubscription)} className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
                    style={{ backgroundColor: isSubscription ? 'var(--accent)' : 'var(--border-strong)' }}
                    role="switch" aria-checked={isSubscription} aria-label="Toggle subscription">
                    <div className="absolute top-0.5 w-4 h-4 rounded-full transition-transform" style={{ backgroundColor: 'var(--accent-contrast)', transform: isSubscription ? 'translateX(22px)' : 'translateX(2px)' }} />
                  </button>
                </div>
                {isSubscription && (
                  <div className="mt-3 pt-3 flex gap-1.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    {['weekly', 'biweekly', 'monthly'].map(f => (
                      <button key={f} type="button" onClick={() => setFrequency(f)} className="px-2.5 py-1 rounded text-xs font-medium capitalize transition-colors"
                        style={{ backgroundColor: frequency === f ? 'var(--accent)' : 'var(--bg-surface)', color: frequency === f ? 'var(--accent-contrast)' : 'var(--text-secondary)', border: frequency === f ? 'none' : '1px solid var(--border-default)' }}>
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-muted)' }}>
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.product.name}</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Qty {item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="rounded-lg p-4 space-y-1.5" style={{ backgroundColor: 'var(--bg-muted)' }}>
                <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-secondary)' }}>Subtotal</span><span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>${subtotal.toFixed(2)}</span></div>
                {isSubscription && <div className="flex justify-between text-xs"><span style={{ color: 'var(--accent)' }}>Discount (15%)</span><span className="tabular-nums" style={{ color: 'var(--accent)' }}>-${discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-secondary)' }}>Shipping</span><span className="tabular-nums" style={{ color: shipping === 0 ? 'var(--accent)' : 'var(--text-primary)' }}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-sm font-semibold pt-2 mt-1" style={{ borderTop: '1px solid var(--border-subtle)' }}><span style={{ color: 'var(--text-primary)' }}>Total</span><span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>${total.toFixed(2)}</span></div>
              </div>

              <button type="button" onClick={() => setCurrentStep(2)} className="w-full h-10 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-contrast)' }}>Continue to shipping</button>
            </div>
          )}

          {/* Step 2: Shipping */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="checkout-email" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input id="checkout-email" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }} />
              </div>
              <div>
                <label htmlFor="checkout-name" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full name</label>
                <input id="checkout-name" type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Jane Doe" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }} />
              </div>
              <div>
                <label htmlFor="checkout-address" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Address</label>
                <input id="checkout-address" type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="123 Coffee St" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="checkout-city" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>City</label>
                  <input id="checkout-city" type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="Seattle" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }} />
                </div>
                <div>
                  <label htmlFor="checkout-zip" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>ZIP</label>
                  <input id="checkout-zip" type="text" name="zip" value={formData.zip} onChange={handleChange} required placeholder="98101" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }} />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setCurrentStep(1)} className="h-10 px-4 rounded-lg text-sm font-medium" style={{ border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}>Back</button>
                <button type="button" onClick={() => setCurrentStep(3)} className="flex-1 h-10 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-contrast)' }}>Continue to payment</button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg p-4" style={{ backgroundColor: 'var(--bg-muted)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Order total</p>
                <p className="text-xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>${total.toFixed(2)}</p>
                {isSubscription && <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>15% subscription discount applied</p>}
              </div>
              <div>
                <label htmlFor="checkout-card" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Card number</label>
                <input id="checkout-card" type="text" name="card" value={formData.card} onChange={handleChange} required placeholder="4242 4242 4242 4242" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="checkout-expiry" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Expiry</label>
                  <input id="checkout-expiry" type="text" name="expiry" value={formData.expiry} onChange={handleChange} required placeholder="MM/YY" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }} />
                </div>
                <div>
                  <label htmlFor="checkout-cvv" className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>CVV</label>
                  <input id="checkout-cvv" type="text" name="cvv" value={formData.cvv} onChange={handleChange} required placeholder="123" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }} />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setCurrentStep(2)} className="h-10 px-4 rounded-lg text-sm font-medium" style={{ border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}>Back</button>
                <button type="submit" className="flex-1 h-10 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-contrast)' }}>Place order — ${total.toFixed(2)}</button>
              </div>
              <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>Simulated checkout. No real payment processed.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Checkout;

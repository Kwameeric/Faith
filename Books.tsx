import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, CheckCircle2, BookOpen, CreditCard, Smartphone, Building2, Plus, Minus, Trash2, X, ArrowRight } from 'lucide-react';
import { useChurch, BookPurchaseItem } from '../context/ChurchContext';
import { useCurrency } from '../context/CurrencyContext';
import MoMoSection from '../components/MoMoSection';
import BankTransferSection from '../components/BankTransferSection';

type CartItem = { bookId: string; quantity: number };

export default function Books() {
  const { data, submitBookPurchase } = useChurch();
  const { formatMoney } = useCurrency();
  const [searchParams] = useSearchParams();
  const featuredBookId = searchParams.get('book');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedItems, setSubmittedItems] = useState<BookPurchaseItem[]>([]);

  // Auto-add featured book when arriving from home page
  useEffect(() => {
    if (featuredBookId && data.books.find(b => b.id === featuredBookId)) {
      addToCart(featuredBookId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredBookId, data.books]);

  const getBook = (id: string) => data.books.find(b => b.id === id);

  // Format price with currency symbol (Ghana Cedi ₵)
  const formatPrice = (amount: number, bookId?: string): string => {
    return formatMoney(amount);
  };

  const addToCart = (bookId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.bookId === bookId);
      if (existing) {
        return prev.map(i => i.bookId === bookId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { bookId, quantity: 1 }];
    });
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prev => prev.map(i => i.bookId === bookId ? { ...i, quantity } : i));
  };

  const removeFromCart = (bookId: string) => {
    setCart(prev => prev.filter(i => i.bookId !== bookId));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () =>
    cart.reduce((sum, item) => {
      const book = getBook(item.bookId);
      return sum + (book ? book.price * item.quantity : 0);
    }, 0);

  const getCartItemCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartItems = (): BookPurchaseItem[] =>
    cart.map(item => {
      const book = getBook(item.bookId);
      return {
        bookId: item.bookId,
        bookTitle: book?.title || '',
        quantity: item.quantity,
        price: book?.price || 0,
      };
    });

  const shipping = getCartTotal() >= 50 || getCartTotal() === 0 ? 0 : 5;
  const total = getCartTotal() + shipping;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckout(true);
    setMobileCartOpen(false);
    setTimeout(() => {
      document.getElementById('checkout-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || cart.length === 0) return;
    const items = getCartItems();
    submitBookPurchase(
      {
        items,
        totalPrice: total,
        ...form,
        paymentMethod,
      },
      items
    );
    setSubmittedItems(items);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAll = () => {
    setSubmitted(false);
    setSubmittedItems([]);
    setForm({ fullName: '', email: '', phone: '', shippingAddress: '', message: '' });
    setCart([]);
    setShowCheckout(false);
  };

  // Success screen
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 sm:p-10 shadow-xl border border-amber-100">
          <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Order Placed Successfully!</h1>
          <p className="text-lg text-slate-700 mb-6">
            Thank you, <span className="font-semibold text-amber-700">{form.fullName}</span>! Your order for {submittedItems.length} {submittedItems.length === 1 ? 'book' : 'books'} has been received.
          </p>

          <div className="bg-white rounded-2xl p-5 shadow text-left mb-6 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Order Summary</h3>
            {submittedItems.map((item, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-semibold text-sm">{item.bookTitle}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity} × {formatPrice(item.price, item.bookId)}</p>
                </div>
                <span className="font-bold text-sm">{formatPrice(item.price * item.quantity, item.bookId)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t-2 border-slate-200 pt-3">
              <span className="font-bold">Total</span>
              <span className="font-bold text-amber-700 text-lg">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 text-sm">Payment Method</span>
              <span className="font-semibold text-sm capitalize">{paymentMethod}</span>
            </div>
          </div>

          <div className="bg-amber-100 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 text-left mb-6">
            <p className="font-semibold mb-1">📋 Next Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Complete payment using the method you selected</li>
              <li>Use reference: <span className="font-mono font-bold">BOOK-ORDER-{Date.now().toString().slice(-6)}</span></li>
              <li>We'll confirm receipt via email and ship your books</li>
            </ol>
          </div>

          <button
            onClick={resetAll}
            className="inline-block px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-medium"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  const cartCount = getCartItemCount();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-sm mb-4">
            <BookOpen className="h-4 w-4" /> Official Book Store
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3">Books by {data.founder.name.split(' ').slice(0, 2).join(' ')}</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base sm:text-lg">Mix & match from our collection — add as many books as you like to your cart.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Books Grid */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-5">Browse Our Collection</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {data.books.map(book => {
                const inCart = cart.find(i => i.bookId === book.id);
                return (
                  <div key={book.id} className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition border-2 ${inCart ? 'border-emerald-500 ring-4 ring-emerald-100' : 'border-transparent hover:-translate-y-1'}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute top-2 right-2 bg-amber-500 text-slate-900 font-bold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm shadow-lg">
                        {book.currency || '₵'}{book.price}
                      </div>
                      {inCart && (
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shadow">
                          {inCart.quantity}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1 line-clamp-2">{book.title}</h3>
                      <p className="text-xs text-amber-700 font-medium mb-1 line-clamp-1">by {book.author}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 hidden sm:block mb-3">{book.description}</p>
                      <button
                        onClick={() => addToCart(book.id)}
                        className={`w-full py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-1.5 ${
                          inCart
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border border-emerald-300'
                            : 'bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900'
                        }`}
                      >
                        {inCart ? (
                          <><Plus className="h-3.5 w-3.5" /> Add Another</>
                        ) : (
                          <><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Cart - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <CartContent
              cart={cart}
              getBook={getBook}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              cartTotal={getCartTotal()}
              shipping={shipping}
              total={total}
              cartCount={cartCount}
              onCheckout={handleCheckout}
              formatPrice={formatPrice}
            />
          </div>
        </aside>
        </div>

        {/* Checkout Form */}
        {showCheckout && cart.length > 0 && (
          <div id="checkout-form" className="mt-10 scroll-mt-20">
            <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl shadow-2xl border border-amber-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 text-white">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <CreditCard className="h-6 w-6" /> Complete Your Order
                </h3>
                <p className="text-amber-50 text-sm mt-1">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} · Total: {formatPrice(total)}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Full Name *</label>
                    <input required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="John Doe" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 123 4567" className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Shipping Address *</label>
                  <textarea required value={form.shippingAddress} onChange={e => setForm(f => ({ ...f, shippingAddress: e.target.value }))} placeholder="Street, City, State, ZIP, Country" rows={2} className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm resize-none" />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { v: 'momo', l: 'MoMo', Icon: Smartphone },
                      { v: 'bank', l: 'Bank', Icon: Building2 },
                      { v: 'paypal', l: 'PayPal', Icon: CreditCard },
                      { v: 'card', l: 'Card', Icon: CreditCard },
                    ].map(o => (
                      <button
                        key={o.v}
                        type="button"
                        onClick={() => setPaymentMethod(o.v)}
                        className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold border-2 transition ${
                          paymentMethod === o.v
                            ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-amber-500'
                        }`}
                      >
                        <o.Icon className="h-4 w-4" /> {o.l}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Order note or special request (optional)"
                  rows={2}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm resize-none"
                />

                <div className="bg-white rounded-xl p-4 border border-amber-200">
                  <h4 className="font-bold text-slate-900 mb-2 text-sm">Order Summary</h4>
                  <div className="space-y-1.5 text-sm">
                    {cart.map(item => {
                      const book = getBook(item.bookId);
                      if (!book) return null;
                      return (
                        <div key={item.bookId} className="flex justify-between">
                          <span className="text-slate-700">{book.title} × {item.quantity}</span>
                          <span className="font-semibold">{formatPrice(book.price * item.quantity, book.id)}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-semibold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t-2 border-slate-300 text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-amber-700">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5" /> Place Order · {cart[0] && getBook(cart[0].bookId)?.currency || '₵'}{total}
                </button>

                <p className="text-xs text-center text-slate-500">📦 Free shipping on orders over {formatMoney(500)} · 🔒 Secure payment · 🌍 Worldwide delivery</p>
              </form>
            </div>

            {/* Payment Methods Detail */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-slate-900 mb-5 text-center">Payment Options</h3>
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <MoMoSection variant="compact" number={data.momoNumber} name={data.momoName} network={data.momoNetwork} />
                <BankTransferSection
                  variant="compact"
                  bankName={data.bankName}
                  accountName={data.accountName}
                  accountNumber={data.accountNumber}
                  paymentLink={data.paymentLink}
                  reference="BOOK-ORDER"
                />
              </div>
              {data.paypalLink && (
                <div className="text-center">
                  <a href={data.paypalLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl px-8 py-5 shadow-xl hover:shadow-2xl transition">
                    <p className="text-2xl mb-1">💙</p>
                    <h3 className="font-bold text-lg">PayPal Giving</h3>
                    <p className="text-xs text-blue-100 mt-1">International payments welcome</p>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Cart Bottom Bar */}
      {cartCount > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-amber-500 shadow-2xl p-3">
          <button
            onClick={() => setMobileCartOpen(true)}
            className="w-full flex items-center justify-between bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl py-3 px-4 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-white text-amber-600 text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">{cartCount}</span>
              </div>
              <span>View Cart</span>
            </div>
            <span className="text-lg">{formatPrice(total)}</span>
          </button>
        </div>
      )}

      {/* Mobile Cart Drawer */}
      {mobileCartOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setMobileCartOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-lg">Your Cart ({cartCount})</h3>
              <button onClick={() => setMobileCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <CartContent
              cart={cart}
              getBook={getBook}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              cartTotal={getCartTotal()}
              shipping={shipping}
              total={total}
              cartCount={cartCount}
              onCheckout={handleCheckout}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CartContent({ cart, getBook, updateQuantity, removeFromCart, clearCart, cartTotal, shipping, total, cartCount, onCheckout, formatPrice }: {
  cart: CartItem[];
  getBook: (id: string) => any;
  updateQuantity: (id: string, q: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  shipping: number;
  total: number;
  cartCount: number;
  onCheckout: () => void;
  formatPrice: (amount: number, bookId?: string) => string;
}) {
  if (cartCount === 0) {
    return (
      <div className="p-8 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-slate-300 mb-3" />
        <h3 className="font-bold text-slate-900 text-lg mb-1">Your Cart is Empty</h3>
        <p className="text-sm text-slate-500">Add books to get started</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-amber-600" /> Your Cart ({cartCount})
        </h3>
        <button onClick={clearCart} className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded">
          Clear
        </button>
      </div>

      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {cart.map(item => {
          const book = getBook(item.bookId);
          if (!book) return null;
          return (
            <div key={item.bookId} className="flex gap-3 bg-slate-50 rounded-xl p-2">
              <img src={book.cover} alt={book.title} className="h-20 w-14 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-900 line-clamp-1">{book.title}</p>
                <p className="text-xs text-amber-700">{formatPrice(book.price, book.id)} each</p>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => updateQuantity(item.bookId, item.quantity - 1)} className="h-6 w-6 rounded border border-slate-300 hover:bg-white flex items-center justify-center">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.bookId, item.quantity + 1)} className="h-6 w-6 rounded border border-slate-300 hover:bg-white flex items-center justify-center">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeFromCart(item.bookId)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                  <Trash2 className="h-4 w-4" />
                </button>
                <p className="font-bold text-sm">{formatPrice(book.price * item.quantity, book.id)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-1.5 text-sm border-t border-slate-200 pt-3">
        <div className="flex justify-between">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-semibold">{formatPrice(cartTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Shipping</span>
          <span className="font-semibold">{shipping === 0 ? <span className="text-emerald-600">FREE</span> : formatPrice(shipping)}</span>
        </div>
        {cartTotal < 50 && cartTotal > 0 && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg">
            💡 Add {formatPrice(Math.max(500 - cartTotal, 0))} more for FREE shipping!
          </p>
        )}
        <div className="flex justify-between text-lg font-bold border-t border-slate-300 pt-2">
          <span>Total</span>
          <span className="text-amber-700">{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
      >
        Proceed to Checkout <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

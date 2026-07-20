'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  IceCream, 
  CreditCard, 
  ShoppingBag, 
  History, 
  MessageSquare, 
  LogOut, 
  FileText, 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Eye, 
  Info,
  ChevronRight,
  TrendingUp,
  Percent,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CartItem } from '@/types';
import { useToastTheme } from '@/components/providers/toast-theme-provider';

interface ProductData {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  flavor: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  isAvailable: boolean;
}

interface CatalogClientProps {
  initialProducts: ProductData[];
  userName: string;
  storeName: string;
  dbError?: string | null;
}

const SUBCATEGORY_ORDER = [
  'Regular',
  'Classic',
  'Special',
  'Natural',
  'Exotic',
  'Exotic Special',
  'Sugar Free',
];

export default function CatalogClient({ initialProducts, userName, storeName, dbError }: CatalogClientProps) {
  const router = useRouter();
  const { showToast } = useToastTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('jojo_cart_items');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as CartItem[];
        const validIds = new Set(initialProducts.map(p => p.id));
        const validCart = parsed.filter(item => validIds.has(item.productId));
        if (validCart.length !== parsed.length) {
          localStorage.setItem('jojo_cart_items', JSON.stringify(validCart));
        }
        setCart(validCart);
      } catch (e) {
        console.error('Failed to parse cart items:', e);
      }
    }
  }, [initialProducts]);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('jojo_cart_items', JSON.stringify(updatedCart));
  };

  const addToCart = (product: ProductData) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        showToast(`Cannot exceed total available stock (${product.stock})`, 'error');
        return; 
      }
      const updatedCart = cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCartToStorage(updatedCart);
      showToast(`Increased quantity of ${product.name}`, 'success');
    } else {
      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
        flavor: product.flavor
      };
      saveCartToStorage([...cart, newItem]);
      showToast(`Added ${product.name} to cart`, 'success');
    }
  };

  const decrementQuantity = (productId: string) => {
    const existingItem = cart.find(item => item.productId === productId);
    if (!existingItem) return;

    if (existingItem.quantity <= 1) {
      const updatedCart = cart.filter(item => item.productId !== productId);
      saveCartToStorage(updatedCart);
      showToast(`Removed item from cart`, 'info');
    } else {
      const updatedCart = cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      saveCartToStorage(updatedCart);
      showToast(`Decreased quantity`, 'info');
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    saveCartToStorage(updatedCart);
    showToast(`Removed item from cart`, 'info');
  };

  const filteredProducts = initialProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.flavor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartGST = cartSubtotal * 0.18;
  const cartTotal = cartSubtotal + cartGST;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    router.push('/portal/checkout');
  };

  const categories = [
    { value: 'ALL', label: 'All Scoops' },
    { value: 'ICE_CREAM', label: 'Tubs & Scoops' },
    { value: 'EXOTIC_CUP', label: 'Exotic Sundaes' },
  ];

  const groupedProducts = SUBCATEGORY_ORDER.reduce((acc, subcat) => {
    const items = filteredProducts.filter(p => p.subcategory === subcat);
    if (items.length > 0) {
      acc.push({ subcategory: subcat, products: items });
    }
    return acc;
  }, [] as { subcategory: string; products: ProductData[] }[]);

  return (
    <div className="min-h-screen flex bg-[#FFFDF9] dark:bg-[#0E0709] font-sans relative overflow-x-hidden">
      
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 border-r border-border bg-card hidden lg:flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-border flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson">
            <IceCream size={20} className="stroke-[2.5]" />
          </div>
          <span className="font-extrabold tracking-tight text-md uppercase text-foreground">
            JoJo <span className="text-brand-crimson">Portal</span>
          </span>
        </div>

        <nav className="p-4 flex-1 space-y-1">
          <Link href="/portal" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <CreditCard size={18} />
            Dashboard
          </Link>
          <Link href="/portal/catalog" className="flex items-center gap-3 px-4 py-3 bg-secondary text-secondary-foreground font-bold rounded-2xl text-sm transition-all">
            <ShoppingBag size={18} />
            Order Catalog
          </Link>
          <Link href="/portal/orders" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <History size={18} />
            Order History
          </Link>
          <Link href="/portal/proforma-invoices" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <FileText size={18} />
            Proforma Invoices
          </Link>
          <Link href="/portal/messages" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-brand-crimson hover:bg-brand-pink/30 rounded-2xl text-sm transition-all">
            <MessageSquare size={18} />
            HQ Messages
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="p-3 bg-muted/40 rounded-2xl border border-border/50 flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-crimson text-white flex items-center justify-center text-xs font-bold shadow-inner">
              {userName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{userName}</p>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Franchise</span>
            </div>
          </div>
          <button 
            onClick={() => {
              const form = document.createElement('form');
              form.method = 'POST';
              form.action = '/api/auth/signout';
              document.body.appendChild(form);
              form.submit();
            }}
            className="w-full py-3 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-0 bg-transparent"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-20 border-b border-border px-6 flex items-center justify-between bg-card flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson lg:hidden">
              <IceCream size={16} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Order Catalog</h1>
              <p className="text-xs text-muted-foreground">{storeName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCartOpen(true)}
              className="px-5 py-2.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-full text-xs shadow-md shadow-brand-crimson/15 flex items-center gap-2 hover:scale-[1.03] transition-all cursor-pointer relative"
            >
              <ShoppingCart size={14} className="stroke-[2.5]" />
              <span>Cart ({cartItemCount})</span>
              {cartItemCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-yellow-400 absolute top-1 right-1 border-2 border-brand-crimson animate-pulse" />
              )}
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          
          {dbError && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400">
              <strong>Database Error:</strong> {dbError}
            </div>
          )}

          {/* Search Bar and Categories Tabs */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 rounded-3xl bg-card border border-border shadow-xs">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flavors or scoops (e.g. Belgian...)"
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setActiveCategory(c.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border-0 ${
                    activeCategory === c.value 
                      ? 'bg-brand-crimson text-white shadow-sm'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category-wise Product Sections */}
          {groupedProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3 border border-dashed border-border/80 rounded-3xl bg-muted/5">
              <ShoppingBag size={48} className="text-muted-foreground mx-auto opacity-35 animate-float" />
              <h3 className="text-md font-bold text-foreground">No products found</h3>
              <p className="text-xs text-muted-foreground/80 max-w-xs mx-auto">
                We couldn&apos;t find any items matching your query &ldquo;{searchQuery}&rdquo;. Try another search term.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {groupedProducts.map((group) => (
                <div key={group.subcategory} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-black text-foreground tracking-tight">{group.subcategory}</h2>
                    <span className="h-px flex-1 bg-border/60" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {group.products.length} {group.products.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.products.map((p) => {
                      const inCart = cart.find(item => item.productId === p.id);
                      return (
                        <div 
                          key={p.id} 
                          className="group rounded-3xl border border-border p-5 bg-card hover:shadow-lg hover:border-brand-crimson/15 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="w-full h-40 rounded-2xl bg-brand-pink/50 flex items-center justify-center text-brand-crimson mb-4 relative overflow-hidden group-hover:scale-[1.01] transition-all">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded-2xl" />
                              ) : (
                                <IceCream size={48} className="stroke-[1.5]" />
                              )}
                              <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-white/95 dark:bg-card/95 text-brand-crimson font-bold rounded-lg text-[9px] uppercase tracking-wider shadow-xs">
                                {p.subcategory}
                              </span>
                              
                              {p.stock <= 0 ? (
                                <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-red-600 text-white font-bold rounded text-[8px] uppercase tracking-wide">
                                  Out of Stock
                                </span>
                              ) : p.stock < 10 ? (
                                <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-yellow-500 text-white font-bold rounded text-[8px] uppercase tracking-wide">
                                  Low Stock ({p.stock})
                                </span>
                              ) : null}
                            </div>

                            <div className="flex justify-between items-start gap-2">
                              <h3 className="text-sm font-bold text-foreground line-clamp-1">{p.name}</h3>
                              <button 
                                onClick={() => setSelectedProduct(p)}
                                className="p-1 hover:bg-muted rounded-md text-muted-foreground hover:text-brand-crimson transition-all cursor-pointer border-0 bg-transparent"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-semibold block mt-0.5">Flavor: {p.flavor}</span>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-2">{p.description}</p>
                          </div>

                          <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-5">
                            <span className="text-md font-extrabold text-brand-crimson">
                              ₹{p.price.toFixed(2)}
                            </span>

                            {p.stock <= 0 ? (
                              <button 
                                disabled 
                                className="px-3.5 py-2 bg-muted text-muted-foreground font-bold rounded-xl text-xs cursor-not-allowed border-0"
                              >
                                Unavailable
                              </button>
                            ) : inCart ? (
                              <div className="flex items-center border border-brand-crimson/30 rounded-xl bg-secondary overflow-hidden">
                                <button 
                                  onClick={() => decrementQuantity(p.id)}
                                  className="px-2 py-2 hover:bg-brand-crimson/10 text-brand-crimson cursor-pointer border-0 bg-transparent flex items-center justify-center"
                                >
                                  <Minus size={12} className="stroke-[2.5]" />
                                </button>
                                <span className="px-2 text-xs font-black text-secondary-foreground min-w-[20px] text-center">
                                  {inCart.quantity}
                                </span>
                                <button 
                                  onClick={() => addToCart(p)}
                                  className="px-2 py-2 hover:bg-brand-crimson/10 text-brand-crimson cursor-pointer border-0 bg-transparent flex items-center justify-center"
                                >
                                  <Plus size={12} className="stroke-[2.5]" />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => addToCart(p)}
                                className="px-4 py-2 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border-0 shadow-sm shadow-brand-crimson/10"
                              >
                                <Plus size={12} className="stroke-[2.5]" />
                                Add Stock
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ===== PRODUCT DETAILS MODAL ===== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in-down">
          <div className="w-full max-w-lg p-6 bg-card border border-border rounded-3xl shadow-2xl space-y-6 relative animate-slide-up">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
            >
              <X size={18} />
            </button>

            <div className="flex gap-4 items-start">
              <div className="w-20 h-20 rounded-2xl bg-brand-pink flex items-center justify-center text-brand-crimson flex-shrink-0">
                <IceCream size={36} className="stroke-[1.5]" />
              </div>
              <div>
                <span className="text-[10px] bg-brand-pink text-brand-crimson font-black px-2 py-0.5 rounded-lg uppercase tracking-wider">
                  {selectedProduct.subcategory}
                </span>
                <h2 className="text-xl font-bold text-foreground mt-1.5">{selectedProduct.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Flavor notes: {selectedProduct.flavor}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Product Specifications</span>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedProduct.description || 'No additional specifications provided for this wholesale batch. Premium pure-milk dessert.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-2xl border border-border/50 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Stock Status</span>
                  <span className={`font-bold block mt-0.5 ${
                    selectedProduct.stock <= 0 ? 'text-red-500' :
                    selectedProduct.stock < 10 ? 'text-yellow-500' : 'text-foreground'
                  }`}>
                    {selectedProduct.stock <= 0 ? 'Out of Stock' : `${selectedProduct.stock} Tubs Available`}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase block">Unit Cost (Excl. GST)</span>
                  <span className="text-sm font-black text-brand-crimson block mt-0.5">₹{selectedProduct.price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/60">
              <div className="text-left">
                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Final Unit Price (Incl. 18% GST)</span>
                <span className="text-md font-extrabold text-foreground">₹{(selectedProduct.price * 1.18).toFixed(2)}</span>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={selectedProduct.stock <= 0}
                  className="px-6 py-3.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-crimson/15 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-0"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== SHOPPING CART DRAWER ===== */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300 ${
        cartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <header className="h-20 border-b border-border px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-foreground">
            <ShoppingCart size={18} className="text-brand-crimson stroke-[2.5]" />
            <h2 className="text-md font-bold uppercase tracking-wider">Your Order Drawer</h2>
          </div>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-1.5 hover:bg-muted text-muted-foreground rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
          >
            <X size={18} />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-3">
            <ShoppingCart size={48} className="text-muted-foreground opacity-30 animate-float" />
            <h3 className="text-md font-bold text-foreground">Cart is empty</h3>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Your bulk order drawer is empty. Browse the catalog to add ice creams and shakes.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-border/60">
              {cart.map((item) => (
                <div key={item.productId} className="py-4 first:pt-0 last:pb-0 flex gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-pink flex items-center justify-center text-brand-crimson flex-shrink-0">
                    <IceCream size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs font-bold text-foreground truncate">{item.name}</h4>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="text-muted-foreground hover:text-red-500 cursor-pointer border-0 bg-transparent"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold">Flavor: {item.flavor}</span>
                    <div className="flex items-center justify-between mt-2.5">
                      <span className="text-xs font-bold text-brand-crimson">₹{item.price.toFixed(2)} / tub</span>
                      
                      <div className="flex items-center border border-border bg-muted/40 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => decrementQuantity(item.productId)}
                          className="px-1.5 py-1 text-muted-foreground hover:bg-brand-pink hover:text-brand-crimson cursor-pointer border-0 bg-transparent"
                        >
                          <Minus size={10} className="stroke-[2.5]" />
                        </button>
                        <span className="px-2 text-[10px] font-black text-foreground min-w-[15px] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => addToCart(initialProducts.find(p => p.id === item.productId)!)}
                          className="px-1.5 py-1 text-muted-foreground hover:bg-brand-pink hover:text-brand-crimson cursor-pointer border-0 bg-transparent"
                        >
                          <Plus size={10} className="stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-border bg-muted/20 space-y-4 flex-shrink-0">
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Batch Subtotal</span>
                  <span className="font-bold text-foreground">₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST Liability (18%)</span>
                  <span className="font-bold text-foreground">₹{cartGST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-3 text-sm font-bold text-foreground">
                  <span>Total Amount (Incl. Tax)</span>
                  <span className="text-md font-black text-brand-crimson">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-brand-pink/50 rounded-xl border border-brand-crimson/10 text-[9px] text-brand-maroon leading-relaxed flex gap-2">
                <Info size={14} className="flex-shrink-0 text-brand-crimson" />
                <span>By checking out, you authorize adding the total cost to your store outstanding balance or settling via payment gateway.</span>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 hover:gap-3 transition-all cursor-pointer shadow-lg shadow-brand-crimson/15 border-0"
              >
                Proceed to Checkout
                <ChevronRight size={14} className="stroke-[2.5]" />
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}

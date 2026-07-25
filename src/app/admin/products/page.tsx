import React from 'react';
import LogoutButton from '@/components/logout-button';
import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { 
  IceCream, 
  Layers, 
  Users, 
  ShoppingBag, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle,
  XCircle,
  DollarSign,
  Boxes,
  AlertTriangle,
  PackageOpen
} from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '@/components/admin-sidebar';
import { deleteProduct, toggleProductAvailability } from './actions';

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/portal');
  }

  const products = await prisma.product.findMany({
    orderBy: { category: 'asc' }
  });

  return (
    <div className="min-h-screen flex bg-[#FFFDF9] dark:bg-[#0E0709] font-sans">
      <AdminSidebar user={session.user} />

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card flex-shrink-0">
          <div>
            <h1 className="text-md font-bold text-foreground tracking-tight">Flavor Catalog</h1>
            <p className="text-[11px] text-muted-foreground">Manage ice cream flavors, stock, and availability for franchise portals.</p>
          </div>
          <div className="flex gap-2">
            <Link 
              href="/admin/products/new" 
              className="px-4 py-2 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition-transform cursor-pointer shadow-md shadow-brand-crimson/15"
            >
              <Plus size={14} className="stroke-[2.5]" />
              Add Flavor
            </Link>
          </div>
        </header>

        {/* Product Registry table */}
        <div className="p-6 max-w-7xl w-full mx-auto">
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border/60">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Boxes size={16} className="text-brand-crimson" />
                Product Ledger
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <IceCream size={48} className="text-muted-foreground mx-auto opacity-35" />
                <p className="text-sm font-bold text-muted-foreground">Catalog is empty</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Click the &ldquo;Add Flavor&rdquo; button above to create your first catalog flavor.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-border/60 text-xs font-bold text-muted-foreground pb-3">
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3 w-32">Category</th>
                      <th className="pb-3 w-32">Subcategory</th>
                      <th className="pb-3 w-32">Flavor Profile</th>
                      <th className="pb-3 w-28 text-right">Price (Ex. GST)</th>
                      <th className="pb-3 w-28 text-right">Stock</th>
                      <th className="pb-3 w-36 text-center">Status</th>
                      <th className="pb-3 text-center w-48">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {products.map((product) => {
                      const stockVal = product.stock ?? 0;
                      const isOutOfStock = !product.isAvailable || stockVal <= 0;
                      const isLowStock = product.isAvailable && stockVal > 0 && stockVal <= 10;

                      return (
                        <tr key={product.id} className="hover:bg-muted/5 transition-colors">
                          <td className="py-4">
                            <span className="font-bold text-foreground block">{product.name}</span>
                            <span className="text-[10px] text-muted-foreground block truncate max-w-xs mt-0.5">{product.description}</span>
                          </td>
                          <td className="py-4 text-xs font-bold text-muted-foreground uppercase tracking-wide">
                            {product.category.replace('_', ' ')}
                          </td>
                          <td className="py-4 text-xs text-foreground font-semibold">
                            {product.subcategory}
                          </td>
                          <td className="py-4 text-xs text-foreground font-semibold">
                            {product.flavor}
                          </td>
                          <td className="py-4 text-right font-extrabold text-brand-crimson font-mono">
                            ₹{Number(product.price).toFixed(2)}
                          </td>
                          <td className="py-4 text-right font-bold text-foreground font-mono">
                            {stockVal} units
                          </td>
                          <td className="py-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider ${
                              isOutOfStock ? 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400' :
                              isLowStock ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400' :
                              'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                            }`}>
                              {isOutOfStock && <XCircle size={10} />}
                              {isLowStock && <AlertTriangle size={10} />}
                              {!isOutOfStock && !isLowStock && <CheckCircle size={10} />}
                              {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link 
                                href={`/admin/products/${product.id}/edit`}
                                className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-brand-crimson transition-colors"
                              >
                                <Edit3 size={14} />
                              </Link>
                              <form action={toggleProductAvailability.bind(null, product.id, product.isAvailable ? false : true)}>
                                <button 
                                  type="submit" 
                                  title={product.isAvailable ? 'Mark as Out of Stock' : 'Mark as In Stock'}
                                  className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-brand-crimson transition-colors cursor-pointer border-0 bg-transparent"
                                >
                                  {product.isAvailable ? <PackageOpen size={14} /> : <CheckCircle size={14} />}
                                </button>
                              </form>
                              <form action={deleteProduct.bind(null, product.id)}>
                                <button 
                                  type="submit" 
                                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-muted-foreground hover:text-red-600 transition-colors cursor-pointer border-0 bg-transparent"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

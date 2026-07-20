import React from 'react';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { updateProduct } from '../../actions';
import { IceCream, ArrowLeft, Save, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();

  // Guard routing
  if (!session?.user) {
    redirect('/auth/signin');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/portal');
  }

  const { id } = await params;

  // Fetch product
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md p-8 bg-card border border-border rounded-3xl text-center space-y-4 shadow-lg">
          <ShieldAlert size={48} className="text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Product Not Found</h1>
          <p className="text-sm text-muted-foreground">
            We could not find the menu product listing you are attempting to edit. It may have been deleted.
          </p>
          <Link href="/admin/products" className="inline-block px-5 py-2.5 bg-brand-crimson text-white font-bold rounded-xl text-xs">
            Back to Registry
          </Link>
        </div>
      </div>
    );
  }

  // Handle Form Submission
  async function submitAction(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const subcategory = formData.get('subcategory') as string;
    const flavor = formData.get('flavor') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string, 10);
    const imageUrl = formData.get('imageUrl') as string;
    const isAvailable = formData.get('isAvailable') === 'true';

    await updateProduct(id, {
      name,
      category,
      subcategory,
      flavor,
      description,
      price,
      stock,
      imageUrl,
      isAvailable
    });

    redirect('/admin/products');
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] dark:bg-[#0E0709] font-sans pb-16">
      
      {/* Header bar */}
      <header className="h-20 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-40">
        <Link 
          href="/admin/products"
          className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-brand-crimson transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Catalog
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-pink flex items-center justify-center text-brand-crimson">
            <IceCream size={16} />
          </div>
          <span className="font-extrabold text-sm uppercase text-foreground">
            HQ Menu Editor
          </span>
        </div>
        <div className="w-16" />
      </header>

      {/* Form Container */}
      <div className="p-6 max-w-2xl mx-auto mt-6">
        <div className="p-8 rounded-[32px] border border-border bg-card shadow-sm space-y-6">
          <div>
            <h2 className="text-md font-bold text-foreground">Edit Product: {product.name}</h2>
            <p className="text-xs text-muted-foreground">Adjust specifications, catalog status, and pricing details.</p>
          </div>

          <form action={submitAction} className="space-y-5 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Product Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  defaultValue={product.name}
                  placeholder="e.g. Belgian Chocolate Truffle"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Category Class</label>
                <select
                  required
                  name="category"
                  defaultValue={product.category}
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson text-xs transition-all"
                >
                  <option value="ICE_CREAM">Tubs & Scoops (Ice Cream)</option>
                  <option value="MILKSHAKE">Blended Milkshakes</option>
                  <option value="EXOTIC_CUP">Exotic Cups & Sundaes</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Subcategory</label>
                <select
                  required
                  name="subcategory"
                  defaultValue={product.subcategory}
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson text-xs transition-all"
                >
                  <option value="Regular">Regular</option>
                  <option value="Classic">Classic</option>
                  <option value="Special">Special</option>
                  <option value="Natural">Natural</option>
                  <option value="Exotic">Exotic</option>
                  <option value="Exotic Special">Exotic Special</option>
                  <option value="Sugar Free">Sugar Free</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Primary Flavor Profile</label>
                <input
                  type="text"
                  required
                  name="flavor"
                  defaultValue={product.flavor}
                  placeholder="e.g. Dark Chocolate"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Wholesale Price (Excl. GST)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  name="price"
                  defaultValue={Number(product.price)}
                  placeholder="e.g. 250.00"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Stock Quantity</label>
                <input
                  type="number"
                  required
                  name="stock"
                  defaultValue={product.stock}
                  placeholder="e.g. 100"
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Image Path</label>
              <input
                type="text"
                required
                name="imageUrl"
                defaultValue={product.imageUrl || ''}
                placeholder="e.g. /images/flavors/Vanilla.jpeg"
                className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs transition-all"
              />
              <p className="text-[10px] text-muted-foreground">Place images in public/images/flavors/ and enter the relative path.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Listing Availability</label>
                <select
                  required
                  name="isAvailable"
                  defaultValue={product.isAvailable ? 'true' : 'false'}
                  className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson text-xs transition-all"
                >
                  <option value="true">Enable (Show in Outlets Catalog)</option>
                  <option value="false">Disable (Hide from Catalog / Out of Stock)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest block">Product Specifications Description</label>
              <textarea
                required
                name="description"
                defaultValue={product.description || ''}
                rows={4}
                placeholder="Include details on ingredients, compliance and dry-ice guidelines."
                className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-crimson focus:border-transparent text-xs resize-none transition-all"
              />
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                className="px-6 py-3.5 bg-brand-crimson hover:bg-brand-crimson/95 text-white font-bold rounded-2xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border-0 shadow-md shadow-brand-crimson/15"
              >
                <Save size={12} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}

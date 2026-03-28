import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { SearchIcon, StarIcon, PlusIcon, EditIcon } from 'lucide-react';
import { usePublicProductsQuery, useMarketplaceSettingsQuery, useCategoriesQuery } from '../services/marketplace/hooks';
import { PublicLayout } from '../components/layout/PublicLayout';
import type { Product } from '../schemas/marketplace';

export function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { data: productsData, isLoading: isProductsLoading, error: productsError } = usePublicProductsQuery(selectedCategoryId || undefined);
  const { data: settings } = useMarketplaceSettingsQuery();
  const { data: categoriesData } = useCategoriesQuery();

  console.log('=== MARKETPLACE CATEGORY DEBUG ===');
  console.log('selectedCategoryId:', selectedCategoryId);
  console.log('categoriesData:', categoriesData);
  console.log('productsData:', productsData);
  console.log('=== END CATEGORY DEBUG ===');

  // Fallback mock data when API fails
  const mockProducts = [
    {
      id: '1',
      title: 'iPhone 13 Pro - 256GB',
      description: 'Excellent condition iPhone 13 Pro with 256GB storage. Minor scratches on the back, screen is pristine.',
      priceNaira: '450000',
      listingDays: 30,
      imageUrls: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400&h=300'],
      phoneNumber: '+2348000000001',
      facebookUrl: '',
      tiktokUrl: '',
      instagramUrl: '',
      otherUrl: '',
      status: 'ACTIVE' as const,
      active: true,
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: '1',
        firstName: 'Chinedu',
        lastName: 'Emeka',
        email: 'chinedu@example.com'
      }
    },
    {
      id: '2',
      title: 'MacBook Air M2',
      description: 'Brand new MacBook Air M2, 8GB RAM, 256GB SSD. Still under warranty.',
      priceNaira: '850000',
      listingDays: 30,
      imageUrls: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400&h=300'],
      phoneNumber: '+2348000000002',
      facebookUrl: '',
      tiktokUrl: '',
      instagramUrl: '',
      otherUrl: '',
      status: 'ACTIVE' as const,
      active: true,
      userId: '2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: '2',
        firstName: 'TechHub',
        lastName: 'NG',
        email: 'techhub@example.com'
      }
    }
  ];

  const products: Product[] = productsData?.products || (productsError ? mockProducts : []);
  
  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategoryId || product.categoryId === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  return (
    <PublicLayout>
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="space-y-8 pb-12 md:pt-16 pt-6 px-4 max-w-7xl mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">
            Community Marketplace
          </h1>
          <p className="text-ink-secondary mt-2 text-lg">
            Buy and sell items securely using your Greener Pastures wallet
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative w-full md:w-80">
            <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
          </div>
          {false ? (
            <Link to="/login">
              <Button className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
            selectedCategoryId === null 
              ? 'bg-ink text-white shadow-md' 
              : 'bg-white text-ink-secondary border border-gray-200 hover:bg-surface'
          }`}
        >
          All Items
        </button>
        {categoriesData?.categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              selectedCategoryId === category.id 
                ? 'bg-ink text-white shadow-md' 
                : 'bg-white text-ink-secondary border border-gray-200 hover:bg-surface'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {isProductsLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-0 overflow-hidden flex flex-col h-full rounded-3xl border border-gray-100 shadow-sm">
              <Skeleton className="h-56" />
              <div className="p-6 flex flex-col flex-1 bg-white space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-ink mb-2">
            {searchTerm ? 'No products found' : 'No products available'}
          </h3>
          <p className="text-ink-secondary">
            {searchTerm ? 'Try adjusting your search terms' : 'Be the first to add a product to the marketplace'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            console.log('=== RENDERING PRODUCT ===');
            console.log('Product ID:', product.id);
            console.log('Product title:', product.title);
            console.log('Product imageUrls:', product.imageUrls);
            console.log('ImageUrls type:', typeof product.imageUrls);
            console.log('ImageUrls length:', product.imageUrls?.length);
            console.log('First image URL:', product.imageUrls?.[0]);
            console.log('=== END PRODUCT DEBUG ===');
            
            // Check if current user is the product owner
            const isOwner = false; // Public marketplace doesn't show edit options
            
            return (
            <Link key={product.id} to={`/marketplace/product/${product.id}`}>
              <Card
                hoverable
                className="p-0 overflow-hidden flex flex-col h-full group rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
              >
              
                <div className="h-56 overflow-hidden bg-surface relative">
                  {product.images && product.images.length > 0 && product.images[0]?.imagePath ? (
                    <img
                    src={product.images[0].imagePath}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : product.imageUrls && product.imageUrls.length > 0 && product.imageUrls[0] ? (
                    <img
                    src={product.imageUrls[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-400 text-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-white">
                  <h3 className="font-bold text-ink text-xl mb-2 line-clamp-1 group-hover:text-ajo-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-2xl font-black text-ink tracking-tight mb-6">
                    ₦{Number(product.priceNaira).toLocaleString()}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {isOwner && (
                        <Link to={`/marketplace/edit-product/${product.id}`} onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="p-1.5">
                            <EditIcon className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-700' 
                          : product.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {product.status}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            );
          })}
        </div>
      )}
      </motion.div>
    </PublicLayout>
  );
}
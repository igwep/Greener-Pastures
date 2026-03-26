import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { SearchIcon, StarIcon, PlusIcon } from 'lucide-react';
import { usePublicProductsQuery, useMarketplaceSettingsQuery } from '../services/marketplace/hooks';
import type { Product } from '../schemas/marketplace';

export function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: productsData, isLoading: isProductsLoading, error: productsError } = usePublicProductsQuery();
  const { data: settings } = useMarketplaceSettingsQuery();

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
  
  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="space-y-8 pb-12">
      
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
          <Link to="/marketplace/add-product">
            <Button className="flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {['All Items', 'Electronics', 'Fashion', 'Home', 'Vehicles'].map(
          (cat, i) =>
          <button
            key={i}
            className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-ink text-white shadow-md' : 'bg-white text-ink-secondary border border-gray-200 hover:bg-surface'}`}>
            
              {cat}
            </button>

        )}
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
          {filteredProducts.map((product) =>
          <Link key={product.id} to={`/marketplace/product/${product.id}`}>
              <Card
              hoverable
              className="p-0 overflow-hidden flex flex-col h-full group rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              
                <div className="h-56 overflow-hidden bg-surface relative">
                  {product.imageUrls[0] ? (
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
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-sm font-bold text-ink border border-gray-200">
                        {product.user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-medium text-ink-secondary">
                        {product.user ? `${product.user.firstName} ${product.user.lastName}`.charAt(0) + '.' : 'Unknown'}
                      </span>
                    </div>
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
              </Card>
            </Link>
          )}
        </div>
      )}
    </motion.div>);
}
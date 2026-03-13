import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchIcon, StarIcon } from 'lucide-react';
const products = [
{
  id: 1,
  title: 'iPhone 13 Pro - 256GB',
  price: 450000,
  seller: 'Chinedu E.',
  rating: 4.8,
  image:
  'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400&h=300'
},
{
  id: 2,
  title: 'MacBook Air M2',
  price: 850000,
  seller: 'TechHub NG',
  rating: 5.0,
  image:
  'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400&h=300'
},
{
  id: 3,
  title: 'AirPods Pro Gen 2',
  price: 180000,
  seller: 'GadgetStore',
  rating: 4.5,
  image:
  'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=400&h=300'
},
{
  id: 4,
  title: 'Nike Air Max 270',
  price: 65000,
  seller: 'SneakerHead',
  rating: 4.9,
  image:
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400&h=300'
},
{
  id: 5,
  title: 'PS5 Console Standard',
  price: 600000,
  seller: 'GameWorld',
  rating: 4.7,
  image:
  'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=400&h=300'
},
{
  id: 6,
  title: 'Samsung Galaxy S22',
  price: 380000,
  seller: 'MobileZone',
  rating: 4.6,
  image:
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400&h=300'
}];

export function MarketplacePage() {
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
        <div className="relative w-full md:w-80">
          <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-ajo-600/20 focus:border-ajo-600 outline-none transition-all shadow-sm" />
          
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) =>
        <Link key={product.id} to={`/product/${product.id}`}>
            <Card
            hoverable
            className="p-0 overflow-hidden flex flex-col h-full group rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            
              <div className="h-56 overflow-hidden bg-surface relative">
                <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-6 flex flex-col flex-1 bg-white">
                <h3 className="font-bold text-ink text-xl mb-2 line-clamp-1 group-hover:text-ajo-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-2xl font-black text-ink tracking-tight mb-6">
                  ₦{product.price.toLocaleString()}
                </p>

                <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-sm font-bold text-ink border border-gray-200">
                      {product.seller.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-ink-secondary">
                      {product.seller}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-ink bg-amber-50 px-2 py-1 rounded-md text-amber-700">
                    <StarIcon className="w-4 h-4 fill-current" />
                    {product.rating}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>
    </motion.div>);

}
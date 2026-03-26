import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  EyeIcon, 
  CameraIcon, 
  XIcon,
  PackageIcon,
  TrendingUpIcon,
  StarIcon
} from 'lucide-react';

// Mock user products data
const mockUserProducts = [
  {
    id: '1',
    title: 'iPhone 12 Pro Max',
    price: 420000,
    category: 'Electronics',
    description: 'Excellent condition iPhone 12 Pro Max, 256GB, Pacific Blue',
    images: ['https://images.unsplash.com/photo-1572886594635-af5f87cbe030?auto=format&fit=crop&q=80&w=400&h=300'],
    status: 'active',
    views: 245,
    rating: 4.5,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Nike Air Jordan 1',
    price: 85000,
    category: 'Fashion',
    description: 'Brand new Air Jordan 1 Retro High, size 42',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400&h=300'],
    status: 'active',
    views: 189,
    rating: 4.8,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'MacBook Pro M1',
    price: 650000,
    category: 'Electronics',
    description: 'MacBook Pro 13" M1 chip, 16GB RAM, 512GB SSD',
    images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400&h=300'],
    status: 'sold',
    views: 312,
    rating: 5.0,
    createdAt: '2024-01-10'
  }
];

type Product = typeof mockUserProducts[0];

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>(mockUserProducts);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: 'Electronics'
  });
  const [images, setImages] = useState<string[]>([]);

  const handleCreateProduct = () => {
    setIsCreateMode(true);
    setEditingProduct(null);
    setFormData({ title: '', price: '', description: '', category: 'Electronics' });
    setImages([]);
  };

  const handleEditProduct = (product: Product) => {
    setIsCreateMode(false);
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      description: product.description,
      category: product.category
    });
    setImages(product.images);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setImages(prev => [...prev, url]);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, price: Number(formData.price), images }
          : p
      ));
    } else {
      // Create new product
      const newProduct: Product = {
        id: Date.now().toString(),
        title: formData.title,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        images,
        status: 'active',
        views: 0,
        rating: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProducts(prev => [newProduct, ...prev]);
    }

    // Reset form
    setFormData({ title: '', price: '', description: '', category: 'Electronics' });
    setImages([]);
    setEditingProduct(null);
    setIsCreateMode(false);
  };

  const handleCancel = () => {
    setIsCreateMode(false);
    setEditingProduct(null);
    setFormData({ title: '', price: '', description: '', category: 'Electronics' });
    setImages([]);
  };

  const activeProducts = products.filter(p => p.status === 'active');
  const soldProducts = products.filter(p => p.status === 'sold');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ink">My Products</h2>
          <p className="text-ink-secondary mt-1">
            Manage your marketplace listings
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleCreateProduct}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 rounded-2xl border-none shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-ajo-50 rounded-xl flex items-center justify-center">
              <PackageIcon className="w-6 h-6 text-ajo-600" />
            </div>
            <span className="text-2xl font-bold text-ink">{products.length}</span>
          </div>
          <p className="text-sm text-ink-secondary">Total Products</p>
        </Card>

        <Card className="p-6 rounded-2xl border-none shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUpIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-ink">{activeProducts.length}</span>
          </div>
          <p className="text-sm text-ink-secondary">Active Listings</p>
        </Card>

        <Card className="p-6 rounded-2xl border-none shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <EyeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-ink">
              {products.reduce((sum, p) => sum + p.views, 0)}
            </span>
          </div>
          <p className="text-sm text-ink-secondary">Total Views</p>
        </Card>

        <Card className="p-6 rounded-2xl border-none shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-ink">
              {products.length > 0 
                ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
                : '0.0'
              }
            </span>
          </div>
          <p className="text-sm text-ink-secondary">Avg Rating</p>
        </Card>
      </div>

      {/* Create/Edit Product Form */}
      {(isCreateMode || editingProduct) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-6 rounded-3xl border-none shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-ink">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <XIcon className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-ink mb-3">
                  Product Images
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 6 && (
                    <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-ajo-400 transition-colors">
                      <CameraIcon className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Add Image</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    Product Title
                  </label>
                  <Input
                    placeholder="Enter product name"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-2">
                    Price (₦)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ajo-600/20 focus:border-ajo-600 outline-none transition-all"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home & Garden</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe your product..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ajo-600/20 focus:border-ajo-600 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingProduct ? 'Update Product' : 'List Product'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Products List */}
      {products.length === 0 && !isCreateMode ? (
        <Card className="p-12 rounded-3xl border-none shadow-sm text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-ink mb-2">No products yet</h3>
          <p className="text-ink-secondary mb-6">
            Start by adding your first product to the marketplace
          </p>
          <Button onClick={handleCreateProduct}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Active Products */}
          {activeProducts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-ink mb-4">Active Listings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-48 bg-surface relative">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant="success" className="text-xs">
                            Active
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-ink mb-2 line-clamp-1">
                          {product.title}
                        </h4>
                        <p className="text-xl font-bold text-ajo-600 mb-3">
                          ₦{product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center justify-between text-sm text-ink-secondary mb-4">
                          <span>{product.views} views</span>
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 fill-current text-amber-400" />
                            {product.rating}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEditProduct(product)}
                            className="flex-1"
                          >
                            <EditIcon className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <TrashIcon className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Sold Products */}
          {soldProducts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-ink mb-4">Sold Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {soldProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="overflow-hidden rounded-2xl border-none shadow-sm opacity-75">
                      <div className="h-48 bg-surface relative">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover grayscale"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant="neutral" className="text-xs">
                            Sold
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-ink mb-2 line-clamp-1">
                          {product.title}
                        </h4>
                        <p className="text-xl font-bold text-green-600 mb-3">
                          ₦{product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center justify-between text-sm text-ink-secondary">
                          <span>{product.views} views</span>
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 fill-current text-amber-400" />
                            {product.rating}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

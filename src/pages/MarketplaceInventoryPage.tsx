import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Modal';
import { MarketplaceInventorySkeleton } from '../components/skeleton/MarketplaceInventorySkeleton';
import { 
  PackageIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  PlusIcon,
  SearchIcon,
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  FilterIcon,
  Trash2Icon
} from 'lucide-react';
import { useMyProductsQuery, useDeleteProductMutation, useToggleProductActiveMutation } from '../services/marketplace/hooks';
import type { Product } from '../schemas/marketplace';
import { useToast } from '../contexts/ToastContext';

export function MarketplaceInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'REJECTED'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [toggleModalOpen, setToggleModalOpen] = useState(false);
  const [productToToggle, setProductToToggle] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const { data: productsData, isLoading: isProductsLoading } = useMyProductsQuery();
  const deleteProductMutation = useDeleteProductMutation();
  const toggleProductActiveMutation = useToggleProductActiveMutation();
  const toast = useToast();

  console.log('=== INVENTORY PAGE DEBUG ===');
  console.log('MarketplaceInventoryPage rendered!');
  console.log('isLoading:', isProductsLoading);
  console.log('productsData:', productsData);
  console.log('=== END INVENTORY DEBUG ===');

  // Mock data for development
  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'iPhone 13 Pro - 256GB',
      description: 'Excellent condition iPhone 13 Pro with 256GB storage. Minor scratches on the back, screen is pristine.',
      priceNaira: '450000',
      listingDays: 30,
      imageUrls: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400&h=300'],
      phoneNumber: '+2348000000001',
      facebookUrl: 'https://facebook.com/example',
      tiktokUrl: 'https://tiktok.com/@example',
      instagramUrl: 'https://instagram.com/example',
      otherUrl: '',
      status: 'ACTIVE',
      active: true,
      userId: '1',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      expiresAt: '2024-02-14T10:30:00Z',
      feeChargedNaira: '3000.00'
    },
    {
      id: '2',
      title: 'MacBook Air M2',
      description: 'Brand new MacBook Air M2, 8GB RAM, 256GB SSD. Still under warranty.',
      priceNaira: '850000',
      listingDays: 60,
      imageUrls: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=400&h=300'],
      phoneNumber: '+2348000000002',
      facebookUrl: '',
      tiktokUrl: '',
      instagramUrl: '',
      otherUrl: '',
      status: 'PENDING',
      active: false,
      userId: '1',
      createdAt: '2024-01-20T14:15:00Z',
      updatedAt: '2024-01-20T14:15:00Z',
      feeChargedNaira: '6000.00'
    },
    {
      id: '3',
      title: 'Nike Air Max 270',
      description: 'Like new Nike Air Max 270, worn only twice. Original box included.',
      priceNaira: '65000',
      listingDays: 30,
      imageUrls: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400&h=300'],
      phoneNumber: '+2348000000003',
      facebookUrl: '',
      tiktokUrl: '',
      instagramUrl: '',
      otherUrl: '',
      status: 'EXPIRED',
      active: false,
      userId: '1',
      createdAt: '2023-12-01T09:00:00Z',
      updatedAt: '2023-12-01T09:00:00Z',
      expiresAt: '2023-12-31T09:00:00Z',
      feeChargedNaira: '3000.00'
    },
    {
      id: '4',
      title: 'PS5 Console Standard',
      description: 'PS5 console with one controller. Excellent condition, barely used.',
      priceNaira: '600000',
      listingDays: 45,
      imageUrls: ['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=400&h=300'],
      phoneNumber: '+2348000000004',
      facebookUrl: '',
      tiktokUrl: '',
      instagramUrl: '',
      otherUrl: '',
      status: 'REJECTED',
      active: false,
      userId: '1',
      createdAt: '2024-01-10T16:45:00Z',
      updatedAt: '2024-01-11T09:20:00Z',
      feeChargedNaira: '4500.00'
    },
    {
      id: '5',
      title: 'Samsung Galaxy S22',
      description: 'Samsung Galaxy S22 in excellent condition. No scratches, battery health 95%.',
      priceNaira: '380000',
      listingDays: 30,
      imageUrls: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400&h=300'],
      phoneNumber: '+2348000000005',
      facebookUrl: '',
      tiktokUrl: '',
      instagramUrl: '',
      otherUrl: '',
      status: 'ACTIVE',
      active: true,
      userId: '1',
      createdAt: '2024-01-18T11:30:00Z',
      updatedAt: '2024-01-18T11:30:00Z',
      expiresAt: '2024-02-17T11:30:00Z',
      feeChargedNaira: '3000.00'
    }
  ];

  const products = productsData?.products || mockProducts;

  console.log('=== PRODUCTS DATA DEBUG ===');
  console.log('Final products array:', products);
  console.log('Products length:', products.length);
  console.log('Using mock data?', !productsData?.products);
  console.log('=== END PRODUCTS DEBUG ===');

  // Calculate statistics
  const stats = useMemo(() => {
    const total = products.length;
    const pending = products.filter((p: Product) => p.status === 'PENDING').length;
    const active = products.filter((p: Product) => p.status === 'ACTIVE').length;
    const activeProducts = products.filter((p: Product) => p.active === true).length;
    const inactiveProducts = products.filter((p: Product) => p.active === false).length;
    const expired = products.filter((p: Product) => p.status === 'EXPIRED').length;
    const rejected = products.filter((p: Product) => p.status === 'REJECTED').length;

    return { total, pending, active, activeProducts, inactiveProducts, expired, rejected };
  }, [products]);

  // Filter products based on search and status
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  // Pagination logic
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, productsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'EXPIRED': return 'error';
      case 'REJECTED': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return CheckCircleIcon;
      case 'PENDING': return ClockIcon;
      case 'EXPIRED': return XCircleIcon;
      case 'REJECTED': return XCircleIcon;
      default: return PackageIcon;
    }
  };

  const handleToggleActive = async (product: Product) => {
    setProductToToggle(product);
    setToggleModalOpen(true);
  };

  const confirmToggle = async () => {
    if (productToToggle) {
      try {
        await toggleProductActiveMutation.mutateAsync(productToToggle.id);
        setToggleModalOpen(false);
        
        // Show success toast
        if (productToToggle.active) {
          toast.success('Product Deactivated', `"${productToToggle.title}" has been hidden from the marketplace.`);
        } else {
          toast.success('Product Activated', `"${productToToggle.title}" is now visible in the marketplace.`);
        }
        
        setProductToToggle(null);
      } catch (error) {
        console.error('Failed to toggle product active status:', error);
        toast.error('Action Failed', 'Unable to toggle product visibility. Please try again.');
      }
    }
  };

  const cancelToggle = () => {
    setToggleModalOpen(false);
    setProductToToggle(null);
  };

  const handleDelete = async (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProductMutation.mutateAsync(productToDelete.id);
        setDeleteModalOpen(false);
        
        // Show success toast
        toast.success('Product Deleted', `"${productToDelete.title}" has been permanently deleted.`);
        
        setProductToDelete(null);
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error('Delete Failed', 'Unable to delete product. Please try again.');
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      {isProductsLoading ? (
        <MarketplaceInventorySkeleton />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink tracking-tight">
                My Marketplace Inventory
              </h1>
              <p className="text-ink-secondary mt-1">
                Manage your product listings and track their performance
              </p>
            </div>
            <Link to="/marketplace/add-product">
              <Button className="flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
        <Card className="p-6 rounded-2xl border-none shadow-sm bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <PackageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-ink">{stats.total}</span>
          </div>
          <h3 className="text-sm font-semibold text-ink">Total Products</h3>
          <p className="text-xs text-ink-secondary mt-1">All listings</p>
        </Card>

        <Card className="p-6 rounded-2xl border-none shadow-sm bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-ink">{stats.activeProducts}</span>
          </div>
          <h3 className="text-sm font-semibold text-ink">Active</h3>
          <p className="text-xs text-ink-secondary mt-1">Live & visible</p>
        </Card>

        <Card className="p-6 rounded-2xl border-none shadow-sm bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-slate-600" />
            </div>
            <span className="text-2xl font-bold text-ink">{stats.inactiveProducts}</span>
          </div>
          <h3 className="text-sm font-semibold text-ink">Inactive</h3>
          <p className="text-xs text-ink-secondary mt-1">Hidden listings</p>
        </Card>

        <Card className="p-6 rounded-2xl border-none shadow-sm bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-ink">{stats.pending}</span>
          </div>
          <h3 className="text-sm font-semibold text-ink">Pending</h3>
          <p className="text-xs text-ink-secondary mt-1">Awaiting approval</p>
        </Card>

        <Card className="p-6 rounded-2xl border-none shadow-sm bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-ink">{stats.active}</span>
          </div>
          <h3 className="text-sm font-semibold text-ink">Approved</h3>
          <p className="text-xs text-ink-secondary mt-1">Live listings</p>
        </Card>

        <Card className="p-6 rounded-2xl border-none shadow-sm bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-ink">{stats.expired}</span>
          </div>
          <h3 className="text-sm font-semibold text-ink">Expired</h3>
          <p className="text-xs text-ink-secondary mt-1">Ended listings</p>
        </Card>

        <Card className="p-6 rounded-2xl border-none shadow-sm bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-2xl font-bold text-ink">{stats.rejected}</span>
          </div>
          <h3 className="text-sm font-semibold text-ink">Rejected</h3>
          <p className="text-xs text-ink-secondary mt-1">Declined listings</p>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 rounded-2xl border-none shadow-sm bg-white">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-12 px-4 rounded-xl border bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-ajo-500 transition-all text-ink border-gray-200"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-ink">Product Listings</h2>
          <p className="text-sm text-ink-secondary mt-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
          </p>
        </div>

        {isProductsLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-ink mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-ink-secondary mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by adding your first product to the marketplace'
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Link to="/marketplace/add-product">
                <Button className="flex items-center gap-2">
                  <PlusIcon className="w-4 h-4" />
                  Add Your First Product
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Listed
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedProducts.map((product: Product) => {
                /*   console.log('=== RENDERING INVENTORY PRODUCT ===');
                  console.log('Product ID:', product.id);
                  console.log('Product title:', product.title);
                  console.log('Product imageUrls:', product.imageUrls);
                  console.log('ImageUrls type:', typeof product.imageUrls);
                  console.log('ImageUrls length:', product.imageUrls?.length);
                  console.log('First image URL:', product.imageUrls?.[0]);
                  console.log('=== END INVENTORY PRODUCT DEBUG ==='); */
                  
                  const StatusIcon = getStatusIcon(product.status);
                  return (
                    <tr 
                      key={product.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        product.active ? 'border-l-4 border-l-green-500 bg-green-50/30' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.images && product.images.length > 0 && product.images[0]?.imagePath ? (
                              <img
                                src={product.images[0].imagePath}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <PackageIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-ink truncate">
                              {product.title}
                            </h3>
                            <p className="text-sm text-ink-secondary truncate">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-ink">
                          ₦{Number(product.priceNaira).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(product.status)} className="flex items-center gap-1">
                            <StatusIcon className="w-3 h-3" />
                            {product.status}
                          </Badge>
                          {product.active && (
                            <Badge variant="success" className="flex items-center gap-1 text-xs">
                              <CheckCircleIcon className="w-3 h-3" />
                              ACTIVE
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-ink">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-ink-secondary">
                          {new Date(product.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {product.expiresAt ? (
                          <div className="text-sm text-ink">
                            {new Date(product.expiresAt).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="text-sm text-ink-secondary">-</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleToggleActive(product)}
                            disabled={toggleProductActiveMutation.isPending}
                            title={product.active ? 'Deactivate Product' : 'Activate Product'}
                            className={product.active ? 'text-green-600 hover:text-green-700 hover:bg-green-50' : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'}
                          >
                            {product.active ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                          </Button>
                          <Link to={`/marketplace/edit-product/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <EditIcon className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(product)}
                            disabled={deleteProductMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete Product"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-ink-secondary">
            Showing {((currentPage - 1) * productsPerPage) + 1} to {Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1"
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 px-0 py-0 ${
                    currentPage === page 
                      ? 'bg-ajo-600 text-white hover:bg-ajo-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        title="Delete Product"
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={cancelDelete}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              isLoading={deleteProductMutation.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2Icon className="w-8 h-8 text-red-600" />
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                ⚠️ WARNING: Permanent Action
              </h3>
              <p className="text-red-700 text-sm font-medium">
                You are about to permanently delete "{productToDelete?.title}"
              </p>
            </div>
            <p className="text-ink-secondary">
              This action <strong>cannot be undone</strong>. The product will be permanently deleted along with all associated images and payment records.
            </p>
          </div>
        </div>
      </Modal>

      {/* Toggle Active Confirmation Modal */}
      <Modal
        isOpen={toggleModalOpen}
        onClose={cancelToggle}
        title={productToToggle?.active ? "Deactivate Product" : "Activate Product"}
        footer={
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={cancelToggle}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmToggle}
              isLoading={toggleProductActiveMutation.isPending}
              className={productToToggle?.active ? "flex-1 bg-orange-600 hover:bg-orange-700 text-white" : "flex-1 bg-green-600 hover:bg-green-700 text-white"}
            >
              {productToToggle?.active ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              productToToggle?.active ? 'bg-orange-50' : 'bg-green-50'
            }`}>
              {productToToggle?.active ? 
                <EyeOffIcon className="w-8 h-8 text-orange-600" /> : 
                <EyeIcon className="w-8 h-8 text-green-600" />
              }
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">
              {productToToggle?.active ? 'Deactivate' : 'Activate'} "{productToToggle?.title}"?
            </h3>
            <p className="text-ink-secondary">
              {productToToggle?.active 
                ? 'This product will be hidden from the marketplace and will no longer be visible to buyers.'
                : 'This product will become visible in the marketplace and buyers will be able to see and purchase it.'
              }
            </p>
          </div>
        </div>
      </Modal>
        </>
      )}
    </motion.div>
  );
}

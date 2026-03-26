import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PlusIcon, CameraIcon, XIcon } from 'lucide-react';

export function CreateProductCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: 'Electronics'
  });
  const [images, setImages] = useState<string[]>([]);

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
    // Handle product creation logic here
    console.log('Creating product:', { ...formData, images });
    
    // Reset form
    setFormData({ title: '', price: '', description: '', category: 'Electronics' });
    setImages([]);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="lg:col-span-2"
      >
        <Card 
          className="h-full min-h-[400px] border-2 border-dashed border-ajo-200 bg-ajo-50 hover:bg-ajo-100 transition-all cursor-pointer group"
          onClick={() => setIsExpanded(true)}
        >
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 bg-ajo-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-ajo-200 transition-colors">
              <PlusIcon className="w-8 h-8 text-ajo-600" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-2">Create Product</h3>
            <p className="text-ink-secondary text-center">
              List your items on the marketplace and reach thousands of buyers
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="lg:col-span-2"
    >
      <Card className="h-full p-6 border-none shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-ink">Create New Product</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
          >
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
              List Product
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}

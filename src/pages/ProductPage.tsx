import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { usePublicProductQuery } from '../services/marketplace/hooks';
import { getStoredUser } from '../services/auth/session';
import { PublicLayout } from '../components/layout/PublicLayout';
import {
  ArrowLeftIcon,
  EditIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
  FacebookIcon,
  InstagramIcon,
  MusicIcon,
  GlobeIcon
} from 'lucide-react';
export function ProductPage() {
  const { id } = useParams();
  const { data: productData, isLoading, error } = usePublicProductQuery(id || '');
  const [isOwner, setIsOwner] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSellerPhone, setShowSellerPhone] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const storedUser = getStoredUser();
  const product = productData?.product;

  // Get all images from either images array or imageUrls array
  const allImages = product?.images?.map(img => img.imagePath) || product?.imageUrls || [];
  const hasMultipleImages = allImages.length > 1;
  const currentImage = allImages[currentImageIndex] || allImages[0];

  const normalizeSocialUrl = (value: unknown) => {
    if (typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    // If backend returns a bare handle/link without protocol, make it clickable.
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const socialLinks = [
    {
      key: 'facebook',
      label: 'Facebook',
      url: normalizeSocialUrl(product?.facebookUrl),
      Icon: FacebookIcon,
    },
    {
      key: 'instagram',
      label: 'Instagram',
      url: normalizeSocialUrl(product?.instagramUrl),
      Icon: InstagramIcon,
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      url: normalizeSocialUrl(product?.tiktokUrl),
      // Lucide doesn't ship a dedicated TikTok icon, so we use a music note as a close visual.
      Icon: MusicIcon,
    },
    {
      key: 'other',
      label: 'More',
      url: normalizeSocialUrl(product?.otherUrl),
      Icon: GlobeIcon,
    },
  ].filter((s) => s.url);

  const hasSocialLinks = socialLinks.length > 0;

  const phoneNumber = (product?.phoneNumber ?? '').toString();
  const telHref = phoneNumber
    ? `tel:${phoneNumber
        .trim()
        // Keep digits and a leading + if present.
        .replace(/[^\d+]/g, '')
        .replace(/(?!^)\+/g, '')}`
    : '';

  const descriptionText = (product?.description ?? '').toString();
  const DESCRIPTION_TRUNCATE_AT = 80;
  const shouldTruncateDescription =
    descriptionText.length > DESCRIPTION_TRUNCATE_AT;
  const visibleDescription = isDescriptionExpanded
    ? descriptionText
    : descriptionText.slice(0, DESCRIPTION_TRUNCATE_AT);

  const goToPreviousImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1);
  };

  const goToNextImage = () => {
    setCurrentImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1);
  };

  useEffect(() => {
    if (product && storedUser) {
      setIsOwner(product.userId === storedUser.id);
    }
  }, [product, storedUser]);

  // Keyboard navigation for images
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasMultipleImages) return;
      
      if (e.key === 'ArrowLeft') {
        goToPreviousImage();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasMultipleImages]);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto space-y-8 pb-12 md:pt-16 pt-6 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="aspect-square bg-gray-200 rounded-[2rem]"></div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !product) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto space-y-8 pb-12 md:pt-16 pt-6 px-4 text-center">
          <h1 className="text-2xl font-bold text-ink">Product not found</h1>
          <p className="text-ink-secondary">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }
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
        className="space-y-8 max-w-7xl mx-auto pb-12 md:pt-16 pt-6 px-4">
      
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-sm font-bold text-ink-secondary hover:text-ink transition-colors bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm w-fit">
        
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Marketplace
      </Link>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        <div className="rounded-[2rem] overflow-hidden bg-surface aspect-square border border-gray-100 shadow-sm relative">
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <p className="text-sm">No Image</p>
              </div>
            </div>
          )}
          
          {hasMultipleImages && (
            <>
              {/* Navigation arrows */}
              <button
                onClick={goToPreviousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
              
              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col py-4">
          <div className="flex items-center justify-between mb-6">
            <Badge variant="neutral" className="w-fit px-3 py-1">
              {product.categoryId || 'General'}
            </Badge>
            {isOwner && (
              <Link to={`/marketplace/edit-product/${product.id}`}>
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <EditIcon className="w-4 h-4" />
                  Edit Product
                </Button>
              </Link>
            )}
          </div>
          <h1 className="text-4xl font-bold text-ink mb-4 tracking-tight">
            {product.title}
          </h1>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-medium text-ink-secondary">
              Status: {product.status}
            </span>
          </div>

          <p className="text-5xl font-black text-ajo-600 mb-10 tracking-tight">
            ₦{Number(product.priceNaira).toLocaleString()}
          </p>

          <div className="space-y-4 mb-10 text-ink-secondary leading-relaxed text-lg">
            <p>
              {visibleDescription}
              {!isDescriptionExpanded && shouldTruncateDescription ? '…' : null}
            </p>
            {shouldTruncateDescription && (
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded((v) => !v)}
                className="text-ajo-600 font-semibold hover:text-ajo-700 transition-colors"
              >
                {isDescriptionExpanded ? 'Read less' : 'Read more'}
              </button>
            )}
          </div>

          <div className="mt-auto space-y-6">
            {!showSellerPhone ? (
              <div className="flex gap-4">
                <Button
                  className="flex-1 rounded-xl h-14 text-lg shadow-md"
                  size="lg"
                  onClick={() => setShowSellerPhone(true)}
                  disabled={!telHref}
                >
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Contact Seller
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <a
                  href={telHref}
                  className="flex-1 rounded-xl h-14 text-lg shadow-md inline-flex items-center justify-center gap-2 bg-ajo-900 text-white hover:bg-ajo-900/90 transition-colors"
                  aria-label="Call seller"
                >
                  <PhoneIcon className="w-4 h-4" />
                  <span className="font-semibold">{phoneNumber}</span>
                </a>
              </div>
            )}

            {hasSocialLinks && (
              <div className="flex items-center gap-3 flex-wrap">
                {socialLinks.map(({ key, label, url, Icon }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-ajo-600" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
    </PublicLayout>
  );
}
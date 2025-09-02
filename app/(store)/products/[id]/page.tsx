import { notFound } from 'next/navigation';
import Image from 'next/image';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { formatPrice } from '@/lib/utils';

interface ProductDetailPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  await dbConnect();

  const product = await Product.findById(params.id).lean();
  if (!product || !product.active) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images?.[0] || '/images/placeholder.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image: string, index: number) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          {/* Ratings */}
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.ratings.average) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({product.ratings.count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>

          {/* Description */}
          <div className="prose prose-gray">
            <p>{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Specifications</h3>
              <dl className="grid grid-cols-1 gap-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex">
                    <dt className="font-medium text-gray-900 w-32 flex-shrink-0">{key}:</dt>
                    <dd className="text-gray-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Add to Cart */}
          <AddToCartButton
            product={{
              id: product._id.toString(),
              name: product.name,
              price: product.price,
              image: product.images?.[0] || '/images/placeholder.jpg',
              stock: product.stock,
            }}
            className="max-w-xs"
          />
        </div>
      </div>
    </div>
  );
}
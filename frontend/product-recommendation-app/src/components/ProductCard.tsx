// File: src/components/ProductCard.tsx
// REPLACED CONTENT

export interface Product {
  id: string;
  score: number;
  title: string | null;
  brand: string | null;
  price: number | null;
  images: string[] | null;
  categories: string | null;
  generated_description: string | null;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0].trim()
      : "https://via.placeholder.com/300";

  // Helper to parse the category string (re-used from your file)
  const parseCategory = (categoryString: string | null): string => {
    if (!categoryString) return "Uncategorized";
    try {
      const cleaned = categoryString.replace(/[\[\]']+/g, "");
      const parts = cleaned.split(", ").slice(0, 2);
      return parts.join(" > ");
    } catch (e) {
      return categoryString;
    }
  };

  const displayCategory = parseCategory(product.categories);

  return (
    // --- This is the new Vertical Card layout ---
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image container */}
      <div className="h-48 w-full flex-shrink-0">
        <img
          className="h-full w-full object-cover"
          src={displayImage}
          alt={product.title || "Product Image"}
        />
      </div>

      {/* Content container */}
      <div className="flex flex-1 flex-col justify-between p-4">
        {/* Top section (text) */}
        <div>
          <p className="text-sm font-medium text-gray-500">
            {product.brand || "Brand"}
          </p>
          <p className="mb-2 text-lg font-semibold text-gray-800">
            {product.title || "Product Title"}
          </p>
          
          <p className="mb-2 text-xs font-semibold uppercase text-blue-600">
            {displayCategory}
          </p>

          <p className="mb-4 text-sm text-gray-700">
            {product.generated_description || "No description available."}
          </p>
        </div>

        {/* Bottom section (price) */}
        <div className="mt-auto">
          {product.price && (
            <p className="text-xl font-bold text-green-600">
              ${product.price.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
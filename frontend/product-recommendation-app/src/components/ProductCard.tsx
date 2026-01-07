import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Sparkles } from "lucide-react";

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
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0].trim()
      : "https://via.placeholder.com/300";

  // Mouse tracking for subtle glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      layoutId={`card-container-${product.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, cursor: "pointer" }}
      transition={{ duration: 0.3 }}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#151c36] border border-white/10 shadow-2xl"
    >
      {/* Mouse Glow Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-900">
        <motion.img
          layoutId={`card-image-${product.id}`}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={displayImage}
          alt={product.title || "Product"}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-transparent to-transparent opacity-80" />

        {/* Brand Badge */}
        <div className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
          {product.brand || "Selection"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <motion.h3
            layoutId={`card-title-${product.id}`}
            className="line-clamp-2 text-lg font-bold leading-tight text-white group-hover:text-blue-400 transition-colors"
          >
            {product.title}
          </motion.h3>
        </div>

        {/* AI Description */}
        <div className="relative mb-6 pl-3">
          <div className="absolute left-0 top-1 h-full w-0.5 bg-blue-500 rounded-full" />
          <p className="line-clamp-3 text-sm italic text-gray-300">
            "{product.generated_description}"
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-gray-500">Price</span>
            <span className="text-xl font-bold text-emerald-400">
              ${product.price?.toFixed(2) || "N/A"}
            </span>
          </div>

          <button className="rounded-full bg-white/5 p-2 text-blue-300 hover:bg-white/10 transition-colors">
            <Sparkles size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

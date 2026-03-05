import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  CATEGORIES,
  type Category,
  MOCK_PRODUCTS,
  type MockProduct,
} from "@/data/mockProducts";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAddToCart,
  useCheckout,
  useListProducts,
  useRemoveFromCart,
  useViewCart,
} from "@/hooks/useQueries";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  Cpu,
  Dumbbell,
  Facebook,
  Heart,
  Instagram,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Twitter,
  User,
  UtensilsCrossed,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  Cpu,
  Shirt,
  UtensilsCrossed,
  Sparkles,
  Dumbbell,
  BookOpen,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            // biome-ignore lint/suspicious/noArrayIndexKey: star positions are stable
            key={i}
            className={`w-3.5 h-3.5 ${
              i < Math.floor(rating)
                ? "fill-brand-gold text-brand-gold"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground font-body">
        {rating} ({count.toLocaleString()})
      </span>
    </div>
  );
}

// ── Countdown Timer ───────────────────────────────────────────────────────────
function CountdownTimer() {
  const [time, setTime] = useState({ h: 5, m: 47, s: 23 });
  useEffect(() => {
    const iv = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 5;
          m = 59;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      {[
        { v: time.h, l: "hrs" },
        { v: time.m, l: "min" },
        { v: time.s, l: "sec" },
      ].map((unit, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: time units are static
        <div key={i} className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 min-w-[48px] text-center">
            <span className="font-display font-bold text-xl text-white tabular-nums">
              {pad(unit.v)}
            </span>
          </div>
          <span className="text-[10px] text-white/70 mt-0.5 uppercase tracking-wider">
            {unit.l}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: MockProduct;
  index: number;
  onAddToCart: (id: string, name: string) => void;
  isAdding: boolean;
}

function ProductCard({
  product,
  index,
  onAddToCart,
  isAdding,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <motion.div
      data-ocid={`products.item.${index}`}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-card card-hover border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-orange">
            {product.badge}
          </Badge>
        </div>
      )}

      {/* Discount */}
      <div className="absolute top-3 right-10 z-10">
        <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{product.discount}%
        </span>
      </div>

      {/* Wishlist */}
      <button
        type="button"
        onClick={() => setWishlisted(!wishlisted)}
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-xs hover:bg-white transition-colors"
        aria-label="Wishlist"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
          }`}
        />
      </button>

      {/* Image */}
      <div className="relative overflow-hidden bg-secondary/30 h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-brand-purple font-semibold mb-1 uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="font-display font-semibold text-sm text-card-foreground mb-2 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        <StarRating rating={product.rating} count={product.reviews} />

        <div className="flex items-end justify-between mt-3">
          <div>
            <div className="font-display font-bold text-lg text-foreground">
              {formatPrice(product.price)}
            </div>
            <div className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </div>
          </div>
        </div>

        <Button
          data-ocid={`products.item.add_button.${index}`}
          onClick={() => onAddToCart(product.id, product.name)}
          disabled={isAdding}
          className="w-full mt-3 bg-brand-gradient text-white font-semibold text-sm rounded-xl hover:shadow-brand hover:scale-[1.02] transition-all duration-200"
          size="sm"
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            <ShoppingCart className="w-4 h-4 mr-1" />
          )}
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}

// ── Skeleton Cards ────────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      <Skeleton className="h-48 w-full shimmer" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-1/3 shimmer" />
        <Skeleton className="h-4 w-4/5 shimmer" />
        <Skeleton className="h-3 w-1/2 shimmer" />
        <Skeleton className="h-6 w-1/3 shimmer mt-2" />
        <Skeleton className="h-9 w-full shimmer" />
      </div>
    </div>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────────────────────
interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cartItems: string[];
  onRemove: (id: string) => void;
  isRemoving: boolean;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

function CartDrawer({
  open,
  onClose,
  cartItems,
  onRemove,
  isRemoving,
  onCheckout,
  isCheckingOut,
}: CartDrawerProps) {
  const getProduct = (id: string) =>
    MOCK_PRODUCTS.find((p) => p.id === id) ?? null;

  const subtotal = cartItems.reduce((sum, id) => {
    const p = getProduct(id);
    return sum + (p?.price ?? 0);
  }, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.aside
            data-ocid="cart.panel"
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-background z-50 flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-primary/5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-lg text-foreground">
                  Your Cart
                </h2>
                {cartItems.length > 0 && (
                  <Badge className="bg-brand-orange text-white text-xs">
                    {cartItems.length}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                data-ocid="cart.close_button"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div
                  data-ocid="cart.empty_state"
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-float">
                    <ShoppingBag className="w-10 h-10 text-primary/50" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Discover amazing products and add them here
                  </p>
                  <Button
                    onClick={onClose}
                    className="bg-brand-gradient text-white rounded-xl font-semibold"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.slice(0, 5).map((id, i) => {
                    const product = getProduct(id);
                    if (!product) return null;
                    return (
                      <motion.div
                        // biome-ignore lint/suspicious/noArrayIndexKey: cart items use positional markers
                        key={`${id}-${i}`}
                        data-ocid={`cart.item.${i + 1}`}
                        className="flex gap-3 bg-card rounded-xl p-3 border border-border"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-contain bg-secondary/30 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.category}
                          </p>
                          <p className="font-bold text-brand-purple mt-1">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          data-ocid={`cart.item.delete_button.${i + 1}`}
                          onClick={() => onRemove(id)}
                          disabled={isRemoving}
                          className="self-start p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-border p-5 space-y-4 bg-card/50">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-body">
                    Subtotal
                  </span>
                  <span className="font-display font-bold text-xl text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Delivery charges will be calculated at checkout
                </div>
                <Button
                  data-ocid="cart.checkout_button"
                  onClick={onCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-brand-gradient text-white font-bold text-base py-6 rounded-xl hover:shadow-brand transition-all duration-200"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [navScrolled, setNavScrolled] = useState(false);

  const productsRef = useRef<HTMLElement>(null);

  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { data: backendProducts, isLoading: productsLoading } =
    useListProducts();
  const { data: cartItems = [] } = useViewCart();
  const addToCartMutation = useAddToCart();
  const removeFromCartMutation = useRemoveFromCart();
  const checkoutMutation = useCheckout();

  // Nav scroll effect
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Merge backend + mock products
  const allProducts = (() => {
    if (backendProducts && backendProducts.length > 0) {
      return backendProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price) / 100,
        originalPrice: Math.round(Number(p.price) / 100 / 0.8),
        image: p.image.getDirectURL(),
        category: "Electronics" as Category,
        rating: 4.5,
        reviews: 100,
        discount: 20,
      }));
    }
    return MOCK_PRODUCTS;
  })();

  // Filter & sort
  const filteredProducts = allProducts
    .filter((p) => {
      const matchCat =
        activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleAddToCart = useCallback(
    async (id: string, name: string) => {
      setAddingId(id);
      try {
        await addToCartMutation.mutateAsync(id);
        toast.success(`${name} added to cart!`, {
          description: "Item has been added to your cart",
        });
      } catch {
        toast.error("Failed to add to cart", {
          description: "Please try again",
        });
      } finally {
        setAddingId(null);
      }
    },
    [addToCartMutation],
  );

  const handleRemoveFromCart = useCallback(
    async (id: string) => {
      setRemovingId(id);
      try {
        await removeFromCartMutation.mutateAsync(id);
        toast.success("Item removed from cart");
      } catch {
        toast.error("Failed to remove item");
      } finally {
        setRemovingId(null);
      }
    },
    [removeFromCartMutation],
  );

  const handleCheckout = useCallback(async () => {
    try {
      await checkoutMutation.mutateAsync();
      toast.success("Order placed successfully!", {
        description: "Thank you for shopping at Sabkuch.com!",
      });
      setCartOpen(false);
    } catch {
      toast.error("Checkout failed", { description: "Please try again" });
    }
  }, [checkoutMutation]);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Products", href: "#products" },
    { label: "Categories", href: "#categories" },
    { label: "Deals", href: "#flash-sale" },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Toaster richColors position="top-right" />

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          navScrolled
            ? "bg-white/95 backdrop-blur-md shadow-card border-b border-border"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <img
                src="/assets/generated/logo-transparent.dim_300x80.png"
                alt="Sabkuch.com"
                className="h-10 w-auto object-contain"
              />
            </a>

            {/* Search */}
            <div className="flex-1 max-w-xl hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-ocid="navbar.search_input"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-full border-border bg-secondary/50 focus:bg-white text-sm h-10"
                />
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  data-ocid={`navbar.link.${i + 1}`}
                  className="px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  onClick={
                    link.href === "#products"
                      ? (e) => {
                          e.preventDefault();
                          scrollToProducts();
                        }
                      : undefined
                  }
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Cart + Login */}
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              {/* Cart */}
              <button
                type="button"
                data-ocid="navbar.cart_button"
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-primary/10 transition-colors animate-pulse-ring"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center animate-badge-pop">
                    {cartItems.length > 9 ? "9+" : cartItems.length}
                  </span>
                )}
              </button>

              {/* Login/Logout */}
              {identity ? (
                <Button
                  data-ocid="navbar.login_button"
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="rounded-full border-border text-sm font-semibold hidden sm:flex gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  Logout
                </Button>
              ) : (
                <Button
                  data-ocid="navbar.login_button"
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="rounded-full bg-brand-gradient text-white text-sm font-semibold hidden sm:flex gap-1.5 shadow-brand hover:shadow-brand hover:scale-105 transition-all"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <LogIn className="w-3.5 h-3.5" />
                  )}
                  Login
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-full border-border bg-secondary/50 text-sm h-9"
              />
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO SECTION ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden min-h-[500px] flex items-center">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="/assets/generated/hero-banner.dim_1200x500.jpg"
              alt="Hero banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-hero-gradient" />
          </div>

          {/* Floating decorative orbs */}
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-brand-orange/20 blur-3xl animate-float" />
          <div
            className="absolute bottom-10 right-1/3 w-48 h-48 rounded-full bg-primary/30 blur-3xl animate-float"
            style={{ animationDelay: "1.5s" }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Badge className="mb-5 bg-brand-orange/20 text-brand-orange border border-brand-orange/30 backdrop-blur-sm font-semibold text-sm px-4 py-1.5 rounded-full">
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  India's #1 Shopping Destination
                </Badge>

                <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl leading-tight text-white mb-4">
                  <span className="block">Sabkuch —</span>
                  <span className="text-gradient-warm font-serif-accent italic">
                    Har Cheez Yahan
                  </span>
                  <span className="block text-white"> Milegi!</span>
                </h1>

                <p className="text-white/80 text-lg mb-8 font-body max-w-lg leading-relaxed">
                  Millions of products. Unbeatable prices. Lightning-fast
                  delivery. Your trusted Indian marketplace for every need.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    data-ocid="hero.primary_button"
                    size="lg"
                    onClick={scrollToProducts}
                    className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-8 py-6 rounded-2xl text-base shadow-orange hover:shadow-orange hover:scale-105 transition-all duration-200"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Shop Now
                  </Button>
                  <Button
                    data-ocid="hero.secondary_button"
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/60 text-white hover:bg-white/15 backdrop-blur-sm font-bold px-8 py-6 rounded-2xl text-base transition-all"
                    onClick={() =>
                      document
                        .getElementById("categories")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Browse Categories
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-5 mt-10">
                  {[
                    { icon: Package, text: "Free Delivery" },
                    { icon: Clock, text: "24/7 Support" },
                    { icon: TrendingUp, text: "Best Prices" },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-1.5 text-white/70 text-sm"
                    >
                      <Icon className="w-4 h-4 text-brand-orange" />
                      <span className="font-body">{text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ───────────────────────────────────────────────── */}
        <section id="categories" className="py-14 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground">
                Shop by <span className="text-gradient-brand">Category</span>
              </h2>
              <p className="text-muted-foreground mt-2 font-body">
                Find exactly what you're looking for
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
              {CATEGORIES.map((cat, i) => {
                const Icon = ICON_MAP[cat.icon];
                const isActive = activeCategory === cat.name;
                return (
                  <motion.button
                    key={cat.name}
                    data-ocid={`category.item.${i + 1}`}
                    onClick={() => {
                      setActiveCategory(isActive ? "All" : cat.name);
                      scrollToProducts();
                    }}
                    className={`group relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200 ${
                      isActive
                        ? "border-primary bg-primary/10 shadow-brand scale-105"
                        : "border-border bg-card hover:-translate-y-1 hover:shadow-card-lift"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ scale: isActive ? 1.05 : 1.03 }}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-xs`}
                    >
                      {Icon && <Icon className="w-6 h-6 text-white" />}
                    </div>
                    <span
                      className={`text-xs font-bold text-center leading-tight ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {cat.name}
                    </span>
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <X className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FLASH SALE BANNER ────────────────────────────────────────── */}
        <section
          id="flash-sale"
          className="py-8 bg-brand-gradient overflow-hidden relative"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute bottom-0 right-1/4 w-24 h-24 rounded-full bg-brand-orange/20 blur-2xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                  <Zap className="w-5 h-5 text-brand-orange fill-brand-orange" />
                  <span className="text-white/80 text-sm font-semibold uppercase tracking-widest">
                    Flash Sale
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-white leading-tight">
                  Up to{" "}
                  <span className="text-brand-orange font-serif-accent italic">
                    70% OFF
                  </span>
                  <span className="text-white"> Today!</span>
                </h2>
                <p className="text-white/70 text-sm mt-1 font-body">
                  Exclusive deals on thousands of products
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-white/70 text-xs uppercase tracking-wider font-semibold">
                  Sale ends in
                </span>
                <CountdownTimer />
              </div>

              <Button
                size="lg"
                className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-8 py-5 rounded-2xl shadow-orange hover:scale-105 transition-all flex-shrink-0"
                onClick={scrollToProducts}
              >
                Grab Deals
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* ── PRODUCTS SECTION ─────────────────────────────────────────── */}
        <section ref={productsRef} id="products" className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-foreground">
                  {activeCategory === "All" ? (
                    <>
                      Featured{" "}
                      <span className="text-gradient-brand">Products</span>
                    </>
                  ) : (
                    <>
                      <span className="text-gradient-brand">
                        {activeCategory}
                      </span>
                    </>
                  )}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {filteredProducts.length} products found
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <Select
                  value={activeCategory}
                  onValueChange={(v) =>
                    setActiveCategory(v as Category | "All")
                  }
                >
                  <SelectTrigger
                    data-ocid="filter.select"
                    className="w-44 rounded-xl border-border text-sm"
                  >
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger
                    data-ocid="sort.select"
                    className="w-44 rounded-xl border-border text-sm"
                  >
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div
                data-ocid="products.loading_state"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders are positional
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div
                data-ocid="products.empty_state"
                className="text-center py-20"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-float">
                  <Package className="w-12 h-12 text-primary/40" />
                </div>
                <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                  No Products Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters
                </p>
                <Button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="bg-brand-gradient text-white rounded-xl font-semibold"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div
                data-ocid="products.list"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i + 1}
                    onAddToCart={handleAddToCart}
                    isAdding={addingId === product.id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── PROMOTIONAL BANNER ───────────────────────────────────────── */}
        <section className="py-12 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Package,
                  title: "Free Shipping",
                  desc: "On orders above ₹499",
                  color: "from-violet-500 to-purple-700",
                },
                {
                  icon: Clock,
                  title: "Easy Returns",
                  desc: "30-day return policy",
                  color: "from-amber-500 to-orange-600",
                },
                {
                  icon: TrendingUp,
                  title: "Best Price Guarantee",
                  desc: "We match any price",
                  color: "from-green-500 to-emerald-600",
                },
              ].map(({ icon: Icon, title, desc, color }, i) => (
                <motion.div
                  key={title}
                  className="flex items-center gap-4 bg-card rounded-2xl p-5 border border-border shadow-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-xs`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-foreground">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-body">
                      {desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-foreground text-background pt-14 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Col 1: Brand */}
            <div className="col-span-2 md:col-span-1">
              <img
                src="/assets/generated/logo-transparent.dim_300x80.png"
                alt="Sabkuch.com"
                className="h-10 w-auto object-contain mb-4 invert"
              />
              <p className="text-background/60 text-sm font-body leading-relaxed mb-4">
                India ka sabse bada online bazaar. Har cheez, har jagah, har
                baar.
              </p>
              <div className="flex gap-3">
                {[
                  {
                    Icon: Facebook,
                    label: "Facebook",
                    href: "https://facebook.com",
                  },
                  {
                    Icon: Twitter,
                    label: "Twitter",
                    href: "https://twitter.com",
                  },
                  {
                    Icon: Instagram,
                    label: "Instagram",
                    href: "https://instagram.com",
                  },
                  {
                    Icon: Youtube,
                    label: "YouTube",
                    href: "https://youtube.com",
                  },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-background/50 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Home", href: "/" },
                  { label: "Products", href: "#products" },
                  { label: "New Arrivals", href: "#products" },
                  { label: "Best Sellers", href: "#products" },
                  { label: "Sale", href: "#flash-sale" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-background/70 hover:text-background text-sm font-body transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3 h-3 text-brand-orange" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Customer Service */}
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-background/50 mb-4">
                Customer Service
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Track Order", href: "#" },
                  { label: "Returns & Refunds", href: "#" },
                  { label: "FAQ", href: "#" },
                  { label: "Contact Us", href: "mailto:support@sabkuch.com" },
                  { label: "Privacy Policy", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-background/70 hover:text-background text-sm font-body transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3 h-3 text-brand-orange" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: App + Contact */}
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-background/50 mb-4">
                Get in Touch
              </h4>
              <div className="space-y-3 mb-5">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 text-background/70 hover:text-background text-sm font-body transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  +91 98765 43210
                </a>
                <a
                  href="mailto:support@sabkuch.com"
                  className="flex items-center gap-2 text-background/70 hover:text-background text-sm font-body transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  support@sabkuch.com
                </a>
                <div className="flex items-start gap-2 text-background/70 text-sm font-body">
                  <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
                  Mumbai, Maharashtra, India
                </div>
              </div>
              <div>
                <p className="text-background/50 text-xs uppercase tracking-wider mb-2">
                  Download Our App
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background/10 hover:bg-background/20 border border-background/20 text-background text-xs font-semibold px-3 py-2 rounded-lg transition-colors text-center"
                  >
                    📱 App Store
                  </a>
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-background/10 hover:bg-background/20 border border-background/20 text-background text-xs font-semibold px-3 py-2 rounded-lg transition-colors text-center"
                  >
                    🤖 Google Play
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-background/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-background/50 text-sm font-body text-center sm:text-left">
              © {new Date().getFullYear()} Sabkuch.com — All Rights Reserved
            </p>
            <p className="text-background/40 text-xs font-body">
              Built with <span className="text-brand-orange">❤</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.hostname : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/60 hover:text-background transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ── CART DRAWER ──────────────────────────────────────────────────── */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={handleRemoveFromCart}
        isRemoving={!!removingId}
        onCheckout={handleCheckout}
        isCheckingOut={checkoutMutation.isPending}
      />
    </div>
  );
}

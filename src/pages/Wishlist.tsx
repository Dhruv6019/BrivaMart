import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useCartContext } from '../contexts/CartContext';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useCartContext();
  const { toast } = useToast();

  const handleAddToCart = (wishlistItem: any) => {
    addToCart(wishlistItem.product);
    toast({
      title: "Added to Cart",
      description: `${wishlistItem.product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from Wishlist",
      description: "Product has been removed from your wishlist.",
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <Heart className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
              <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
              <p className="text-muted-foreground mb-8">
                Save items you love by clicking the heart icon on products.
              </p>
              <Button asChild>
                <a href="/products">Browse Products</a>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((wishlistItem) => (
              <Card key={wishlistItem.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={wishlistItem.product.images[0]}
                      alt={wishlistItem.product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(wishlistItem.productId)}
                      className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{wishlistItem.product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {wishlistItem.product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">${wishlistItem.product.price}</span>
                        {wishlistItem.product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${wishlistItem.product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        {wishlistItem.product.category}
                      </span>
                    </div>

                    <Button 
                      onClick={() => handleAddToCart(wishlistItem)}
                      className="w-full"
                      disabled={!wishlistItem.product.inStock}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {wishlistItem.product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
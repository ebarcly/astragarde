const mockProducts = [
  {
    id: "gid://shopify/Product/1",
    title: "Premium Wireless Headphones",
    handle: "premium-wireless-headphones",
    images: {
      nodes: [
        {
          altText: "Premium Wireless Headphones - Front View",
          url: "https://placehold.co/600x600/1a1a1a/ffffff?text=Headphones+1",
          width: 600,
          height: 600
        },
        {
          altText: "Premium Wireless Headphones - Side View",
          url: "https://placehold.co/600x600/2a2a2a/ffffff?text=Headphones+2",
          width: 600,
          height: 600
        },
        {
          altText: null,
          url: "https://placehold.co/600x600/3a3a3a/ffffff?text=Headphones+3",
          width: 600,
          height: 600
        }
      ]
    },
    variants: {
      nodes: [
        {
          id: "gid://shopify/ProductVariant/1001",
          title: "Black",
          availableForSale: true,
          quantityAvailable: 15,
          price: {
            amount: "299.99",
            currencyCode: "USD"
          }
        },
        {
          id: "gid://shopify/ProductVariant/1002",
          title: "Silver",
          availableForSale: true,
          quantityAvailable: 8,
          price: {
            amount: "299.99",
            currencyCode: "USD"
          }
        },
        {
          id: "gid://shopify/ProductVariant/1003",
          title: "Rose Gold",
          availableForSale: false,
          quantityAvailable: 0,
          price: {
            amount: "329.99",
            currencyCode: "USD"
          }
        }
      ]
    },
    featuredImage: {
      altText: "Premium Wireless Headphones - Featured Image",
      url: "https://placehold.co/800x800/1a1a1a/ffffff?text=Headphones+Featured",
      width: 800,
      height: 800
    }
  },
  {
    id: "gid://shopify/Product/2",
    title: "Organic Cotton T-Shirt",
    handle: "organic-cotton-t-shirt",
    images: {
      nodes: [
        {
          altText: "Organic Cotton T-Shirt - Front",
          url: "https://placehold.co/600x600/e8f4f8/333333?text=T-Shirt+1",
          width: 600,
          height: 600
        },
        {
          altText: "Organic Cotton T-Shirt - Back",
          url: "https://placehold.co/600x600/f0f8fc/333333?text=T-Shirt+2",
          width: 600,
          height: 600
        }
      ]
    },
    variants: {
      nodes: [
        {
          id: "gid://shopify/ProductVariant/2001",
          title: "Small / White",
          availableForSale: true,
          quantityAvailable: 25,
          price: {
            amount: "29.99",
            currencyCode: "USD"
          }
        },
        {
          id: "gid://shopify/ProductVariant/2002",
          title: "Medium / White",
          availableForSale: true,
          quantityAvailable: 30,
          price: {
            amount: "29.99",
            currencyCode: "USD"
          }
        },
        {
          id: "gid://shopify/ProductVariant/2003",
          title: "Large / White",
          availableForSale: true,
          quantityAvailable: 20,
          price: {
            amount: "29.99",
            currencyCode: "USD"
          }
        },
        {
          id: "gid://shopify/ProductVariant/2004",
          title: "Small / Navy",
          availableForSale: true,
          quantityAvailable: 12,
          price: {
            amount: "29.99",
            currencyCode: "USD"
          }
        }
      ]
    },
    featuredImage: {
      altText: "Organic Cotton T-Shirt - Featured Image",
      url: "https://placehold.co/800x800/e8f4f8/333333?text=T-Shirt+Featured",
      width: 800,
      height: 800
    }
  },
  {
    id: "gid://shopify/Product/4",
    title: "Eco-Friendly Yoga Mat",
    handle: "eco-friendly-yoga-mat",
    images: {
      nodes: [
        {
          altText: "Eco-Friendly Yoga Mat - Rolled",
          url: "https://placehold.co/600x600/a8d5ba/2d5016?text=Yoga+Mat+1",
          width: 600,
          height: 600
        },
        {
          url: "https://placehold.co/600x600/b8e5ca/2d5016?text=Yoga+Mat+2",
          width: 600,
          height: 600
        },
        {
          altText: "Eco-Friendly Yoga Mat - Texture Detail",
          url: "https://placehold.co/600x600/c8f5da/2d5016?text=Yoga+Mat+3",
          width: 600,
          height: 600
        }
      ]
    },
    variants: {
      nodes: [
        {
          id: "gid://shopify/ProductVariant/4001",
          title: "Forest Green",
          availableForSale: true,
          quantityAvailable: 18,
          price: {
            amount: "68.00",
            currencyCode: "USD"
          }
        },
        {
          id: "gid://shopify/ProductVariant/4002",
          title: "Ocean Blue",
          availableForSale: true,
          quantityAvailable: 22,
          price: {
            amount: "68.00",
            currencyCode: "USD"
          }
        },
        {
          id: "gid://shopify/ProductVariant/4003",
          title: "Sunset Orange",
          availableForSale: true,
          quantityAvailable: 10,
          price: {
            amount: "68.00",
            currencyCode: "USD"
          }
        },
        {
          id: "gid://shopify/ProductVariant/4004",
          title: "Lavender Purple",
          availableForSale: true,
          quantityAvailable: 7,
          price: {
            amount: "72.00",
            currencyCode: "USD"
          }
        }
      ]
    },
    featuredImage: {
      altText: "Eco-Friendly Yoga Mat - Featured Image",
      url: "https://placehold.co/800x800/a8d5ba/2d5016?text=Yoga+Mat+Featured",
      width: 800,
      height: 800
    }
  }
];

export default mockProducts;

// Note: The ImageResult and VariantResult schemas would need to be defined based on your actual Zod schemas
// This mockup assumes typical e-commerce data structures for images and variants
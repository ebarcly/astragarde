import { z } from "zod";

export const configSchema = z.object({
  shopifyShop: z.string(),
  publicShopifyAccessToken: z.string(),
  privateShopifyAccessToken: z.string(),
  apiVersion: z.string(),
});

export const MoneyV2Result = z.object({
  amount: z.string(),
  currencyCode: z.string(),
});

export const ImageResult = z
  .object({
    altText: z.string().nullable().optional(),
    url: z.string(),
    width: z.number().positive().int(),
    height: z.number().positive().int(),
  })
  .nullable();

export const CartItemResult = z.object({
  id: z.string(),
  cost: z.object({
    amountPerQuantity: MoneyV2Result,
    subtotalAmount: MoneyV2Result,
    totalAmount: MoneyV2Result,
  }),
  merchandise: z.object({
    id: z.string(),
    title: z.string(),
    product: z.object({
      title: z.string(),
      handle: z.string(),
    }),
    image: ImageResult.nullable(),
  }),
  quantity: z.number().positive().int(),
});

export const CartResult = z
  .object({
    id: z.string(),
    cost: z.object({
      subtotalAmount: MoneyV2Result,
    }),
    checkoutUrl: z.string(),
    totalQuantity: z.number().int(),
    lines: z.object({
      nodes: z.array(CartItemResult),
    }),
  })
  .nullable();

export const VariantResult = z.object({
  id: z.string(),
  title: z.string(),
  availableForSale: z.boolean(),
  quantityAvailable: z.number().int(),
  price: MoneyV2Result,
  compareAtPrice: MoneyV2Result.nullable(),
  selectedOptions: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ),
});

// Add ProductOption schema for cleaner option handling
export const ProductOptionResult = z.object({
  id: z.string(),
  name: z.string(),
  values: z.array(z.string()),
});

export const ProductResult = z
  .object({
    id: z.string(),
    title: z.string(),
    handle: z.string(),
    description: z.string(),
    images: z.object({
      nodes: z.array(ImageResult),
    }),
    // Add options array to get all available option names and values
    options: z.array(ProductOptionResult),
    variants: z.object({
      nodes: z.array(VariantResult),
    }),
    featuredImage: ImageResult.nullable(),
  })
  .nullable();
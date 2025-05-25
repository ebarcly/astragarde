<script lang="ts">
import type { z } from "zod";
import type { ProductResult } from "../utils/schemas";

import ShopifyImage from "./ShopifyImage.svelte";
import Money from "./Money.svelte";

export interface Props {
  product: z.infer<typeof ProductResult>;
  size?: "medium" | "large" | "extraLarge";
}

const { product, size = "medium" }: Props = $props();

// Helper functions
const isOnSale =
  product?.variants.nodes[0].compareAtPrice &&
  parseFloat(product.variants.nodes[0].compareAtPrice.amount) >
    parseFloat(product.variants.nodes[0].price.amount);

const isSoldOut = !product?.variants.nodes.some(
  (variant) => variant.availableForSale
);

// Get unique colors from variants (assuming color is in the option values)
const getColorVariants = () => {
  if (!product?.variants.nodes) return [];

  const colors = new Map();
  product.variants.nodes.forEach((variant) => {
    variant.selectedOptions?.forEach((option) => {
      if (option.name.toLowerCase() === "color") {
        colors.set(option.value, variant.id);
      }
    });
  });

  return Array.from(colors.entries());
};

const colorVariants = getColorVariants();

// Color mapping for swatches
const getColorClass = (colorName: string) => {
  const colorMap: { [key: string]: string } = {
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    red: "bg-red-500",
    blue: "bg-blue-500",
    black: "bg-black",
    white: "bg-white border-gray-300",
    gray: "bg-gray-400",
    grey: "bg-gray-400",
    beige: "bg-beige",
    brown: "bg-brown",
    orange: "bg-orange",
    pink: "bg-pink",
    purple: "bg-purple",
  };

  const lowerColor = colorName.toLowerCase();
  return colorMap[lowerColor] || "bg-gray-300";
};

const sizeClasses = {
  medium: "w-44 h-64 sm:w-52 sm:h-72 md:w-60 md:h-80 lg:w-68 lg:h-96",
  large: "w-52 h-76 sm:w-60 sm:h-84 md:w-72 md:h-96 lg:w-80 lg:h-[500px]",
  extraLarge: "w-60 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[600px] lg:w-[20vw] lg:h-[700px]",
};

const cardClasses = `relative ${sizeClasses[size]}`;

// Get the second image if available
const secondImage = product?.images.nodes[1] || product?.featuredImage;
</script>

<a href="/products/{product?.handle}" class="group block overflow-hidden">
  <!-- card container -->
  <div class={cardClasses}>
    <!-- image container -->
    <div class="relative flex h-full w-full items-center justify-center">
      <!-- hover image (background) -->
      <ShopifyImage
        classList="w-full h-full object-cover object-center absolute inset-0"
        loading="eager"
        image={secondImage}
        sizes="
          (min-width: 1540px) 348px,
          (min-width: 1280px) 284px,
          (min-width: 1040px) 309px,
          (min-width: 780px) 348px,
          (min-width: 640px) 284px,
          calc(100vw - 48px)
        "
      />
      <!-- main image (foreground) -->
      <ShopifyImage
        classList="w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
        loading="eager"
        image={product?.featuredImage}
        sizes="
          (min-width: 1540px) 348px,
          (min-width: 1280px) 284px,
          (min-width: 1040px) 309px,
          (min-width: 780px) 348px,
          (min-width: 640px) 284px,
          calc(100vw - 48px)
        "
      />
    </div>

    <!-- Sale/Sold Out Badge -->
    {#if isOnSale && !isSoldOut}
      <div class="absolute top-2 left-2 bg-black px-2 py-1 text-xs font-medium text-white">
        Sale
      </div>
    {/if}

    {#if isSoldOut}
      <div class="absolute top-2 left-2 bg-gray-500 px-2 py-1 text-xs font-medium text-white">
        Sold Out
      </div>
    {/if}
  </div>

  <div class="flex flex-col items-center justify-between py-2 text-center text-zinc-700">
    <!-- Price Section -->
    <div class="font-primary mb-1 text-lg font-semibold text-black">
      {#if isOnSale}
        <div class="flex items-center justify-center gap-2">
          <span class="text-sm text-gray-500 line-through">
            <Money showCurrency price={product?.variants.nodes[0].compareAtPrice!} />
          </span>
          <span class="text-black">
            <Money showCurrency price={product?.variants.nodes[0].price} />
          </span>
        </div>
      {:else}
        <Money showCurrency price={product?.variants.nodes[0].price!} />
      {/if}
    </div>
    
    <h3 class="font-primary mb-0.5 w-full text-base font-bold break-words">
      {product?.title}
    </h3>
    
    <!-- Color Swatches -->
    {#if colorVariants.length > 1}
      <div class="mt-1 flex justify-center gap-1">
        {#each colorVariants as [color, variantId]}
          <a
            href="/products/{product?.handle}?variant={variantId}"
            class="h-4 w-4 rounded-full border {getColorClass(color)} transition-all hover:ring-2 hover:ring-gray-300"
            title={color}
            data-variant-id={variantId}
          ></a>
        {/each}
      </div>
    {/if}
  </div>
</a>
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

// Get unique colors from variants
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
  small: "w-36 h-52 sm:w-40 sm:h-56 md:w-44 sm:h-60 lg:w-48 lg:h-64",
  medium: "w-44 h-64 sm:w-52 sm:h-72 md:w-60 md:h-80 lg:w-68 lg:h-96",
  large: "w-52 h-76 sm:w-60 sm:h-84 md:w-72 md:h-96 lg:w-80 lg:h-[500px]",
  extraLarge: "w-60 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[600px] lg:w-[20vw] lg:h-[700px]",
};

const cardClasses = `relative ${sizeClasses[size]}`;

// Get the second image if available
const secondImage = product?.images.nodes[1] || product?.featuredImage;
</script>

<div class="group flex flex-col h-full">
  <!-- Image is the main link -->
  <a href="/products/{product?.handle}" class="block">
    <div class="relative w-full aspect-[4/5] overflow-hidden">
      {#if isOnSale && !isSoldOut}
        <div class="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 font-semibold uppercase tracking-wider z-10">Sale</div>
      {/if}
      {#if isSoldOut}
        <div class="absolute top-3 left-3 bg-gray-700/80 text-white text-xs px-3 py-1 font-semibold uppercase tracking-wider z-10">Sold Out</div>
      {/if}
      <ShopifyImage
        classList="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        loading="eager"
        image={secondImage ?? null}
        sizes="(min-width: 1540px) 348px, (min-width: 1280px) 284px, (min-width: 1040px) 309px, (min-width: 780px) 348px, (min-width: 640px) 284px, calc(100vw - 48px)"
      />
      <ShopifyImage
        classList="w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
        loading="eager"
        image={product?.featuredImage ?? null}
        sizes="(min-width: 1540px) 348px, (min-width: 1280px) 284px, (min-width: 1040px) 309px, (min-width: 780px) 348px, (min-width: 640px) 284px, calc(100vw - 48px)"
      />
    </div>
  </a>
  <!-- Info -->
  <div class="flex flex-col items-center mt-4 space-y-1">
    <div class="font-secondary font-semibold tracking-wide text-base md:text-lg lg:text-xl text-zinc-800 text-center lg:text-center w-full">
      {#if isOnSale}
        <span class="text-sm text-gray-400 line-through mr-2">
          <Money showCurrency price={product?.variants.nodes[0].compareAtPrice!} />
        </span>
        <span>
          <Money showCurrency price={product?.variants.nodes[0].price} />
        </span>
      {:else}
        <Money showCurrency price={product?.variants.nodes[0].price!} />
      {/if}
    </div>
    <a href="/products/{product?.handle}" class="font-secondary font-semibold tracking-wide text-base md:text-lg lg:text-xl text-zinc-900 group-hover:underline transition truncate w-full text-center lg:text-center">
      {product?.title}
    </a>
    {#if colorVariants.length > 1}
      <div class="mt-1 flex justify-center gap-2">
        {#each colorVariants as [color, variantId]}
          <a
            href="/products/{product?.handle}?variant={variantId}"
            class="h-4 w-4 rounded-full border {getColorClass(color)} transition-all hover:ring-2 hover:ring-gray-300 mb-2"
            title={color}
            data-variant-id={variantId}
            aria-label={`Select color ${color}`}
          ></a>
        {/each}
      </div>
    {/if}
  </div>
</div>

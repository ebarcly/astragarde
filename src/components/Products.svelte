<script lang="ts">
import { z } from "zod";
import { ProductResult } from "../utils/schemas";
import ProductCard from "./ProductCard.svelte";

const ProductsResult = z.array(ProductResult);

interface Props {
  products: z.infer<typeof ProductsResult>;
  gap?: number;
  layout?: "horizontal" | "grid";
  cardSize?: "medium" | "large" | 'extraLarge';
}

let { products, gap = 2, layout = "grid", cardSize }: Props = $props();
</script>

<section>
  <div class="flex flex-col gap-4 py-16 sm:py-20">
    <h2 class="sr-only">Products</h2>
    {#if layout === "horizontal"}
      <div
        class="flex flex-row gap-{gap ?? 2} scrollbar-none px-0 overflow-x-auto"
      >
        {#each products as product}
          <div class="flex h-full flex-col">
            <ProductCard {product} size={cardSize} />
          </div>
        {/each}
      </div>
    {:else}
      <div
        class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-{gap}"
      >
        {#each products as product}
          <div>
            <ProductCard {product} />
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  import { register } from 'swiper/element/bundle';
  import ProductCard from './ProductCard.svelte';
  import { z } from "zod";
  import { ProductResult } from "../utils/schemas";

  
  let swiperEl: HTMLElement;

  // Register Swiper web components once
  onMount(() => {
    register();
    if (swiperEl) {
      swiperEl.breakpoints = {
        640: { slidesPerView: 2, spaceBetween: 2 },
        1024: { slidesPerView: 4, spaceBetween: 8 },
      };
    }
  });

  const ProductsResult = z.array(ProductResult);

  export let products: z.infer<typeof ProductsResult> = [];
  export let cardSize: "medium" | "large" | "extraLarge" = "medium";
</script>

<!-- Slider -->
<swiper-container
  bind:this={swiperEl}
  slides-per-view="2"
  space-between="8"
  pagination={
    {
      "clickable": true,
      "dynamicBullets": true,
      "renderBullet": (index, className) => {
        return '<span class="' + className + '">' + (index + 1) + '</span>';
      },
    }
  }
  style="width: 100%; padding: 1rem 0; margin-bottom: 4rem;"
>
  {#each products as product}
    <swiper-slide>
      <ProductCard {product} size={cardSize} />
    </swiper-slide>
  {/each}
</swiper-container>

<style>
.mySwiper {
  width: 100%;
  padding: 1rem 0;
  margin-bottom: 1rem;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border: 1px solid #000000;
}


/* Pagination */
:global(swiper-container::part(pagination)) {
    width: 100%;
    gap: 0.5rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    margin-bottom: 2rem;
}

:global(swiper-container::part(bullet)) {
  width: 12px;
  height: 12px;
  background: #c2c2c297;
  border-radius: 50%;
  opacity: 0.7;
  margin: 0 4px;
  transition: background 0.3s, opacity 0.3s;
}

:global(swiper-container::part(bullet-active)) {
  background: #111;
  opacity: 1;
}
</style>

<script lang="ts">
  import { onMount } from "svelte";
  import { initCart, cart, isCartDrawerOpen } from "../stores/cart";

  export let color: "black" | "white" = "black";

  onMount(() => {
    initCart();
  });

  function openCart() {
    isCartDrawerOpen.set(true);
  }

  $: colorClass = color === "white" ? "text-white" : "text-black";
</script>

<div>
  <button class="relative cursor-pointer" on:click={openCart}>
    <span class="sr-only">Open your cart</span>
    <svg
      class={`h-8 w-8 ${colorClass} pointer-events-none`}
      aria-hidden="true"
      focusable="false"
      role="presentation"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>icon-bag-minimal</title>

      <!-- Bag body -->
      <rect
        x="11.375"
        y="17.863"
        width="41.25"
        height="36.75"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />

      <!-- Bag handle -->
      <path
        d="M22.25 18c0-7.105 4.35-9 9.75-9s9.75 1.895 9.75 9"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
    </svg>
    {#if $cart && $cart.totalQuantity > 0}
      <div
        class="absolute -right-2 -top-1 sm:-right-1 sm:top-0 bg-emerald-900 text-white text-[12px] rounded-full"
      >
        <span class="w-5 h-5 flex justify-center text-center items-center">
          {$cart.totalQuantity}
        </span>
      </div>
    {/if}
  </button>
</div>
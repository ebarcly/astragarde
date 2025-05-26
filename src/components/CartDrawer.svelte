<script lang="ts">
  import { run } from "svelte/legacy";

  import { fade, fly } from "svelte/transition";
  import {
    cart,
    isCartDrawerOpen,
    removeCartItems,
    isCartUpdating,
    updateCartItemQuantity,
  } from "../stores/cart";
  import ShopifyImage from "./ShopifyImage.svelte";
  import Money from "./Money.svelte";
  import { clickOutside } from "../utils/click-outside";

  let cartDrawerEl: HTMLDivElement | undefined = $state();

  // Add classes to cart line items if cart is updating
  let cartIsUpdatingClass = $derived(
    $isCartUpdating ? "opacity-50 pointer-events-none" : "",
  );

  // Add focus to cart drawer when it opens
  run(() => {
    if ($isCartDrawerOpen) {
      document.querySelector("body")?.classList.add("overflow-hidden");
      cartDrawerEl?.focus();
    }
  });

  function removeItem(id: string) {
    removeCartItems([id]);
  }

  function closeCartDrawer() {
    document.querySelector("body")?.classList.remove("overflow-hidden");
    isCartDrawerOpen.set(false);
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeCartDrawer();
    }
  }

  function updateQuantity(id: string, newQuantity: number) {
    if (newQuantity > 0) {
      updateCartItemQuantity(id, newQuantity);
    } else {
      removeItem(id);
    }
  }

  // Get selected options (size and color) from the variant title
  function getSelectedOptions(title: string) {
    const options = title.split(" / ");
    const result: { size?: string; color?: string } = {};

    options.forEach((option, index) => {
      const lower = option.toLowerCase();

      if (lower.includes("size:")) {
        result.size = option.split(": ")[1];
      } else if (lower.includes("color:")) {
        result.color = option.split(": ")[1];
      } else {
        // No prefix: assume position-based
        if (index === 0) {
          result.size = option;
        } else if (index === 1) {
          result.color = option;
        }
      }
    });

    return result;
  }
</script>

{#if $isCartDrawerOpen}
  <div
    class="relative z-70"
    aria-labelledby="slide-over-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      in:fade={{ duration: 200 }}
      out:fade={{ duration: 200 }}
      class="fixed inset-0 bg-white/30 transition-opacity"
    ></div>

    <div class="fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div
          role="dialog"
          class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 focus:outline-none"
          tabindex="-1"
          use:clickOutside={() => closeCartDrawer()}
          bind:this={cartDrawerEl}
          onkeydown={onKeyDown}
        >
          <div
            in:fly={{ duration: 500, x: 500, opacity: 100 }}
            out:fly={{ duration: 500, x: 500, opacity: 100 }}
            class="pointer-events-auto w-screen max-w-lg max-h-screen bg-white"
          >
            <div class="flex flex-col min-h-full max-h-screen">
              <div class="flex items-start justify-between p-5">
                <h2
                  class="text-4xl flex gap-4 items-center font-bold font-primary text-zinc-800"
                  id="slide-over-title"
                >
                  CART
                  {#if $isCartUpdating}
                    <svg
                      class="animate-spin -ml-1 mr-3 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  {/if}
                </h2>
                <div class="ml-3 flex h-7 items-center">
                  <button
                    onclick={() => closeCartDrawer()}
                    type="button"
                    class="-m-2 p-2 text-black"
                  >
                    <span class="sr-only">Close panel</span>
                    <!-- Heroicon name: outline/x-mark -->
                    <svg
                      class="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="0.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex-1 overflow-y-auto">
                <div class="px-5">
                  {#if $cart && $cart.lines?.nodes.length > 0}
                    <!-- svelte-ignore a11y_no_redundant_roles -->
                    <ul
                      role="list"
                      class="divide-y divide-zinc-100 {cartIsUpdatingClass}"
                    >
                      {#each $cart.lines?.nodes as item}
                        {@const selectedOptions = getSelectedOptions(
                          item.merchandise.title,
                        )}
                        <li class="grid py-8 grid-cols-12 gap-3">
                          <div
                            class="overflow-hidden col-span-4 lg:col-span-3"
                          >
                            <ShopifyImage
                              image={item.merchandise.image}
                              classList="object-cover h-full object-center"
                              sizes="(min-width: 100px) 100px"
                              loading="lazy"
                            />
                          </div>
                          <div
                            class="col-span-7 lg:col-span-8 flex flex-col gap-2"
                          >
                            <a
                              class="hover:underline w-fit"
                              href={`/products/${item.merchandise.product.handle}`}
                            >
                              {item.merchandise.product.title}
                            </a>
                            {#if selectedOptions.size}
                              <p class="text-sm text-gray-500">
                                Size: {selectedOptions.size}
                              </p>
                            {/if}
                            {#if selectedOptions.color}
                              <p class="text-sm text-gray-500">
                                Color: {selectedOptions.color}
                              </p>
                            {/if}
                            <p class="text-xs">
                              <Money
                                price={item.cost.amountPerQuantity}
                                showCurrency={false}
                              />
                            </p>
                            <div class="flex items-center">
                              <button
                                type="button"
                                class="cursor-pointer w-8 h-6 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                                onclick={() =>
                                  updateQuantity(item.id, item.quantity - 1)}
                                disabled={$isCartUpdating}
                              >
                                -
                              </button>
                              <span class="w-8 text-center"
                                >{item.quantity}</span
                              >
                              <button
                                type="button"
                                class="cursor-pointer w-8 h-6 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                                onclick={() =>
                                  updateQuantity(item.id, item.quantity + 1)}
                                disabled={$isCartUpdating}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div
                            class="col-span-2 lg:col-span-1 flex items-center justify-end"
                          >
                            <p class="font-medium">
                              <Money
                                price={item.cost.totalAmount}
                                showCurrency={false}
                              />
                            </p>
                          </div>
                        </li>
                      {/each}
                    </ul>
                  {:else}
                    <div class="mt-4">
                      <p class="text-black font-primary">
                        Your cart is currently empty.
                      </p>
                    </div>
                  {/if}
                </div>
              </div>

              <div class="">
                {#if $cart && $cart.lines?.nodes.length > 0}
                  <div class="border-t border-zinc-200 py-6 px-4 sm:px-6">
                    <div
                      class="flex justify-between text-base font-medium text-gray-900"
                    >
                      <p>Subtotal</p>
                      <p>
                        <Money
                          price={$cart.cost.subtotalAmount}
                          showCurrency={true}
                        />
                      </p>
                    </div>
                    <p class="mt-0.5 text-sm text-gray-500">
                      Shipping, taxes, and discount codes calculated at checkout.
                    </p>
                    <div class="mt-6">
                      <a href={$cart.checkoutUrl} class="button">Checkout</a>
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

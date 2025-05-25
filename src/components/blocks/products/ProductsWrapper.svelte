<script lang="ts">
  import { filters } from "$/stores/filters";
  import { onMount } from "svelte";
  import Products from "$/components/Products.svelte";

  let { buyerIp } = $props<{ buyerIp: string }>();

  let products = $state([]);
  let isLoading = $state(true); // loading state

  async function fetchProducts(currentFilters: any) {
    isLoading = true;
    const params = new URLSearchParams(currentFilters);
    try {
      const res = await fetch(
        `/api/products?buyerIp=${encodeURIComponent(buyerIp)}${params.toString() ? `&${params.toString()}` : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      products = await res.json();
    } catch (error) {
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchProducts(filters.value);
  });

  filters.subscribe((val) => {
    fetchProducts(val);
  });
</script>

{#if isLoading}
  <div class="py-20 text-center text-gray-500 h-screen">Cargando productos...</div>
{:else}
  <Products {products} />
{/if}
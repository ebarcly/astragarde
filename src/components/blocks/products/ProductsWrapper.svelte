<script lang="ts">
  import { filters } from "$/stores/filters";
  import { sort, getSortQuery, type SortOption } from "$/stores/sort";
  import { onMount } from "svelte";
  import Products from "$/components/Products.svelte";

  let { buyerIp } = $props<{ buyerIp: string }>();

  let products = $state([]);
  let isLoading = $state(true);
  let mounted = $state(false);

  async function fetchProducts(currentFilters: any, currentSort: SortOption) {
    isLoading = true;
    const params = new URLSearchParams(currentFilters);
    
    // Add required parameters
    params.set('buyerIp', buyerIp);
    const { sortKey, reverse } = getSortQuery(currentSort);
    params.set('sortKey', sortKey);
    params.set('reverse', reverse.toString());
    
    try {
      const res = await fetch(`/api/products?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      products = await res.json();
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    mounted = true;
    fetchProducts(filters.value, sort.get());
  });

  // Subscribe to both filters and sort changes, but only after mount
  filters.subscribe((val) => {
    if (mounted) {
      fetchProducts(val, sort.get());
    }
  });

  sort.subscribe((val) => {
    if (mounted) {
      fetchProducts(filters.value, val);
    }
  });
</script>

{#if isLoading}
  <div class="py-20 text-center text-zinc-700 h-screen">Loading products...</div>
{:else if products.length === 0}
  <div class="py-20 text-center text-zinc-700 h-screen text-2xl font-primary">No products found. Try adjusting your filters.</div>
{:else}
  <Products {products} />
{/if}

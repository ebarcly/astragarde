<!-- PredictiveSearch.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { ProductResult } from '$/utils/schemas';
  
  // Props
  export let placeholder: string = 'Search products...';
  export let limit: number = 6;
  export let minChars: number = 2;
  export let debounceMs: number = 300;
  export let showImages: boolean = true;
  
  // State
  let searchInput: string = '';
  let searchResults: ProductResult[] = [];
  let isLoading: boolean = false;
  let isOpen: boolean = false;
  let searchContainer: HTMLDivElement;
  let searchInputElement: HTMLInputElement;
  let debounceTimer: NodeJS.Timeout;
  
  // Search function
  async function searchProducts(query: string) {
    if (!query || query.length < minChars) {
      searchResults = [];
      isOpen = false;
      return;
    }
    
    isLoading = true;
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          limit: limit
        })
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const products = await response.json();
      searchResults = products;
      isOpen = true;
    } catch (error) {
      console.error('Search error:', error);
      searchResults = [];
      isOpen = false;
    } finally {
      isLoading = false;
    }
  }
  
  // Debounced search
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    searchInput = target.value;
    
    clearTimeout(debounceTimer);
    
    if (searchInput.length === 0) {
      searchResults = [];
      isOpen = false;
      return;
    }
    
    debounceTimer = setTimeout(() => {
      searchProducts(searchInput);
    }, debounceMs);
  }
  
  // Handle click outside to close
  function handleClickOutside(event: MouseEvent) {
    if (searchContainer && !searchContainer.contains(event.target as Node)) {
      isOpen = false;
    }
  }
  
  // Handle escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
      searchInputElement?.blur();
    }
  }
  
  // Format price
  function formatPrice(amount: string, currencyCode: string): string {
    const price = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  }
  
  // Handle product click
  function handleProductClick(handle: string) {
    window.location.href = `/products/${handle}`;
  }
  
  // Handle view all results
  function handleViewAll() {
    window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
  }
  
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeydown);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeydown);
      clearTimeout(debounceTimer);
    };
  });
</script>

<div bind:this={searchContainer} class="relative w-full max-w-2xl mx-auto">
  <!-- Search Input -->
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    
    <input
      bind:this={searchInputElement}
      type="text"
      class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white"
      {placeholder}
      value={searchInput}
      on:input={handleInput}
      on:focus={() => searchInput && searchResults.length > 0 && (isOpen = true)}
    />
    
    <!-- Loading spinner -->
    {#if isLoading}
      <div class="absolute inset-y-0 right-0 pr-4 flex items-center">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
      </div>
    {/if}
    
    <!-- Clear button -->
    {#if searchInput && !isLoading}
      <button
        class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
        on:click={() => {
          searchInput = '';
          searchResults = [];
          isOpen = false;
          searchInputElement?.focus();
        }}
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    {/if}
  </div>
  
  <!-- Search Results Dropdown -->
  {#if isOpen && searchResults.length > 0}
    <div 
      class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
      role="listbox"
    >
      <!-- Products Header -->
      <div class="px-4 py-3 border-b border-gray-100">
        <h3 class="text-sm font-medium text-gray-900 uppercase tracking-wide">Products</h3>
      </div>
      
      <!-- Product Results -->
      <div class="py-2">
        {#each searchResults as product}
          <button
            class="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150 text-left"
            on:click={() => handleProductClick(product.handle)}
          >
            <!-- Product Image -->
            {#if showImages && product.featuredImage}
              <div class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText || product.title}
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            {:else}
              <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            {/if}
            
            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 truncate">{product.title}</h4>
              {#if product.variants.nodes.length > 0}
                <p class="text-sm text-gray-600 mt-1">
                  {formatPrice(product.variants.nodes[0].price.amount, product.variants.nodes[0].price.currencyCode)}
                </p>
              {/if}
            </div>
            
            <!-- Arrow -->
            <div class="flex-shrink-0">
              <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        {/each}
      </div>
      
      <!-- View All Results -->
      {#if searchResults.length >= limit}
        <div class="border-t border-gray-100">
          <button
            class="w-full px-4 py-3 text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-150 font-medium"
            on:click={handleViewAll}
          >
            Show all results for "{searchInput}" →
          </button>
        </div>
      {/if}
    </div>
  {/if}
  
  <!-- No Results -->
  {#if isOpen && searchInput.length >= minChars && !isLoading && searchResults.length === 0}
    <div class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div class="px-4 py-6 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search terms</p>
      </div>
    </div>
  {/if}
</div>
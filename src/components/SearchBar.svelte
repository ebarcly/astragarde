<!-- SearchBar.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { ProductResult } from '$/utils/schemas';
  
  // Props
  export let placeholder: string = 'Search products...';
  export let limit: number = 6;
  export let minChars: number = 2;
  export let debounceMs: number = 300;
  export let showImages: boolean = true;
  export let initialQuery: string = '';
  
  // State
  let searchInput: string = initialQuery;
  let searchResults: ProductResult[] = [];
  let isLoading: boolean = false;
  let searchInputElement: HTMLInputElement;
  let debounceTimer: NodeJS.Timeout;
  let showDropdown: boolean = false;
  let resultsContainer: HTMLDivElement;
  
  // Search function
  async function searchProducts(query: string) {
    if (!query || query.length < minChars) {
      searchResults = [];
      showDropdown = false;
      return;
    }
    
    isLoading = true;
    showDropdown = true;
    
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
    } catch (error) {
      console.error('Search error:', error);
      searchResults = [];
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
      showDropdown = false;
      return;
    }
    
    debounceTimer = setTimeout(() => {
      searchProducts(searchInput);
    }, debounceMs);
  }
  
  // Handle form submission
  function handleSubmit(event: Event) {
    event.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  }
  
  // Handle focus
  function handleFocus() {
    if (searchInput.length >= minChars && searchResults.length > 0) {
      showDropdown = true;
    }
  }
  
  // Handle blur (with delay to allow clicks)
  function handleBlur() {
    setTimeout(() => {
      showDropdown = false;
    }, 200);
  }
  
  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      showDropdown = false;
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
    showDropdown = false;
    window.location.href = `/products/${handle}`;
  }
  
  // Handle view all results
  function handleViewAll() {
    showDropdown = false;
    window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
  }
  
  // Handle click outside
  function handleClickOutside(event: MouseEvent) {
    if (resultsContainer && !resultsContainer.contains(event.target as Node)) {
      showDropdown = false;
    }
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

<div class="relative w-full max-w-2xl" bind:this={resultsContainer}>
  <!-- Search Form -->
  <form on:submit={handleSubmit} class="relative">
    <div class="relative flex items-center">
      <!-- Search Icon -->
      <div class="absolute left-3 flex-shrink-0">
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <!-- Search Input -->
      <input
        bind:this={searchInputElement}
        type="text"
        class="w-full pl-10 pr-20 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        {placeholder}
        bind:value={searchInput}
        on:input={handleInput}
        on:focus={handleFocus}
        on:blur={handleBlur}
        autocomplete="off"
      />
      
      <!-- Loading spinner -->
      {#if isLoading}
        <div class="absolute right-12 flex-shrink-0">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      {/if}
      
      <!-- Search Button -->
      <button
        type="submit"
        class="absolute right-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Search
      </button>
    </div>
  </form>
  
  <!-- Dropdown Results -->
  {#if showDropdown && searchInput.length >= minChars}
    <div class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
      {#if searchResults.length > 0}
        <!-- Product Results -->
        <div class="py-2">
          {#each searchResults as product}
            <button
              class="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150 text-left"
              on:click={() => handleProductClick(product.handle)}
            >
              <!-- Product Image -->
              {#if showImages && product.featuredImage}
                <div class="flex-shrink-0 w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              {:else}
                <div class="flex-shrink-0 w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div class="border-t border-gray-100">
          <button
            class="w-full px-4 py-3 text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-150 font-medium"
            on:click={handleViewAll}
          >
            Show all results for "{searchInput}" →
          </button>
        </div>
      {:else if !isLoading}
        <!-- No Results -->
        <div class="px-4 py-6 text-center">
          <svg class="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p class="mt-1 text-sm text-gray-500">Try adjusting your search terms</p>
        </div>
      {/if}
    </div>
  {/if}
</div>
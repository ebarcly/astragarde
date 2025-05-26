<!-- PredictiveSearchDialog.svelte -->
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
  let dialogElement: HTMLDialogElement;
  let searchInputElement: HTMLInputElement;
  let debounceTimer: NodeJS.Timeout;
  
  // Search function
  async function searchProducts(query: string) {
    if (!query || query.length < minChars) {
      searchResults = [];
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
      return;
    }
    
    debounceTimer = setTimeout(() => {
      searchProducts(searchInput);
    }, debounceMs);
  }
  
  // Open dialog
  function openDialog() {
    isOpen = true;
    dialogElement?.showModal();
    // Focus input after dialog opens
    setTimeout(() => {
      searchInputElement?.focus();
    }, 100);
  }
  
  // Close dialog
  function closeDialog() {
    isOpen = false;
    dialogElement?.close();
    // Reset state
    searchInput = '';
    searchResults = [];
    clearTimeout(debounceTimer);
  }
  
  // Handle backdrop click
  function handleDialogClick(event: MouseEvent) {
    if (event.target === dialogElement) {
      closeDialog();
    }
  }
  
  // Handle escape key and other keyboard shortcuts
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeDialog();
    }
    // Optional: Cmd/Ctrl + K to open search (common pattern)
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      if (!isOpen) {
        openDialog();
      }
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
    closeDialog();
    window.location.href = `/products/${handle}`;
  }
  
  // Handle view all results
  function handleViewAll() {
    closeDialog();
    window.location.href = `/search?q=${encodeURIComponent(searchInput)}`;
  }
  
  // Listen for custom event from navigation
  function handleSearchOpen() {
    openDialog();
  }
  
  onMount(() => {
    // Listen for global keyboard shortcuts
    document.addEventListener('keydown', handleKeydown);
    
    // Listen for custom search event from navigation
    document.addEventListener('open-search', handleSearchOpen);
    
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('open-search', handleSearchOpen);
      clearTimeout(debounceTimer);
    };
  });
</script>

<!-- Dialog Element -->
<dialog
  bind:this={dialogElement}
  class="bg-transparent border-none outline-none max-w-2xl w-full mx-auto mt-20 p-0 rounded-lg shadow-2xl"
  on:click={handleDialogClick}
>
  <!-- Dialog Content -->
  <div class="bg-white rounded-lg overflow-hidden">
    <!-- Header with Search Input -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <!-- Search Icon -->
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <!-- Search Input -->
        <input
          bind:this={searchInputElement}
          type="text"
          class="flex-1 text-lg border-none outline-none bg-transparent placeholder-gray-500"
          {placeholder}
          value={searchInput}
          on:input={handleInput}
        />
        
        <!-- Loading spinner -->
        {#if isLoading}
          <div class="flex-shrink-0">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
        {/if}
        
        <!-- Close button -->
        <button
          class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 rounded"
          on:click={closeDialog}
          aria-label="Close search"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Search Results -->
    {#if searchInput.length >= minChars}
      <div class="max-h-96 overflow-y-auto">
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
        {:else if !isLoading}
          <!-- No Results -->
          <div class="px-4 py-8 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p class="mt-1 text-sm text-gray-500">Try adjusting your search terms</p>
          </div>
        {/if}
      </div>
    {:else if searchInput.length > 0 && searchInput.length < minChars}
      <!-- Minimum characters message -->
      <div class="px-4 py-8 text-center">
        <p class="text-sm text-gray-500">Type at least {minChars} characters to search</p>
      </div>
    {:else}
      <!-- Empty state -->
      <div class="px-4 py-8 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-500">Start typing to search products</h3>
        <p class="mt-1 text-xs text-gray-400">Press Escape to close</p>
      </div>
    {/if}
  </div>
</dialog>
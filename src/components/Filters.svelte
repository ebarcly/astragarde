<script lang="ts">
  import { onMount } from "svelte";
  import { filters } from "$lib/stores/filters";
  import { Slider } from "$lib/components/ui/slider/index.js";

  // Props
  interface Props {
    idPrefix?: string;
  }

  let { idPrefix = "" }: Props = $props();

  // Component state using runes
  let minPrice = $state(0);
  let maxPrice = $state(199);
  let currentMinPrice = $state(0);
  let currentMaxPrice = $state(400);
  let availability = $state<string | null>(null);
  let filterMinPrice = $state<number | null>(null);
  let filterMaxPrice = $state<number | null>(null);
  let sliderValue = $state([0, 400]);

  // UI state
  let availabilityExpanded = $state(true);
  let priceExpanded = $state(true);

  // Derived values using $derived
  let hasActiveFilters = $derived(
    availability !== null || filterMinPrice !== null || filterMaxPrice !== null,
  );
  let availabilityTagText = $derived(
    availability === "true" ? "IN STOCK" : "OUT OF STOCK",
  );
  let priceTagText = $derived(() => {
    const minText = filterMinPrice ? `$${filterMinPrice}` : "$0";
    const maxText = filterMaxPrice ? `$${filterMaxPrice}` : "$400";
    return `${minText} - ${maxText}`;
  });

  // Update current prices when slider value changes
  $effect(() => {
    if (sliderValue && sliderValue.length === 2) {
      currentMinPrice = sliderValue[0];
      currentMaxPrice = sliderValue[1];
    }
  });

  // Functions
  function toggleSection(section: "availability" | "price") {
    if (section === "availability") {
      availabilityExpanded = !availabilityExpanded;
    } else {
      priceExpanded = !priceExpanded;
    }
  }

  function handleAvailabilityFilter(value: string) {
    if (availability === value) {
      availability = null;
    } else {
      availability = value;
    }
    updateFilters();
  }

  function handleSliderChange(value: number[]) {
    if (value && value.length === 2) {
      sliderValue = value;
      currentMinPrice = value[0];
      currentMaxPrice = value[1];
      filterMinPrice = currentMinPrice > minPrice ? currentMinPrice : null;
      filterMaxPrice = currentMaxPrice < maxPrice ? currentMaxPrice : null;
      updateFilters();
    }
  }

  function removeFilter(filterType: string) {
    if (filterType === "availability") {
      availability = null;
    } else if (filterType === "price") {
      filterMinPrice = null;
      filterMaxPrice = null;
      currentMinPrice = minPrice;
      currentMaxPrice = maxPrice;
      sliderValue = [minPrice, maxPrice];
    }
    updateFilters();
  }

  function updateURL() {
    const url = new URL(window.location.href);

    // Clear existing filter params
    url.searchParams.delete("availability");
    url.searchParams.delete("minPrice");
    url.searchParams.delete("maxPrice");

    // Add active filters
    if (availability !== null) {
      url.searchParams.set("availability", availability);
    }

    if (filterMinPrice !== null) {
      url.searchParams.set("minPrice", filterMinPrice.toString());
    }

    if (filterMaxPrice !== null) {
      url.searchParams.set("maxPrice", filterMaxPrice.toString());
    }

    // Update URL without page reload
    window.history.replaceState({}, "", url);
  }

  function updateStore() {
    // Create a clean filter object with only non-null values
    const activeFilters: Record<string, string | number> = {};

    if (availability !== null) {
      activeFilters.availability = availability;
    }

    if (filterMinPrice !== null) {
      activeFilters.minPrice = filterMinPrice;
    }

    if (filterMaxPrice !== null) {
      activeFilters.maxPrice = filterMaxPrice;
    }

    // Update the nanostores filters atom
    filters.set(activeFilters);
  }

  function updateFilters() {
    updateURL();
    updateStore();
  }

  function loadFiltersFromURL() {
    const url = new URL(window.location.href);

    // Load availability filter
    const availabilityParam = url.searchParams.get("availability");
    if (availabilityParam === "true" || availabilityParam === "false") {
      availability = availabilityParam;
    }

    // Load price filters
    const minPriceParam = url.searchParams.get("minPrice");
    const maxPriceParam = url.searchParams.get("maxPrice");

    if (minPriceParam && !isNaN(Number(minPriceParam))) {
      currentMinPrice = Number(minPriceParam);
      filterMinPrice = Number(minPriceParam);
    }

    if (maxPriceParam && !isNaN(Number(maxPriceParam))) {
      currentMaxPrice = Number(maxPriceParam);
      filterMaxPrice = Number(maxPriceParam);
    }

    // Update slider value
    sliderValue = [currentMinPrice, currentMaxPrice];
    updateStore();
  }

  // Mount logic
  onMount(() => {
    loadFiltersFromURL();
  });
</script>

<div
  class="p-4 rounded-sm bg-white shadow w-full max-w-full relative z-10 border border-zinc-200"
>
  <!-- Active Filter Tags -->
  {#if hasActiveFilters}
    <div
      id="activeFilterTags"
      class="mb-4 space-y-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {#if availability !== null}
        <div
          class="bg-green-700 text-white px-4 py-2 rounded flex items-center justify-between text-sm font-medium transition-all duration-200 ease-in-out"
        >
          <span>{availabilityTagText}</span>
          <button
            class="ml-2 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
            onclick={() => removeFilter("availability")}
            aria-label="Remove availability filter"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      {/if}

      {#if filterMinPrice !== null || filterMaxPrice !== null}
        <div
          class="bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-between text-sm font-medium transition-all duration-200 ease-in-out"
        >
          <span>{priceTagText}</span>
          <button
            class="ml-2 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
            onclick={() => removeFilter("price")}
            aria-label="Remove price filter"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Availability Filter -->
  <div class="mb-8">
    <button
      class="flex items-center justify-between text-left mb-4 focus:outline-none w-full"
      onclick={() => toggleSection("availability")}
    >
      <h3 class="text-sm font-medium tracking-wider uppercase text-gray-900">
        Availability
      </h3>
      <svg
        class="w-4 h-4 text-gray-500 transform transition-transform {availabilityExpanded
          ? 'rotate-180'
          : ''}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>

    {#if availabilityExpanded}
      <div class="space-y-3">
        <button
          class="flex items-center cursor-pointer text-left hover:bg-gray-100 p-1 rounded w-full"
          onclick={() => handleAvailabilityFilter("true")}
        >
          <div
            class="w-4 h-4 mr-3 flex-shrink-0 flex items-center justify-center border border-gray-300"
          >
            {#if availability === "true"}
              <div class="w-3 h-3 bg-black"></div>
            {/if}
          </div>
          <span
            class="text-gray-900 {availability === 'true' ? 'font-bold' : ''}"
            >In stock</span
          >
        </button>

        <button
          class="flex items-center cursor-pointer text-left hover:bg-gray-100 p-1 rounded w-full"
          onclick={() => handleAvailabilityFilter("false")}
        >
          <div
            class="w-4 h-4 mr-3 flex-shrink-0 flex items-center justify-center border border-gray-300"
          >
            {#if availability === "false"}
              <div class="w-3 h-3 bg-black"></div>
            {/if}
          </div>
          <span
            class="text-gray-900 {availability === 'false' ? 'font-bold' : ''}"
            >Out of stock</span
          >
        </button>
      </div>
    {/if}
  </div>

  <!-- Price Filter -->
  <div class="mb-8 w-full">
    <button
      class="flex items-center justify-between text-left mb-4 focus:outline-none w-full"
      onclick={() => toggleSection("price")}
    >
      <h3 class="text-sm font-medium tracking-wider uppercase text-gray-900">
        Price
      </h3>
      <svg
        class="w-4 h-4 text-gray-500 transform transition-transform {priceExpanded
          ? 'rotate-180'
          : ''}"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>

    {#if priceExpanded}
      <div class="space-y-4">
        <!-- Price Range Display -->
        <div class="flex justify-between text-sm text-gray-900">
          <span>${currentMinPrice.toFixed(2)}</span>
          <span>${currentMaxPrice.toFixed(2)}</span>
        </div>

        <!-- ShadCN Slider Component -->
        <Slider
          max={maxPrice}
          step={1}
          bind:value={sliderValue}
          onValueChange={handleSliderChange}
          class="w-full"
        />
      </div>
    {/if}
  </div>
</div>

<style>
  /* Custom styles if needed for ShadCN integration */
</style>

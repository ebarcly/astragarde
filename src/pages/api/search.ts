// src/pages/api/search.ts
import type { APIRoute } from "astro";
import { getProducts } from "$/utils/shopify";

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  try {
    const { query, limit = 6 } = await request.json();

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Get the client IP for Shopify's buyer IP requirement
    const buyerIP =
      url.searchParams.get("buyerIP") ||
      request.headers.get("x-forwarded-for") ||
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-real-ip") ||
      request.headers.get("x-client-ip") ||
      request.headers.get("x-cluster-client-ip") ||
      request.headers.get("x-forwarded") ||
      request.headers.get("forwarded-for") ||
      request.headers.get("forwarded") ||
      "::1";

    // Search products using your existing getProducts function
    const products = await getProducts({
      limit: Number(limit),
      buyerIP,
      query: query.trim(),
      sortKey: "RELEVANCE", // Use relevance for search results
    });

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Search API error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};

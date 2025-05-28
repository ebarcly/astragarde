import { getProducts } from "$/utils/shopify";

export async function GET({
  request,
  clientAddress,
}: {
  request: Request;
  clientAddress: any;
}) {
  const url = new URL(request.url);

  const isAvailable = url.searchParams.get("availability")?.toLowerCase();
  const priceMin = url.searchParams.get("minPrice");
  const priceMax = url.searchParams.get("maxPrice");
  const sortKey = url.searchParams.get("sortKey");
  const reverse = url.searchParams.get("reverse") === "true";

  const buyerIP =
    clientAddress ||
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

    console.log(buyerIP)
    
  // Build query parts
  const queryParts = [];

  // Availability filter
  if (isAvailable) {
    const availabilityQuery =
      isAvailable === "true"
        ? "available_for_sale:true"
        : "available_for_sale:false";
    queryParts.push(availabilityQuery);
  }

  // Price range filters
  if (priceMin && !isNaN(Number(priceMin))) {
    queryParts.push(`variants.price:>=${priceMin}`);
  }

  if (priceMax && !isNaN(Number(priceMax))) {
    queryParts.push(`variants.price:<=${priceMax}`);
  }

  const query = queryParts.length > 0 ? queryParts.join(" AND ") : "";

  const products = await getProducts({
    limit: 10,
    buyerIP,
    query: query || undefined, // Pass undefined if no query to avoid empty string
    sortKey: sortKey || undefined,
    reverse: reverse
  });

  return new Response(JSON.stringify(products), {
    headers: { "Content-Type": "application/json" },
  });
}

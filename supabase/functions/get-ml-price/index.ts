
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { url } = await req.json()
        if (!url) {
            throw new Error('URL is required')
        }

        console.log(`Processing URL: ${url}`);

        // 1. Follow redirects to get the real MLB item ID
        const response = await fetch(url, { redirect: 'follow' });
        const finalUrl = response.url;
        console.log(`Final URL: ${finalUrl}`);

        // Extract MLB ID (e.g., MLB-12345678 or MLB12345678)
        // Common patterns: /p/MLB123, /MLB-123, etc.
        // Regex looking for MLB followed by digits
        const mlbMatch = finalUrl.match(/(MLB-?\d+)/i);

        if (!mlbMatch) {
            // Fallback: try to fetch the HTML and look for item ID in meta tags if URL structure is weird
            // But for now, let's assume URL contains it.
            throw new Error('Could not extract Mercado Livre Product ID from URL');
        }

        let itemId = mlbMatch[1].replace('-', ''); // Remove dash if present: MLB-123 -> MLB123
        console.log(`Extracted Item ID: ${itemId}`);

        // 2. Fetch details from Mercado Livre API
        const mlApiUrl = `https://api.mercadolibre.com/items/${itemId}`;
        const mlResponse = await fetch(mlApiUrl);

        if (!mlResponse.ok) {
            throw new Error(`Failed to fetch details from Mercado Livre API: ${mlResponse.statusText}`);
        }

        const mlData = await mlResponse.json();

        const result = {
            title: mlData.title,
            price: mlData.price,
            currency_id: mlData.currency_id,
            thumbnail: mlData.pictures?.[0]?.url || mlData.thumbnail,
            permalink: mlData.permalink,
        };

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})

require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

const YELP_API_KEY = process.env.YELP_API_KEY;

if (!YELP_API_KEY) {
  console.error("Error: YELP_API_KEY environment variable is required.");
  console.error("Run with: YELP_API_KEY=your_key node server.js");
  process.exit(1);
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/restaurants", async (req, res) => {
  const city = (req.query.city || "").trim();
  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }
  if (city.length > 100) {
    return res.status(400).json({ error: "City name is too long" });
  }

  const offset = Math.max(0, parseInt(req.query.offset) || 0);
  const limit = 20;

  const params = new URLSearchParams({
    location: city,
    term: "restaurants",
    limit: String(limit),
    offset: String(offset),
    radius: "8047", // ~5 miles in meters
    sort_by: "best_match",
  });

  try {
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/search?${params}`,
      {
        headers: { Authorization: `Bearer ${YELP_API_KEY}` },
      }
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error("Yelp API error:", response.status, errorBody);

      let message = "Yelp API request failed";
      if (response.status === 401) {
        message = "Invalid API key. Please check your YELP_API_KEY.";
      } else if (response.status === 400) {
        message = "Could not find that location. Yelp may not have coverage for this area. Please check the spelling or try a different city.";
      } else if (response.status === 429) {
        message = "Too many requests. Please wait a moment and try again.";
      } else if (response.status >= 500) {
        message = "Yelp service is temporarily unavailable. Try again later.";
      }

      return res.status(response.status).json({ error: message });
    }

    const data = await response.json();

    if (!data.businesses || !Array.isArray(data.businesses)) {
      return res.status(502).json({ error: "Unexpected response from Yelp API" });
    }

    const restaurants = data.businesses.map((b) => ({
      name: b.name,
      rating: b.rating ?? 0,
      review_count: b.review_count ?? 0,
      address: b.location?.display_address?.join(", ") || "Address unavailable",
      latitude: b.coordinates?.latitude ?? null,
      longitude: b.coordinates?.longitude ?? null,
      image_url: b.image_url || null,
      price: b.price || null,
      categories: (b.categories || []).map((c) => c.title),
      phone: b.display_phone || null,
      url: b.url || null,
    }));

    res.json({
      restaurants,
      total: data.total || restaurants.length,
      offset,
      limit,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

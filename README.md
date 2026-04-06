# StartFruit — Restaurant Finder

A simple JavaScript web app that lets you search any city and browse restaurants using real-time data from the Yelp Fusion API.

**Live demo:** [starfruit-express.onrender.com](https://starfruit-express.onrender.com/)

## Approach

I built a Node.js/Express backend that proxies requests to the Yelp Fusion API, keeping the API key server-side so it's never exposed to the browser. The frontend is vanilla HTML/CSS/JS — no frameworks, no build step — with a search input that fetches restaurants by city.

I used Yelp's [`radius`](https://docs.developer.yelp.com/reference/v3_business_search) parameter set to 8047 meters (~5 miles) and `best_match` sorting to keep results relevant and within city limits. The UI displays each restaurant as a card with its photo, name, star rating, cuisine categories, address, phone number, and coordinates. Results are paginated at 20 per page.

## Accuracy & Edge Cases

| Scenario | How it's handled |
|---|---|
| Empty or whitespace-only input | Validated client-side (`required`) and server-side (400 response) |
| City name too long (>100 chars) | Rejected server-side with a clear error |
| Invalid or expired API key | 401 detected, user sees "Invalid API key" message |
| City not found / no Yelp coverage | Friendly message suggesting the area may not be covered |
| Yelp rate limiting (429) | User told to wait and try again |
| Yelp server outage (5xx) | User told service is temporarily unavailable |
| Missing restaurant data (no photo, no phone, no coordinates) | Graceful fallbacks — placeholder image, fields omitted or shown as "Unavailable" |
| XSS via city input | All user input is HTML-escaped before rendering |
| API key security | Stored in `.env`, proxied through backend, never sent to the browser |

## Setup

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd StartFruit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your Yelp API key**

   Create a `.env` file in the project root:
   ```
   YELP_API_KEY=your_api_key_here
   ```
   Get a key at [Yelp Fusion](https://fusion.yelp.com/).

4. **Run the app**
   ```bash
   npm start
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## Project Structure

```
StartFruit/
├── server.js          # Express server, Yelp API proxy
├── public/
│   └── index.html     # Frontend (HTML + CSS + JS, single file)
├── .env               # Yelp API key (not committed)
├── .gitignore
├── package.json
└── README.md
```

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **API:** [Yelp Fusion Business Search](https://docs.developer.yelp.com/reference/v3_business_search)

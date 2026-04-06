# StartFruit — Restaurant Finder

A simple JavaScript web app that uses the Yelp Fusion API to fetch and display restaurants for any city.

## Approach

I built a Node.js/Express backend that proxies requests to the Yelp Fusion API, keeping the API key server-side. The frontend is vanilla HTML/CSS/JS — no frameworks — with a search input that fetches restaurants by city. I used Yelp's `radius` parameter (8047m / ~5 miles) and `best_match` sorting to keep results relevant to the searched city. The UI displays name, rating, address, and coordinates with pagination for browsing through results.

## Accuracy & Edge Cases

- Empty/missing city input is validated both client-side (`required` field) and server-side (400 error).
- Yelp API radius is capped at 5 miles to ensure results stay within city limits.
- API errors are caught and surfaced to the user with clear messages.
- User input is HTML-escaped to prevent XSS.
- The API key is stored in `.env` and never exposed to the browser.

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

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **API:** Yelp Fusion Business Search

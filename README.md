# ShopSphere — E-commerce Capstone

Responsive React + Vite product catalog with reusable components, client-side routes, search, category filtering, sorting, product detail pages, a persistent cart, and a demo checkout.

## Run locally
Requires Node.js 20.19+ or 22.12+ and npm.
```bash
npm install
npm run dev
```
Open the local URL shown in the terminal (usually http://localhost:5173).

## Test production build
```bash
npm run build
npm run preview
```

## Deploy to Vercel
1. Push the project folder to a GitHub repository.
2. Import that repository at https://vercel.com/new
3. Build command: `npm run build`; output directory: `dist`.
4. Deploy and copy the public URL.

Product photos are loaded from Unsplash and require an internet connection. This is a frontend demo: checkout does not process real payments or create real orders.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🇫🇷 Performance-Optimized French SEO

This project is optimized for French-speaking audiences with lightweight, performance-focused SEO implementation.

### Key Features

#### 1. **French-First Strategy**

-   French (`fr`) as default locale at root domain
-   English content served from `/en` subdirectory
-   New domain: `https://gossip.cavdar.fr`

#### 2. **Lightweight Metadata**

-   Dynamic, locale-aware metadata generation
-   Essential French keywords without bloat
-   Geographic targeting for France
-   Proper canonical URLs and hreflang

#### 3. **Performance Optimizations**

-   Removed heavy structured data components
-   Simplified middleware for faster routing
-   Minimal SEO headers for reduced overhead
-   Streamlined sitemap generation

#### 4. **Essential SEO Elements**

-   French content prioritized in search results
-   Clean robots.txt with broad search engine support
-   OpenGraph tags for social sharing
-   Proper language alternates

### Implementation

-   `src/app/[locale]/layout.tsx` - Lightweight metadata
-   `src/middleware.ts` - Fast locale detection
-   `src/lib/seo-utils.ts` - Essential SEO utilities
-   `src/app/sitemap.ts` - Performance-focused sitemap
-   `src/app/robots.ts` - Clean robots configuration

### Performance Benefits

✅ **Fast page loads** - No heavy SEO components  
✅ **Minimal overhead** - Essential metadata only  
✅ **French priority** - Better rankings for French users  
✅ **Clean codebase** - Maintainable SEO implementation

### Quick Setup

1. Domain pointing to `https://gossip.cavdar.fr`
2. Google Search Console for both languages
3. Monitor French search performance
4. Test with French geo-location

This implementation provides excellent French SEO without impacting app performance!

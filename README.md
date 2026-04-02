# 🎬 Affect: Your Personal Economic Radar

> The economy, translated to your wallet. A cinematic, AI-powered news engine that turns global headlines into personalized financial awareness.

## Inspiration
Most financial news is written for Wall Street, not for the person paying rent in Mumbai or buying a car in New York. We noticed a massive "translation gap": a headline like *"Central Bank raises repo rate by 25bps"* sounds like noise to most people, but it mathematically translates to a real-world squeeze on personal liquidity where `ΔEMI = +₹1,200`. We built **Affect** to bridge that gap—turning cold global data into warm, personalized awareness.

## What it does
Affect is a **Personal Economic Radar**. It pulls live global business and economic news and immediately analyzes every story through the lens of your specific life stage. Using large language models, Affect calculates how a macroeconomic shift intersects with your personal variables (age, housing, employment, income) to determine your wallet impact. It then translates these stories into a "Cinematic Editorial" feed, ranking the news by the severity of its impact on your specific life.

## How we built it
We built the frontend using **Next.js 15 (App Router)** to ensure a lightning-fast, SEO-optimized experience. For styling, we utilized **Tailwind CSS v4** to create a cutting-edge design system built around a "dark luxury newspaper" aesthetic, complete with fluid **Framer Motion** animations. 

The core intelligence is powered by **Llama 3.3 70B** (via the OpenRouter API), which handles complex economic reasoning securely via Next.js Server Actions. We pull real-time data using the NewsAPI, and designed a custom layout architecture to create a seamless, responsive experience that scales from a mobile-first app into a beautiful multi-column desktop reading environment.

## Built For Hackanomics
Building for Hackanomics taught us the raw power of combining modern AI with dense macroeconomic matrices. We learned that the real challenge of "open finance" isn't just about accessing open datasets; it's about *translation*. We discovered how to successfully prompt large language models to act as personal actuaries rather than just summarizers. Navigating the complexity of transforming terrifying economic jargon into a simple, actionable `+₹400/month` metric proved to be the ultimate Hackanomics lesson in bridging the gap between global economies and the individual wallet.

---

## Getting Started Locally

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with your API keys:
```env
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the radar.

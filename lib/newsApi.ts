import { Article } from "./types";

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

export async function fetchEconNews(): Promise<Article[]> {
  if (!NEWS_API_KEY) {
    console.error("NEWS_API_KEY is not defined");
    return [];
  }

  try {
    const url = `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=10&apiKey=${NEWS_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "Failed to fetch news");
    }

    return (data.articles as any[]).map((a, i) => ({
      id: btoa(a.url).slice(0, 12), // simple unique ID from URL
      title: a.title,
      description: a.description || "",
      url: a.url,
      urlToImage: a.urlToImage,
      publishedAt: a.publishedAt,
      source: {
        name: a.source.name
      }
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

export async function fetchEconNewsWeekly(): Promise<Article[]> {
  if (!NEWS_API_KEY) {
    console.error("NEWS_API_KEY is not defined");
    return [];
  }

  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const fromStr = lastWeek.toISOString().split("T")[0];
    
    // Sort by popularity for everything over last 7 days from economy keywords to get broader context
    const url = `https://newsapi.org/v2/everything?q=economy OR finance OR market&sortBy=popularity&from=${fromStr}&pageSize=4&language=en&apiKey=${NEWS_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.status !== "ok") {
      throw new Error(data.message || "Failed to fetch weekly top news");
    }

    return (data.articles as any[]).map((a: any) => ({
      id: btoa(a.url).slice(0, 12) + "-wk", // unique signature for weekly fetch to dedupe locally
      title: a.title,
      description: a.description || "",
      url: a.url,
      urlToImage: a.urlToImage,
      publishedAt: a.publishedAt,
      source: {
        name: a.source.name
      }
    }));
  } catch (error) {
    console.error("Error fetching weekly news:", error);
    return [];
  }
}

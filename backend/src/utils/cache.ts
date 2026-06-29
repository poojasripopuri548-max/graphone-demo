import NodeCache from "node-cache";

class AppCache {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 300, // 5 minutes default
      checkperiod: 60, // Clean up every 60 seconds
      useClones: false,
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    if (ttl) {
      return this.cache.set(key, value, ttl);
    }
    return this.cache.set(key, value);
  }

  del(key: string): boolean {
    // Delete exact key
    const exactDeleted = this.cache.del(key);
    // Also delete pattern-matched keys
    const keys = this.cache.keys();
    const matchingKeys = keys.filter((k) => k.startsWith(key));
    if (matchingKeys.length > 0) {
      this.cache.del(matchingKeys);
    }
    return exactDeleted > 0;
  }

  flush(): void {
    this.cache.flushAll();
  }

  getStats() {
    return {
      keys: this.cache.keys().length,
      hits: this.cache.getStats().hits,
      misses: this.cache.getStats().misses,
    };
  }
}

export const appCache = new AppCache();

// Cache key generators
export const CacheKeys = {
  companies: (filters?: Record<string, string>) =>
    `companies:${filters ? JSON.stringify(filters) : "all"}`,
  company: (slug: string) => `company:${slug}`,
  trending: () => "companies:trending",
  investors: (filters?: Record<string, string>) =>
    `investors:${filters ? JSON.stringify(filters) : "all"}`,
  investor: (slug: string) => `investor:${slug}`,
  products: (filters?: Record<string, string>) =>
    `products:${filters ? JSON.stringify(filters) : "all"}`,
  news: (filters?: Record<string, string>) =>
    `news:${filters ? JSON.stringify(filters) : "all"}`,
  search: (query: string) => `search:${query}`,
  stats: () => "stats",
  feed: () => "feed",
  graph: (slug: string) => `graph:${slug}`,
  coInvestors: (slug: string) => `coinvestors:${slug}`,
};
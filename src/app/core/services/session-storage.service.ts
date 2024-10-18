import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SessionStorageService {
    private ttl: number = 600000; // Default TTL: 10 minutes in milliseconds

    // Generate a unique key using class name and optional suffix
    private generateCacheKey(context: any, suffix: string = ''): string {
        const className = context.constructor.name;
        return `${className}${suffix ? `_${suffix}` : ''}`;
    }

    set(key: string, value: any): void {
        const expiry = new Date().getTime() + this.ttl;
        const data = { value, expiry };
        sessionStorage.setItem(key, JSON.stringify(data));
    }

    get<T>(key: string): T | null {
        const item = sessionStorage.getItem(key);
        if (!item) return null;

        const data = JSON.parse(item);
        const currentTime = new Date().getTime();

        if (currentTime > data.expiry) {
            sessionStorage.removeItem(key); // Remove expired data
            return null;
        }
        return data.value as T;
    }

    async cacheWithExpiry<T>(
        context: any,
        fetchData: () => Promise<T>,
        suffix: string = '',
        key?: string // Optional key parameter
    ): Promise<T> {
        const cacheKey = key ?? this.generateCacheKey(context, suffix); // Use provided key or generate one
        const cachedData = this.get<T>(cacheKey);

        if (cachedData) {
            return cachedData;
        }

        // Fetch new data and store it in cache
        const data = await fetchData();
        this.set(cacheKey, data);
        return data;
    }

    remove(context: any, suffix: string = '', key?: string): void {
        const cacheKey = key ?? this.generateCacheKey(context, suffix);
        console.log(cacheKey);
        sessionStorage.removeItem(cacheKey);
    }
}

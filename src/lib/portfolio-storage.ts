import { PortfolioData, PortfolioStyle } from "@/types/portfolio";

export interface SavedPortfolio {
    id: string;
    name: string;
    templateId: string;
    data: PortfolioData;
    updatedAt: string;
}

const LOCAL_STORAGE_KEY = "ai-portfolio-builder-saved-portfolios";

/**
 * Check if we are in cloud storage mode (NextAuth session available)
 */
export const isCloudStorage = () => {
    // This is a browser check; actual routing happens via API
    return typeof window !== "undefined";
};

/**
 * List all portfolios (Cloud or Local)
 */
export async function listPortfolios(): Promise<SavedPortfolio[]> {
    try {
        const res = await fetch("/api/portfolios");
        if (res.ok) {
            const cloudPortfolios = await res.json();
            return cloudPortfolios.map((p: any) => ({
                id: p._id,
                name: p.name,
                templateId: p.templateId,
                data: p.data,
                updatedAt: p.updatedAt,
            }));
        }
    } catch (e) {
        console.warn("Cloud storage not available, falling back to local", e);
    }

    // Fallback to localStorage
    if (typeof window === "undefined") return [];
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    return local ? JSON.parse(local) : [];
}

/**
 * Save a portfolio
 */
export async function savePortfolio(
    portfolio: Partial<SavedPortfolio> & { data: PortfolioData }
): Promise<SavedPortfolio> {
    const portfolioToSave = {
        name: portfolio.name || portfolio.data.personalInfo.name || "Untitled Portfolio",
        templateId: portfolio.templateId || portfolio.data.style,
        data: portfolio.data,
    };

    try {
        const method = portfolio.id ? "PATCH" : "POST";
        const url = portfolio.id ? `/api/portfolios/${portfolio.id}` : "/api/portfolios";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(portfolioToSave),
        });

        if (res.ok) {
            const saved = await res.json();
            return {
                id: saved._id,
                name: saved.name,
                templateId: saved.templateId,
                data: saved.data,
                updatedAt: saved.updatedAt,
            };
        }
    } catch (e) {
        console.warn("Could not save to cloud, saving to local", e);
    }

    // LocalStorage Fallback
    const localPortfolios = await listPortfolios();
    const newPortfolio: SavedPortfolio = {
        id: portfolio.id || `local-${Date.now()}`,
        name: portfolioToSave.name,
        templateId: portfolioToSave.templateId,
        data: portfolioToSave.data,
        updatedAt: new Date().toISOString(),
    };

    const index = localPortfolios.findIndex((p) => p.id === newPortfolio.id);
    if (index > -1) {
        localPortfolios[index] = newPortfolio;
    } else {
        localPortfolios.push(newPortfolio);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localPortfolios));
    return newPortfolio;
}

/**
 * Delete a portfolio
 */
export async function deletePortfolio(id: string): Promise<boolean> {
    try {
        const res = await fetch(`/api/portfolios/${id}`, { method: "DELETE" });
        if (res.ok) return true;
    } catch (e) {
        console.warn("Could not delete from cloud", e);
    }

    // LocalStorage Fallback
    const localPortfolios = await listPortfolios();
    const filtered = localPortfolios.filter((p) => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

/**
 * Get a single portfolio
 */
export async function getPortfolio(id: string): Promise<SavedPortfolio | null> {
    try {
        const res = await fetch(`/api/portfolios/${id}`);
        if (res.ok) {
            const p = await res.json();
            return {
                id: p._id,
                name: p.name,
                templateId: p.templateId,
                data: p.data,
                updatedAt: p.updatedAt,
            };
        }
    } catch (e) {
        console.warn("Could not get from cloud", e);
    }

    const localPortfolios = await listPortfolios();
    return localPortfolios.find((p) => p.id === id) || null;
}

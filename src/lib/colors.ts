import { parse as parseYaml } from "yaml";

export interface ColorFetcher {
    getColor: (language: string) => string;
}

let colorFetcherCache: ColorFetcher;

/**
 * Parses Linguist colors from GitHub
 * @returns {Promise<ColorFetcher>}
 */
export const fetchColors = async (): Promise<ColorFetcher> => {
    let languages;
    try {
        languages = await fetch("https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml");
    } catch (e) {
        throw new Error("Failed to fetch language data");
    }

    let languageData;
    try {
        languageData = await languages.text();
    } catch (e) {
        throw new Error("Failed to format response");
    }

    let parsedLanguageData: Record<
        string,
        {
            ace_mode: string;
            color: string;
            extensions: string[];
            language_id: number;
            tm_scope: string;
            type: string;
        }
    >;
    try {
        parsedLanguageData = parseYaml(languageData);
    } catch (e) {
        throw new Error("Failed to parse language data");
    }
    
    return {
        getColor: (language: string): string => {
            return parsedLanguageData[language]?.color;
        }
    };
};

/**
 * Ensure we instantiate color library once.
 * @returns {Promise<ColorFetcher>}
 */
export const colors = async (): Promise<ColorFetcher> => {
    if (!colorFetcherCache) {
        colorFetcherCache = await fetchColors();
    }
    return colorFetcherCache;
};

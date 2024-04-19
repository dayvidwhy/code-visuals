import type { RepositoryData } from "$lib";

self.addEventListener("message", (e) => {
    const repositoryLanguages: RepositoryData[] = e.data;

    // totals languages across all repositories
    const totals: Record<string, number> = {};
    let byteTotal = 0;
    repositoryLanguages.forEach(({ languages }) => {
        Object.keys(languages.data).forEach((key) => {
            if (totals[key] === undefined) {
                totals[key] = 0;
            }
            totals[key] += languages.data[key];
            byteTotal += languages.data[key];
        });
    });

    self.postMessage({
        totals,
        byteTotal
    });
}, false);

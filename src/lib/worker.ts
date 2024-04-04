import type { Endpoints } from "@octokit/types";
type listLanguagesResponse = Endpoints["GET /repos/{owner}/{repo}/languages"]["response"];

self.addEventListener("message", (e) => {
    const repositoryLanguages: {
        name: string;
        languages: listLanguagesResponse
    }[] = e.data;
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
    // Perform computation or task with data
    // For example, let's just return the data
    self.postMessage({
        totals,
        byteTotal
    });
}, false);

<script lang="ts">
import { page } from "$app/stores";
import { Octokit } from "@octokit/core";
import type { Endpoints } from "@octokit/types";
import CodeChart from "./CodeChart.svelte";

type listUserReposParameters = Endpoints["GET /user"]["response"];
type listUserReposResponse = Endpoints["GET /users/{username}/repos"]["response"];

const fetchLanguageData = async () => {
    const octokit = new Octokit({
        /**
         * We're appending the 'accessToken' property to the session back
         * in ./src/auth.ts so we can access it here.
        */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        auth: $page.data.session?.accessToken
    });
    const { data }: listUserReposParameters = await octokit.request("GET /user");

    const result: listUserReposResponse = await octokit.request("GET /users/{username}/repos", {
        username: data.login
    });
    // languages returns how man bytes of each language file
    const repositoryLanguages = await Promise.all(result.data.map((repo) => (
        octokit.request("GET /repos/{owner}/{repo}/languages", {
            owner: data.login,
            repo: repo.name
        })
    )));

    // totals languages across the projects
    const totals: Record<string, number> = {};
    let byteTotal = 0;
    repositoryLanguages.forEach(({ data }) => {
        Object.keys(data).forEach((key) => {
            if (totals[key] === undefined) {
                totals[key] = 0;
            }
            totals[key] += data[key];
            byteTotal += data[key];
        });
    });

    return {
        totals,
        byteTotal
    };
};
</script>

<h1>
    Dashboard page
</h1>
<p>
    {#await fetchLanguageData() then data}
        Data loaded
        <CodeChart chartData={data} />
    {/await}
</p>

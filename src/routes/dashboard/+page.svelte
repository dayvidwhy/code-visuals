<script lang="ts">
import { page } from "$app/stores";
import {
    fetchAllRepositoryData,
    fetchRepositoriesForUser,
    fetchRepositoryData,
    fetchUserDetails,
    colors
} from "$lib";
import type { ColorFetcher } from "$lib";

import CodeChart from "$lib/components/CodeChart.svelte";
import Loader from "$lib/components/Loader.svelte";
import workerUrl from "$lib/worker?worker";

/**
 * Instantiate the dashboard page pre-loading the color fetcher.
 * Grab the user token here to pass to the component tree.
 */
const init = async (): Promise<
    {
        colorFetcher: ColorFetcher;
        token: string;
    }
> => {
    /**
    * We're appending the 'accessToken' property to the session back
    * in ./src/auth.ts so we can access it here.
    */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const token = $page.data.session.accessToken;
    await fetchUserDetails(token);
    return {
        colorFetcher: await colors(),
        token: token
    };
};

const fetchAllRepostoryLanguageData = async (token: string): Promise<{
    totals: Record<string, number>;
    byteTotal: number;
}> => {
    // grab all the languages for each repository
    const repositoryLanguages = await fetchAllRepositoryData(token);

    // create worker to calculate totals
    const worker = new workerUrl;
    worker.postMessage(repositoryLanguages);
    return new Promise<{
        totals: Record<string, number>;
        byteTotal: number;
    }>((resolve): void => {
        worker.onmessage = (event) => {
            resolve(event.data);
        };
    });
};

const sidebarNav = [
    {
        name: "Languages",
        href: "/dashboard"
    }
];
</script>

<nav class="w-44 bg-slate-700 text-white overflow-y-auto">
    <ul>
        {#each sidebarNav as nav}
            <li>
                <a class={`block p-2 hover:bg-slate-400 text-sm hover:text-slate-200 ${$page.url.pathname === nav.href ? "bg-slate-600" : ""}`} href={nav.href}>{nav.name}</a>
            </li>
        {/each}
    </ul>
</nav>
<div class="w-full flex-1 overflow-y-auto">
    <div class="flex flex-col p-4">
        {#if $page.data.session}
            {#await init()}
                <Loader />
            {:then { colorFetcher, token }} 
                <div class="flex flex-row">
                    <div class="w-full p-2 h-72">
                        <div class="shadow-sm p-2 h-full rounded-sm bg-white">
                            <h2 class="text-md text-slate-600 font-bold">
                                Overall Language Usage
                            </h2>
                            {#await fetchAllRepostoryLanguageData(token)}
                                <Loader />
                            {:then data}
                                <div class="p-2">
                                    <CodeChart colorFetcher={colorFetcher} chartData={data.totals} />
                                </div>
                            {/await}
                        </div>
                    </div>
                </div>
                <div class="flex flex-row flex-wrap">
                    {#await fetchRepositoriesForUser(token) then repositories}
                        {#each repositories as repo}
                            <div class="w-1/4 p-2 mb h-72">
                                <div class="p-2 shadow-sm h-full rounded-sm bg-white">
                                    <h2 class="text-md text-slate-600 font-bold">
                                        {repo}
                                    </h2>
                                    {#await fetchRepositoryData(token, repo)}
                                        <Loader />
                                    {:then repoData}
                                        <div class="p-2">
                                            <CodeChart colorFetcher={colorFetcher} chartData={repoData.languages.data} />
                                        </div>
                                    {/await}
                                </div>
                            </div>
                        {/each}
                    {:catch error}
                        <div>
                            {error.message}
                        </div>
                    {/await}
                </div>
            {/await}
        {:else}
            <div class="flex flex-col border border-slate-400">
                <div class="w-full pl-2">
                    <strong>Not Logged In</strong>
                </div>
            </div>
        {/if}
    </div>
</div>


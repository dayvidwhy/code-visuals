<script lang="ts">
import { page } from "$app/stores";
import {
    fetchAllRepositoryData,
    fetchRepositoriesForUser,
    fetchRepositoryData
} from "$lib/repository";
import CodeChart from "$lib/components/CodeChart.svelte";
import { colors } from "$lib/colors";
import type { ColorFetcher } from "$lib/colors";
import Loader from "$lib/components/Loader.svelte";

const init = async (): Promise<
    {
        colorFetcher: ColorFetcher;
        token: string;
    }
> => {
    return {
        colorFetcher: await colors(),
        /**
        * We're appending the 'accessToken' property to the session back
        * in ./src/auth.ts so we can access it here.
        */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        token: $page.data.session.accessToken
    };
};

const fetchDataForEachRepo = async (token: string) => {
    // instantiate color library
    let colorFetcher: ColorFetcher = await colors();
    const repositories = await fetchRepositoriesForUser(token);

    return {
        repositories,
        colorFetcher
    };
};

const fetchAllRepostoryLanguageData = async (token: string): Promise<{
    totals: Record<string, number>;
    byteTotal: number;
    colorFetcher: ColorFetcher;
}> => {
    let colorFetcher: ColorFetcher = await colors();

    const repositoryLanguages = await fetchAllRepositoryData(token);
    // totals languages across all repositories
    console.log(repositoryLanguages);
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
    return {
        totals,
        byteTotal,
        colorFetcher
    };
};
</script>

<div class="flex flex-col">
    {#if $page.data.session}
    {#await init()}
        <Loader />
    {:then { colorFetcher, token }} 
        <div class="flex flex-row">
            <div class="w-full p-2 h-72">
                <div class="border-slate-400 border p-2 h-full rounded">
                    <h2 class="text-xl text-slate-700">
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
            {#await fetchDataForEachRepo(token)}
                <Loader />
            {:then data}
                {#each data.repositories as repo}
                    <div class="w-1/4 p-2 mb h-72">
                        <div class="p-2 border-slate-400 border h-full rounded">
                            <h2 class="text-xl text-slate-700">
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

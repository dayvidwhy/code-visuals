<script lang="ts">
import { page } from "$app/stores";
import {
    fetchAllRepositoryData,
    fetchRepositoriesForUser,
    fetchRepositoryData,
    fetchUserDetails
} from "$lib/repository";
import CodeChart from "$lib/components/CodeChart.svelte";
import { colors } from "$lib/colors";
import type { ColorFetcher } from "$lib/colors";
import Loader from "$lib/components/Loader.svelte";
import workerUrl from "$lib/worker?worker";

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

const fetchDataForEachRepo = async (token: string) => {
    const repositories = await fetchRepositoriesForUser(token);

    return {
        repositories
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
    const { totals, byteTotal } = await new Promise<{
        totals: Record<string, number>;
        byteTotal: number;
    }>((resolve): void => {
        worker.onmessage = (event) => {
            resolve(event.data);
        };
    });

    return {
        totals,
        byteTotal
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
            {#await fetchDataForEachRepo(token) then data}
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

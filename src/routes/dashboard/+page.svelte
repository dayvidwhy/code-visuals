<script lang="ts">
import { page } from "$app/stores";
import { fetchAllRepositoryData } from "$lib/repository";
import CodeChart from "$lib/components/CodeChart.svelte";

const fetchLanguageData = async () => {
    /**
    * We're appending the 'accessToken' property to the session back
    * in ./src/auth.ts so we can access it here.
    */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const repositoryLanguages = await fetchAllRepositoryData($page.data.session?.accessToken);
    // totals languages across the projects
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
        repositoryLanguages
    };
};
</script>

<div class="flex flex-col">
    {#await fetchLanguageData() then data}
    <div class="flex flex-row">
        <div class="w-full p-2">
            <h2>
                Overall Language Usage
            </h2>
            <div class="border-slate-400 border p-2">
                {#await fetchLanguageData() then data}
                    <CodeChart chartHeight={200} chartData={data.totals} />
                {/await}
            </div>
        </div>
    </div>
    <div class="flex flex-row flex-wrap">
        {#each data.repositoryLanguages as repo}
            <div class="w-1/4 p-2">
                <h2>
                    {repo.name}
                </h2>
                <div class="border-slate-400 border p-2">
                    <CodeChart chartHeight={150} chartData={repo.languages.data} />
                </div>
            </div>
        {/each}
    </div>
    {:catch error}
        <div>
            {error.message}
        </div>
    {/await}
</div>

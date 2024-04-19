<script lang="ts">
import Chart from "chart.js/auto";
import type { ChartConfiguration } from "chart.js/auto";
import { onMount } from "svelte";
import type { ColorFetcher } from "$lib";

/**
 * Data comes in the format
 * {
 *    "language": byteCount
 * }
 * eg
 * {
 *   "JavaScript": 1000,
 *   "TypeScript": 2000
 * }
 */
export let chartData: Record<
    string,
    number
>;
export let colorFetcher: ColorFetcher;

// hold onto chart instance
let canvas: HTMLCanvasElement;

onMount(() => {
    const languages = Object.keys(chartData);
    const datasets = languages.map((key) => chartData[key]);
    const chartConfig: ChartConfiguration = {
        type: "bar",
        data: {
            labels: languages,
            datasets: [{
                label: "Languages",
                data: datasets,
                backgroundColor: languages.map((language) => {
                    return colorFetcher.getColor(language);
                })
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    };
    const chart: Chart = new Chart(canvas, chartConfig);

    // cleanup on destroy
    return () => chart?.destroy();
});

</script>

<canvas bind:this={canvas} width="400" id="myChart"></canvas>

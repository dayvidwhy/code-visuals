<script lang="ts">
import Chart from "chart.js/auto";
import type { ChartConfiguration } from "chart.js/auto";
import { onMount, onDestroy } from "svelte";

// local libs
import type { ColorFetcher } from "$lib/colors";

// Props
export let chartData: Record<
    string,
    number
>;
export let colorFetcher: ColorFetcher;

// hold onto chart instance
let canvas: HTMLCanvasElement;
let chart: Chart;

onMount(async () => {
    // create chart
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
    chart = new Chart(canvas, chartConfig);
});

onDestroy(() => {
    chart?.destroy();
});
</script>

<canvas bind:this={canvas} width="400" id="myChart"></canvas>

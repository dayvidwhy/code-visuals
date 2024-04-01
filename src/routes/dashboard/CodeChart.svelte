<script lang="ts">
import Chart from "chart.js/auto";
import type { ChartConfiguration } from "chart.js/auto";
import { onMount, onDestroy } from "svelte";

export let chartData: { totals: Record<string, number> };

let canvas: HTMLCanvasElement;
let chart: Chart;

onMount(() => {
    const languages = Object.keys(chartData.totals);
    const datasets = languages.map((key) => chartData.totals[key]);
    const chartConfig: ChartConfiguration = {
        type: "bar",
        data: {
            labels: languages,
            datasets: [{
                label: "Languages",
                data: datasets
            }]
        }
    };

    chart = new Chart(canvas, chartConfig);
});

onDestroy(() => {
    chart?.destroy();
});
</script>

<canvas bind:this={canvas} id="myChart" width="400" height="400"></canvas>

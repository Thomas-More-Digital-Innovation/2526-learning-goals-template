<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import type { Category } from "$lib/types";
    import type { Chart as ChartType } from "chart.js";

    interface Props {
        categories: Category[];
    }

    let { categories }: Props = $props();

    let canvasElement: HTMLCanvasElement;
    let chartInstance: ChartType | null = null;

    // Calculate counts
    let counts = $derived.by(() => {
        let todo = 0;
        let inProgress = 0;
        let done = 0;
        let verified = 0;

        for (const cat of categories) {
            for (const goal of cat.goals) {
                if (goal.verified) {
                    verified++;
                } else if (goal.status === "Done") {
                    done++;
                } else if (goal.status === "In Progress") {
                    inProgress++;
                } else if (goal.status === "Todo") {
                    todo++;
                }
            }
        }

        const total = todo + inProgress + done + verified;
        const doneTotal = done + verified;

        return { todo, inProgress, done, verified, total, doneTotal };
    });

    onMount(async () => {
        const {
            Chart,
            DoughnutController,
            ArcElement,
            Legend,
            Title,
            Tooltip,
        } = await import("chart.js");
        const { default: ChartDataLabels } = await import(
            "chartjs-plugin-datalabels"
        );
        Chart.register(
            DoughnutController,
            ArcElement,
            Legend,
            Title,
            Tooltip,
            ChartDataLabels,
        );

        const c = counts;

        chartInstance = new Chart(canvasElement, {
            type: "doughnut",
            data: {
                labels: ["Todo", "Done", "In Progress", "Verified"],
                datasets: [
                    {
                        label: "Count",
                        data: [c.todo, c.done, c.inProgress, c.verified],
                        backgroundColor: [
                            "#d1d5db",
                            "#10b981",
                            "#FA6432",
                            "#7FC1E0",
                        ],
                        borderColor: "#ffffff",
                        borderWidth: 3,
                        hoverOffset: 8,
                    },
                ],
            },
            options: {
                aspectRatio: 16 / 11,
                responsive: true,
                plugins: {
                    legend: {
                        position: "right",
                        labels: {
                            font: {
                                size: 13,
                                family: "'Inter', 'system-ui', 'sans-serif'",
                                weight: 500,
                            },
                            color: "#00293F",
                            padding: 12,
                            usePointStyle: true,
                            pointStyle: "circle",
                        },
                    },
                    title: {
                        display: true,
                        text: `Done: ${c.total > 0 ? Math.round((c.doneTotal / c.total) * 100) : 0}% | Verified: ${c.total > 0 ? Math.round((c.verified / c.total) * 100) : 0}%`,
                        font: {
                            size: 14,
                            family: "'Inter', 'system-ui', 'sans-serif'",
                            weight: "bold",
                        },
                        color: "#00293F",
                        padding: { top: 10, bottom: 20 },
                    },
                    tooltip: {
                        backgroundColor: "#00293F",
                        titleColor: "#ffffff",
                        bodyColor: "#ffffff",
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true,
                        borderColor: "#FA6432",
                        borderWidth: 2,
                    },

                    datalabels: {
                        color: "#ffffff",
                        font: {
                            size: 14,
                            weight: "bold",
                        },
                        formatter: (value: number) => {
                            return value > 0 ? value : "";
                        },
                    },
                },
                layout: {
                    padding: 10,
                },
            },
        });
    });

    onDestroy(() => {
        if (chartInstance) {
            chartInstance.destroy();
        }
    });
</script>

<div class="chart-container">
    <canvas bind:this={canvasElement}></canvas>
</div>

<style>
    .chart-container {
        width: 280px;
        height: 200px;
        canvas {
            height: 100%;
        }
    }
</style>

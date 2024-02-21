<script lang="ts">
    // @ts-ignore
    import Chart, { type ChartOptions } from 'chart.js/auto';
    import axios from 'axios';
    import { onMount } from 'svelte';


    let apiServer =import.meta.env.VITE_API_SERVER;



    
    async function createChart(rdata?:any, rdataset?:any) {
        const canvas = document.getElementById('myChart');
        const result = await axios.get(apiServer+'/dashboard/yearlyabsencebyday');
        // let dataArr = [];
        // for (let i = 0; i < 100; i++) {
        //     dataArr.push(Math.floor(Math.random() * 20)+2);
        // }
        // @ts-ignore
        const ctx = canvas.getContext('2d');

        const data = {
            labels: result.data.data,
            datasets: [
                {
                    label: 'Absentees',
                    // @ts-ignore
                    data: result.data.dataset,
                    backgroundColor: 'rgb(100,96,200,0.5)', // Green
                    borderColor: 'rgb(100,96,200)',
                    pointRadius: 0.5,
                    borderWidth: 0.5,
                    fill: 'origin',
                    tension: 0.4,
                    plugins: {
                        filler: {
                            propagate: true
                        }
                    }
                }
            ]
        };

        const options = {
            aspectRatio: 8.5,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        display: false
                    },
                    grid: {
                        display: false
                    }
                },
                x: {
                    ticks: {
                        display: true,
                    },
                    grid: {
                        display: false
                    }
                }
            }
        };

        const chart = new Chart(ctx, {
            type: 'line',
            data: data,
            // @ts-ignore
            options: options
        });

        // Change area color to red if number of absentees is above 10
        // const dataset = chart.data.datasets[0];
        // const absences = dataset.data;
        // const backgroundColors = absences.map(absence => absence > 10 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 128, 0, 0.5)');
        // dataset.backgroundColor = backgroundColors;
        // chart.update();
    }

    onMount(() => {
        createChart();
    });
</script>

<div style="flex: 0 50%;">
    <h2>Daily Absences</h2>
    <canvas id="myChart"></canvas>
</div>
import { describe, it } from 'mocha';
import { ChartConfiguration } from 'chart.js';

import { ChartJSNodeCanvas, ChartCallback } from './';

describe(ChartJSNodeCanvas.name, () => {

	const width = 400;
	const height = 400;
	const configuration: ChartConfiguration = {
		type: 'bar',
		data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [{
				label: '# of Votes',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255,99,132,1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
			plugins: {
				annotation: {
				}
			} as any
		}
	};
	const chartCallback: ChartCallback = (ChartJS) => {
		ChartJS.defaults.responsive = true;
		ChartJS.defaults.maintainAspectRatio = false;
	};

	it('works with render to buffer', async () => {
		const chartJSNodeCanvas = new ChartJSNodeCanvas({ animation: {
			renderType: 'dataurl',
			// callback: console.log,
			frameRate: 10
		 }, width, height, chartCallback });
		const urls = await chartJSNodeCanvas.renderAnimationFrames(configuration) as Array<string>;

		// const chart = chartJSNodeCanvas.renderChart(configuration);
	});
});
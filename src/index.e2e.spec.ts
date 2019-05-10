import { strict as assert } from 'assert';
import { writeFile, readFile } from 'fs';
import { promisify } from 'util';
import { describe, it } from 'mocha';
import { ChartConfiguration } from 'chart.js';
import { freshRequire } from './freshRequire';
import memwatch from 'node-memwatch';

import { CanvasRenderService, ChartCallback } from './';

const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);

memwatch.on('leak', (info) => {
	throw new Error(info.reason);
});

describe(CanvasRenderService.name, () => {

	const chartColors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};
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
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						callback: (value: number) => '$' + value
					} as any
				}]
			}
		},
		plugins: {
			annotation: {
			}
		} as any
	};
	const chartCallback: ChartCallback = (ChartJS) => {

		ChartJS.defaults.global.responsive = true;
		ChartJS.defaults.global.maintainAspectRatio = false;
	};

	it.skip('test image', async () => {
		const canvasRenderService = new CanvasRenderService(width, height, chartCallback);
		const image = await canvasRenderService.renderToBuffer(configuration);
		await writeFileAsync('./test.png', image);
	});

	it('works with registering plugin', async () => {

		const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {

			// (global as any).Chart = ChartJS;
			ChartJS.plugins.register(freshRequire('chartjs-plugin-annotation'));
			// delete (global as any).Chart;
		});
		const image = await canvasRenderService.renderToBuffer({
			type: 'bar',
			data: {
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
				datasets: [
					{
						type: 'line',
						label: 'Dataset 1',
						borderColor: chartColors.blue,
						borderWidth: 2,
						fill: false,
						data: [-39, 44, -22, -45, -27, 12, 18]
					},
					{
						type: 'bar',
						label: 'Dataset 2',
						backgroundColor: chartColors.red,
						data: [-18, -43, 36, -37, 1, -1, 26],
						borderColor: 'white',
						borderWidth: 2
					},
					{
						type: 'bar',
						label: 'Dataset 3',
						backgroundColor: chartColors.green,
						data: [-7, 21, 1, 7, 34, -29, -36]
					}
				]
			},
			options: {
				responsive: true,
				title: {
					display: true,
					text: 'Chart.js Combo Bar Line Chart'
				},
				tooltips: {
					mode: 'index',
					intersect: true
				},
				annotation: {
					annotations: [
						{
							drawTime: 'afterDatasetsDraw',
							id: 'hline',
							type: 'line',
							mode: 'horizontal',
							scaleID: 'y-axis-0',
							value: 48,
							borderColor: 'black',
							borderWidth: 5,
							label: {
								backgroundColor: 'red',
								content: 'Test Label',
								enabled: true
							}
						},
						{
							drawTime: 'beforeDatasetsDraw',
							type: 'box',
							xScaleID: 'x-axis-0',
							yScaleID: 'y-axis-0',
							xMin: 'February',
							xMax: 'April',
							yMin: -23,
							yMax: 40,
							backgroundColor: 'rgba(101, 33, 171, 0.5)',
							borderColor: 'rgb(101, 33, 171)',
							borderWidth: 1,
						}
					]
				}
			} as any
		});
		//await writeFileAsync('./testData/chartjs-plugin-annotation.png', image);
		const expected = await readFileAsync('./testData/chartjs-plugin-annotation.png');
		assert.ok(image.equals(expected), `Expected ${JSON.stringify(image, null, 2)}, to equal ${JSON.stringify(expected, null, 2)}`);
		// const actual = hashCode(image.toString('base64'));
		// const expected = -1742834127;
		// assert.equal(actual, expected);
	});

	it('works with self registering plugin', async () => {

		const chartJsFactory = () => {
			const chartJS = require('chart.js');
			require('chartjs-plugin-datalabels');
			delete require.cache[require.resolve('chart.js')];
			delete require.cache[require.resolve('chartjs-plugin-datalabels')];
			return chartJS;
		};
		const canvasRenderService = new CanvasRenderService(width, height, (/*ChartJS*/) => {

			// (global as any).Chart = ChartJS;
			// ChartJS.plugins.register(freshRequire('chartjs-plugin-datalabels', require));
			// delete (global as any).Chart;
		}, undefined, chartJsFactory);
		const image = await canvasRenderService.renderToBuffer({
			type: 'bar',
			data: {
				labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as any,
				datasets: [{
					backgroundColor: chartColors.red,
					data: [12, 19, 3, 5, 2, 3],
					datalabels: {
						align: 'end',
						anchor: 'start'
					}
				}, {
					backgroundColor: chartColors.blue,
					data: [3, 5, 2, 3, 30, 15, 19, 2],
					datalabels: {
						align: 'center',
						anchor: 'center'
					}
				}, {
					backgroundColor: chartColors.green,
					data: [12, 19, 3, 5, 2, 3],
					datalabels: {
						anchor: 'end',
						align: 'start',
					}
				}] as any
			},
			options: {
				plugins: {
					datalabels: {
						color: 'white',
						display(context: any): boolean {
							return context.dataset.data[context.dataIndex] > 15;
						},
						font: {
							weight: 'bold'
						},
						formatter: Math.round
					}
				},
				scales: {
					xAxes: [{
						stacked: true
					}],
					yAxes: [{
						stacked: true
					}]
				}
			}
		});
		//await writeFileAsync('./testData/chartjs-plugin-datalabels.png', image);
		const expected = await readFileAsync('./testData/chartjs-plugin-datalabels.png');
		assert.ok(image.equals(expected), `Expected ${JSON.stringify(image, null, 2)}, to equal ${JSON.stringify(expected, null, 2)}`);
		// const actual = hashCode(image.toString('base64'));
		// const expected = -1377895140;
		// assert.equal(actual, expected);
	});

	it('works with custom font', async () => {

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
					borderWidth: 1,
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
							callback: (value: number) => '$' + value
						} as any
					}]
				}
			},
			plugins: {
				annotation: {
				}
			} as any
		};
		const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {

			ChartJS.defaults.global.defaultFontFamily = 'VTKS UNAMOUR';
		});
		canvasRenderService.registerFont('./testData/VTKS UNAMOUR.ttf', { family: 'VTKS UNAMOUR' });
		const image = await canvasRenderService.renderToBuffer(configuration);
		//await writeFileAsync('./testData/font.png', image);
		const expected = await readFileAsync('./testData/font.png');
		assert.ok(image.equals(expected), `Expected ${JSON.stringify(image, null, 2)}, to equal ${JSON.stringify(expected, null, 2)}`);
	});

	it('does not leak with new instance', async () => {

		const diffs = await Promise.all([...Array(4).keys()].map((iteration) => {
			const heapDiff = new memwatch.HeapDiff();
			console.log('generated heap for iteration ' + (iteration + 1));
			const canvasRenderService = new CanvasRenderService(width, height, chartCallback);
			return canvasRenderService.renderToBuffer(configuration, 'image/png')
				.then(() => {
					const diff = heapDiff.end();
					console.log('generated diff for iteration ' + (iteration + 1));
					return diff;
				});
		}));
		const actual = diffs.map(d => d.change.size_bytes);
		const expected = actual.slice().sort();
		assert.notDeepEqual(actual, expected);
	});

	it('does not leak with same instance', async () => {

		const canvasRenderService = new CanvasRenderService(width, height, chartCallback);
		const diffs = await Promise.all([...Array(4).keys()].map((iteration) => {
			const heapDiff = new memwatch.HeapDiff();
			console.log('generated heap for iteration ' + (iteration + 1));
			return canvasRenderService.renderToBuffer(configuration, 'image/png')
				.then(() => {
					const diff = heapDiff.end();
					console.log('generated diff for iteration ' + (iteration + 1));
					return diff;
				});
		}));
		const actual = diffs.map(d => d.change.size_bytes);
		const expected = actual.slice().sort();
		assert.notDeepEqual(actual, expected);
	});

	function hashCode(string: string): number {

		let hash = 0;
		if (string.length === 0) {
			return hash;
		}
		for (let i = 0; i < string.length; i++) {
			const chr = string.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}
});

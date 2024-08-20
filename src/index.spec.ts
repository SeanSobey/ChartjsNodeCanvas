import { Assert } from 'ts-std-lib';
import { describe, it } from 'mocha';
import { ChartConfiguration } from 'chart.js';

import { ChartJSNodeCanvas, ChartCallback, MimeType, ChartJSNodeCanvasPlugins } from './';

const assert = new Assert();

describe(ChartJSNodeCanvas.name, () => {

	// const chartColors = {
	// 	red: 'rgb(255, 99, 132)',
	// 	orange: 'rgb(255, 159, 64)',
	// 	yellow: 'rgb(255, 205, 86)',
	// 	green: 'rgb(75, 192, 192)',
	// 	blue: 'rgb(54, 162, 235)',
	// 	purple: 'rgb(153, 102, 255)',
	// 	grey: 'rgb(201, 203, 207)'
	// };
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
				yAxes: {
					ticks: {
						beginAtZero: true,
						callback: (value: number) => '$' + value
					} as any
				}
			}
		},
		plugins: {
			annotation: {
			}
		} as any
	};

	function createSUT(plugins?: ChartJSNodeCanvasPlugins): ChartJSNodeCanvas {

		const chartCallback: ChartCallback = (ChartJS) => {

			ChartJS.defaults.responsive = true;
			ChartJS.defaults.maintainAspectRatio = false;
		};
		return new ChartJSNodeCanvas({ width, height, chartCallback, plugins });
	}

	const mimeTypes: ReadonlyArray<MimeType> = ['image/png', 'image/jpeg'];

	describe(ChartJSNodeCanvas.prototype.renderToDataURL.name, () => {

		describe(`given canvasType 'undefined'`, () => {

			const canvasType = undefined;

			mimeTypes.forEach((mimeType) => {

				describe(`given mimeType '${mimeType}'`, () => {

					it('renders data url', async () => {
						const chartJSNodeCanvas = createSUT(canvasType);
						const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration, mimeType);
						assert.equal(dataUrl.startsWith(`data:${mimeType};base64,`), true);
					});

					it('renders data url in parallel', async () => {
						const chartJSNodeCanvas = createSUT(canvasType);
						const promises = Array(3).fill(undefined).map(() => chartJSNodeCanvas.renderToDataURL(configuration, mimeType));
						const dataUrls = await Promise.all(promises);
						dataUrls.forEach((dataUrl) => assert.equal(dataUrl.startsWith(`data:${mimeType};base64,`), true));
					});
				});
			});
		});
	});

	describe(ChartJSNodeCanvas.prototype.renderToDataURLSync.name, () => {

		describe(`given canvasType 'undefined'`, () => {

			const canvasType = undefined;

			mimeTypes.forEach((mimeType) => {

				describe(`given mimeType '${mimeType}'`, () => {

					it('renders data url', () => {
						const chartJSNodeCanvas = createSUT(canvasType);
						const dataUrl = chartJSNodeCanvas.renderToDataURLSync(configuration, mimeType);
						assert.equal(dataUrl.startsWith(`data:${mimeType};base64,`), true);
					});

					it('renders data url in parallel', () => {
						const chartJSNodeCanvas = createSUT(canvasType);
						const dataUrls = Array(3).fill(undefined).map(() => chartJSNodeCanvas.renderToDataURLSync(configuration, mimeType));
						dataUrls.forEach((dataUrl) => assert.equal(dataUrl.startsWith(`data:${mimeType};base64,`), true));
					});
				});
			});
		});
	});

	describe(ChartJSNodeCanvas.prototype.renderToBuffer.name, () => {

		describe(`given canvasType 'undefined'`, () => {

			const canvasType = undefined;

			mimeTypes.forEach((mimeType) => {

				describe(`given extended mimeType '${mimeType}'`, () => {

					it('renders chart', async () => {
						const chartJSNodeCanvas = createSUT(canvasType);
						const image = await chartJSNodeCanvas.renderToBuffer(configuration, mimeType);
						assert.equal(image instanceof Buffer, true);
					});
				});
			});
		});
	});

	describe(ChartJSNodeCanvas.prototype.renderToBufferSync.name, () => {

		([
			[mimeTypes],
			[['image/svg+xml']],
			[['application/pdf']]
		] as ReadonlyArray<[ReadonlyArray<MimeType | 'application/pdf' | 'image/svg+xml'>]>).forEach(([extendedMimeTypes]) => {

			extendedMimeTypes.forEach((mimeType) => {

				describe(`given mimeType '${mimeType}'`, () => {

					it('renders chart', async () => {
						const chartJSNodeCanvas = createSUT();
						const image = chartJSNodeCanvas.renderToBufferSync(configuration, mimeType);
						assert.equal(image instanceof Buffer, true);
					});
				});
			});

		});
	});

	describe(ChartJSNodeCanvas.prototype.renderToStream.name, () => {

		([
			[mimeTypes],
			[['application/pdf']]
		] as ReadonlyArray<[ReadonlyArray<MimeType | 'application/pdf'>]>).forEach(([extendedMimeTypes]) => {

			extendedMimeTypes.forEach((mimeType) => {

				describe(`given extended mimeType '${mimeType}'`, () => {

					it('renders stream', (done) => {
						const chartJSNodeCanvas = createSUT();
						const stream = chartJSNodeCanvas.renderToStream(configuration, mimeType);
						const data: Array<Buffer> = [];
						stream.on('data', (chunk: Buffer) => {
							data.push(chunk);
						});
						stream.on('end', () => {
							assert.equal(Buffer.concat(data).length > 0, true);
							done();
						});
						stream.on('finish', () => {
							assert.equal(Buffer.concat(data).length > 0, true);
							done();
						});
						stream.on('error', (error) => {
							done(error);
						});
					});
				});

			});
		});
	});
});

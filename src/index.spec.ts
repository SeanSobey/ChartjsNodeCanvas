import { Assert } from 'ts-std-lib';
import { describe, it } from 'mocha';
import { ChartConfiguration } from 'chart.js';
import { freshRequire } from './freshRequire';

import { ChartJSNodeCanvas, ChartCallback, CanvasType, MimeType, ChartJSNodeCanvasOptions } from './';

const assert = new Assert();

describe(ChartJSNodeCanvas.name, () => {

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
	const nullCanvasChartJsFactory: ChartJsFactory = () => {
		const ChartJs = freshRequire('chart.js');
		return class extends ChartJs {
			constructor(context: any, configuration: any) {
				super(context, configuration);
				this.canvas = null;
			}
		} as any;
	};

	function createSUT(canvasType: CanvasType | undefined, chartJsFactory: ChartJsFactory | undefined): ChartJSNodeCanvas {

		const chartCallback: ChartCallback = (ChartJS) => {

			ChartJS.defaults.global.responsive = true;
			ChartJS.defaults.global.maintainAspectRatio = false;
		};
		return new ChartJSNodeCanvas(width, height, chartCallback, canvasType, chartJsFactory);
	}
	const nullCanvasErrorMessage = 'Canvas is null';

	const mimeTypes: ReadonlyArray<MimeType> = ['image/png', 'image/jpeg'];

	describe(ChartJSNodeCanvas.prototype.renderToDataURL.name, () => {

		describe(`given chartJsFactory that returns null canvas`, () => {

			const chartJsFactory = nullCanvasChartJsFactory;

			it('throws error', async () => {
				const ChartJSNodeCanvas = createSUT(undefined, chartJsFactory);
				await assert.rejectsError(() => ChartJSNodeCanvas.renderToDataURL(configuration, undefined), Error, nullCanvasErrorMessage);
			});
		});

		describe(`given chartJsFactory 'undefined'`, () => {

			const chartJsFactory = undefined;

			describe(`given canvasType 'undefined'`, () => {

				const canvasType = undefined;

				mimeTypes.forEach((mimeType) => {

					describe(`given mimeType '${mimeType}'`, () => {

						it('renders data url', async () => {
							const ChartJSNodeCanvas = createSUT(canvasType, chartJsFactory);
							const dataUrl = await ChartJSNodeCanvas.renderToDataURL(configuration, mimeType);
							assert.equal(dataUrl.startsWith(`data:${mimeType};base64,`), true);
						});

						it('renders data url in parallel', async () => {
							const ChartJSNodeCanvas = createSUT(canvasType, chartJsFactory);
							const promises = Array(3).fill(undefined).map(() => ChartJSNodeCanvas.renderToDataURL(configuration, mimeType));
							const dataUrls = await Promise.all(promises);
							dataUrls.forEach((dataUrl) => assert.equal(dataUrl.startsWith(`data:${mimeType};base64,`), true));
						});
					});
				});
			});
		});
	});

	describe(ChartJSNodeCanvas.prototype.renderToDataURLSync.name, () => {

		describe(`given chartJsFactory that returns null canvas`, () => {

			const chartJsFactory = nullCanvasChartJsFactory;

			it('throws error', () => {
				const ChartJSNodeCanvas = createSUT(undefined, chartJsFactory);
				assert.throws(() => ChartJSNodeCanvas.renderToDataURLSync(configuration, undefined), Error, nullCanvasErrorMessage);
			});
		});

		describe(`given chartJsFactory 'undefined'`, () => {

			const chartJsFactory = undefined;

			describe(`given canvasType 'undefined'`, () => {

				const canvasType = undefined;

				mimeTypes.forEach((mimeType) => {

					describe(`given mimeType '${mimeType}'`, () => {

						it('renders data url', () => {
							const ChartJSNodeCanvas = createSUT(canvasType, chartJsFactory);
							const dataUrl = ChartJSNodeCanvas.renderToDataURLSync(configuration, mimeType);
							assert.equal(dataUrl.startsWith(`data:${mimeType};base64,`), true);
						});

						it('renders data url in parallel', () => {
							const ChartJSNodeCanvas = createSUT(canvasType, chartJsFactory);
							const dataUrls = Array(3).fill(undefined).map(() => ChartJSNodeCanvas.renderToDataURLSync(configuration, mimeType));
							dataUrls.forEach((dataUrl) => assert.equal(dataUrl.startsWith(`data:${mimeType};base64,`), true));
						});
					});
				});
			});
		});
	});

	describe(ChartJSNodeCanvas.prototype.renderToBuffer.name, () => {

		describe(`given chartJsFactory that returns null canvas`, () => {

			const chartJsFactory = nullCanvasChartJsFactory;

			it('throws error', async () => {
				const ChartJSNodeCanvas = createSUT(undefined, chartJsFactory);
				await assert.rejectsError(() => ChartJSNodeCanvas.renderToBuffer(configuration, undefined), Error, nullCanvasErrorMessage);
			});
		});

		describe(`given chartJsFactory 'undefined'`, () => {

			const chartJsFactory = undefined;

			describe(`given canvasType 'undefined'`, () => {

				const canvasType = undefined;

				mimeTypes.forEach((mimeType) => {

					describe(`given extended mimeType '${mimeType}'`, () => {

						it('renders chart', async () => {
							const ChartJSNodeCanvas = createSUT(canvasType, chartJsFactory);
							const image = await ChartJSNodeCanvas.renderToBuffer(configuration, mimeType);
							assert.equal(image instanceof Buffer, true);
						});
					});
				});
			});
		});
	});

	describe(ChartJSNodeCanvas.prototype.renderToBufferSync.name, () => {

		describe(`given chartJsFactory that returns null canvas`, () => {

			const chartJsFactory = nullCanvasChartJsFactory;

			it('throws error', () => {
				const ChartJSNodeCanvas = createSUT(undefined, chartJsFactory);
				assert.throws(() => ChartJSNodeCanvas.renderToBufferSync(configuration, undefined), Error, nullCanvasErrorMessage);
			});
		});

		describe(`given chartJsFactory 'undefined'`, () => {

			const chartJsFactory = undefined;

			([
				[undefined, mimeTypes],
				['svg', ['image/svg+xml']],
				['pdf', ['application/pdf']]
			] as ReadonlyArray<[CanvasType, ReadonlyArray<MimeType | 'application/pdf' | 'image/svg+xml'>]>).forEach(([canvasType, extendedMimeTypes]) => {

				describe(`given canvasType '${canvasType}'`, () => {

					extendedMimeTypes.forEach((mimeType) => {

						describe(`given mimeType '${mimeType}'`, () => {

							it('renders chart', async () => {
								const ChartJSNodeCanvas = createSUT(canvasType, chartJsFactory);
								const image = ChartJSNodeCanvas.renderToBufferSync(configuration, mimeType);
								assert.equal(image instanceof Buffer, true);
							});
						});
					});
				});
			});
		});
	});

	describe(ChartJSNodeCanvas.prototype.renderToStream.name, () => {

		describe(`given chartJsFactory that returns null canvas`, () => {

			const chartJsFactory = nullCanvasChartJsFactory;

			it('throws error', () => {
				const ChartJSNodeCanvas = createSUT(undefined, chartJsFactory);
				assert.throws(() => ChartJSNodeCanvas.renderToStream(configuration, undefined), Error, nullCanvasErrorMessage);
			});
		});

		describe(`given chartJsFactory 'undefined'`, () => {

			const chartJsFactory = undefined;

			([
				[undefined, mimeTypes],
				['pdf', ['application/pdf']]
			] as ReadonlyArray<[CanvasType | undefined, ReadonlyArray<MimeType | 'application/pdf'>]>).forEach(([canvasType, extendedMimeTypes]) => {

				describe(`given canvasType '${canvasType}'`, () => {

					extendedMimeTypes.forEach((mimeType) => {

						describe(`given extended mimeType '${mimeType}'`, () => {

							it('renders stream', (done) => {
								const ChartJSNodeCanvas = createSUT(canvasType, chartJsFactory);
								const stream = ChartJSNodeCanvas.renderToStream(configuration, mimeType);
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
	});
});

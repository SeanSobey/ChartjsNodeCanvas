global.window = { requestAnimationFrame: setImmediate } as any;
import { describe, it } from 'mocha';
import { ChartConfiguration } from 'chart.js';
import { promises as fs } from 'fs';

import { ChartJSNodeCanvas, ChartCallback } from './';
import { Assert } from 'ts-std-lib';
import { join } from 'path';
import { platform } from 'os';

const assert = new Assert();

describe(ChartJSNodeCanvas.name, () => {
	const folder = join(process.cwd(), 'testData', platform(), 'animation');
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
			animation: {
				onProgress: event => {
					// tslint:disable-next-line: no-unused-expression
					(event as any).currentStep;
				}
			}
		}
	};
	const chartCallback: ChartCallback = (ChartJS) => {
		ChartJS.defaults.responsive = true;
		ChartJS.defaults.maintainAspectRatio = false;
	};

	it('generates animation frames as data urls', async () => {
		const chartJSNodeCanvas = new ChartJSNodeCanvas({
			animation: true,
			backgroundColour: 'white',
			width,
			height,
			chartCallback
		});
		const urls = await chartJSNodeCanvas.renderAnimationFrameDataURLs(configuration);
		assert.equal(urls.length > 50, true);
	});

	it('generates animation frames as buffers', async () => {
		const chartJSNodeCanvas = new ChartJSNodeCanvas({
			animation: true,
			backgroundColour: 'white',
			width,
			height,
			chartCallback
		});
		const buffers = await chartJSNodeCanvas.renderAnimationFrameBuffers(configuration, 40);
		assert.equal(buffers.length, 26);
		// tslint:disable-next-line: forin
		for (const index in buffers) {
			const buffer = buffers[index];
			const fileNameWithExtension = `buffer-animation-frame-${index}.png`;
			const testDataPath = join(folder, fileNameWithExtension);
			await fs.writeFile(testDataPath, buffer);
		}
	});
});

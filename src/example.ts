import { ChartJSNodeCanvas, ChartCallback } from './';
// @ts-expect-error moduleResolution:nodenext issue 54523
import { ChartConfiguration } from 'chart.js/auto';
import path from 'path';
import { promises as fs } from 'fs';

async function main(): Promise<void> {

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
		},
		plugins: [{
			id: 'background-colour',
			beforeDraw: (chart) => {
				const ctx = chart.ctx;
				ctx.save();
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, width, height);
				ctx.restore();
			}
		}]
	};
	const chartCallback: ChartCallback = (ChartJS) => {
		ChartJS.defaults.responsive = true;
		ChartJS.defaults.maintainAspectRatio = false;
	};
	console.log('here');

	const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
	const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
	await fs.writeFile('./resources/example.png', buffer, 'base64');

	const k = Object.keys(require.cache).find(key => key.includes(path.join('node_modules','chart.js')));
	console.log('keys', k);

	// const animatedChartJSNodeCanvas = new AnimatedChartJSNodeCanvas({ width, height, chartCallback });
	// const buffers = await animatedChartJSNodeCanvas.renderToBuffer(configuration);
	// const { Gif } = await import('make-a-gif');
	// const gif = new Gif(width, height, 1);
	// const totalDuration = 1000;
	// const duration = totalDuration / buffers.length;
	// await gif.setFrames(buffers.map(buffer => ({ src: new Uint8Array(buffer), duration })));
	// // const data = await chartJSNodeCanvas.renderToDataURL(configuration);
	// // console.log(data.length);
	// const image = await gif.encode();
	// await fs.writeFile('./resources/example.gif', image);
}
main();

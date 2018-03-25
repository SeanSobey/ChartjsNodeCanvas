import { promisify } from 'util';
import { Stream } from 'stream';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
import * as Canvas from 'canvas-prebuilt';
import * as fresh from 'fresh-require';

export type ChartCallback = (chartJS: typeof ChartJS) => void | Promise<void>;

export class CanvasRenderService {

	private readonly _width: number;
	private readonly _height: number;
	private readonly _ChartJs: typeof ChartJS;

	constructor(width: number, height: number, chartCallback?: ChartCallback) {

		this._width = width;
		this._height = height;
		this._ChartJs = fresh('chart.js', require) as typeof ChartJS;
		if (chartCallback) {
			chartCallback(this._ChartJs);
		}
	}

	public renderToDataURL(configuration: Chart.ChartConfiguration): Promise<string> {

		const chart = this.renderChart(configuration);
		return new Promise<string>((resolve, reject) => {
			const canvas = chart.canvas as typeof Canvas;
			canvas.toDataURL('image/png', (error: Error | null, png: string) => {
				if (error) {
					return reject(error);
				}
				return resolve(png);
			});
		});
	}

	public renderToBuffer(configuration: Chart.ChartConfiguration): Promise<Buffer> {

		const chart = this.renderChart(configuration);
		return new Promise<Buffer>((resolve, reject) => {
			const canvas = chart.canvas as typeof Canvas;
			canvas.toBuffer((error: Error | null, buffer: Buffer) => {
				if (error) {
					return reject(error);
				}
				return resolve(buffer);
			});
		});
	}

	public renderToStream(configuration: Chart.ChartConfiguration): Stream {

		const chart = this.renderChart(configuration);
		const canvas = chart.canvas as typeof Canvas;
		return canvas.pngStream();
	}

	private renderChart(configuration: Chart.ChartConfiguration): Chart {

		const canvas = new Canvas(this._width, this._height);
		canvas.style = {};
		// Disable animation (otherwise charts will throw exceptions)
		configuration.options = configuration.options || {};
		configuration.options.responsive = false;
		configuration.options.animation = false as any;
		const context = canvas.getContext('2d');
		(global as any).window = {};	//https://github.com/chartjs/Chart.js/pull/5324
		return new this._ChartJs(context, configuration);
	}
}

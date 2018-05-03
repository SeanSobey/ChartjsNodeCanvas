import { promisify } from 'util';
import { Stream } from 'stream';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
import { createCanvas } from 'canvas-prebuilt';
import * as fresh from 'fresh-require';

export type ChartCallback = (chartJS: typeof ChartJS) => void | Promise<void>;

export class CanvasRenderService {

	private readonly _canvas: any;
	private readonly _ChartJs: typeof ChartJS;

	constructor(width: number, height: number, chartCallback?: ChartCallback) {

		this._canvas = createCanvas(width, height);
		this._canvas.style = {};
		this._ChartJs = fresh('chart.js', require) as typeof ChartJS;
		if (chartCallback) {
			chartCallback(this._ChartJs);
		}
	}

	public async renderToDataURL(configuration: Chart.ChartConfiguration): Promise<string> {

		this.renderChart(configuration);
		return new Promise<string>((resolve, reject) => {
			this._canvas.toDataURL('image/png', (error: Error | null, png: string) => {
				if (error) {
					return reject(error);
				}
				return resolve(png);
			});
		});
	}

	public renderToBuffer(configuration: Chart.ChartConfiguration): Promise<Buffer> {

		this.renderChart(configuration);
		return new Promise<Buffer>((resolve, reject) => {
			this._canvas.toBuffer((error: Error | null, buffer: Buffer) => {
				if (error) {
					return reject(error);
				}
				return resolve(buffer);
			});
		});
	}

	public renderToStream(configuration: Chart.ChartConfiguration): Stream {

		this.renderChart(configuration);
		return this._canvas.pngStream();
	}

	private renderChart(configuration: Chart.ChartConfiguration): Chart {

		// Disable animation (otherwise charts will throw exceptions)
		configuration.options = configuration.options || {};
		configuration.options.responsive = false;
		configuration.options.animation = false as any;
		const context = this._canvas.getContext('2d');
		(global as any).window = {};	//https://github.com/chartjs/Chart.js/pull/5324
		return new this._ChartJs(context, configuration);
	}
}

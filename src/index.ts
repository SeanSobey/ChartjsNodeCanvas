import { Stream } from 'stream';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
import { createCanvas } from 'canvas';
import * as fresh from 'fresh-require';

export type ChartCallback = (chartJS: typeof ChartJS) => void | Promise<void>;

export class CanvasRenderService {

	private readonly _width: number;
	private readonly _height: number;
	private readonly _ChartJs: typeof ChartJS;

	/**
	 * Create a new instance of CanvasRenderService.
	 *
	 * @param width The width of the charts to render, in pixles.
	 * @param height The height of the charts to render, in pixles.
	 * @param chartCallback optional callback which is called once with a new ChartJS global reference.
	 */
	constructor(width: number, height: number, chartCallback?: ChartCallback) {

		this._width = width;
		this._height = height;
		this._ChartJs = fresh('chart.js', require) as typeof ChartJS;
		if (chartCallback) {
			chartCallback(this._ChartJs);
		}
	}

	/**
	 * Render to a data url as png.
	 * @see https://github.com/Automattic/node-canvas#canvastodataurl
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 */
	public renderToDataURL(configuration: ChartConfiguration): Promise<string> {

		const chart = this.renderChart(configuration);
		return new Promise<string>((resolve, reject) => {
			const canvas = chart.canvas as any;
			canvas.toDataURL('image/png', (error: Error | null, png: string) => {
				if (error) {
					return reject(error);
				}
				return resolve(png);
			});
		});
	}

	/**
	 * Render to a buffer as png.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 */
	public renderToBuffer(configuration: ChartConfiguration): Promise<Buffer> {

		const chart = this.renderChart(configuration);
		return new Promise<Buffer>((resolve, reject) => {
			const canvas = chart.canvas as any;
			canvas.toBuffer((error: Error | null, buffer: Buffer) => {
				if (error) {
					return reject(error);
				}
				return resolve(buffer);
			});
		});
	}

	/**
	 * Render to a stream as png.
	 * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 */
	public renderToStream(configuration: ChartConfiguration): Stream {

		const chart = this.renderChart(configuration);
		const canvas = chart.canvas as any;
		return canvas.pngStream();
	}

	private renderChart(configuration: ChartConfiguration): Chart {

		const canvas = createCanvas(this._width, this._height);
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

import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
import { EventEmitter } from 'events';
import { createCanvas } from 'canvas-prebuilt';
import * as fresh from 'fresh-require';

export type ChartCallback = (chartJS: typeof ChartJS) => void | Promise<void>;

export class CanvasRenderService extends EventEmitter {

	private readonly _canvas: any;
	private readonly _ChartJs: typeof ChartJS;

	constructor(width: number, height: number, chartCallback?: ChartCallback) {

		super();
		this._canvas = createCanvas(width, height);
		this._canvas.style = {};
		this._ChartJs = fresh('fresh-require') as typeof ChartJS;
		if (chartCallback) {
			chartCallback(this._ChartJs);
		}
	}

	public async render(configuration: Chart.ChartConfiguration): Promise<Buffer> {

		// Disable animation (otherwise charts will throw exceptions)
		configuration.options = configuration.options || {};
		configuration.options.responsive = false;
		configuration.options.animation = false as any;
		const context = this._canvas.getContext('2d');
		const chart = new this._ChartJs(context, configuration);
		return new Promise<Buffer>((resolve, reject) => {
			// or `pngStream` `toDataURL`, etc
			this._canvas.toBuffer((error: Error | null, buffer: Buffer) => {
				if (error) {
					return reject(error);
				}
				return resolve(buffer);
			});
		});
	}
}

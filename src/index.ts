import { Readable } from 'stream';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
import { createCanvas, registerFont } from 'canvas';
import { freshRequire } from './freshRequire';
import { loadavg } from 'os';

export type ChartJSNodeCanvasPlugins = {
	/**
	 * Global plugins, see https://www.chartjs.org/docs/latest/developers/plugins.html.
	 */
	readonly modern?: ReadonlyArray<string | Chart.PluginServiceGlobalRegistration & Chart.PluginServiceRegistrationOptions>;
	/**
	 * This will work for plugins that `require` ChartJS themselves.
	 */
	readonly requireChartJSLegacy?: ReadonlyArray<string>;
	/**
	 * This should work for any plugin that expects a global Chart variable.
	 */
	readonly globalVariableLegacy?: ReadonlyArray<string>;
	/**
	 * This will work with plugins that just return a plugin object and do no specific loading themselves.
	 */
	readonly requireLegacy?: ReadonlyArray<string>;
};
export type ChartCallback = (chartJS: typeof ChartJS) => void | Promise<void>;
export type CanvasType = 'pdf' | 'svg';
export type MimeType = 'image/png' | 'image/jpeg';

// https://github.com/Automattic/node-canvas#non-standard-apis
type Canvas	= HTMLCanvasElement & {
	toBuffer(callback: (err: Error|null, result: Buffer) => void, mimeType?: string, config?: any): void;
	toBuffer(mimeType?: string, config?: any): Buffer;
	createPNGStream(config?: any): Readable;
	createJPEGStream(config?: any): Readable;
	createPDFStream(config?: any): Readable;
};

export interface ChartJSNodeCanvasOptions {
	/**
	 * The width of the charts to render, in pixels.
	 */
	readonly width: number;
	/**
	 * The height of the charts to render, in pixels.
	 */
	readonly height: number;
	/**
	 * Optional callback which is called once with a new ChartJS global reference as the only parameter.
	 */
	readonly chartCallback?: ChartCallback;
	/**
	 * Optional canvas type ('PDF' or 'SVG'), see the [canvas pdf doc](https://github.com/Automattic/node-canvas#pdf-output-support).
	 */
	readonly type?: CanvasType;
	/**
	 * Optional plugins to register.
	 */
	readonly plugins?: ChartJSNodeCanvasPlugins;
}

export class ChartJSNodeCanvas {

	private readonly _width: number;
	private readonly _height: number;
	private readonly _chartJs: typeof ChartJS;
	private readonly _createCanvas: typeof createCanvas;
	private readonly _registerFont: typeof registerFont;
	private readonly _type?: CanvasType;

	/**
	 * Create a new instance of CanvasRenderService.
	 *
	 * @param options Configuration for this instance
	 */
	constructor(options: ChartJSNodeCanvasOptions) {

		if (options === null || typeof (options) !== 'object') {
			throw new Error('An options parameter object is required');
		}
		if (!options.width || typeof (options.width) !== 'number') {
			throw new Error('A width option is required');
		}
		if (!options.height || typeof (options.height) !== 'number') {
			throw new Error('A height option is required');
		}

		this._width = options.width;
		this._height = options.height;
		const canvas = freshRequire('canvas');
		this._createCanvas = canvas.createCanvas;
		this._registerFont = canvas.registerFont;
		this._type = options.type && options.type.toLowerCase() as CanvasType;
		this._chartJs = this.initialize(options.plugins, options.chartCallback);
	}

	/**
	 * Render to a data url.
	 * @see https://github.com/Automattic/node-canvas#canvastodataurl
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType The image format, `image/png` or `image/jpeg`.
	 */
	public renderToDataURL(configuration: ChartConfiguration, mimeType: MimeType = 'image/png'): Promise<string> {

		const chart = this.renderChart(configuration);
		return new Promise<string>((resolve, reject) => {
			if (!chart.canvas) {
				return reject(new Error('Canvas is null'));
			}
			const canvas = chart.canvas as Canvas;
			canvas.toDataURL(mimeType, (error: Error | null, png: string) => {
				chart.destroy();
				if (error) {
					return reject(error);
				}
				return resolve(png);
			});
		});
	}

	/**
	 * Render to a data url synchronously.
	 * @see https://github.com/Automattic/node-canvas#canvastodataurl
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType The image format, `image/png` or `image/jpeg`.
	 */
	public renderToDataURLSync(configuration: ChartConfiguration, mimeType: MimeType = 'image/png'): string {

		const chart = this.renderChart(configuration);
		if (!chart.canvas) {
			throw new Error('Canvas is null');
		}
		const canvas = chart.canvas as Canvas;
		chart.destroy();
		const dataUrl = canvas.toDataURL(mimeType);
		return dataUrl;
	}

	/**
	 * Render to a buffer.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support) or `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
	 */
	public renderToBuffer(configuration: ChartConfiguration, mimeType: MimeType = 'image/png'): Promise<Buffer> {

		const chart = this.renderChart(configuration);
		return new Promise<Buffer>((resolve, reject) => {
			if (!chart.canvas) {
				throw new Error('Canvas is null');
			}
			const canvas = chart.canvas as Canvas;
			canvas.toBuffer((error: Error | null, buffer: Buffer) => {
				chart.destroy();
				if (error) {
					return reject(error);
				}
				return resolve(buffer);
			}, mimeType);
		});
	}

	/**
	 * Render to a buffer synchronously.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
	 */
	public renderToBufferSync(configuration: ChartConfiguration, mimeType: MimeType | 'application/pdf' | 'image/svg+xml' = 'image/png'): Buffer {

		const chart = this.renderChart(configuration);
		if (!chart.canvas) {
			throw new Error('Canvas is null');
		}
		const canvas = chart.canvas as Canvas;
		const buffer =  canvas.toBuffer(mimeType);
		chart.destroy();
		return buffer;
	}

	/**
	 * Render to a stream.
	 * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
	 */
	public renderToStream(configuration: ChartConfiguration, mimeType: MimeType | 'application/pdf' = 'image/png'): Readable {

		const chart = this.renderChart(configuration);
		if (!chart.canvas) {
			throw new Error('Canvas is null');
		}
		const canvas = chart.canvas as Canvas;
		setImmediate(() => chart.destroy());
		switch (mimeType) {
			case 'image/png':
				return canvas.createPNGStream();
			case 'image/jpeg':
				return canvas.createJPEGStream();
			case 'application/pdf':
				return canvas.createPDFStream();
			default:
				throw new Error(`Un-handled mimeType: ${mimeType}`);
		}
	}

	/**
	 * Use to register the font with Canvas to use a font file that is not installed as a system font, this must be done before the Canvas is created.
	 *
	 * @param path The path to the font file.
	 * @param options The font options.
	 * @example
	 * registerFont('comicsans.ttf', { family: 'Comic Sans' });
	 */
	public registerFont(path: string, options: { readonly family: string, readonly weight?: string, readonly style?: string }): void {

		this._registerFont(path, options);
	}

	private initialize(plugins?: ChartJSNodeCanvasPlugins, chartCallback?: ChartCallback): typeof ChartJS {

		const chartJs = require('chart.js');

		if (plugins?.requireChartJSLegacy) {
			for (const plugin of plugins.requireChartJSLegacy) {
				require(plugin);
				delete require.cache[require.resolve(plugin)];
			}
		}

		if (plugins?.globalVariableLegacy) {
			(global as any).Chart = chartJs;
			for (const plugin of plugins.globalVariableLegacy) {
				freshRequire(plugin);
			}
			delete (global as any).Chart;
		}

		if (plugins?.modern) {
			for (const plugin of plugins.modern) {
				if (typeof plugin === 'string') {
					chartJs.plugins.register(freshRequire(plugin));
				} else {
					chartJs.plugins.register(plugin);
				}
			}
		}

		if (plugins?.requireLegacy) {
			for (const plugin of plugins.requireLegacy) {
				chartJs.plugins.register(freshRequire(plugin));
			}
		}

		if (chartCallback) {
			chartCallback(chartJs);
		}

		delete require.cache[require.resolve('chart.js')];

		return chartJs;
	}

	private renderChart(configuration: ChartConfiguration): Chart {

		const canvas = this._createCanvas(this._width, this._height, this._type);
		canvas.style = {};
		// Disable animation (otherwise charts will throw exceptions)
		configuration.options = configuration.options || {};
		configuration.options.responsive = false;
		configuration.options.animation = false as any;
		const context = canvas.getContext('2d');
		return new this._chartJs(context, configuration);
	}
}

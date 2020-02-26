import { Readable } from 'stream';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
import { createCanvas, registerFont } from 'canvas';
import { freshRequire } from './freshRequire';

export type ChartCallback = (chartJS: typeof ChartJS) => void | Promise<void>;
export type CanvasType = 'pdf' | 'svg';
export type MimeType = 'image/png' | 'image/jpeg';
export type ChartJsFactory = () => typeof ChartJS;

const defaultChartJsFactory: ChartJsFactory = () => freshRequire('chart.js');

// https://github.com/Automattic/node-canvas#non-standard-apis
type Canvas	= HTMLCanvasElement & {
	toBuffer(callback: (err: Error|null, result: Buffer) => void, mimeType?: string, config?: any): void;
	toBuffer(mimeType?: string, config?: any): Buffer;
	createPNGStream(config?: any): Readable;
	createJPEGStream(config?: any): Readable;
	createPDFStream(config?: any): Readable;
};

export class CanvasRenderService {

	private readonly _width: number;
	private readonly _height: number;
	private readonly _chartJs: typeof ChartJS;
	private readonly _createCanvas: typeof createCanvas;
	private readonly _registerFont: typeof registerFont;
	private readonly _type?: CanvasType;

	/**
	 * Create a new instance of CanvasRenderService.
	 *
	 * @param width The width of the charts to render, in pixels.
	 * @param height The height of the charts to render, in pixels.
	 * @param chartCallback optional callback which is called once with a new ChartJS global reference as the only parameter.
	 * @param type optional The canvas type ('PDF' or 'SVG'), see the [canvas pdf doc](https://github.com/Automattic/node-canvas#pdf-output-support).
	 * @param chartJsFactory optional provider for chart.js.
	 */
	constructor(width: number, height: number, chartCallback?: ChartCallback, type?: CanvasType, chartJsFactory?: ChartJsFactory) {

		this._width = width;
		this._height = height;
		this._chartJs = (chartJsFactory || defaultChartJsFactory)();
		const canvas = freshRequire('canvas');
		this._createCanvas = canvas.createCanvas;
		this._registerFont = canvas.registerFont;
		this._type = type;
		if (chartCallback) {
			chartCallback(this._chartJs);
		}
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

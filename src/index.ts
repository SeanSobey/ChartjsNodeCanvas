import { Readable } from 'stream';
import { Chart as ChartJS, ChartConfiguration, ChartComponentLike } from 'chart.js';
import { createCanvas, registerFont, Image, PngConfig, JpegConfig, PdfConfig } from 'canvas';
import { freshRequire } from './freshRequire';
import { BackgroundColourPlugin } from './backgroundColourPlugin';

export type ChartJSNodeCanvasPlugins = {
	/**
	 * Global plugins, see https://www.chartjs.org/docs/latest/developers/plugins.html.
	 */
	readonly modern?: ReadonlyArray<string | ChartComponentLike>;
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
export enum MimeType {
	PNG = 'image/png',
	JPEG = 'image/jpeg',
	PDF = 'application/pdf',
	SVG = 'image/svg+xml'
}

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

	/**
	 * Optional background color for the chart, otherwise it will be transparent. Note, this will apply to all charts. See the [fillStyle](https://www.w3schools.com/tags/canvas_fillstyle.asp) canvas API used for possible values.
	 */
	readonly backgroundColour?: string;
}

export class ChartJSNodeCanvas {

	private readonly _width: number;
	private readonly _height: number;
	private readonly _chartJs: typeof ChartJS;
	private readonly _createCanvas: typeof createCanvas;
	private readonly _registerFont: typeof registerFont;
	private readonly _image: typeof Image;
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
		this._image = canvas.Image;
		this._type = options.type && options.type.toLowerCase() as CanvasType;
		this._chartJs = this.initialize(options);
	}

	/**
	 * Render to a data url.
	 * @see https://github.com/Automattic/node-canvas#canvastodataurl
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType The image format.
	 */
	public renderToDataURL(configuration: ChartConfiguration, mimeType?: MimeType.PNG | MimeType.JPEG): Promise<string>;
	/**
	 * Render to a data url.
	 * @see https://github.com/Automattic/node-canvas#canvastodataurl
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType The image format.
	 * @param quality An optional jpeg quality from 0 to 1.
	 */
	public renderToDataURL(configuration: ChartConfiguration, mimeType: MimeType.JPEG, quality: number): Promise<string>;
	/**
	 * Render to a data url.
	 * @see https://github.com/Automattic/node-canvas#canvastodataurl
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType The image format.
	 * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
	 */
	public renderToDataURL(configuration: ChartConfiguration, mimeType: MimeType.JPEG, imageConfiguration: JpegConfig): Promise<string>;
	/**
	 * Render to a data url.
	 * @see https://github.com/Automattic/node-canvas#canvastodataurl
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType The image format, `image/png` or `image/jpeg`.
	 * @param quality An optional jpeg quality from 0 to 1.
	 */
	public renderToDataURL(configuration: ChartConfiguration, mimeType: MimeType.PNG | MimeType.JPEG = MimeType.PNG, qualityOrConfig?: number | JpegConfig): Promise<string> {

		const chart = this.renderChart(configuration);
		return new Promise<string>((resolve, reject) => {
			if (!chart.canvas) {
				return reject(new Error('Canvas is null'));
			}
			const canvas = chart.canvas as Canvas;
			const callback = (error: Error | null, png: string) => {
				chart.destroy();
				if (error) {
					return reject(error);
				}
				return resolve(png);
			};
			if (mimeType === MimeType.JPEG && qualityOrConfig) {
				(canvas as any).toDataURL(mimeType, qualityOrConfig, callback);
			} else {
				canvas.toDataURL(mimeType, callback);
			}
		});
	}

	/**
	 * Render to a data url synchronously.
	 * @see https://github.com/Automattic/node-canvas#canvastodataurl
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType The image format.
	 */
	public renderToDataURLSync(configuration: ChartConfiguration, mimeType?: MimeType.PNG | MimeType.JPEG): string;
	/**
	 * Render to a data url synchronously.
	 * @see https://github.com/Automattic/node-canvas#canvastodataurl
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType The image format.
	 * @param quality An optional jpeg quality from 0 to 1.
	 */
	public renderToDataURLSync(configuration: ChartConfiguration, mimeType: MimeType.JPEG, quality: number): string;
	/**
	 * Render to a data url synchronously.
	 * @see https://github.com/Automattic/node-canvas#canvastodataurl
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType The image format, `image/png` or `image/jpeg`.
	 * @param quality An optional jpeg quality from 0 to 1.
	 */
	public renderToDataURLSync(configuration: ChartConfiguration, mimeType: MimeType.PNG | MimeType.JPEG = MimeType.PNG, quality?: number): string {

		const chart = this.renderChart(configuration);
		if (!chart.canvas) {
			throw new Error('Canvas is null');
		}
		const canvas = chart.canvas as Canvas;
		const dataUrl = canvas.toDataURL(mimeType, quality);
		chart.destroy();
		return dataUrl;
	}

	/**
	 * Render to a buffer.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 */
	public renderToBuffer(configuration: ChartConfiguration, mimeType?: MimeType | 'raw'): Promise<Buffer>;
	/**
	 * Render to a buffer.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
	 */
	public renderToBuffer(configuration: ChartConfiguration, mimeType: MimeType.PNG, imageConfiguration: PngConfig): Promise<Buffer>;
	/**
	 * Render to a buffer.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
	 */
	public renderToBuffer(configuration: ChartConfiguration, mimeType: MimeType.JPEG, imageConfiguration: JpegConfig): Promise<Buffer>;
	/**
	 * Render to a buffer.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
	 */
	public renderToBuffer(configuration: ChartConfiguration, mimeType: MimeType.PDF, imageConfiguration: PdfConfig): Promise<Buffer>;
	/**
	 * Render to a buffer.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support) or `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
	 * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
	 */
	public renderToBuffer(configuration: ChartConfiguration, mimeType: MimeType | 'raw' = MimeType.PNG, imageConfiguration?: PngConfig | JpegConfig | PdfConfig): Promise<Buffer> {

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
			}, mimeType, imageConfiguration);
		});
	}

	/**
	 * Render to a buffer synchronously.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 */
	 public renderToBufferSync(configuration: ChartConfiguration, mimeType?: MimeType): Buffer;
	/**
	 * Render to a buffer synchronously.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
	 */
	public renderToBufferSync(configuration: ChartConfiguration, mimeType: MimeType.PNG, imageConfiguration: PngConfig): Buffer;
	/**
	 * Render to a buffer synchronously.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
	 */
	public renderToBufferSync(configuration: ChartConfiguration, mimeType: MimeType.JPEG, imageConfiguration: JpegConfig): Buffer;
	/**
	 * Render to a buffer synchronously.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
	 */
	public renderToBufferSync(configuration: ChartConfiguration, mimeType: MimeType.PDF, imageConfiguration: PdfConfig): Buffer;
	/**
	 * Render to a buffer synchronously.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
	 * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
	 */
	public renderToBufferSync(configuration: ChartConfiguration, mimeType: MimeType = MimeType.PNG, imageConfiguration?: PngConfig | JpegConfig | PdfConfig): Buffer {

		const chart = this.renderChart(configuration);
		if (!chart.canvas) {
			throw new Error('Canvas is null');
		}
		const canvas = chart.canvas as Canvas;
		const buffer =  canvas.toBuffer(mimeType, imageConfiguration);
		chart.destroy();
		return buffer;
	}

	/**
	 * Render to a stream.
	 * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 */
	public renderToStream(configuration: ChartConfiguration, mimeType?: MimeType.PNG | MimeType.JPEG | MimeType.PDF): Readable;
	/**
	 * Render to a stream.
	 * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 * @param imageConfiguration An optional config for the canvas image options. See the relevant [configs](https://github.com/Automattic/node-canvas#canvascreatepngstream).
	 */
	public renderToStream(configuration: ChartConfiguration, mimeType: MimeType.PNG, pngConfiguration: PngConfig): Readable;
	/**
	 * Render to a stream.
	 * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 * @param imageConfiguration An optional config for the canvas image options. See the relevant [configs](https://github.com/Automattic/node-canvas#canvascreatejpegstream).
	 */
	public renderToStream(configuration: ChartConfiguration, mimeType: MimeType.JPEG, jpegConfiguration: JpegConfig): Readable;
	/**
	 * Render to a stream.
	 * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format.
	 * @param imageConfiguration An optional config for the canvas image options. See the relevant [configs](https://github.com/Automattic/node-canvas#canvascreatepdfstream).
	 */
	public renderToStream(configuration: ChartConfiguration, mimeType: MimeType.PDF, pdfConfiguration: PdfConfig): Readable;
	/**
	 * Render to a stream.
	 * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
	 * @param imageConfiguration An optional config for the canvas image options. See the relevant configs for [png](https://github.com/Automattic/node-canvas#canvascreatepngstream), [jpeg](https://github.com/Automattic/node-canvas#canvascreatejpegstream) or [pdf](https://github.com/Automattic/node-canvas#canvascreatepdfstream).
	 */
	public renderToStream(configuration: ChartConfiguration, mimeType: MimeType.PNG | MimeType.JPEG | MimeType.PDF = MimeType.PNG, imageConfiguration?: PngConfig | JpegConfig | PdfConfig): Readable {

		const chart = this.renderChart(configuration);
		if (!chart.canvas) {
			throw new Error('Canvas is null');
		}
		const canvas = chart.canvas as Canvas;
		setImmediate(() => chart.destroy());
		switch (mimeType) {
			case 'image/png':
				return canvas.createPNGStream(imageConfiguration);
			case 'image/jpeg':
				return canvas.createJPEGStream(imageConfiguration);
			case 'application/pdf':
				return canvas.createPDFStream(imageConfiguration);
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

	private initialize(options: ChartJSNodeCanvasOptions): typeof ChartJS {

		const chartJs: typeof ChartJS = require('chart.js');

		if (options.plugins?.requireChartJSLegacy) {
			for (const plugin of options.plugins.requireChartJSLegacy) {
				require(plugin);
				delete require.cache[require.resolve(plugin)];
			}
		}

		if (options.plugins?.globalVariableLegacy) {
			(global as any).Chart = chartJs;
			for (const plugin of options.plugins.globalVariableLegacy) {
				freshRequire(plugin);
			}
			delete (global as any).Chart;
		}

		if (options.plugins?.modern) {
			for (const plugin of options.plugins.modern) {
				if (typeof plugin === 'string') {
					chartJs.register(freshRequire(plugin));
				} else {
					chartJs.register(plugin);
				}
			}
		}

		if (options.plugins?.requireLegacy) {
			for (const plugin of options.plugins.requireLegacy) {
				chartJs.register(freshRequire(plugin));
			}
		}

		if (options.chartCallback) {
			options.chartCallback(chartJs);
		}

		if (options.backgroundColour) {
			chartJs.register(new BackgroundColourPlugin(options.width, options.height, options.backgroundColour));
		}

		delete require.cache[require.resolve('chart.js')];

		return chartJs;
	}

	private renderChart(configuration: ChartConfiguration): ChartJS {

		const canvas = this._createCanvas(this._width, this._height, this._type);
		(canvas as any).style = (canvas as any).style || {};
		// Disable animation (otherwise charts will throw exceptions)
		configuration.options = configuration.options || {};
		configuration.options.responsive = false;
		configuration.options.animation = false as any;
		const context = canvas.getContext('2d');
		(global as any).Image = this._image; // Some plugins use this API
		const chart = new this._chartJs(context, configuration);
		delete (global as any).Image;
		return chart;
	}
}

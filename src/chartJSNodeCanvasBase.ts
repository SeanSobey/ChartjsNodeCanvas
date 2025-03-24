import { Readable } from 'stream';
// @ts-expect-error moduleResolution:nodenext issue 54523
import { Chart as ChartJS, ChartComponentLike } from 'chart.js/auto';
import { createCanvas, registerFont, Image } from 'canvas';
import { join as pathJoin } from 'path';
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
export type MimeType = 'image/png' | 'image/jpeg';

// https://github.com/Automattic/node-canvas#non-standard-apis
export type Canvas = HTMLCanvasElement & {
	toBuffer(callback: (err: Error | null, result: Buffer) => void, mimeType?: string, config?: any): void;
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

export abstract class ChartJSNodeCanvasBase {

	protected readonly _width: number;
	protected readonly _height: number;
	protected readonly _chartJs: typeof ChartJS;
	protected readonly _createCanvas: typeof createCanvas;
	protected readonly _registerFont: typeof registerFont;
	protected readonly _image: typeof Image;
	protected readonly _type?: CanvasType;

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

	protected initialize(options: ChartJSNodeCanvasOptions): typeof ChartJS {

		const chartJs: typeof ChartJS = require('chart.js/auto');

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
		const chartJsPath  = pathJoin('node_modules','chart.js');

		for (const key of Object.keys(require.cache)) {
			if (key.includes(chartJsPath)) {
				delete require.cache[key];
			}
		}

		return chartJs;
	}
}

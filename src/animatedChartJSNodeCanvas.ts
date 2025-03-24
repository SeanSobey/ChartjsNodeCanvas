// @ts-expect-error moduleResolution:nodenext issue 54523
import { Chart as ChartJS, ChartConfiguration } from 'chart.js/auto';
import { ChartJSNodeCanvasBase, MimeType, Canvas } from './chartJSNodeCanvasBase';

const animationFrameProvider: AnimationFrameProvider = {
	cancelAnimationFrame: (handle) => clearImmediate(handle as any),
	requestAnimationFrame: (callback) => setImmediate(() => callback(Date.now())) as any,
};

type OnProgress = (chart: ChartJS, progress: number, initial: boolean) => void;
type OnComplete = (chart: ChartJS, initial: boolean) => void;

export class AnimatedChartJSNodeCanvas extends ChartJSNodeCanvasBase {

	/**
	 * Render to a data url array.
	 * @see https://github.com/Automattic/node-canvas#canvastodataurl
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
	 */
	public renderToDataURL(configuration: ChartConfiguration, mimeType: MimeType = 'image/png'): Promise<ReadonlyArray<string>> {

		const frames: Array<string> = [];
		return new Promise((resolve, _reject) => {
			this.renderChart(configuration, (chart) => {

				const canvas = chart.canvas as Canvas;
				if (!canvas) {
					throw new Error('Canvas is null');
				}
				const dataUrl = canvas.toDataURL(mimeType);
				frames.push(dataUrl);
			}, (chart) => {

				resolve(frames);
				chart.destroy();
			});
		});
	}

	/**
	 * Render to a buffer.
	 * @see https://github.com/Automattic/node-canvas#canvastobuffer
	 *
	 * @param configuration The Chart JS configuration for the chart to render.
	 * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support) or `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
	 */
	public renderToBuffer(configuration: ChartConfiguration, mimeType: MimeType = 'image/png'): Promise<ReadonlyArray<Buffer>> {

		return new Promise((resolve, _reject) => {

			const frames: Array<Buffer> = [];
			this.renderChart(configuration, (chart) => {

				const canvas = chart.canvas as Canvas;
				if (!canvas) {
					throw new Error('Canvas is null');
				}
				const buffer = canvas.toBuffer(mimeType);
				frames.push(buffer);
			}, (chart) => {

				resolve(frames);
				chart.destroy();
			});
		});
	}

	private renderChart(configuration: ChartConfiguration, onProgress: OnProgress, onComplete: OnComplete): ChartJS {

		const canvas = this._createCanvas(this._width, this._height, this._type);
		(canvas as any).style = (canvas as any).style || {};
		const options = Object.assign({}, configuration.options);
		options.responsive = false;
		const animation = options.animation || {};
		if (!animation.duration) {
			animation.duration = 1000;
		}
		const baseOnProgress = animation.onProgress;
		animation.onProgress = (event) => {
			const currentStep: number = (event as any).currentStep; // type docs wrong?
			const initial = !!(event as any).initial ? (event as any).initial : false;  // added around 3.2.x
			const progress = currentStep / event.numSteps;
			if (baseOnProgress) {
				//baseOnComplete(event.chart);
				baseOnProgress.call(animation as any, event);
			}
			onProgress(event.chart, progress, initial);
		};
		const baseOnComplete = animation.onProgress;
		animation.onComplete = (event) => {
			const initial = !!(event as any).initial ? (event as any).initial : false;  // added around 3.2.x
			if (baseOnComplete) {
				//baseOnComplete(event.chart);
				baseOnComplete.call(animation as any, event);
			}
			onComplete(event.chart, initial);
		};
		const plugins = configuration.plugins || [];
		const configuredChartConfig = { ...configuration, options, plugins };
		global.window = global.window || {};
		global.window.requestAnimationFrame = animationFrameProvider.requestAnimationFrame;
		global.window.cancelAnimationFrame = animationFrameProvider.cancelAnimationFrame;
		const context = canvas.getContext('2d');
		(global as any).Image = this._image; // Some plugins use this API
		const chart = new this._chartJs((context as any), configuredChartConfig);
		delete (global as any).Image;
		return chart;
	}
}

import { Chart as ChartJS, ChartConfiguration, Plugin as ChartJSPlugin } from 'chart.js';
import { Readable } from 'stream';
import { MimeType } from '.';

// https://github.com/Automattic/node-canvas#non-standard-apis
type Canvas	= HTMLCanvasElement & {
	toBuffer(callback: (err: Error|null, result: Buffer) => void, mimeType?: string, config?: any): void;
	toBuffer(mimeType?: string, config?: any): Buffer;
	createPNGStream(config?: any): Readable;
	createJPEGStream(config?: any): Readable;
	createPDFStream(config?: any): Readable;
};

export type AnimationFrame = string | Buffer;

export type AnimationType = {
	// tslint:disable: readonly-keyword readonly-array
	frames: Array<AnimationFrame>;
	completed: boolean;
	error?: Error;
	// tslint:enable: readonly-keyword readonly-array
};

export type AnimationRenderType = 'buffer' | 'dataurl';

export type AnimationPluginOptions = {
	readonly renderType: AnimationRenderType;
	readonly mimeType: MimeType;
};

export type AnimationCallback = (result: ReadonlyArray<AnimationFrame>, error?: Error) => void;

export class AnimationPlugin implements ChartJSPlugin {
	private static readonly defaultPluginOptions: AnimationPluginOptions = {
		mimeType: 'image/png',
		renderType: 'dataurl'
	};
	private static readonly ID = 'chartjs-plugin-chartjs-node-canvas-animation';

	public readonly id: string = AnimationPlugin.ID;

	// tslint:disable-next-line: readonly-array
	private readonly _frames: Array<AnimationFrame>;
	private readonly _animationCompleted: AnimationCallback;
	private readonly vars = {
		beforeDatasetDraw: false,
		count: 0,
		frame: 0,
	};

	// tslint:disable-next-line: readonly-array
	public constructor(animationCompleted: AnimationCallback) {
		this._frames = [];
		this._animationCompleted = animationCompleted;
	}

	public static includePluginOptions(configuration: ChartConfiguration, options: AnimationPluginOptions): ChartConfiguration {
		return {
			...configuration,
			options: {
				...(configuration.options ?? {}),
				plugins: {
					...(configuration.options?.plugins ?? {}),
					...({[AnimationPlugin.ID]: options})
				}
			}
		};
	}

	public afterDraw(chart: ChartJS): void {
		this.render(chart);
		this.vars.count += 1;
	}

	public afterRender(chart: ChartJS): void {
		this.render(chart);
		this._animationCompleted(this._frames);
	}

	public beforeDatasetDraw(chart: ChartJS): void {
		if (this.vars.beforeDatasetDraw) {
			return;
		}
		this.vars.beforeDatasetDraw = true;
		this.render(chart);
	}

	private render(chart: ChartJS): void {
		this.vars.frame += 1;
		const { mimeType, renderType } = this.pluginOptions(chart);
		try {
			if (renderType === 'buffer') {
				this.renderToBuffer(chart, mimeType);
			}
			if (renderType === 'dataurl') {
				this.renderToDataURL(chart, mimeType);
			}
		} catch (error) {
			this._animationCompleted([], error instanceof Error ? error : new Error());
		}
	}

	private renderToBuffer(chart: ChartJS, mimeType: MimeType): void {
		if (!chart.canvas) {
			throw new Error('Canvas is null');
		}
		const canvas = chart.canvas as Canvas;
		const buffer = canvas.toBuffer(mimeType);
		this._frames.push(buffer);
	}

	private renderToDataURL(chart: ChartJS, mimeType: MimeType): void {
		if (!chart.canvas) {
			throw new Error('Canvas is null');
		}
		const canvas = chart.canvas as Canvas;
		const png = canvas.toDataURL(mimeType);
		this._frames.push(png);
	}

	private pluginOptions(chart: ChartJS): AnimationPluginOptions {
		const plugins = chart.config.options?.plugins;
		const options = plugins ? (plugins as any)[AnimationPlugin.ID] : {};
		return { ...AnimationPlugin.defaultPluginOptions, ...options };
	}
}

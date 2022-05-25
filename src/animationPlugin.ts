import { Chart as ChartJS, Plugin as ChartJSPlugin } from 'chart.js';
import { Readable } from 'stream';

// https://github.com/Automattic/node-canvas#non-standard-apis
type Canvas	= HTMLCanvasElement & {
	toBuffer(callback: (err: Error|null, result: Buffer) => void, mimeType?: string, config?: any): void;
	toBuffer(mimeType?: string, config?: any): Buffer;
	createPNGStream(config?: any): Readable;
	createJPEGStream(config?: any): Readable;
	createPDFStream(config?: any): Readable;
};

export type AnimationOptions = {
	readonly frameRate?: number;
	readonly renderType?: 'buffer' | 'dataurl';
	readonly callback?: (chart: ChartJS, canvas: Canvas, frame: number) => void;
};

export type AnimationType = {
	// tslint:disable: readonly-keyword readonly-array
	buffers: Array<Buffer>;
	error?: Error;
	urls: Array<string>;
	options?: AnimationOptions;
	completed: boolean;
	// tslint:enable: readonly-keyword readonly-array
};

export class AnimationPlugin implements ChartJSPlugin {
	public readonly id: string = 'chartjs-plugin-chartjs-node-canvas-animation';

	// tslint:disable-next-line: readonly-array
	private readonly _animationBuffers: Array<Buffer>;
	// tslint:disable-next-line: readonly-array
	private readonly _animationURLs: Array<string>;
	private readonly _animationCompleted: (error?: Error) => void;
	private readonly vars = {
		count: 0,
		prev: 0,
		frame: 0,
		beforeDatasetDraw: false,
		wait: false
	};
	private readonly options: AnimationOptions;
	private readonly startTime: number;

	// tslint:disable-next-line: readonly-array
	public constructor(options: AnimationOptions, animationBuffers: Array<Buffer>, animationURLs: Array<string>, animationCompleted: () => void) {
		this.startTime = (new Date()).getTime();
		this.options = options;
		this._animationBuffers = animationBuffers;
		this._animationCompleted = animationCompleted;
		this._animationURLs = animationURLs;

		this.startWaiting = this.startWaiting.bind(this);
		this.stopWaiting = this.stopWaiting.bind(this);
	}

	public afterDraw(chart: ChartJS): boolean | void {
		const frameRate = this.options.frameRate ?? 30;
		const diff = this.difference();
		const timeHasPassed = (diff - this.vars.prev) > (1000 / frameRate);
		if (timeHasPassed && !this.vars.wait) {
			this.render(chart).catch(this._animationCompleted);
		}
		this.vars.count += 1;
	}

	public afterRender(chart: ChartJS): void {
		this.render(chart).then(() => this._animationCompleted()).catch(this._animationCompleted);
	}

	public beforeDatasetDraw(chart: ChartJS): void {
		if (this.vars.beforeDatasetDraw || this.vars.wait) {
			return;
		}
		this.vars.beforeDatasetDraw = true;
		this.render(chart).catch(this._animationCompleted);
	}

	private async render(chart: ChartJS): Promise<void> {
		this.startWaiting();
		const diff = this.difference();
		this.vars.frame += 1;
		this.vars.prev = diff;
		try {
			if (this.options.renderType === 'buffer') {
				await this.renderToBuffer(chart);
			}
			if (this.options.renderType === 'dataurl') {
				await this.renderToDataURL(chart);
			}
			if (this.options.callback && chart.canvas) {
				this.options.callback(chart, chart.canvas as Canvas, this.vars.frame);
			}
		} catch (error) {
			throw error;
		} finally {
			this.stopWaiting();
		}
	}

	private renderToBuffer(chart: ChartJS): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!chart.canvas) {
				reject('Canvas is null');
			}
			const canvas = chart.canvas as Canvas;
			canvas.toBuffer((error: Error | null, buffer: Buffer) => {
				if (error) {
					reject(error);
				}
				this._animationBuffers!.push(buffer);
				resolve();
			}, 'image/png');
		});
	}

	private renderToDataURL(chart: ChartJS): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!chart.canvas) {
				reject('Canvas is null');
			}
			const canvas = chart.canvas as Canvas;
			canvas.toDataURL('image/png', (error: Error | null, png: string) => {
				if (error) {
					reject(error);
				}
				this._animationURLs!.push(png);
				resolve();
			});
		});
	}

	private startWaiting(): void {
		this.vars.wait = true;
	}

	private stopWaiting(): void {
		this.vars.wait = false;
	}

	private difference(): number {
		return (new Date()).getTime() - this.startTime;
	}
}

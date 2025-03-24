// @ts-expect-error moduleResolution:nodenext issue 54523
import { Chart as ChartJS, Plugin as ChartJSPlugin } from 'chart.js/auto';

export class BackgroundColourPlugin implements ChartJSPlugin {
	public readonly id: string = 'chartjs-plugin-chartjs-node-canvas-background-colour';

	public constructor(
		private readonly _width: number,
		private readonly _height: number,
		private readonly _fillStyle: string
	) { }

	public beforeDraw(chart: ChartJS): boolean | void {

		const ctx = chart.ctx;
		ctx.save();
		ctx.globalCompositeOperation = 'destination-over';
		ctx.fillStyle = this._fillStyle;
		ctx.fillRect(0, 0, this._width, this._height);
		ctx.restore();
	}
}

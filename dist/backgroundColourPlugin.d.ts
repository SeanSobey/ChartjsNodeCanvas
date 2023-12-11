import { Chart as ChartJS, Plugin as ChartJSPlugin } from 'chart.js';
export declare class BackgroundColourPlugin implements ChartJSPlugin {
    private readonly _width;
    private readonly _height;
    private readonly _fillStyle;
    readonly id: string;
    constructor(_width: number, _height: number, _fillStyle: string);
    beforeDraw(chart: ChartJS): boolean | void;
}

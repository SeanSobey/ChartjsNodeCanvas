/// <reference types="node" />
import { Stream } from 'stream';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
export declare type ChartCallback = (chartJS: typeof ChartJS) => void | Promise<void>;
export declare class CanvasRenderService {
    private readonly _width;
    private readonly _height;
    private readonly _ChartJs;
    /**
     * Create a new instance of CanvasRenderService.
     *
     * @param width The width of the charts to render, in pixles.
     * @param height The height of the charts to render, in pixles.
     * @param chartCallback optional callback which is called once with a new ChartJS global reference.
     */
    constructor(width: number, height: number, chartCallback?: ChartCallback);
    /**
     * Render to a data url as png.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     */
    renderToDataURL(configuration: ChartConfiguration): Promise<string>;
    /**
     * Render to a buffer as png.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     */
    renderToBuffer(configuration: ChartConfiguration): Promise<Buffer>;
    /**
     * Render to a stream as png.
     * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
     *
     * @param configuration The Chart JS configuration for the chart to render.
     */
    renderToStream(configuration: ChartConfiguration): Stream;
    private renderChart;
}

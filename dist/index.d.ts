/// <reference types="node" />
import { Readable } from 'stream';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
export declare type ChartCallback = (chartJS: typeof ChartJS) => void | Promise<void>;
export declare type CanvasType = 'pdf' | 'svg';
export declare type MimeType = 'image/png' | 'image/jpeg';
export declare type ChartJsFactory = () => typeof ChartJS;
export declare class CanvasRenderService {
    private readonly _width;
    private readonly _height;
    private readonly _chartJs;
    private readonly _createCanvas;
    private readonly _registerFont;
    private readonly _type?;
    /**
     * Create a new instance of CanvasRenderService.
     *
     * @param width The width of the charts to render, in pixels.
     * @param height The height of the charts to render, in pixels.
     * @param chartCallback optional callback which is called once with a new ChartJS global reference as the only parameter.
     * @param type optional The canvas type ('PDF' or 'SVG'), see the [canvas pdf doc](https://github.com/Automattic/node-canvas#pdf-output-support).
     * @param chartJsFactory optional provider for chart.js.
     */
    constructor(width: number, height: number, chartCallback?: ChartCallback, type?: CanvasType, chartJsFactory?: ChartJsFactory);
    /**
     * Render to a data url.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType The image format, `image/png` or `image/jpeg`.
     */
    renderToDataURL(configuration: ChartConfiguration, mimeType?: MimeType): Promise<string>;
    /**
     * Render to a data url synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType The image format, `image/png` or `image/jpeg`.
     */
    renderToDataURLSync(configuration: ChartConfiguration, mimeType?: MimeType): string;
    /**
     * Render to a buffer.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support) or `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
     */
    renderToBuffer(configuration: ChartConfiguration, mimeType?: MimeType): Promise<Buffer>;
    /**
     * Render to a buffer synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
     */
    renderToBufferSync(configuration: ChartConfiguration, mimeType?: MimeType | 'application/pdf' | 'image/svg+xml'): Buffer;
    /**
     * Render to a stream.
     * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
     */
    renderToStream(configuration: ChartConfiguration, mimeType?: MimeType | 'application/pdf'): Readable;
    /**
     * Use to register the font with Canvas to use a font file that is not installed as a system font, this must be done before the Canvas is created.
     *
     * @param path The path to the font file.
     * @param options The font options.
     * @example
     * registerFont('comicsans.ttf', { family: 'Comic Sans' });
     */
    registerFont(path: string, options: {
        readonly family: string;
        readonly weight?: string;
        readonly style?: string;
    }): void;
    private renderChart;
}

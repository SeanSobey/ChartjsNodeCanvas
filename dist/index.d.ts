/// <reference types="node" />
import { Readable } from 'stream';
import { Chart as ChartJS, ChartConfiguration, ChartComponentLike } from 'chart.js';
export declare type ChartJSNodeCanvasPlugins = {
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
export declare type ChartCallback = (chartJS: typeof ChartJS) => void | Promise<void>;
export declare type MimeType = 'image/png' | 'image/jpeg';
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
     * Optional plugins to register.
     */
    readonly plugins?: ChartJSNodeCanvasPlugins;
    /**
     * Optional background color for the chart, otherwise it will be transparent. Note, this will apply to all charts. See the [fillStyle](https://www.w3schools.com/tags/canvas_fillstyle.asp) canvas API used for possible values.
     */
    readonly backgroundColour?: string;
}
export declare class ChartJSNodeCanvas {
    private readonly _width;
    private readonly _height;
    private readonly _chartJs;
    private readonly _createCanvas;
    private readonly _image;
    /**
     * Create a new instance of CanvasRenderService.
     *
     * @param options Configuration for this instance
     */
    constructor(options: ChartJSNodeCanvasOptions);
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
     * @param nameAlias The name to use when registering the font, this is the name that will be used in the font property in the chart configuration.
     * @example
     * registerFont('comicsans.ttf', 'Comic Sans');
     */
    registerFont(path: string, nameAlias?: string): void;
    private initialize;
    private renderChart;
}

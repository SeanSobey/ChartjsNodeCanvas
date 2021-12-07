/// <reference types="node" />
import { Readable } from 'stream';
import { Chart as ChartJS, ChartConfiguration, ChartComponentLike } from 'chart.js';
import { PngConfig, JpegConfig, PdfConfig } from 'canvas';
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
export declare type CanvasType = 'pdf' | 'svg';
export declare enum MimeType {
    PNG = "image/png",
    JPEG = "image/jpeg",
    PDF = "application/pdf",
    SVG = "image/svg+xml"
}
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
export declare class ChartJSNodeCanvas {
    private readonly _width;
    private readonly _height;
    private readonly _chartJs;
    private readonly _createCanvas;
    private readonly _registerFont;
    private readonly _image;
    private readonly _type?;
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
     * @param mimeType The image format.
     */
    renderToDataURL(configuration: ChartConfiguration, mimeType?: MimeType.PNG | MimeType.JPEG): Promise<string>;
    /**
     * Render to a data url.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType The image format.
     * @param quality An optional jpeg quality from 0 to 1.
     */
    renderToDataURL(configuration: ChartConfiguration, mimeType: MimeType.JPEG, quality: number): Promise<string>;
    /**
     * Render to a data url.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType The image format.
     * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
     */
    renderToDataURL(configuration: ChartConfiguration, mimeType: MimeType.JPEG, imageConfiguration: JpegConfig): Promise<string>;
    /**
     * Render to a data url synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType The image format.
     */
    renderToDataURLSync(configuration: ChartConfiguration, mimeType?: MimeType.PNG | MimeType.JPEG): string;
    /**
     * Render to a data url synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType The image format.
     * @param quality An optional jpeg quality from 0 to 1.
     */
    renderToDataURLSync(configuration: ChartConfiguration, mimeType: MimeType.JPEG, quality: number): string;
    /**
     * Render to a buffer.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     */
    renderToBuffer(configuration: ChartConfiguration, mimeType?: MimeType | 'raw'): Promise<Buffer>;
    /**
     * Render to a buffer.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
     */
    renderToBuffer(configuration: ChartConfiguration, mimeType: MimeType.PNG, imageConfiguration: PngConfig): Promise<Buffer>;
    /**
     * Render to a buffer.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
     */
    renderToBuffer(configuration: ChartConfiguration, mimeType: MimeType.JPEG, imageConfiguration: JpegConfig): Promise<Buffer>;
    /**
     * Render to a buffer.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
     */
    renderToBuffer(configuration: ChartConfiguration, mimeType: MimeType.PDF, imageConfiguration: PdfConfig): Promise<Buffer>;
    /**
     * Render to a buffer synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     */
    renderToBufferSync(configuration: ChartConfiguration, mimeType?: MimeType): Buffer;
    /**
     * Render to a buffer synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
     */
    renderToBufferSync(configuration: ChartConfiguration, mimeType: MimeType.PNG, imageConfiguration: PngConfig): Buffer;
    /**
     * Render to a buffer synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
     */
    renderToBufferSync(configuration: ChartConfiguration, mimeType: MimeType.JPEG, imageConfiguration: JpegConfig): Buffer;
    /**
     * Render to a buffer synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     * @param imageConfiguration An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer).
     */
    renderToBufferSync(configuration: ChartConfiguration, mimeType: MimeType.PDF, imageConfiguration: PdfConfig): Buffer;
    /**
     * Render to a stream.
     * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     */
    renderToStream(configuration: ChartConfiguration, mimeType?: MimeType.PNG | MimeType.JPEG | MimeType.PDF): Readable;
    /**
     * Render to a stream.
     * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     * @param imageConfiguration An optional config for the canvas image options. See the relevant [configs](https://github.com/Automattic/node-canvas#canvascreatepngstream).
     */
    renderToStream(configuration: ChartConfiguration, mimeType: MimeType.PNG, pngConfiguration: PngConfig): Readable;
    /**
     * Render to a stream.
     * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     * @param imageConfiguration An optional config for the canvas image options. See the relevant [configs](https://github.com/Automattic/node-canvas#canvascreatejpegstream).
     */
    renderToStream(configuration: ChartConfiguration, mimeType: MimeType.JPEG, jpegConfiguration: JpegConfig): Readable;
    /**
     * Render to a stream.
     * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format.
     * @param imageConfiguration An optional config for the canvas image options. See the relevant [configs](https://github.com/Automattic/node-canvas#canvascreatepdfstream).
     */
    renderToStream(configuration: ChartConfiguration, mimeType: MimeType.PDF, pdfConfiguration: PdfConfig): Readable;
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
    private initialize;
    private renderChart;
}

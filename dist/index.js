"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const fresh = require("fresh-require");
const defaultChartJsFactory = () => fresh('chart.js', require);
class CanvasRenderService {
    /**
     * Create a new instance of CanvasRenderService.
     *
     * @param width The width of the charts to render, in pixels.
     * @param height The height of the charts to render, in pixels.
     * @param chartCallback optional callback which is called once with a new ChartJS global reference.
     * @param type optional The canvas type ('PDF' or 'SVG'), see the [canvas pdf doc](https://github.com/Automattic/node-canvas#pdf-output-support).
     * @param chartJsFactory optional provider for chart.js.
     */
    constructor(width, height, chartCallback, type, chartJsFactory) {
        this._width = width;
        this._height = height;
        this._ChartJs = (chartJsFactory || defaultChartJsFactory)();
        this._type = type;
        if (chartCallback) {
            chartCallback(this._ChartJs);
        }
    }
    /**
     * Render to a data url.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType The image format, `image/png` or `image/jpeg`.
     */
    renderToDataURL(configuration, mimeType = 'image/png') {
        const chart = this.renderChart(configuration);
        return new Promise((resolve, reject) => {
            const canvas = chart.canvas;
            canvas.toDataURL(mimeType, (error, png) => {
                if (error) {
                    return reject(error);
                }
                return resolve(png);
            });
        });
    }
    /**
     * Render to a buffer.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
     */
    renderToBuffer(configuration, mimeType = 'image/png') {
        const chart = this.renderChart(configuration);
        return new Promise((resolve, reject) => {
            const canvas = chart.canvas;
            canvas.toBuffer((error, buffer) => {
                if (error) {
                    return reject(error);
                }
                return resolve(buffer);
            }, mimeType);
        });
    }
    /**
     * Render to a stream.
     * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
     */
    renderToStream(configuration, mimeType = 'image/png') {
        const chart = this.renderChart(configuration);
        const canvas = chart.canvas;
        switch (mimeType) {
            case 'image/png':
                return canvas.createPNGStream();
            case 'image/jpeg':
                return canvas.createJPEGStream();
            case 'application/pdf':
                return canvas.createPDFStream();
            default:
                throw new Error(`Un-handled mimeType: ${mimeType}`);
        }
    }
    renderChart(configuration) {
        const canvas = canvas_1.createCanvas(this._width, this._height, this._type);
        canvas.style = {};
        // Disable animation (otherwise charts will throw exceptions)
        configuration.options = configuration.options || {};
        configuration.options.responsive = false;
        configuration.options.animation = false;
        const context = canvas.getContext('2d');
        global.window = {}; //https://github.com/chartjs/Chart.js/pull/5324
        return new this._ChartJs(context, configuration);
    }
}
exports.CanvasRenderService = CanvasRenderService;
//# sourceMappingURL=index.js.map
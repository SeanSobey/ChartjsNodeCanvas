"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartJSNodeCanvas = void 0;
const freshRequire_1 = require("./freshRequire");
const backgroundColourPlugin_1 = require("./backgroundColourPlugin");
class ChartJSNodeCanvas {
    /**
     * Create a new instance of CanvasRenderService.
     *
     * @param options Configuration for this instance
     */
    constructor(options) {
        if (options === null || typeof (options) !== 'object') {
            throw new Error('An options parameter object is required');
        }
        if (!options.width || typeof (options.width) !== 'number') {
            throw new Error('A width option is required');
        }
        if (!options.height || typeof (options.height) !== 'number') {
            throw new Error('A height option is required');
        }
        this._width = options.width;
        this._height = options.height;
        const canvas = (0, freshRequire_1.freshRequire)('canvas');
        this._createCanvas = canvas.createCanvas;
        this._registerFont = canvas.registerFont;
        this._image = canvas.Image;
        this._type = options.type && options.type.toLowerCase();
        this._chartJs = this.initialize(options);
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
            if (!chart.canvas) {
                return reject(new Error('Canvas is null'));
            }
            const canvas = chart.canvas;
            canvas.toDataURL(mimeType, (error, png) => {
                chart.destroy();
                if (error) {
                    return reject(error);
                }
                return resolve(png);
            });
        });
    }
    /**
     * Render to a data url synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType The image format, `image/png` or `image/jpeg`.
     */
    renderToDataURLSync(configuration, mimeType = 'image/png') {
        const chart = this.renderChart(configuration);
        if (!chart.canvas) {
            throw new Error('Canvas is null');
        }
        const canvas = chart.canvas;
        const dataUrl = canvas.toDataURL(mimeType);
        chart.destroy();
        return dataUrl;
    }
    /**
     * Render to a buffer.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support) or `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
     */
    renderToBuffer(configuration, mimeType = 'image/png') {
        const chart = this.renderChart(configuration);
        return new Promise((resolve, reject) => {
            if (!chart.canvas) {
                throw new Error('Canvas is null');
            }
            const canvas = chart.canvas;
            canvas.toBuffer((error, buffer) => {
                chart.destroy();
                if (error) {
                    return reject(error);
                }
                return resolve(buffer);
            }, mimeType);
        });
    }
    /**
     * Render to a buffer synchronously.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     * @param mimeType A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas.
     */
    renderToBufferSync(configuration, mimeType = 'image/png') {
        const chart = this.renderChart(configuration);
        if (!chart.canvas) {
            throw new Error('Canvas is null');
        }
        const canvas = chart.canvas;
        const buffer = canvas.toBuffer(mimeType);
        chart.destroy();
        return buffer;
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
        if (!chart.canvas) {
            throw new Error('Canvas is null');
        }
        const canvas = chart.canvas;
        setImmediate(() => chart.destroy());
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
    /**
     * Use to register the font with Canvas to use a font file that is not installed as a system font, this must be done before the Canvas is created.
     *
     * @param path The path to the font file.
     * @param options The font options.
     * @example
     * registerFont('comicsans.ttf', { family: 'Comic Sans' });
     */
    registerFont(path, options) {
        this._registerFont(path, options);
    }
    initialize(options) {
        var _a, _b, _c, _d;
        const chartJs = require('chart.js');
        if ((_a = options.plugins) === null || _a === void 0 ? void 0 : _a.requireChartJSLegacy) {
            for (const plugin of options.plugins.requireChartJSLegacy) {
                require(plugin);
                delete require.cache[require.resolve(plugin)];
            }
        }
        if ((_b = options.plugins) === null || _b === void 0 ? void 0 : _b.globalVariableLegacy) {
            global.Chart = chartJs;
            for (const plugin of options.plugins.globalVariableLegacy) {
                (0, freshRequire_1.freshRequire)(plugin);
            }
            delete global.Chart;
        }
        if ((_c = options.plugins) === null || _c === void 0 ? void 0 : _c.modern) {
            for (const plugin of options.plugins.modern) {
                if (typeof plugin === 'string') {
                    chartJs.register((0, freshRequire_1.freshRequire)(plugin));
                }
                else {
                    chartJs.register(plugin);
                }
            }
        }
        if ((_d = options.plugins) === null || _d === void 0 ? void 0 : _d.requireLegacy) {
            for (const plugin of options.plugins.requireLegacy) {
                chartJs.register((0, freshRequire_1.freshRequire)(plugin));
            }
        }
        if (options.chartCallback) {
            options.chartCallback(chartJs);
        }
        if (options.backgroundColour) {
            chartJs.register(new backgroundColourPlugin_1.BackgroundColourPlugin(options.width, options.height, options.backgroundColour));
        }
        delete require.cache[require.resolve('chart.js')];
        return chartJs;
    }
    renderChart(configuration) {
        const canvas = this._createCanvas(this._width, this._height, this._type);
        canvas.style = canvas.style || {};
        // Disable animation (otherwise charts will throw exceptions)
        configuration.options = configuration.options || {};
        configuration.options.responsive = false;
        configuration.options.animation = false;
        const context = canvas.getContext('2d');
        global.Image = this._image; // Some plugins use this API
        const chart = new this._chartJs(context, configuration);
        delete global.Image;
        return chart;
    }
}
exports.ChartJSNodeCanvas = ChartJSNodeCanvas;
//# sourceMappingURL=index.js.map
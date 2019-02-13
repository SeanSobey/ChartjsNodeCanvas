"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const fresh = require("fresh-require");
class CanvasRenderService {
    /**
     * Create a new instance of CanvasRenderService.
     *
     * @param width The width of the charts to render, in pixles.
     * @param height The height of the charts to render, in pixles.
     * @param chartCallback optional callback which is called once with a new ChartJS global reference.
     */
    constructor(width, height, chartCallback) {
        this._width = width;
        this._height = height;
        this._ChartJs = fresh('chart.js', require);
        if (chartCallback) {
            chartCallback(this._ChartJs);
        }
    }
    /**
     * Render to a data url as png.
     * @see https://github.com/Automattic/node-canvas#canvastodataurl
     *
     * @param configuration The Chart JS configuration for the chart to render.
     */
    renderToDataURL(configuration) {
        const chart = this.renderChart(configuration);
        return new Promise((resolve, reject) => {
            const canvas = chart.canvas;
            canvas.toDataURL('image/png', (error, png) => {
                if (error) {
                    return reject(error);
                }
                return resolve(png);
            });
        });
    }
    /**
     * Render to a buffer as png.
     * @see https://github.com/Automattic/node-canvas#canvastobuffer
     *
     * @param configuration The Chart JS configuration for the chart to render.
     */
    renderToBuffer(configuration) {
        const chart = this.renderChart(configuration);
        return new Promise((resolve, reject) => {
            const canvas = chart.canvas;
            canvas.toBuffer((error, buffer) => {
                if (error) {
                    return reject(error);
                }
                return resolve(buffer);
            });
        });
    }
    /**
     * Render to a stream as png.
     * @see https://github.com/Automattic/node-canvas#canvascreatepngstream
     *
     * @param configuration The Chart JS configuration for the chart to render.
     */
    renderToStream(configuration) {
        const chart = this.renderChart(configuration);
        const canvas = chart.canvas;
        return canvas.pngStream();
    }
    renderChart(configuration) {
        const canvas = canvas_1.createCanvas(this._width, this._height);
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
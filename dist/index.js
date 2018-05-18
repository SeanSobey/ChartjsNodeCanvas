"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_prebuilt_1 = require("canvas-prebuilt");
const fresh = require("fresh-require");
class CanvasRenderService {
    constructor(width, height, chartCallback) {
        this._width = width;
        this._height = height;
        this._ChartJs = fresh('chart.js', require);
        if (chartCallback) {
            chartCallback(this._ChartJs);
        }
    }
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
    renderToStream(configuration) {
        const chart = this.renderChart(configuration);
        const canvas = chart.canvas;
        return canvas.pngStream();
    }
    renderChart(configuration) {
        const canvas = canvas_prebuilt_1.createCanvas(this._width, this._height);
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
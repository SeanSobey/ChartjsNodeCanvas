"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Canvas = require("canvas-prebuilt");
const fresh = require("fresh-require");
class CanvasRenderService {
    constructor(width, height, chartCallback) {
        this._canvas = new Canvas(width, height);
        this._canvas.style = {};
        this._ChartJs = fresh('chart.js', require);
        if (chartCallback) {
            chartCallback(this._ChartJs);
        }
    }
    async renderToDataURL(configuration) {
        this.renderChart(configuration);
        return new Promise((resolve, reject) => {
            this._canvas.toDataURL('image/png', (error, png) => {
                if (error) {
                    return reject(error);
                }
                return resolve(png);
            });
        });
    }
    renderToBuffer(configuration) {
        this.renderChart(configuration);
        return new Promise((resolve, reject) => {
            this._canvas.toBuffer((error, buffer) => {
                if (error) {
                    return reject(error);
                }
                return resolve(buffer);
            });
        });
    }
    renderToStream(configuration) {
        this.renderChart(configuration);
        return this._canvas.pngStream();
    }
    renderChart(configuration) {
        // Disable animation (otherwise charts will throw exceptions)
        configuration.options = configuration.options || {};
        configuration.options.responsive = false;
        configuration.options.animation = false;
        const context = this._canvas.getContext('2d');
        global.window = {}; //https://github.com/chartjs/Chart.js/pull/5324
        return new this._ChartJs(context, configuration);
    }
}
exports.CanvasRenderService = CanvasRenderService;
//# sourceMappingURL=index.js.map
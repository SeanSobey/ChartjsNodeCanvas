"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
require("source-map-support/register");
const _1 = require("./");
describe('app', () => {
    const width = 400;
    const height = 400;
    const configuration = {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: (value) => '$' + value
                        }
                    }]
            }
        }
    };
    const chartCallback = (ChartJS) => {
        ChartJS.defaults.global.responsive = true;
        ChartJS.defaults.global.maintainAspectRatio = false;
    };
    it('renders buffer', async () => {
        const canvasRenderService = new _1.CanvasRenderService(width, height, chartCallback);
        const image = await canvasRenderService.renderToBuffer(configuration);
        assert.equal(image instanceof Buffer, true);
    });
    it('renders data url', async () => {
        const canvasRenderService = new _1.CanvasRenderService(width, height, chartCallback);
        const dataUrl = await canvasRenderService.renderToDataURL(configuration);
        assert.equal(dataUrl.startsWith('data:image/png;base64,'), true);
    });
    it('renders stream', (done) => {
        const canvasRenderService = new _1.CanvasRenderService(width, height, chartCallback);
        const stream = canvasRenderService.renderToStream(configuration);
        let data = [];
        stream.on('data', (chunk) => {
            data.push(chunk);
        });
        stream.on('end', () => {
            assert.equal(Buffer.concat(data).length > 0, true);
            done();
        });
        stream.on('error', (error) => {
            done(error);
        });
    });
});
//# sourceMappingURL=index.spec.js.map
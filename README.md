# chartjs-node-canvas

[![CircleCI](https://circleci.com/gh/SeanSobey/ChartjsNodeCanvas.svg?style=svg)](https://circleci.com/gh/SeanSobey/ChartjsNodeCanvas)

A node renderer for [Chart.js](http://www.chartjs.org) using [canvas](https://github.com/Automattic/node-canva).

Provides and alternative to [chartjs-node](https://www.npmjs.com/package/chartjs-node) that does not require jsdom (or the global variables that this requires) and allows chartJS as a peer dependency, so you can manage its version yourself.

## Installation

```
npm i chartjs-node-canvas
```

## Features

* Supports all Chart JS features and charts.
* Uses [canvas-prebuilt](https://www.npmjs.com/package/canvas-prebuilt), so hopefully no nasty issues with node-gyp.
* No heavy DOM virtualization libraries, thanks to a [pull request](https://github.com/chartjs/Chart.js/pull/5324) to chart.js allowing it to run natively on node, requiring only a Canvas API.
* Chart JS is a peer dependency, so you can bump and manage it yourself.
* Provides a callback with the global ChartJS variable, so you can use the [Global Configuration](https://www.chartjs.org/docs/latest/configuration/#global-configuration).
* Uses [fresh-require](https://www.npmjs.com/package/fresh-require) for each instance of `CanvasRenderService`, so you can mutate the ChartJS global variable seperatly within each instance.

## Usage

```js

const { CanvasRenderService } = require('chartjs-node-canvas');

(async () => {
    const width = 400; //px
    const height = 400; //px
    const configuration = {
        ... // See https://www.chartjs.org/docs/latest/configuration
    };
    const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {
        // See https://www.chartjs.org/docs/latest/configuration/#global-configuration
        ChartJS.defaults.global.responsive = true;
    });
    const image = await canvasRenderService.renderToBuffer(configuration);
    const dataUrl = await canvasRenderService.renderToDataURL(configuration); // image/png
    const stream = canvasRenderService.renderToStream(configuration);
})();
```

## Full Example

```js

const { CanvasRenderService } = require('chartjs-node-canvas');

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
                    callback: (value: number) => '$' + value
                } as any
            }]
        }
    }
};
const chartCallback = (ChartJS) => {

    ChartJS.defaults.global.responsive = true;
    ChartJS.defaults.global.maintainAspectRatio = false;
};

(async () => {
    const canvasRenderService = new CanvasRenderService(width, height, chartCallback);
    const image = await canvasRenderService.renderToBuffer(configuration);
    const dataUrl = await canvasRenderService.renderToDataURL(configuration);
    const stream = canvasRenderService.renderToStream(configuration);
})();
```
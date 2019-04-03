# chartjs-node-canvas

[![CircleCI](https://circleci.com/gh/SeanSobey/ChartjsNodeCanvas.svg?style=svg)](https://circleci.com/gh/SeanSobey/ChartjsNodeCanvas)
[![NPM](https://img.shields.io/npm/v/chartjs-node-canvas.svg)](https://www.npmjs.com/package/chartjs-node-canvas)

A node renderer for [Chart.js](http://www.chartjs.org) using [canvas](https://github.com/Automattic/node-canvas).

Provides and alternative to [chartjs-node](https://www.npmjs.com/package/chartjs-node) that does not require jsdom (or the global variables that this requires) and allows chartJS as a peer dependency, so you can manage its version yourself.

## Installation

```
npm i chartjs-node-canvas
```

## Features

* Supports all Chart JS features and charts.
* No heavy DOM virtualization libraries, thanks to a [pull request](https://github.com/chartjs/Chart.js/pull/5324) to chart.js allowing it to run natively on node, requiring only a Canvas API.
* Chart JS is a peer dependency, so you can bump and manage it yourself.
* Provides a callback with the global ChartJS variable, so you can use the [Global Configuration](https://www.chartjs.org/docs/latest/configuration/#global-configuration).
* Uses [fresh-require](https://www.npmjs.com/package/fresh-require) for each instance of `CanvasRenderService`, so you can mutate the ChartJS global variable seperatly within each instance.

## Limitations

### Animations

Chart animation (and responsive resize) is disabled by this library. This is necessary since the animation API's required are not available in node/canvas (this is not a browser environment after all).

This is the same as:

```js
Chart.defaults.global.animation = false;
Chart.defaults.global.responsive = false;
```

## API

See the [API docs](https://github.com/SeanSobey/ChartjsNodeCanvas/blob/master/API.md).

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

### Loading plugins

The key to getting plugins working is knowing that this package uses [fresh-require](https://www.npmjs.com/package/fresh-require) by default to retrieve its version of `chart.js`. And there are some tools you can use to solve these issues with the way older ChartJS plugins that do not use the newer global plugin registration API, and instead either load chartjs itself or expect a global variable:

1. Temporary global variable for ChartJs:
```js
const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {

	global.Chart = ChartJS;
	require('<chart plugin>');
	delete global.Chart;
});
```
This should work for any plugin that expects a global Chart variable.

2. Chart factory function for `CanvasRenderService`:
```js
const chartJsFactory = () => {
	const chartJS = require('chart.js');
	require('<chart plugin>');
        // Clear the require cache so to allow `CanvasRenderService` seperate instances of ChartJS and plugins.
	delete require.cache[require.resolve('chart.js')];
	delete require.cache[require.resolve('chart plugin')];
	return chartJS;
};
const canvasRenderService = new CanvasRenderService(width, height, undefined, undefined, chartJsFactory);
```
This will work for plugins that `require` ChartJS themselves.

3. Register plugin directly with ChartJS:
```js
const freshRequire = require('fresh-require');

const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {

	// Use 'fresh-require' to allow `CanvasRenderService` seperate instances of ChartJS and plugins.
	ChartJS.plugins.register(freshRequire('<chart plugin>', require));
});
```
This will work with plugins that just return a plugin object and do no specific loading themselves.

These approaches can be combined also.

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
                    callback: (value) => '$' + value
                }
            }]
        }
    }
};
const chartCallback = (Chart) => {

    // Global config example: https://www.chartjs.org/docs/latest/configuration/
    Chart.defaults.global.elements.rectangle.borderWidth = 2;
    // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
    Chart.plugins.register({
        // plugin implementation
    });
    // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
    Chart.controllers.MyType = Chart.DatasetController.extend({
        // chart implementation
    });
};

(async () => {
    const canvasRenderService = new CanvasRenderService(width, height, chartCallback);
    const image = await canvasRenderService.renderToBuffer(configuration);
    const dataUrl = await canvasRenderService.renderToDataURL(configuration);
    const stream = canvasRenderService.renderToStream(configuration);
})();
```
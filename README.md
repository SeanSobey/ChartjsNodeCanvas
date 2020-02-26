<!-- [![Logo](./resources/logo.png)](https://github.com/SeanSobey/ChartjsNodeCanvas) -->
<a href="https://github.com/SeanSobey/ChartjsNodeCanvas" align="center">
  <!-- <img src="https://raw.githubusercontent.com/SeanSobey/ChartjsNodeCanvas/HEAD/resources/logo.png"> -->
  <img src="./resources/logo.png">
</a>

# chartjs-node-canvas

<!-- [![CircleCI](https://circleci.com/gh/SeanSobey/ChartjsNodeCanvas.svg?style=svg)](https://circleci.com/gh/SeanSobey/ChartjsNodeCanvas) -->
[![GitHub](https://github.com/SeanSobey/ChartjsNodeCanvas/workflows/Node%20CI/badge.svg)](https://github.com/SeanSobey/ChartjsNodeCanvas/actions)
[![codecov](https://codecov.io/gh/SeanSobey/ChartjsNodeCanvas/branch/master/graph/badge.svg)](https://codecov.io/gh/SeanSobey/ChartjsNodeCanvas)
[![NPM](https://img.shields.io/npm/v/chartjs-node-canvas.svg)](https://www.npmjs.com/package/chartjs-node-canvas)
[![packagephobia publish](https://badgen.net/packagephobia/publish/chartjs-node-canvas@latest)](https://bundlephobia.com/result?p=chartjs-node-canvas)
<!-- [![bundlephobia](https://badgen.net/bundlephobia/min/chartjs-node-canvas@latest)](https://bundlephobia.com/result?p=chartjs-node-canvas) -->
<!-- [![packagephobia install](https://badgen.net/packagephobia/install/chartjs-node-canvas@latest)](https://bundlephobia.com/result?p=chartjs-node-canvas) -->

A Node JS renderer for [Chart.js](http://www.chartjs.org) using [canvas](https://github.com/Automattic/node-canvas).

Provides and alternative to [chartjs-node](https://www.npmjs.com/package/chartjs-node) that does not require jsdom (or the global variables that this requires) and allows chartJS as a peer dependency, so you can manage its version yourself.

## Contents

1. [Installation](#Installation)
2. [Node JS version](#Node%20JS%20version)
3. [Features](#Features)
4. [Limitations](#Limitations)
5. [API](#API)
6. [Usage](#Usage)
7. [Full Example](#Full%20Example)
8. [Known Issues](#Known%20Issues)

## Installation

```
npm i chartjs-node-canvas chart.js
```

## Node JS version

This is limited by the upstream dependency [canvas](https://github.com/Automattic/node-canvas).

See the `package.json` `engines` section for the current supported Node version. This is not limited using `engineStrict` so you can try a new version if you like. You will need to do a `npm rebuild` to rebuild the canvas binaries.

## Features

* Supports all Chart JS features and charts.
* No heavy DOM virtualization libraries, thanks to a [pull request](https://github.com/chartjs/Chart.js/pull/5324) to chart.js allowing it to run natively on node, requiring only a Canvas API.
* Chart JS is a peer dependency, so you can bump and manage it yourself.
* Provides a callback with the global ChartJS variable, so you can use the [Global Configuration](https://www.chartjs.org/docs/latest/configuration/#global-configuration).
* Uses (similar to) [fresh-require](https://www.npmjs.com/package/fresh-require) for each instance of `CanvasRenderService`, so you can mutate the ChartJS global variable separately within each instance.
* Support for custom fonts.

## Limitations

### Animations

Chart animation (and responsive resize) is disabled by this library. This is necessary since the animation API's required are not available in Node JS/canvas-node (this is not a browser environment after all).

This is the same as:

```js
Chart.defaults.global.animation = false;
Chart.defaults.global.responsive = false;
```

### SVG and PDF

You need to install [ImageMagik](https://imagemagick.org/script/download.php).

For some unknown reason canvas requires use of the [sync](https://github.com/Automattic/node-canvas#canvastobuffer) API's to use SVG's or PDF's. This libraries which support these are:

* [renderToBufferSync](./API.md#CanvasRenderService+renderToBufferSync) ('application/pdf' | 'image/svg+xml')
* [renderToStream](./API.md#CanvasRenderService+renderToStream) ('application/pdf')

## API

See the [API docs](https://github.com/SeanSobey/ChartjsNodeCanvas/blob/master/API.md).

## Usage

```js
const { CanvasRenderService } = require('chartjs-node-canvas');

const width = 400; //px
const height = 400; //px
const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => { });

(async () => {
    const configuration = {
        ... // See https://www.chartjs.org/docs/latest/configuration
    };
    const image = await canvasRenderService.renderToBuffer(configuration);
    const dataUrl = await canvasRenderService.renderToDataURL(configuration);
    const stream = canvasRenderService.renderToStream(configuration);
})();
```

### Memory Management

Every instance of `CanvasRenderService` creates its own [canvas](https://github.com/Automattic/node-canvas). To ensure efficient memory and GC use make sure your implementation creates as few instances as possible and reuses them:

```js
const { CanvasRenderService } = require('chartjs-node-canvas');

// Re-use one service, or as many as you need for different canvas size requirements
const smallCanvasRenderService = new CanvasRenderService(400, 400);
const bigCanvasRenderService = new CanvasRenderService(2000, 2000);

// Expose just the 'render' methods to downstream code so they don't have to worry about life-cycle management.
exports = {
    renderSmallChart: (configuration) => smallCanvasRenderService.renderToBuffer(configuration),
    renderBigChart: (configuration) => bigCanvasRenderService.renderToBuffer(configuration)
};
```

### Custom Charts

Just use the ChartJS reference in the callback:

```js
const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {
    // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
    ChartJS.controllers.MyType = Chart.DatasetController.extend({
        // chart implementation
    });
});
```

### Global Config

Just use the ChartJS reference in the callback:

```js
const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {
    // Global config example: https://www.chartjs.org/docs/latest/configuration/
    ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
});
```

### Custom Fonts

Just use the `registerFont` method:

```js
const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {
    // Just example usage
    ChartJS.defaults.global.defaultFontFamily = 'VTKS UNAMOUR';
});
// Register before rendering any charts
canvasRenderService.registerFont('./testData/VTKS UNAMOUR.ttf', { family: 'VTKS UNAMOUR' });
```

See the node-canvas [docs](https://github.com/Automattic/node-canvas#registerfont) and the chart js [docs](https://www.chartjs.org/docs/latest/general/fonts.html).

### Loading plugins

#### Newer plugins

Just use the ChartJS reference in the callback:

```js
const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {
    // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
    ChartJS.plugins.register({
        // plugin implementation
    });
});
```

#### Older plugins

The key to getting older plugins working is knowing that this package uses an equivalent to [fresh-require](https://www.npmjs.com/package/fresh-require) by default to retrieve its version of `chart.js`.

There are some tools you can use to solve any issues with the way older ChartJS plugins that do not use the newer global plugin registration API, and instead either load chartjs itself or expect a global variable:

---

1. Temporary global variable for ChartJs:

```js
const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {
    global.Chart = ChartJS;
    require('<chart plugin>');
    delete global.Chart;
});
```

This should work for any plugin that expects a global Chart variable.

---

1. Chart factory function for `CanvasRenderService`:

```js
const chartJsFactory = () => {
    const chartJS = require('chart.js');
    require('<chart plugin>');
        // Clear the require cache so to allow `CanvasRenderService` separate instances of ChartJS and plugins.
    delete require.cache[require.resolve('chart.js')];
    delete require.cache[require.resolve('chart plugin')];
    return chartJS;
};
const canvasRenderService = new CanvasRenderService(width, height, undefined, undefined, chartJsFactory);
```

This will work for plugins that `require` ChartJS themselves.

---

1. Register plugin directly with ChartJS:

```js
const freshRequire = require('fresh-require');

const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {
    // Use 'fresh-require' to allow `CanvasRenderService` separate instances of ChartJS and plugins.
    ChartJS.plugins.register(freshRequire('<chart plugin>', require));
});
```

This will work with plugins that just return a plugin object and do no specific loading themselves.

---

These approaches can be combined also.

## Full Example

```js
const { CanvasRenderService } = require('chartjs-node-canvas');

const width = 400;
const height = 400;
const chartCallback = (ChartJS) => {

    // Global config example: https://www.chartjs.org/docs/latest/configuration/
    ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
    // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
    ChartJS.plugins.register({
        // plugin implementation
    });
    // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
    ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
        // chart implementation
    });
};
const canvasRenderService = new CanvasRenderService(width, height, chartCallback);

(async () => {
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
    const image = await canvasRenderService.renderToBuffer(configuration);
    const dataUrl = await canvasRenderService.renderToDataURL(configuration);
    const stream = canvasRenderService.renderToStream(configuration);
})();
```

## Known Issues

There is a problem with persisting config objects between render calls, see this [issue](https://github.com/SeanSobey/ChartjsNodeCanvas/issues/9) for details and workarounds.

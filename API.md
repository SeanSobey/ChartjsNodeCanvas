<a name="CanvasRenderService"></a>

## CanvasRenderService
**Kind**: global class  

* [CanvasRenderService](#CanvasRenderService)
    * [new CanvasRenderService(width, height, chartCallback)](#new_CanvasRenderService_new)
    * [.renderToDataURL(configuration)](#CanvasRenderService+renderToDataURL)
    * [.renderToBuffer(configuration)](#CanvasRenderService+renderToBuffer)
    * [.renderToStream(configuration)](#CanvasRenderService+renderToStream)

<a name="new_CanvasRenderService_new"></a>

### new CanvasRenderService(width, height, chartCallback)
Create a new instance of CanvasRenderService.


| Param | Description |
| --- | --- |
| width | The width of the charts to render, in pixles. |
| height | The height of the charts to render, in pixles. |
| chartCallback | optional callback which is called once with a new ChartJS global reference. |

<a name="CanvasRenderService+renderToDataURL"></a>

### canvasRenderService.renderToDataURL(configuration)
Render to a data url as png.

**Kind**: instance method of [<code>CanvasRenderService</code>](#CanvasRenderService)  
**See**: https://github.com/Automattic/node-canvas#canvastodataurl  

| Param | Description |
| --- | --- |
| configuration | The Chart JS configuration for the chart to render. |

<a name="CanvasRenderService+renderToBuffer"></a>

### canvasRenderService.renderToBuffer(configuration)
Render to a buffer as png.

**Kind**: instance method of [<code>CanvasRenderService</code>](#CanvasRenderService)  
**See**: https://github.com/Automattic/node-canvas#canvastobuffer  

| Param | Description |
| --- | --- |
| configuration | The Chart JS configuration for the chart to render. |

<a name="CanvasRenderService+renderToStream"></a>

### canvasRenderService.renderToStream(configuration)
Render to a stream as png.

**Kind**: instance method of [<code>CanvasRenderService</code>](#CanvasRenderService)  
**See**: https://github.com/Automattic/node-canvas#canvascreatepngstream  

| Param | Description |
| --- | --- |
| configuration | The Chart JS configuration for the chart to render. |


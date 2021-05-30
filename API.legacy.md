<a name="CanvasRenderService"></a>

## CanvasRenderService
**Kind**: global class  

* [CanvasRenderService](#CanvasRenderService)
    * [new CanvasRenderService(width, height, chartCallback, type, chartJsFactory)](#new_CanvasRenderService_new)
    * [.renderToDataURL(configuration, mimeType)](#CanvasRenderService+renderToDataURL)
    * [.renderToDataURLSync(configuration, mimeType)](#CanvasRenderService+renderToDataURLSync)
    * [.renderToBuffer(configuration, mimeType)](#CanvasRenderService+renderToBuffer)
    * [.renderToBufferSync(configuration, mimeType)](#CanvasRenderService+renderToBufferSync)
    * [.renderToStream(configuration, mimeType)](#CanvasRenderService+renderToStream)
    * [.registerFont(path, options)](#CanvasRenderService+registerFont)

<a name="new_CanvasRenderService_new"></a>

### new CanvasRenderService(width, height, chartCallback, type, chartJsFactory)
Create a new instance of CanvasRenderService.


| Param | Description |
| --- | --- |
| width | The width of the charts to render, in pixels. |
| height | The height of the charts to render, in pixels. |
| chartCallback | optional callback which is called once with a new ChartJS global reference as the only parameter. |
| type | optional The canvas type ('PDF' or 'SVG'), see the [canvas pdf doc](https://github.com/Automattic/node-canvas#pdf-output-support). |
| chartJsFactory | optional provider for chart.js. |

<a name="CanvasRenderService+renderToDataURL"></a>

### canvasRenderService.renderToDataURL(configuration, mimeType)
Render to a data url.

**Kind**: instance method of [<code>CanvasRenderService</code>](#CanvasRenderService)  
**See**: https://github.com/Automattic/node-canvas#canvastodataurl  

| Param | Default | Description |
| --- | --- | --- |
| configuration |  | The Chart JS configuration for the chart to render. |
| mimeType | <code>image/png</code> | The image format, `image/png` or `image/jpeg`. |

<a name="CanvasRenderService+renderToDataURLSync"></a>

### canvasRenderService.renderToDataURLSync(configuration, mimeType)
Render to a data url synchronously.

**Kind**: instance method of [<code>CanvasRenderService</code>](#CanvasRenderService)  
**See**: https://github.com/Automattic/node-canvas#canvastodataurl  

| Param | Default | Description |
| --- | --- | --- |
| configuration |  | The Chart JS configuration for the chart to render. |
| mimeType | <code>image/png</code> | The image format, `image/png` or `image/jpeg`. |

<a name="CanvasRenderService+renderToBuffer"></a>

### canvasRenderService.renderToBuffer(configuration, mimeType)
Render to a buffer.

**Kind**: instance method of [<code>CanvasRenderService</code>](#CanvasRenderService)  
**See**: https://github.com/Automattic/node-canvas#canvastobuffer  

| Param | Default | Description |
| --- | --- | --- |
| configuration |  | The Chart JS configuration for the chart to render. |
| mimeType | <code>image/png</code> | A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support) or `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas. |

<a name="CanvasRenderService+renderToBufferSync"></a>

### canvasRenderService.renderToBufferSync(configuration, mimeType)
Render to a buffer synchronously.

**Kind**: instance method of [<code>CanvasRenderService</code>](#CanvasRenderService)  
**See**: https://github.com/Automattic/node-canvas#canvastobuffer  

| Param | Default | Description |
| --- | --- | --- |
| configuration |  | The Chart JS configuration for the chart to render. |
| mimeType | <code>image/png</code> | A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas. |

<a name="CanvasRenderService+renderToStream"></a>

### canvasRenderService.renderToStream(configuration, mimeType)
Render to a stream.

**Kind**: instance method of [<code>CanvasRenderService</code>](#CanvasRenderService)  
**See**: https://github.com/Automattic/node-canvas#canvascreatepngstream  

| Param | Default | Description |
| --- | --- | --- |
| configuration |  | The Chart JS configuration for the chart to render. |
| mimeType | <code>image/png</code> | A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas. |

<a name="CanvasRenderService+registerFont"></a>

### canvasRenderService.registerFont(path, options)
Use to register the font with Canvas to use a font file that is not installed as a system font, this must be done before the Canvas is created.

**Kind**: instance method of [<code>CanvasRenderService</code>](#CanvasRenderService)  

| Param | Description |
| --- | --- |
| path | The path to the font file. |
| options | The font options. |

**Example**  
```js
registerFont('comicsans.ttf', { family: 'Comic Sans' });
```

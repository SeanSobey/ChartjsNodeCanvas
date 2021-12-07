<a name="ChartJSNodeCanvas"></a>

## ChartJSNodeCanvas
**Kind**: global class  

* [ChartJSNodeCanvas](#ChartJSNodeCanvas)
    * [new ChartJSNodeCanvas(options)](#new_ChartJSNodeCanvas_new)
    * [.renderToDataURL(configuration, mimeType, quality)](#ChartJSNodeCanvas+renderToDataURL)
    * [.renderToDataURLSync(configuration, mimeType, quality)](#ChartJSNodeCanvas+renderToDataURLSync)
    * [.renderToBuffer(configuration, mimeType, imageConfiguration)](#ChartJSNodeCanvas+renderToBuffer)
    * [.renderToBufferSync(configuration, mimeType, imageConfiguration)](#ChartJSNodeCanvas+renderToBufferSync)
    * [.renderToStream(configuration, mimeType, imageConfiguration)](#ChartJSNodeCanvas+renderToStream)
    * [.registerFont(path, options)](#ChartJSNodeCanvas+registerFont)

<a name="new_ChartJSNodeCanvas_new"></a>

### new ChartJSNodeCanvas(options)
Create a new instance of CanvasRenderService.


| Param | Description |
| --- | --- |
| options | Configuration for this instance |

<a name="ChartJSNodeCanvas+renderToDataURL"></a>

### chartJSNodeCanvas.renderToDataURL(configuration, mimeType, quality)
Render to a data url.

**Kind**: instance method of [<code>ChartJSNodeCanvas</code>](#ChartJSNodeCanvas)  
**See**: https://github.com/Automattic/node-canvas#canvastodataurl  

| Param | Description |
| --- | --- |
| configuration | The Chart JS configuration for the chart to render. |
| mimeType | The image format, `image/png` or `image/jpeg`. |
| quality | An optional jpeg quality from 0 to 1. |

<a name="ChartJSNodeCanvas+renderToDataURLSync"></a>

### chartJSNodeCanvas.renderToDataURLSync(configuration, mimeType, quality)
Render to a data url synchronously.

**Kind**: instance method of [<code>ChartJSNodeCanvas</code>](#ChartJSNodeCanvas)  
**See**: https://github.com/Automattic/node-canvas#canvastodataurl  

| Param | Description |
| --- | --- |
| configuration | The Chart JS configuration for the chart to render. |
| mimeType | The image format, `image/png` or `image/jpeg`. |
| quality | An optional jpeg quality from 0 to 1. |

<a name="ChartJSNodeCanvas+renderToBuffer"></a>

### chartJSNodeCanvas.renderToBuffer(configuration, mimeType, imageConfiguration)
Render to a buffer.

**Kind**: instance method of [<code>ChartJSNodeCanvas</code>](#ChartJSNodeCanvas)  
**See**: https://github.com/Automattic/node-canvas#canvastobuffer  

| Param | Description |
| --- | --- |
| configuration | The Chart JS configuration for the chart to render. |
| mimeType | A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support) or `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas. |
| imageConfiguration | An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer). |

<a name="ChartJSNodeCanvas+renderToBufferSync"></a>

### chartJSNodeCanvas.renderToBufferSync(configuration, mimeType, imageConfiguration)
Render to a buffer synchronously.

**Kind**: instance method of [<code>ChartJSNodeCanvas</code>](#ChartJSNodeCanvas)  
**See**: https://github.com/Automattic/node-canvas#canvastobuffer  

| Param | Description |
| --- | --- |
| configuration | The Chart JS configuration for the chart to render. |
| mimeType | A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas. |
| imageConfiguration | An optional config for the canvas image [options](https://github.com/Automattic/node-canvas#canvastobuffer). |

<a name="ChartJSNodeCanvas+renderToStream"></a>

### chartJSNodeCanvas.renderToStream(configuration, mimeType, imageConfiguration)
Render to a stream.

**Kind**: instance method of [<code>ChartJSNodeCanvas</code>](#ChartJSNodeCanvas)  
**See**: https://github.com/Automattic/node-canvas#canvascreatepngstream  

| Param | Description |
| --- | --- |
| configuration | The Chart JS configuration for the chart to render. |
| mimeType | A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas. |
| imageConfiguration | An optional config for the canvas image options. See the relevant configs for [png](https://github.com/Automattic/node-canvas#canvascreatepngstream), [jpeg](https://github.com/Automattic/node-canvas#canvascreatejpegstream) or [pdf](https://github.com/Automattic/node-canvas#canvascreatepdfstream). |

<a name="ChartJSNodeCanvas+registerFont"></a>

### chartJSNodeCanvas.registerFont(path, options)
Use to register the font with Canvas to use a font file that is not installed as a system font, this must be done before the Canvas is created.

**Kind**: instance method of [<code>ChartJSNodeCanvas</code>](#ChartJSNodeCanvas)  

| Param | Description |
| --- | --- |
| path | The path to the font file. |
| options | The font options. |

**Example**  
```js
registerFont('comicsans.ttf', { family: 'Comic Sans' });
```

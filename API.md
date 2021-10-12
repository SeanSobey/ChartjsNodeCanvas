<a name="ChartJSNodeCanvas"></a>

## ChartJSNodeCanvas
**Kind**: global class  

* [ChartJSNodeCanvas](#ChartJSNodeCanvas)
    * [new ChartJSNodeCanvas(options)](#new_ChartJSNodeCanvas_new)
    * [.renderToDataURL(configuration, mimeType)](#ChartJSNodeCanvas+renderToDataURL)
    * [.renderToDataURLSync(configuration, mimeType)](#ChartJSNodeCanvas+renderToDataURLSync)
    * [.renderToBuffer(configuration, mimeType)](#ChartJSNodeCanvas+renderToBuffer)
    * [.renderToBufferSync(configuration, mimeType)](#ChartJSNodeCanvas+renderToBufferSync)
    * [.renderToStream(configuration, mimeType)](#ChartJSNodeCanvas+renderToStream)
    * [.registerFont(path, options)](#ChartJSNodeCanvas+registerFont)

<a name="new_ChartJSNodeCanvas_new"></a>

### new ChartJSNodeCanvas(options)
Create a new instance of CanvasRenderService.


| Param | Description |
| --- | --- |
| options | Configuration for this instance |

<a name="ChartJSNodeCanvas+renderToDataURL"></a>

### chartJSNodeCanvas.renderToDataURL(configuration, mimeType)
Render to a data url.

**Kind**: instance method of [<code>ChartJSNodeCanvas</code>](#ChartJSNodeCanvas)  
**See**: https://github.com/Automattic/node-canvas#canvastodataurl  

| Param | Default | Description |
| --- | --- | --- |
| configuration |  | The Chart JS configuration for the chart to render. |
| mimeType | <code>image/png</code> | The image format, `image/png` or `image/jpeg`. |

<a name="ChartJSNodeCanvas+renderToDataURLSync"></a>

### chartJSNodeCanvas.renderToDataURLSync(configuration, mimeType)
Render to a data url synchronously.

**Kind**: instance method of [<code>ChartJSNodeCanvas</code>](#ChartJSNodeCanvas)  
**See**: https://github.com/Automattic/node-canvas#canvastodataurl  

| Param | Default | Description |
| --- | --- | --- |
| configuration |  | The Chart JS configuration for the chart to render. |
| mimeType | <code>image/png</code> | The image format, `image/png` or `image/jpeg`. |

<a name="ChartJSNodeCanvas+renderToBuffer"></a>

### chartJSNodeCanvas.renderToBuffer(configuration, mimeType)
Render to a buffer.

**Kind**: instance method of [<code>ChartJSNodeCanvas</code>](#ChartJSNodeCanvas)  
**See**: https://github.com/Automattic/node-canvas#canvastobuffer  

| Param | Default | Description |
| --- | --- | --- |
| configuration |  | The Chart JS configuration for the chart to render. |
| mimeType | <code>image/png</code> | A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support) or `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas. |

<a name="ChartJSNodeCanvas+renderToBufferSync"></a>

### chartJSNodeCanvas.renderToBufferSync(configuration, mimeType)
Render to a buffer synchronously.

**Kind**: instance method of [<code>ChartJSNodeCanvas</code>](#ChartJSNodeCanvas)  
**See**: https://github.com/Automattic/node-canvas#canvastobuffer  

| Param | Default | Description |
| --- | --- | --- |
| configuration |  | The Chart JS configuration for the chart to render. |
| mimeType | <code>image/png</code> | A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `raw` (unencoded ARGB32 data in native-endian byte order, top-to-bottom), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas. |

<a name="ChartJSNodeCanvas+renderToStream"></a>

### chartJSNodeCanvas.renderToStream(configuration, mimeType)
Render to a stream.

**Kind**: instance method of [<code>ChartJSNodeCanvas</code>](#ChartJSNodeCanvas)  
**See**: https://github.com/Automattic/node-canvas#canvascreatepngstream  

| Param | Default | Description |
| --- | --- | --- |
| configuration |  | The Chart JS configuration for the chart to render. |
| mimeType | <code>image/png</code> | A string indicating the image format. Valid options are `image/png`, `image/jpeg` (if node-canvas was built with JPEG support), `application/pdf` (for PDF canvases) and image/svg+xml (for SVG canvases). Defaults to `image/png` for image canvases, or the corresponding type for PDF or SVG canvas. |

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

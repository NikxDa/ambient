<img src="/images/ambientjs-logo.png" width="50%">
A JavaScript Ambient Light Library. Lightweight. Fast. Portable.

## Live demo
A live demonstration is available at https://nikx.io/ambient.

## Installation
To install ambient, simply download the script file (minified version is recommended) and 
insert it into your HTML-file, either in the `<head>`-tag or right before the end of the `<body>`-tag.

```html
<script type="text/javascript" src="ambient.min.js"></script>
```

## Quick Start
**Step 1:** Add the `data-ambient` tag to any `img` or `video` element you want.
```html
<img alt="An image" src="https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347" data-ambient>
```


**Step 2:** Initialize a new `Ambient`-instance and call the `render ()`-function.
```js
var ambient = new Ambient ();
ambient.render ();
```

That's it! Output:
![QuickStart Output](/images/quickstart-preview.png)

## License
MIT
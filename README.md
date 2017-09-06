<img src="/images/ambientjs-logo.png" width="50%">
A JavaScript Ambient Light Library. Lightweight. Fast. Portable.

## Quick Start
**Step 1:** Include `ambient.js` in your HTML file.
```html
<head>
	...
	<script type="text/javascript" src="ambient.min.js"></script>
	...
</head>
```


**Step 2:** Add the `data-ambient` tag to any `img` or `video` element you want.
```html
<img alt="An image" src="https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347" data-ambient>
```


**Step 3:** Initialize a new `Ambient`-instance and call the `render ()`-function.
var ambient = new Ambient ();
ambient.render ();
```

That's it! Output:
![QuickStart Output](/images/quickstart-preview.png)

## License
MIT
# ambient.js
A JavaScript Ambient Light Library. Lightweight. Fast. Portable.

## Quick Start
First of all, include `ambient.js` into your HTML head tag.
```html
<head>
	...
	<script type="text/javascript" src="ambient.min.js"></script>
	...
</head>

After that, you can add the `data-ambient` tag to any `img` or `video` object you want.
```html
<img alt="An image" src="https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347" data-ambient>
```

Last thing you have to do is initialize a new `Ambient`-instance and render the elements.
```js
var ambient = new Ambient ();
ambient.render ();
```

Output:
![QuickStart Output](/images/quickstart-preview.png)

## License
MIT
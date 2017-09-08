<img src="/images/ambientjs-logo.png" width="50%">
A JavaScript Ambient Light Library. Lightweight. Fast. Portable.

## Description
Ambient.js is a lightweight and flexible JavaScript library that adds ambient lighting to any `<img>` or `<video>` tags.

## Live demo
A live demonstration is available at https://nikx.io/ambient.
You may check out the console there aswell, it provides ready-to-inspect objects.

## Installation
To install ambient, simply download the script file (minified version is recommended) and 
insert it into your HTML-file, either in the `<head>`-tag or right before the end of the `<body>`-tag.

```html
<script type="text/javascript" src="ambient.min.js"></script>
```

You're all set!

## Quick Start
**Step 1:** Add the `data-ambient` tag to any `img` or `video` element you want.
```html
<img alt="An image" src="https://images.unsplash.com/photo-1466854076813-4aa9ac0fc347" data-ambient>
```


**Step 2:** Initialize a new `Ambient`-instance and call the `mount ()`-function.
```js
var ambient = new Ambient ();
ambient.mount ();
```

**Output:**
![QuickStart Output](/images/quickstart-preview.png)

## Methods and properties
The following methods and/or properties are available:

```
// Ambient instance:
Ambient.mount () 	// Wraps all selected images and videos and return an `AmbientElement` array containing every wrapped element
Ambient.unmount () 	// Restores the pre-mounted state
Ambient.elements 	// Array which contains all wrapped elements as `AmbientElement` instances

AmbientElement.disable () 	// Disables the ambient lighting for the selected element
AmbientElement.enable () 	// Enables the ambient lighting for the selected element
```

## Options
When initializing Ambient, there are a few options available for you to modify. Pass any option you want to modify into the constructor:
```js
var ambient = new Ambient (/* options go here */);
```

The default values are:
```js
{
	insertCSS: true, 		// Controls whether the CSS is auto-inserted into the HTML file
	retainAttributes: true, // If set to true, any argument the image has before being wrapped will be retained and copied onto the new image element
	blur: -1 				// When set to -1, the default value of 45px will be used
}
```

## How it works
When `mount ()` is called, any image or video which has the `data-ambient` tag set will be padded with a wrapper `div` and an additional shadow element.
Any attribute the image has will be retained and copied over to the new image element. The structure of this wrapper is the following:

```html
<div class="ambient__container"> <!-- This is the wrapper element by which the original image is replaced -->
	<img class="ambient__visible ..." src="..." ...> <!-- The new image element which holds the image -->
	<img class="ambient__shadow" src="..."> <!-- The shadow element, which is used to provide the ambient effect -->
</div>
```

If you do not want to retain the attributes the image has before Ambient.js kicks in, you may set the `retainAttributes` option to `false` when Ambient is initialized.

## Styling the image wrapper
When applying styles, keep in mind that the image you are styling is now at a completely different position inside the document. You should now consider styling the outer container,
because the image will be styled to completely fill it by default. This is also the reason why, by default, any attribute the original image has will not be retained - it most probably would not 
make sense to have these styles in the new context.

One might notice that there is no way to differentiate between multiple containers. Ambient.js provides a simple solution for this:
When the `data-ambient` attribute is not only set, but contains a value, the `id` attribute of the container will reflect this value. This allows
for easy control over a big amount of containers. 

Note that the container has to have its `position` property set to `relative`. If you need to position the image absolutely, 
you should wrap another `div` element around it, and set this one to have an absolute position.

**Example:**

```html
<img src="..." data-ambient="test-image">
<!-- will render -->
<div class="ambient__container" id="test-image">...</div>
```

## Including CSS file manually
By default, Ambient.js comes with a base64 variant of `ambiant.min.css`, which it will include into the HTML's `<head>` tag on initialization. 
If you do not want this to happen, simply set the `insertCSS` option to `false` when initializing Ambient.

Since the CSS data is missing when you do this, you will have to include the `ambient.min.css` file into the HTML manually.

## Known issues
* ~~When initializing Ambient with the `retainAttributes` option set to `false`, a call to `unmount ()` will not restore the original attributes.~~

## Contributing
Contributions are always welcome! Feel free to send a pull request, it'll be reviewed and then merged if possible.

## License
MIT
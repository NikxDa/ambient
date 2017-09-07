var AmbientElement = (function () {
	function AmbientElement (container) {
		// Save the name
		this.name = container.getAttribute ("id") || undefined;

		// Save the element
		this.container = container;

		// Save the shadow element
		this.shadowElement = this.container.querySelector (".ambient__shadow");
	}

	AmbientElement.prototype.disable = function () {
		// Hide the shadow element if neccessary
		if (this.shadowElement.style.display !== "none")
			this.shadowElement.style.display = "none";
	}

	AmbientElement.prototype.enable = function () {
		// Show the shadow element if neccessary
		if (this.shadowElement.style.display !== "block")
			this.shadowElement.style.display = "block ";
	}

	// Return the wrapped object
	return AmbientElement;
})(); 

var Ambient = (function () {
	// Private properties
	var _customBlur,
		_retainAttributes;

	// Constructor
	function Ambient (options) {
		// If no options are provided, use empty object
		options = options || {};

		// Merge custom and default options
		this.options = Object.assign ({
			insertCSS: true, // true inserts the CSS via base64
			retainAttributes: true, // true keeps attributes when wrapping images or videos
			blur: -1 // -1 uses default value of 45px
		}, options);

		// Should the base64-styles be applied?
		if (this.options.insertCSS) {
			// Apply our custom ambient-styles
			applyDefaultStyles ();
		}

		// Is there a custom blur to be applied?
		if (this.options.blur >= 0 && this.options.blur !== 45)
			_customBlur = this.options.blur;

		// Should attributes be retained?
		_retainAttributes = this.options.retainAttributes;

		// Create empty elements array
		this.elements = [];
	}

	// Renders all ambient elements
	Ambient.prototype.mount = function (element) {
		// Find all images that should have ambient
		var images = document.querySelectorAll ("img[data-ambient]");

		// Render all images
		for (var i = 0; i < images.length; i++)
			this.elements.push (renderImage (images [i]));

		// Find all videos that should have ambient
		var videos = document.querySelectorAll ("video[data-ambient]");

		// Render all videos
		for (var i = 0; i < videos.length; i++) 
			this.elements.push (renderVideo (videos [i]));

		// Return the elements
		return this.elements;
	}

	// Removes all ambient objects and resets the state
	Ambient.prototype.unmount = function () {
		// Iterate over all ambient elements
		this.elements.forEach (function (ambientElement) {
			// Grab the container
			var container = ambientElement.container;

			// Grab the visible element and reset the state
			var visibleElement = container.querySelector (".ambient__visible");
			visibleElement.classList.remove ("ambient__visible");
			visibleElement.setAttribute ("data-ambient", (ambientElement.name || ""));

			// Reposition the visible element
			container.parentNode.insertBefore (visibleElement, container);

			// Remove the container
			container.parentNode.removeChild (container);
		});

		// Reset the elements-array
		this.elements = [];
	}

	// Renders a video to be ambi-lit. (hah!)
	function renderVideo (videoElement) {
		var element = videoElement;

		// Main container where the video will go
		var container = document.createElement ("div");
		container.className = "ambient__container";

		// Set the id, so that CSS is transferrable
		if (element.getAttribute ("data-ambient").length > 0)
			container.id = element.getAttribute ("data-ambient");

		// Create two new elements
		var visibleElement = element.cloneNode (true);

		// Should attributes be retained?
		if (!_retainAttributes) {
			// Iterate over all attributes
			for (var i = 0; i < visibleElement.attributes.length; i++) {
				// Grab the attribute name
				var name = visibleElement.attributes [i].name.toLowerCase ();

				// Name 'src' is okay, continue
				if (name === "src") continue;

				// Otherwise remove attribute
				visibleElement.removeAttribute (name);
			}
		}

		// Add the corresponding class
		visibleElement.classList.add ("ambient__visible");

		// The shadow element will be a plain one
		var shadowElement = document.createElement ("canvas");
		shadowElement.className = "ambient__shadow";

		// Set a custom blur if necessary
		if (_customBlur)
			applyBlur (shadowElement, _customBlur);

		// Remove the data-ambient attribute to avoid confusion
		visibleElement.removeAttribute ("data-ambient");

		// Add the time change event listeners
		(function (video, canvas) {
			var context = canvas.getContext ("2d");
			var shouldRequestNewFrame = false;

			function mirrorCanvas () {
				// Draw the current video image onto the canvas
				context.clearRect (0, 0, canvas.width, canvas.height);
				context.drawImage (video, 0, 0, canvas.width, canvas.height);

				// Request a new frame rendering if necessary
				if (shouldRequestNewFrame)
					window.requestAnimationFrame (mirrorCanvas);
			}

			// Draw when the data loaded
			video.onloadeddata = function () {
				window.requestAnimationFrame (mirrorCanvas);
			}

			// Draw when the video is played
			video.onplay = function () {
				shouldRequestNewFrame = true;
				window.requestAnimationFrame (mirrorCanvas);
			}

			// Stop drawing
			video.onpause = function () { shouldRequestNewFrame = false; }
			video.onabort = function () { shouldRequestNewFrame = false; }
		})(visibleElement, shadowElement);

		// Append the elements to the container
		container.appendChild (visibleElement);
		container.appendChild (shadowElement);

		// Insert the container and remove the original image
		element.parentNode.insertBefore (container, element);
		element.parentNode.removeChild (element);

		// Return AmbientElement
		return new AmbientElement (container);
	}

	// Renders an image to be ambi-lit. (hah!)
	function renderImage (imgElement) {
		// Main container where the image will go
		var container = document.createElement ("div");
		container.className = "ambient__container";

		// Set the id, so that CSS is transferrable
		if (imgElement.getAttribute ("data-ambient").length > 0)
			container.id = imgElement.getAttribute ("data-ambient");

		// Create two new elements
		var visibleElement;

		// Should attributes be retained?
		if (_retainAttributes)
			visibleElement = imgElement.cloneNode ();
		else {
			// Create element from scratch
			visibleElement = document.createElement ("img");

			// Copy src and alt
			visibleElement.src = imgElement.src;
			visibleElement.alt = imgElement.alt;
		}

		// Add the corresponding class
		visibleElement.classList.add ("ambient__visible");

		// The shadow element will be a plain one
		var shadowElement = document.createElement ("img");
		shadowElement.className = "ambient__shadow";
		shadowElement.src = visibleElement.src;

		// Set a custom blur if necessary
		if (_customBlur)
			applyBlur (shadowElement, _customBlur);

		// Remove the data-ambient attribute to avoid confusion
		visibleElement.removeAttribute ("data-ambient");
		shadowElement.removeAttribute ("data-ambient");

		// The image might still change, listen for that
		(function (visible, shadow) {
			// New image loaded?
			visibleElement.onload = function () {
				// Change the source of the shadow element aswell
				shadowElement.src = visibleElement.src;
			}
		})(visibleElement, shadowElement);

		// Append the elements to the container
		container.appendChild (visibleElement);
		container.appendChild (shadowElement);

		// Insert the container and remove the original image
		imgElement.parentNode.insertBefore (container, imgElement);
		imgElement.parentNode.removeChild (imgElement);

		// Return AmbientElement
		return new AmbientElement (container);
	}

	// Sets the blur filter of an element
	function applyBlur (element, value) {
		var blur = "blur(" + value + "px)";

		element.style.filter = blur;
		element.style.webkitFilter = blur;
		element.style.mozFilter = blur;
		element.style.msFilter = blur;
	}

	// Applies custom styles to an element
	function applyStyles (element, styles) {
		// Iterate over style keys
		for (var item in styles) {
			// Check whether it is a custom property
			if (styles.hasOwnProperty (item)) {
				// Apply the style to the element
				element.style [item] = styles [item];
			}
		}
	}

	// Applies the default ambient styles
	function applyDefaultStyles () {
		// This is a base64-encoded stylesheet, which I include here so you don't have to :)
		var defaultStyles = "LmFtYmllbnRfX2NvbnRhaW5lcntwb3NpdGlvbjpyZWxhdGl2ZX0uYW1iaWVudF9fdmlzaWJsZXtkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlO3otaW5kZXg6MTA7d2lkdGg6MTAwJX0uYW1iaWVudF9fc2hhZG93e2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTt6LWluZGV4OjU7bGVmdDowO3RvcDowOy13ZWJraXQtZmlsdGVyOmJsdXIoNDVweCk7LW1vei1maWx0ZXI6Ymx1cig0NXB4KTstbXMtZmlsdGVyOmJsdXIoNDVweCk7ZmlsdGVyOmJsdXIoNDVweCl9";
		
		// Style element
		var styleEl = document.createElement ("style");
		styleEl.textContent = atob (defaultStyles);

		// Append it to the head
		var head = document.querySelector ("head");
		head.appendChild (styleEl);
	}

	// Return the wrapped object
	return Ambient;
})();

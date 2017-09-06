var Ambient = (function () {
	// Constructor
	function Ambient (options) {
		// If no options are provided, use empty object
		options = options || {};

		// Merge custom and default options
		this.options = Object.assign ({
			includeCSS: true
		}, options);

		// Should the base64-styles be applied?
		if (this.options.includeCSS) {
			// Apply our custom ambient-styles
			applyDefaultStyles ();
		}
	}

	// Renders all ambient elements
	Ambient.prototype.render = function () {
		// Find all images that should have ambient
		var images = document.querySelectorAll ("img[data-ambient]");

		// Render all images
		for (var i = 0; i < images.length; i++)
			renderImage (images [i]);

		// Find all videos that should have ambient
		var videos = document.querySelectorAll ("video[data-ambient]");

		// Render all videos
		for (var i = 0; i < videos.length; i++) 
			renderVideo (videos [i]);
	}

	Ambient.prototype.discard = function () {
		// Find all shadow elements
		var shadowElements = document.querySelectorAll (".ambient__shadow");

		// Hide them
		shadowElements.forEach (function (element) {
			element.style.display = "none";
		});
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
		// The visible element will retain classes it has
		var visibleElement = element.cloneNode (true);
		visibleElement.classList.add ("ambient__visible");

		// The shadow element will be a plain one
		var shadowElement = document.createElement ("canvas");
		shadowElement.className = "ambient__shadow";

		// Remove the data-ambient attribute to avoid confusion
		visibleElement.removeAttribute ("data-ambient");

		// Add the time change event listeners
		(function (video, canvas) {
			var context = canvas.getContext ("2d");
			var shouldRequestNewFrame = true;

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
		// The visible element will retain classes it has
		var visibleElement = imgElement.cloneNode (true);
		visibleElement.classList.add ("ambient__visible");

		// The shadow element will be a plain one
		var shadowElement = document.createElement ("img");
		shadowElement.className = "ambient__shadow";
		shadowElement.src = visibleElement.src;

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
		var defaultStyle = "LmFtYmllbnRfX2NvbnRhaW5lciwuYW1iaWVudF9fdmlzaWJsZXtwb3NpdGlvbjpyZWxhdGl2ZX0uYW1iaWVudF9fdmlzaWJsZXtkaXNwbGF5OmJsb2NrO3otaW5kZXg6MTA7d2lkdGg6MTAwJX0uYW1iaWVudF9fc2hhZG93e2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTt6LWluZGV4OjU7bGVmdDowO3RvcDowOy13ZWJraXQtZmlsdGVyOmJsdXIoNDVweCk7LW1vei1maWx0ZXI6Ymx1cig0NXB4KTstbXMtZmlsdGVyOmJsdXIoNDVweCk7ZmlsdGVyOmJsdXIoNDVweCl9";
		
		// Style element
		var styleEl = document.createElement ("style");
		styleEl.textContent = atob (defaultStyle);

		// Append it to the head
		var head = document.querySelector ("head");
		head.appendChild (styleEl);
	}

	// Return the wrapped object
	return Ambient;
})();

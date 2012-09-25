var doc = {
	PP: {
		draw: {
			alpha: {
				type: "property",
				property_type: "number",
				description: "Determines the drawing transparency. Ranges from 0.0 (fully transparent) to 1.0 (no additional transparency)."
			},

			circle: {
				type: "function",
				description: "Draws a circle with the given radius at the given coordinates.",
				parameters: [
					{
						type: "number",
						name: "x",
						description: "x coordinate to draw at."
					},

					{
						type: "number",
						name: "y",
						description: "y coordinate to draw at."
					},

					{
						type: "number",
						name: "radius",
						description: "Radius of the circle."
					}
				]
			},

			clear: {
				type: "function",
				description: "Clears the canvas of any drawings."
			},

			rectangle: {
				type: "function",
				description: "Draws a rectangle with a given width and height at the given coordinates.",
				parameters: [
					{
						type: "number",
						name: "x",
						description: "x coordinate to draw at."
					},

					{
						type: "number",
						name: "y",
						description: "y coordinate to draw at."
					},

					{
						type: "number",
						name: "width",
						description: "Width of the rectangle."
					},

					{
						type: "number",
						name: "height",
						description: "Height of the rectangle."
					}
				]
			}
		},

		events: {
			
		},

		loop: {
			beget: {
				type: "function",
				description: "#https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create#Creates# and #PP.loop.register#registers# a new object whose prototype is determined by the $proto$proto$ parameter.",
				parameters: [
					{
						type: "object",
						name: "proto",
						description: "The object which should be the prototype of the newly-created object."
					}
				]
			},

			clearRegistration: {
				type: "function",
				description: "Clears the registration list."
			},

			register: {
				type: "function",
				description: "Adds the $object$object$ to the registration list.",
				parameters: [
					{
						type: "object",
						name: "object",
						description: "The object which should be registered."
					}
				]
			},

			remove: {
				type: "function",
				description: "Removes the $object$object$ from the registration list.",
				parameters: [
					{
						type: "object",
						name: "object",
						description: "The object which should be removed from the registration list."
					}
				]
			},

			update: {
				type: "function",
				description: "This function is executed as the game loop."
			}
		}
	}
};
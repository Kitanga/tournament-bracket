/* Bunch of utility functions */
var need = {
    /**
     * Creates a element
     * @param {string} name The name of the element being created
     * @param {{ attribute_name: string|number|boolean }} attributes An object that holds the attribute names (e.g. width) as keys and the attribute values (e.g. 430px) as values
     * @return {HTMLElement}
     */
    element: function(name, attributes) {
        /* Create the element */
        let element = document.createElement(name);

        /* Add the attributes from the attributes object (format of attribute element: { 'attribute name': attribute_value }) */
        for (let i in attributes) {
            element.setAttribute(i, attributes[i]);
        }
        return element;
    },
    /**
     * Creates a canvas element
     * @param {{ attribute_name: string|number|boolean }} attributes An object that holds the attribute names (e.g. width) as keys and the attribute values (e.g. 430px) as values
     * @return {HTMLCanvasElement}
     */
    canvas: function(attributes) {
        return need.element('canvas', attributes);
    },
    /**
     * Used to create simple 4 squares/rectangles for testing
     * 
     * @param {{}} _obj The sprite onto which we do the following operations
     * @param {number} width The width of the sprite's graphic canvas
     * @param {number} height The height of the sprite's graphic canvas
     * @param {string} color The color (HEX Decimal) we use to fill the sprite's graphic canvas
     */
    createGraphic: function(_obj, width, height, color) {
        /* Here we check if the object has an offscreen canvas */
        if (!_obj._canvas) {
            _obj._canvas = this.canvas({
                "width": width,
                "height": height
            });
            _obj._ctx = _obj._canvas.getContext('2d');
        }
        _obj._canvas.width = width;
        _obj.width = width;
        _obj._canvas.height = height;
        _obj.height = height;
        _obj._ctx.fillStyle = color;
        _obj._ctx.fillRect(0, 0, width, height);
    },
    /**
     * Stroke the canvas object
     */
    stroke: function(_obj, color) {
        _obj._ctx.strokeStyle = color;
        _obj._ctx.strokeRect(0, 0, _obj._canvas.width, _obj._canvas.height);
    },
    "pixelate": function(cx) {
        /* Needed CSS property values to remove anti-aliasing from element */
        var types = ['optimizeSpeed', 'crisp-edges', '-moz-crisp-edges', '-webkit-optimize-contrast', 'optimize-contrast', 'pixelated'];
        var c = cx.canvas;

        cx.mozImageSmoothingEnabled = false;
        cx.webkitImageSmoothingEnabled = false;
        cx.msImageSmoothingEnabled = false;
        cx.imageSmoothingEnabled = false;


        for (var i = 0; i < types.length; i++) {
            c.style['image-rendering'] = types[i];
        }
        c.style.msInterpolationMode = 'nearest-neighbor';
    },
    /**
     * Returns a vector
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {{ x: number, y: number }}
     */
    point: function(x, y) {
        return {
            "x": x === 0 ? 0 : x || 0,
            "y": y !== 0 && typeof y !== 'undefined' ? y : (y === 0 ? 0 : (x === 0 ? 0 : x || 0))
        };
    },
    /* Timestamp function used in game's loop function */
    timestamp: function() {
        // return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        return window.performance.now();
    },

    /* A bunch of math related helper functions */
    math: {
        between: function(n, min, max) {
            return ((n >= min) && (n <= max));
        },

        random: function(min, max) {
            return (min + (Math.random() * (max - min)));
        },

        randomInt: function(min, max) {
            return Math.round(this.random(min, max));
        },

        randomChoice: function(choices) {
            return choices[this.randomInt(0, choices.length - 1)];
        },

        randomBool: function() {
            return Math.random() > 0.5;
        }
    }
};
// export default need;
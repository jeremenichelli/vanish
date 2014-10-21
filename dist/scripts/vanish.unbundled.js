// vanish - undefined
// https://github.com/jeremenichelli/vanish - MIT License

(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return factory(root);
        });
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.Vanish = factory(root);
    }
})(this, function () {
    'use strict';

    // default options
    var dflt = {
        loop: true,
        lapse: 300,
        navigation: true,
        next: '&gt;',
        prev: '&lt;'
    };

    var Vanish = function (element, options) {
        // check if an element was specified
        if (!element) {
            console.error('You must specify an element');
            return;
        } else {
            this.element = element;
        }

        var vanish = this;

        // set options options
        if (options) {
            vanish.setOptions(options);
        } else {
            vanish.options = dflt;
        }

        // set elements and lengths
        vanish.setElements();

        // check if there's an indicator for each element
        if (vanish.hasIndicators && vanish.limit !== vanish.indicators.length) {
            console.error('The number of elements and indicators must match');
            return;
        }

        if (vanish.limit > 1) {

            if (vanish.options.navigation) {
                vanish.prevBtn.onclick = vanish.prev.bind(vanish);
                vanish.nextBtn.onclick = vanish.next.bind(vanish);

                vanish.element.appendChild(vanish.prevBtn);
                vanish.element.appendChild(vanish.nextBtn);
            }

            if (vanish.options.loop) {
                vanish.loop();
            }

            if (vanish.hasIndicators) {

                for (var i = 0; i < vanish.limit; i++) {
                    vanish.indicators[i].onclick = vanish.activeElement.bind(vanish, [i]);
                }
            }

            vanish.element.addClass('vanish-started');
        }
    };

    Vanish.prototype = {
        // set custom options or default
        setOptions : function (options) {
            var vanish = this,
                newOptions = {};

            for (var opt in dflt) {
                newOptions[opt] = (typeof options[opt] !== 'undefined') ? options[opt] : dflt[opt];
            }

            vanish.options = newOptions;
        },
        // set elements and indicators
        setElements : function () {
            var vanish = this;

            vanish.hasIndicators = false;

            vanish.elements = vanish.element.querySelector('[data-vanish-elements]').children;
            if (vanish.element.querySelector('[data-vanish-indicators]')) {
                vanish.indicators = vanish.element.querySelector('[data-vanish-indicators]').children;
                vanish.hasIndicators = true;
            }

            vanish.limit = vanish.elements.length;

            vanish.position = 0;

            if (vanish.options.navigation) {
                vanish.nextBtn = document.createElement('a');
                vanish.prevBtn = document.createElement('a');

                vanish.prevBtn.href = vanish.nextBtn.href = '';

                vanish.nextBtn.addClass('vanish-next');
                vanish.prevBtn.addClass('vanish-prev');

                vanish.nextBtn.innerHTML = vanish.options.next;
                vanish.prevBtn.innerHTML = vanish.options.prev;
            } else if (!vanish.options.loop) {
                console.info('Warning! This vanish instance has no navigation buttons and is not allowed to loop');
            }
        },
        // set active elements
        setActives : function () {
            var vanish = this,
                pos = vanish.position;

            vanish.elements[pos].addClass('active');
            if (vanish.hasIndicators) {
                vanish.indicators[pos].addClass('active');
            }
        },
        // set active elements
        resetActives : function () {
            var vanish = this,
                pos = vanish.position;

            vanish.elements[pos].removeClass('active');
            if (vanish.hasIndicators) {
                vanish.indicators[pos].removeClass('active');
            }
        },
        // move to next element
        next : function () {
            var vanish = this;

            vanish.resetActives();

            if (vanish.position === (vanish.limit - 1)) {
                vanish.position = 0;
            } else {
                ++vanish.position;
            }

            if (vanish.options.loop) {
                vanish.count = 0;
            }

            vanish.setActives();

            return false;
        },
        // move to previous element
        prev : function () {
            var vanish = this;

            vanish.resetActives();

            if (vanish.position === 0) {
                vanish.position = vanish.limit - 1;
            } else {
                --vanish.position;
            }

            if (vanish.options.loop) {
                vanish.count = 0;
            }

            vanish.setActives();

            return false;
        },
        activeElement : function (n) {
            var vanish = this;

            if (n < vanish.limit) {
                vanish.resetActives();

                vanish.position = n;
                if (vanish.options.loop) {
                    vanish.count = 0;
                }

                vanish.setActives();
            }
        },
        // loop function
        loop : function () {
            var vanish = this;

            vanish.count = 0;

            function repeat() {
                ++vanish.count;
                if (vanish.count === vanish.options.lapse) {
                    vanish.next();
                    vanish.count = 0;
                }

                requestAnimationFrame(repeat);
            }

            requestAnimationFrame(repeat);
        }
    };

    // return constructor
    return Vanish;
});
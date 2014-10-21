// vanish - undefined
// https://github.com/jeremenichelli/vanish - MIT License

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1), 
            fToBind = this, 
            fNOP = function () {},
            fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
                ? this
                : oThis,
                aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
// Classing.js - Jeremias Menichelli
// https://github.com/jeremenichelli/classing - MIT License
(function(document){
    'use strict';
    // Object to prototype
    var els = (typeof HTMLElement !== 'undefined') ? HTMLElement : Element;

    // Given an element, converts classes into an array
    var _classToArray = function(el){
        return el.className.split(/\s+/);
    };
    // Checks if an element has a class
    var _hasClass = function(el, c){
        return _classToArray(el).indexOf(c) !== -1;
    };
    // Adds a class (if it's not already there)
    var _addClass = function(el, c){
        if(!_hasClass(el, c)){
            el.className += (el.className === '') ? c : ' ' + c;
        }
    };
    // Removes a class (if it's there)
    var _removeClass = function(el, c){
        if(_hasClass(el, c)){
            var cs = _classToArray(el);
            cs.splice(cs.indexOf(c), 1);
            el.className = cs.join(' ');
        }
    };
    // Toggles a class in an element
    var _toggleClass = function(el, c){
        if(_hasClass(el, c)){
            _removeClass(el, c);
        } else {
            _addClass(el, c);
        }
    };

    if(document.documentElement.classList){
        els.prototype.hasClass = function(c){
            return this.classList.contains(c);
        };

        els.prototype.addClass = function(c){
            this.classList.add(c);
        };

        els.prototype.removeClass = function(c){
            this.classList.remove(c);
        };

        els.prototype.toggleClass = function(c){
            this.classList.toggle(c);
        };
    } else {
        els.prototype.hasClass = function(c){
            return _hasClass(this, c);
        };

        els.prototype.addClass = function(c){
            _addClass(this, c);
        };

        els.prototype.removeClass = function(c){
            _removeClass(this, c);
        };

        els.prototype.toggleClass = function(c){
            _toggleClass(this, c);
        };
    }
})(document);

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
        || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    };
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());
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
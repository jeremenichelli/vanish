vanish
======

Simple engine to manage infinite slides. This is just a script that will manage all the actions and behavior inside the slider, the styles are up to you, but will build some full examples when I have some time. In the meant time here's a guide on how to use it.


## HTML

In order to make *vanish* work you have to follow a simple markup structure:

```html
<div id="mySlide">
    <ul data-vanish-elements>
        <li>
            <img src="images/sample-image-1" alt="first image">
        </li>
        <li>
            <img src="images/sample-image-2" alt="second image">
        </li>
        <li>
            <img src="images/sample-image-3" alt="third image">
        </li>
    </ul>
    <ul data-vanish-indicators>
        <li>one</li>
        <li>two</li>
        <li>three</li>
    </ul>
</div>
```

Just as simple as that, wrap your slide in a ```div``` element and put inside a list of *vanish elements* and, if you want to, a list of *vanish indicators* which are optionals. The script will detect the amount of childs these elements have and do all the magic.


## Styles

The script will move an active class across all the elements, so the minimum styles you'll need are these:

```css
ul[data-vanish-elements] li {
    display: none;
}

ul[data-vanish-elements] li.active {
    display: block;
}
```

The same styles should work for indicators and of course this is just **one way of doing it**, CSS is pretty flexible and you can apply the styles that suits better for you.


## Scripts

After you have the markup and styles set up you'll have to include a ```vanish.js``` file inside your project. It uses polyfills for requestAnimationFrame, Function.prototype.bind and a small class manager so there's a standard version that includes this three dependencies and an unbundled one with just the specific slide management logic.

For every slide you have placed on your site call the following method:

```js
var mySlideElement = document.getElementById('mySlide');

var mySlide = new Vanish(mySlideElement, {
   loop: false,
   next: 'Next',
   prev: 'Previous' 
});
```

When everything is set a *vanish-started* class will be added to the element in case ou want to apply styles. If the scripts finds out that the slides only contains one element it will not loop or show navigation buttons.

### Options

By default Vanish slides will loop every 300 frames *where each frame is 16ms approximately* and will have navigation arrows you can change all of this sending an object with the following options:

```js
{
    loop: BOOLEAN, // if false slide won't loop
    lapse: NUMBER, // number of frames of loop duration
    navigation: BOOLEAN, // if false navigation buttons won't be added
    prev: STRING, // prev navigation button text
    next: STRING // next navigation button text
}
```

## Contributing

This is just the first version so if you find an issuee or have any suggestion just rise tour hand here in this repository.

Thanks!


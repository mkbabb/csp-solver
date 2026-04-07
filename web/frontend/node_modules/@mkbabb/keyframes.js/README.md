# keyframes.js ![image](./assets/cube.png)

Create keyframe animations for **anything** in JavaScript; specify your keyframes in standards-complaint CSS.

[demo 🌈](https://mkbabb.github.io/keyframes.js/)

## Quick Start using `CSS`

#### Create a new `CSSKeyframesAnimation` object:

```ts
const anim = new CSSKeyframesAnimation({
    duration: 2000,
    iterationCount: Infinity,
    direction: "alternate",
    fillMode: "forwards",
});
```

#### Specify your keyframes in CSS:

```css
@keyframes mijn-keyframes {
    from {
        transform: translateX(-100%) translateY(-100%) rotate(0turn);
        background-color: #C462D8;
    }
    100% {
        transform: translateX(50%) translateY(75%) rotate(1turn);
        background-color: #E85252;
    }
}
```

#### Add the keyframes to your animation, and add target elements to animate:

```ts
const CSSKeyframes = /* the above string */  ...
anim.fromCSSKeyframes(CSSKeyframes);
anim.addTargets(document.getElementById("myElement"));
```

#### Play ▶️

```ts
anim.play();
```

This will animate the above element by way of its style properties, as specified in the keyframes. This is only the default behaviour; you can get far more funky with it.

The above is plucked directly from the [`demo/simple`](demo/simple/App.vue) Vue file.

## Table of Contents

- [keyframes.js ](#keyframesjs-)
  - [Quick Start using `CSS`](#quick-start-using-css)
      - [Create a new `CSSKeyframesAnimation` object:](#create-a-new-csskeyframesanimation-object)
      - [Specify your keyframes in CSS:](#specify-your-keyframes-in-css)
      - [Add the keyframes to your animation, and add target elements to animate:](#add-the-keyframes-to-your-animation-and-add-target-elements-to-animate)
      - [Play ▶️](#play-️)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [`Animation`](#animation)
    - [`AnimationOptions`:](#animationoptions)
    - [The transform function](#the-transform-function)
    - [The timing function](#the-timing-function)
      - [Step Functions](#step-functions)
      - [Bézier Curves](#bézier-curves)
      - [Graphing Bézier Curves](#graphing-bézier-curves)
      - [Just gimme the `t` value](#just-gimme-the-t-value)
    - [`TemplateAnimationFrame`](#templateanimationframe)
      - [Reification of a `TemplateAnimationFrame`](#reification-of-a-templateanimationframe)
        - [Variable Resolution](#variable-resolution)
  - [`CSSKeyframesAnimation`](#csskeyframesanimation)
    - [Parsing CSS Keyframes; `keyframes.ts`](#parsing-css-keyframes-keyframests)
    - [Units: `units.ts` \& `CSS Units`](#units-unitsts--css-units)
      - [Unit class hierarchy](#unit-class-hierarchy)
      - [Unit interpolation and resolution](#unit-interpolation-and-resolution)

## Installation

```bash
npm install keyframes.ts
```

Which will _mostly_ work both in and out of the browser. Anything that leverages the the `DOM`, of course, won't work outside of the browser (things like `getComputedStyle`, `document`, etc.).

## `Animation`

The `Animation` object is the driver behind `CSSKeyFramesAnimation` and `AnimationGroup`.

Every `Animation` is composed of (at a high level):

-   options: the options for the animation; `AnimationOptions`
-   a transform function: the function to interpolate between keyframes
-   a timing function: the function to ease the animation, which can also be set by the `AnimationOptions`
-   keyframes: the keyframes for the animation; `TemplateAnimationFrame`

### [`AnimationOptions`](src/animation.ts#L139):

-   duration: time in milliseconds of the entire animation
-   delay: time in milliseconds before the animation starts
-   iterationCount: number of times the animation should repeat
-   direction: direction of the animation (normal, reverse, alternate, alternate-reverse)
-   fillMode: how the animation should apply styles before and after it plays (none, forwards, backwards, both)
-   timing function: the timing function to use for easing, tweening, etc., the animation
-

### The transform function

The type signature of the transform function is as follows:

```ts
type TransformFunction<V extends Vars> = (t: number, v: V) => void;
```

And it's called for each timestep `t` of the animation, where `t` is a number between 0 and the duration of the animation. The transform function is responsible for doing whatever you'd like to do with the variables `v` at each timestep `t`.

The variables `v` are the interpolated values at time `t`, given to you in almost exactly the same form as you originally specified them in the keyframes. Deeply nested objects are supported, as are just about anything else you can think of.

Every value therein is parsed as a CSS value unit, so you can specify things like `1px`, `1em`, `1%`, `1deg`, etc. The library will handle the conversion for you, though two interpolate between two different units, they must be of the same super type (e.g. `px` and `em` are both `length`s, so they can be interpolated; `px` and `deg` are not, so they cannot). See the `collapseNumericType` function within [`units.ts`](src/units.ts) for more information.

### The timing function

The timing, or easing, tweening, etc., function is responsible for determining how the animation progresses over time. The type signature of the timing function is as follows:

```ts
type TimingFunction = (t: number) => number;
```

Where `t` is a number between 0 and 1, and the return value is also a number between 0 and 1. The timing function is responsible for determining how the animation progresses over time, and can be anything from a simple linear function to a complex Bezier curve.

All CSS timing functions are supported, and are implemented in [`easing.ts`](src/easing.ts).

#### Step Functions

A special case and multi-parameter variant of a timing function, implemented as `steppedEase`, which takes (in addition to `t`) two parameters:

-   the number of steps
-   the direction, or jump term, of the step

Valid jump terms are:

-   `jump-none`: the step occurs at the start of the step, but the value is held until the end of the step
-   `jump-start` | `start`: the step occurs at the start of the step
-   `jump-end` | `end`: the step occurs at the end of the step
-   `jump-both` | `both`: the step occurs at the start and end of the step

#### Bézier Curves

Bézier curves are parametric curves defined by a set of control points.

The `cubicBezier` function implements the special cubic case of the more general Bézier curve, taking in control points for `x1`, `y1`, `x2`, and `y2`, and returning the x and y coordinates of the curve at time `t`.

```ts
const [x, y] = cubicBezier(t / duration, 0.09, 0.91, 0.5, 1.5);
```

The general case of calculating a point along a Bézier curve at time `t`, specified at control points `x1, ..., xn`, `y1, ..., yn`, is performed using `deCasteljau`'s algorithm, implemented iteratively as simply the `deCasteljau` function.

Both of the above, along with other math utilities, are implemented in [`math.ts`](src/math.ts).

#### Graphing Bézier Curves

If you're interested in more Bézier visualizations, check out [this](https://www.desmos.com/calculator/tvivnkflzv) Desmos graph.

Or use any of the demos in the [`demo`](demo) folder, click on `timing-functions` and then `bezier`.

#### Just gimme the `t` value

OK ✨

`CSSBezier` is the function you're looking for. It's a high-order function that takes in the control points of the Bezier curve and returns a function that takes in a time `t` and returns the value of the Bezier curve at that time.

For example, CSS's `easeInBounce` is defined as

```ts
function easeInBounce(t: number) {
    t = CSSBezier(0.09, 0.91, 0.5, 1.5)(t);
    return t;
}
```

### `TemplateAnimationFrame`

A `TemplateAnimationFrame` object, or template keyframe, is a keyframe that's not yet been resolved to a concrete keyframe. It's composed of:

-   id: the unique id of the keyframe; autoincremented number
-   start: the start time of the keyframe
-   vars: the variables of the keyframe to be interpolated
-   transform: the transform function of the keyframe
-   timingFunction: the timing function of the keyframe

Keyframes can have unique transform and timing functions, but that's not typical: usually you'll specify one transform and timing function for the entire animation (once a transform function is specified, it's used for all keyframes, similarly for the timing function; no need to list it twice).

#### Reification of a `TemplateAnimationFrame`

A `TemplateAnimationFrame` is reified into a concrete keyframe by the following process:

-   parse the start time: this can be input as a string, which can take on any valid CSS time format (e.g. `1s`, `100ms`, `1.5s`, `1.5ms`, etc.), or as a number, or as a percentage (e.g. `50%`).
    -   All times are then normalized to a percentage of the total duration of the animation.
-   resolve the transform and timing functions if they're null: if they are, they're resolved to the default transform and timing functions specified in the `AnimationOptions`.

Once all of the `TemplateAnimationFrame` objects have been added to an `Animation`, they're further parsed into a concrete keyframe by the following process:

-   sort the keyframes by their starting percentage
-   resolve the variables for each keyframe
-   resolve the keyframes' start and stop times
-   calculate the keyframes' duration

##### Variable Resolution

This is done so that every keyframe has the same set of variables, and so that the variables are resolved to their concrete values. Take the following example:

```ts
const keyframeVars1 = {
    x: 0,
    y: 0,
};
const keyframeVars2 = {
    z: 0,
};
const keyframeVars3 = {
    x: 1,
    y: 1,
    z: 1,
};
```

Notice that `x` and `y` are defined in the first and third keyframes, but not in the second. We handle this by working through the keyframes backwards and seeking the most recent keyframe that has the variable defined.

If it's not defined in any previous keyframes, we set it to the default value of the variable (usually `0`).

All of this above nets you the ability to specify keyframes in a rather hap-hazard way (perhaps not such a good thing 😅). For example, the below is a valid set of keyframes:

```ts
const duration = 1000;
const keyframe1 = {
    start: "0s",
    vars: {
        x: 0,
        y: 0,
    },
};

const keyframe2 = {
    start: "100%",
    vars: {
        x: 0,
        y: 1,
    },
};

const keyframe3 = {
    start: "500ms",
    vars: {
        x: 1,
    },
};
```

## `CSSKeyframesAnimation`

An abstraction over the `Animation` object, the `CSSKeyframesAnimation` object is responsible for creating animations from CSS keyframes. This is done by parsing the CSS keyframes into a series of `TemplateAnimationFrame` objects, thereupon adding them to a base `Animation` object.

### Parsing CSS Keyframes; [`keyframes.ts`](src/parsing/keyframes.ts)

Most of the CSS spec. is supported, including:

-   `from`, `to`, and percentages
-   time units (`s`, `ms`, etc.)
-   lengths (`px`, `em`, etc.)
-   angles (`deg`, `rad`, etc.)
-   colors (`#fff`, `rgb(255, 255, 255)`, `lab(100, 0, 0)`, `lightblue`, etc.)
-   transforms (`translateX(100%)`, `rotate(1turn)`, etc.)
-   variables (`var(--my-var)`)
-   resolved math expressions (`calc(100% - 10px)`)
-   Any `key: value` pair that can be parsed by the `CSS` parser, where value can be
    -   any CSS value
    -   any CSS function
    -   any list of CSS values or functions
-   a limited subset of `JSON`-like objects, though the implemention of `JSON-CSS` is on the roadmap

The implemented parser currently leverages the [`parsimmon`](https://github.com/jneen/parsimmon) parser combinator library 🙂‍↔

### Units: [`units.ts`](src/units.ts) & [`CSS Units`](src/parsing/units.ts)

A great deal of care has gone into the parsing and resolving of units within the CSS spec. Herein, we cover the following unit types:

-   `length`
-   `angle`
-   `time`
-   `resolution`
-   `percentage`
-   `color`

See the parser within the [`CSS Units file`](src/parsing/units.ts) for more information.

#### Unit class hierarchy

A `unit` value comes in three forms, specified in the general [`units.ts`](src/units.ts) file:

-   `ValueUnit`: a value with a string unit and an array of super types
-   `FunctionValue`: a function with a string name and an array of `ValueUnit`s
-   `ValueArray`: an array of `ValueUnit`s

Each of these has defined a set of core functions:

-   `toString()`: returns the string representation of the unit, e.g. `1px` or `translateX(100%)`
-   `valueOf()`: if the value is unit-less, returns the value; otherwise, returns the string variant
-   `lerp(t: number,
other: FunctionValue<T> | ValueArray<T> | ValueUnit<T>,
target?: HTMLElement,)`: interpolates between two units

Note that any `ValueUnit` type variant can be interpolated between another; insofar as, a `ValeUnit` can be interpolated between a `FunctionValue` or `ValueArray`, and vice versa. The values thereof are aligned to the smallest array length of the two: the interpolation is then performed on each element of the array.

#### Unit interpolation and resolution

Units that are of the same supertype can be interpolated between. For example, `px` and `em` are both `length`s, so they can be interpolated between. `px` and `deg` are not, so they cannot.

Supertypes also contain information about the realtive or absolute nature of the unit. For example, `px` is an absolute length, while `em` is a relative length. This information is used to resolve the units to a common supertype, which is then used to interpolate between the two units.

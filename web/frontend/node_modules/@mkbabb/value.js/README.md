# value.js ![image](demo/color-picker/cube.png)

CSS value units for color, length, angles, & c. Create a moderately-typed value with a unit, like `deg`, `px`, etc.

[demo 🌈](https://color.babb.dev)

## Features

- Parse any CSS value: lengths, angles, times, colors, `calc()`, `var()`, gradients
- 10 color spaces: RGB, HSL, HSV, HWB, Lab, LCh, OKLab, OKLCh, XYZ, Kelvin
- Full color space conversion via XYZ hub with gamut mapping
- Normalize, interpolate, and convert between units

## Install

```bash
npm install @mkbabb/value.js
```

## Usage

```ts
import { ValueUnit, FunctionValue } from "@mkbabb/value.js";
```

## Build

```bash
npm run build        # library → dist/
npm run gh-pages     # demo → dist/
npm run dev          # dev server on :8080
npm test             # vitest
```

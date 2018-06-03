# data-uri.macro

[![Babel Macro](https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg?style=flat-square)](https://github.com/kentcdodds/babel-plugin-macros)
[![npm version](https://img.shields.io/npm/v/data-uri.macro.svg)](https://www.npmjs.com/package/data-uri.macro)
[![Build Status](https://travis-ci.org/Andarist/data-uri.macro.svg?branch=master)](https://travis-ci.org/Andarist/data-uri.macro)
[![npm](https://img.shields.io/npm/dm/data-uri.macro.svg)](https://www.npmjs.com/package/data-uri.macro)

Convert your assets to [data URIs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) at build time with [babel macros](https://github.com/kentcdodds/babel-plugin-macros).

## Installation

```sh
npm install --save-dev data-uri.macro
```

## Usage

```js
import dataUri from 'data-uri.macro'
import sampleSvg from '../assets/sample.svg'

const svg = dataUri(sampleSvg)
const png = dataUri(../assets/other.png)
```

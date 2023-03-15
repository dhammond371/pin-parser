# Pin-Parser

A simple tool to return the latitude and longitude from a copied Google or Apple maps pin

## Install

```
$ npm install pin
```

## Usage

```ts
var pinParser = require('pin-parser');

/** 
 * Pin can be of any of the following forms:
 * 12.3456,78.91011
 * (12.3456,78.91011)
 * https://maps.app.goo.gl/c3rjbowSs23hQnhR8?g_st=ic
 * https://maps.apple.com/?ll=54.745391,-110.146062&q=Dropped%20Pin&t=m
 */
const pin = 'https://maps.app.goo.gl/c3rjbowSs23hQnhR8?g_st=ic'

const parsedPin = await pinParser.ParsePin(pin);
```

# Google Hotel Unofficial API

[![Build Status](https://travis-ci.org/mr687/google-hotel-api.svg?branch=main)](https://travis-ci.org/mr687/google-hotel-api)
[![Coverage Status](https://coveralls.io/repos/github/mr687/google-hotel-api/badge.svg?branch=main)](https://coveralls.io/github/mr687/google-hotel-api?branch=main)
[![Dependency Status](https://david-dm.org/mr687/google-hotel-api.svg)](https://david-dm.org/mr687/google-hotel-api)
[![devDependency Status](https://david-dm.org/mr687/google-hotel-api/dev-status.svg)](https://david-dm.org/mr687/google-hotel-api#info=devDependencies)
[![npm version](https://badge.fury.io/js/google-hotel-api.svg)](https://badge.fury.io/js/google-hotel-api)

## Description

This is an unofficial API for Google Hotel. It is based on the [Google Hotel API](https://www.google.com/travel/hotels/). It is not affiliated with Google in any way.

## Installation

```bash
npm install google-hotel-api
```

or if you prefer yarn

```bash
yarn add google-hotel-api
```

## Usage

```js
const { createHotelListing } = require('./dist/index');

const data = createHotelListing({
	language: 'en',
})
.addHotel({
	id: '123abc',
	name: 'Belgrave House',
	address: {
		format: 'simple',
		component: [
			{ name: 'addr1', value: '6 Acacia Ave' },
			{ name: 'addr2', value: 'Floor 5' },
			{ name: 'city', value: 'London' },
			{ name: 'province', value: 'Greater London' },
			{ name: 'postal_code', value: 'SW1W 9TQ' },
		]
	},
	country: 'GB',
	latitude: 35.070374,
	longitude: -106.213648,
	phone: {
		type: 'main',
		value: '123-456-7890'
	},
	category: 'hotel',
})
.writeString();

console.log(data);
```

```xml
<?xml version="1.0"?>
<listings xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.gstatic.com/localfeed/local_feed.xsd">
  <language>en</language>
  <listing>
    <id>123abc</id>
    <name>Belgrave House</name>
    <address format="simple">
      <component name="addr1">6 Acacia Ave</component>
      <component name="addr2">Floor 5</component>
      <component name="city">London</component>
      <component name="province">Greater London</component>
      <component name="postal_code">SW1W 9TQ</component>
    </address>
    <country>GB</country>
    <latitude>35.070374</latitude>
    <longitude>-106.213648</longitude>
    <phone type="main">123-456-7890</phone>
    <category>hotel</category>
  </listing>
</listings>
```
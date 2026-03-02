/* eslint-disable @typescript-eslint/no-explicit-any */

// const configs = require('./configs/stardew').config;
//const fs = require('fs');
const scraper = require('./scraper');
const items = require('./stardew-output').items;

(async () => {
  //console.log('Starting Stardew Scraper with', configs);
  console.log('Scraped Items:', items);
  scraper.validateConfig(items);
})();

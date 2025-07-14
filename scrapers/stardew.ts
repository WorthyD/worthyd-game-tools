/* eslint-disable @typescript-eslint/no-explicit-any */

const configs = require('./configs/stardew').configs;
//const fs = require('fs');
const scraper = require('./scraper');

(async () => {
    const items = await scraper.scrapeItems(configs, false);
  scraper.saveItems(items, configs);
  console.log('Scraped Items:', items);
})();

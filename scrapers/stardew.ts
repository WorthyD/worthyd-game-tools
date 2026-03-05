/* eslint-disable @typescript-eslint/no-explicit-any */

const configs = require('./configs/stardew').config;
//const fs = require('fs');
const scraper = require('./scraper');

(async () => {
  //console.log('Starting Stardew Scraper with', configs);

  const items = await scraper.scrapeItems(configs, false);
  scraper.saveItems(items, configs);
  //console.log('Scraped Items:', items);
  scraper.validateConfig(items);
})();

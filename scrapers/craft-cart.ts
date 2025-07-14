/* eslint-disable @typescript-eslint/no-explicit-any */

const config = require('./configs/craft-cart').config;
const scraper = require('./scraper');

const currentItems =require('../../apps/craft-cart/src/app/catalog/items').items;

(async () => {
  //const items = await scraper.scrapeItems(config);
  //scraper.saveItems(items, config);
  //console.log('Scraped Item Count:', items.length);

  scraper.validateConfig(currentItems);
})();

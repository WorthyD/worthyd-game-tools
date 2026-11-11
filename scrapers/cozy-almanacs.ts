/* eslint-disable @typescript-eslint/no-explicit-any */

const config = require('./configs/cozy-almanacs').config;
const scraper = require('./scraper');

const currentItems =require('../apps/cozy-almanacs/src/app/catalog/items').items;

(async () => {
  //const items = await scraper.scrapeItems(config);
  //scraper.saveItems(items, config);
  //console.log('Scraped Item Count:', items.length);

  scraper.validateConfig(currentItems);
})();

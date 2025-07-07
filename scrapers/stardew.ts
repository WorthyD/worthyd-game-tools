/* eslint-disable @typescript-eslint/no-explicit-any */

const configs = require('./configs/stardew').configs;
//const fs = require('fs');
const scraper = require('./scraper');

(async () => {
  // configs.items.forEach((config: any) => {
  //   axios
  //     .get(config.itemUrl)
  //     .then(async (response: any) => {
  //       const $ = cheerio.load(response.data);
  //       // Scrape the desired information using cheerio
  //       const itemBox = $('#infoboxtable');

  //       const itemName = itemBox.find('tr:eq(0) td').text().trim();
  //       const itemDescription = itemBox.find('tr:eq(2) td').text().trim();
  //       const itemImageUrl = itemBox.find('tr:eq(1) td').find('.image img').attr('src');

  //       // TODO: Setup proper item id
  //       console.log(`Item Name: ${itemName}`);
  //       console.log(`Description: ${itemDescription}`);
  //       console.log(`Image URL: ${itemImageUrl}`);
  //       await downloadImage(
  //         `${configs.baseUrl}${itemImageUrl}`,
  //         `${configs.imagePath}${itemName.replace(/\s+/g, '_')}.png`
  //       );
  //     })
  //     .catch((error: any) => {
  //       console.error(`Error fetching ${config.itemUrl}:`, error);
  //     });
  // });
  const items = await scraper.scrapeItems(configs, false);
  scraper.saveItems(items, configs);
  console.log('Scraped Items:', items);
})();

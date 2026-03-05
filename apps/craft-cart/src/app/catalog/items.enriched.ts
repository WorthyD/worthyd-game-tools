import { items } from './items';

export const getItems = () => {
  const enrichedItems = items;

  const itemsToModify = ['cherry_bomb', 'mega_bomb'];
  
  itemsToModify.forEach(itemId => {
    const item = enrichedItems.find(i => i.id === itemId);
    if (item) {
      // Modify the item here
      item.modified = true;
    }
  });


  return enrichedItems;
}
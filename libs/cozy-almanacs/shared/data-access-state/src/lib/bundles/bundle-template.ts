import { Bundle } from '@cozy-almanacs/models';

/**
 * The starting point for a new bundle. Copy it into a game's `bundles.ts` (or press "New bundle" in the
 * bundle editor at /bundles/config) and delete the fields you don't need. Every field but `id` and `name`
 * is optional.
 */
export const bundleTemplate: Bundle = {
  // Unique across the game's bundles. Saved progress is keyed by it, so avoid renaming it later.
  id: 'new_bundle',
  name: 'New Bundle',
  description: 'What the bundle is, where it is, and what it rewards.',
  imageUrl: './images/new_bundle.png',
  links: [{ text: 'Wiki Link', url: 'https://example.com/wiki/New_Bundle' }],
  // How many items complete the bundle ("any 5 of these 9"). Leave it out to need all of them.
  required: 2,
  items: [
    // A catalog item: everything else comes from the catalog.
    { itemId: 'wood', quantity: 99 },
    // The same catalog item twice needs its own `id`.
    { id: 'wood_2', itemId: 'wood', quantity: 99 },
    // A one-off that isn't in the catalog, like a secret note.
    {
      id: 'secret_note_1',
      name: 'Secret Note #1',
      imageUrl: './images/secret_note.png',
      links: [{ text: 'Wiki Link', url: 'https://example.com/wiki/Secret_Notes#1' }]
    }
  ],
  // Adds every catalog item in these categories / with these tags, e.g. "Recipes cooked".
  itemFilter: { categories: [], tags: [] },
  // Child bundles, e.g. a room's bundles. They use this same shape.
  bundles: []
};

/** Where the player is with one bundle item. Turning an item in also counts as collecting it. */
export interface BundleItemProgress {
  collected?: boolean;
  turnedIn?: boolean;
}

/** A player's progress for one dataset, keyed by `${bundleId}/${itemId}` (see `bundleProgressKey`). */
export type BundleProgress = Record<string, BundleItemProgress | undefined>;

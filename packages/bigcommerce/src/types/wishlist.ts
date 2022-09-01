import * as Core from '@vercel/commerce/types/wishlist'
import { definitions } from '../lib/api/definitions/wishlist'
import type { ProductEdge } from '../lib/api/operations/get-all-products'

export * from '@vercel/commerce/types/wishlist'

export type WishlistItem = NonNullable<
  definitions['wishlist_Full']['items']
>[0] & {
  product?: ProductEdge['node']
}

export type Wishlist = Omit<definitions['wishlist_Full'], 'items'> & {
  items?: WishlistItem[]
}

export type WishlistTypes = {
  wishlist: Wishlist
  itemBody: Core.WishlistItemBody
}

export type WishlistSchema = Core.WishlistSchema<WishlistTypes>
export type GetCustomerWishlistOperation =
  Core.GetCustomerWishlistOperation<WishlistTypes>

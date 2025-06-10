import { startOfMonth } from "date-fns"
import { getUserSubscriptionTier } from "./db/subscription"
import { subscriptionTiers } from "../data/subscrtiptionTiers"
import { getProductCount } from "./product"
import { getUser } from "./auth"
import { getProductViewCount } from "./productsView"

export async function canRemoveBranding() {
 const user = await getUser()
 if(!user) return false
  const tier = await getUserSubscriptionTier(user.id)
  if(!tier) return false
  return subscriptionTiers[tier].canRemoveBranding
}

export async function canCustomizeBanner() {
  const user = await getUser()
 if(!user) return false
  const tier = await getUserSubscriptionTier(user.id)
  if(!tier) return false
  return subscriptionTiers[tier].canCustomizeBanner
}

export async function canAccessAnalytics() {
  const user = await getUser()
 if(!user) return false
  const tier = await getUserSubscriptionTier(user.id)
   if(!tier) return false
  return subscriptionTiers[tier].canAccessAnalytics
}

export async function canCreateProduct() {
  const user = await getUser()
 if(!user) return false
  const tier = await getUserSubscriptionTier(user.id)
   if(!tier) return false
  const productCount = await getProductCount(user.id)
  return productCount < subscriptionTiers[tier].maxNumberOfProducts
}

export async function canShowDiscountBanner(userId: string | null) {
  if (userId == null) return false
  const tier = await getUserSubscriptionTier(userId)
  if(!tier) return false
  const productViews = await getProductViewCount(
    userId,
    startOfMonth(new Date())
  )
  return productViews < subscriptionTiers[tier].maxNumberOfVisits
}
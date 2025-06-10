import { eq } from "drizzle-orm";
import db from "../../index";
import { UserSubscriptionTable } from "../../db/schema";

export async function getUserSubscriptionTier(userId: string) {
 const data = await db.query.UserSubscriptionTable.findFirst({ where : eq(UserSubscriptionTable.userId , userId) , columns : { tier : true}})

 return data?.tier
}
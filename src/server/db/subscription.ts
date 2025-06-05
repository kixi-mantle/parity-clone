import db from "../../index";
import { UserSubscriptionTable } from "../../db/schema";


export function createUserSubscription(data: typeof UserSubscriptionTable.$inferInsert) {
    return db.insert(UserSubscriptionTable).values(data).onConflictDoNothing({
        target: UserSubscriptionTable.userId,
    })

}
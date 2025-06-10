import { and, count, eq, gte } from "drizzle-orm";
import db from "../index";
import { ProductTable, ProductViewTable } from "../db/schema";


export async function getProductViewCount(userId : string , startDate : Date){

const counts = await db
.select({pricingViewCount : count()})
.from(ProductViewTable)
.innerJoin(ProductTable , eq(ProductTable.id , ProductViewTable.productId))
.where(
    and(
        eq(ProductTable.userId , userId),
        gte(ProductViewTable.visitedAt , startDate)
    )
)


  return counts[0]?.pricingViewCount ?? 0
}

export async function createProductView({
  productId , countryId 
} : {
  productId : string 
  countryId? : string
}) {
       
 await db.insert(ProductViewTable).values({
    productId : productId,
    visitedAt : new Date(),
    countryId : countryId
  })

  
}
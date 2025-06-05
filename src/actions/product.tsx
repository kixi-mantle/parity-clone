import { eq } from "drizzle-orm"
import db from "../index"
import { ProductTable } from "../db/schema"


export async function getProducts(userId : string){
    
    const products = await db.query.ProductTable.findMany({where : eq(ProductTable.userId , userId)})

    return products
}
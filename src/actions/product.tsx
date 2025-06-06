"use server"

import { eq } from "drizzle-orm"
import db from "../index"
import { ProductCustomizationTable, ProductTable } from "../db/schema"
import { productDetailsSchema } from "../schemaType"
import { getUser } from "./auth"
import { z } from "zod"
import { redirect } from "next/navigation"


export async function getProducts(userId : string){
    
    const products = await db.query.ProductTable.findMany({where : eq(ProductTable.userId , userId)})

    return products
}

export async function CreateProducts(rawData : z.infer<typeof productDetailsSchema>) : Promise<{error : boolean ; message : string} | undefined> {
     
    const user = await getUser()
    const {data , success} = productDetailsSchema.safeParse(rawData)

    if(!success || !user){
        return {error : true , message : "There was an error creating your product" }
    }

    const [newProduct] = await db.insert(ProductTable).values({...data , userId :  user.id}).returning({ id : ProductTable.id })

    try {
        await db.insert(ProductCustomizationTable).values({productId : newProduct.id}).onConflictDoNothing({
            target : ProductCustomizationTable.productId
        })
    } catch  {
        await db.delete(ProductTable).where(eq(ProductTable.id , newProduct.id))
    }

     redirect(`/dashboard/products/${newProduct.id}/edit?tab=countries`)

}

export async function deleteProducts(id:string) {

    try {
        
        const user = await getUser()
        if(!user) return {error : true , message : "There was an error deleting your product" }
        
        const product = await db.query.ProductTable.findFirst({where : eq(ProductTable.id , id)})
        if(product?.userId == id) return {error : true , message : "Unauthorized action" }
        await db.delete(ProductTable).where(eq(ProductTable.id , id))
        return {error : false , message : "Product deleted successfully" }

    } catch  {
        return {error : true , message : `Internal server error` }
    }


}

export async function updateProduct(id : string , rawData : z.infer<typeof productDetailsSchema>){

try {
    
    const {data , success} = productDetailsSchema.safeParse(rawData) 
    if(!success ){
    return {error : true , message : "There was an error updating your product" }
    }
    await db.update(ProductTable).set(data).where(eq(ProductTable.id , id))
} catch  {
    return {error : true , message : "There was an error updating your product" }
 
    
}


     
}
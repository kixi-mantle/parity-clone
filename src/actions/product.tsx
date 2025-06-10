"use server"

import {  and, eq, inArray, sql, SQLWrapper } from "drizzle-orm"
import db from "../index"
import { CountryGroupDiscountTable, CountryTable, ProductCustomizationTable, ProductTable } from "../db/schema"
import { productCountryDiscountsSchema, productCustomizationSchema, productDetailsSchema } from "../schemaType"
import { getUser } from "./auth"
import { z } from "zod"
import { redirect } from "next/navigation"
import { canCustomizeBanner } from "./permission"


export async function getProducts(userId : string){
    
    const products = await db.query.ProductTable.findMany({where : eq(ProductTable.userId , userId)})

    return products
}
export async function getProduct(productId : string){
    
    const products = await db.query.ProductTable.findFirst({where : eq(ProductTable.id , productId)})

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

export async function getProductCountryGroups({  productId} : {  productId : string}){
    const product = await db.query.ProductTable.findFirst({where : eq(ProductTable.id , productId)})
    if (product == null) return []

    const data = await db.query.CountryGroupTable.findMany({
        with : {
            countries : {
                columns : {
                    name : true,
                    code : true,
                },
            },
            countryGroupDiscounts : {
                columns: {
                    coupon:true,
                    discountPercentage : true
                },
                where : eq(CountryGroupDiscountTable.productId , productId),
                limit : 1
            }
        }
    })
    
    return data.map(group => {
        return {
            id : group.id,
            name : group.name,
            recommendedDiscountPercentage : group.recommendedDiscountPercentage,
            countries : group.countries,
            discount : group.countryGroupDiscounts.at(0),
        }
    })

}


export async function updateCountryDiscounts(
    id : string , 
    unsafeData : z.infer<typeof productCountryDiscountsSchema>
){
        const {data , success} = productCountryDiscountsSchema.safeParse(unsafeData)
        
        if(!success){
            return {error : true , message:"There was an error creating your product"}
        }

        const insert: {
            countryGroupId : string 
            productId : string
            coupon : string 
            discountPercentage : number
        }[] = []
        const deleteIds : {countryGroupId : string }[] = []

        data.groups.forEach(group =>{
            if(
                group.coupon != null &&
                group.coupon.length > 0 &&
                group.discountPercentage != null &&
                group.discountPercentage > 0
            ) {
                insert.push({
                    countryGroupId : group.countryGroupId,
                    coupon : group.coupon,
                    discountPercentage : group.discountPercentage / 100,
                    productId : id,
                })
            }else {
                deleteIds.push({ countryGroupId : group.countryGroupId})
            }
        })

      const statements : SQLWrapper[] = []
      if ( deleteIds.length > 0){
        statements.push(db.delete(CountryGroupDiscountTable).where(
            and(
                eq(CountryGroupDiscountTable.productId , id),
                inArray(
                    CountryGroupDiscountTable.countryGroupId , 
                    deleteIds.map(group => group.countryGroupId)
                )
            )
        ))
      }  

        if(insert.length > 0 ) {
            statements.push(
                db.insert(CountryGroupDiscountTable).values(insert).onConflictDoUpdate({
                    target : [
                        CountryGroupDiscountTable.productId,
                        CountryGroupDiscountTable.countryGroupId,
                    ],
                    set : {
                        coupon : sql.raw(
                            `excluded.${CountryGroupDiscountTable.coupon.name}`
                        ),
                        discountPercentage : sql.raw(
                            `excluded.${CountryGroupDiscountTable.discountPercentage.name}`
                        ),
                    }

                })

            )
        }

        await db.transaction(async (tsx)=>{
            for(const stmt of statements){
                await tsx.execute(stmt)
            }
        })

        return { error : false , message : "Country discounts saved"}
}

export async function getProductCustomization({
    productId
} : {
    productId : string 
}){
       const data = await db.query.ProductTable.findFirst({
        where : eq(ProductTable.id , productId),
        with : {
            ProductCustomizable : true
        }
       }) 

       return data?.ProductCustomizable
}

export async function getProductCount( userId : string) {
    const res = await db.execute(
        sql`select count(*) from ${ProductTable} where ${eq(ProductTable.userId , userId)}`
    )
     const count = Number(res.rows[0].count);
    return count
}

export async function updateProductCustomization(
    productId : string  , rawData : z.infer<typeof productCustomizationSchema>
){
const user = getUser()
const {success , data} = productCustomizationSchema.safeParse(rawData)
const canCustomize = await canCustomizeBanner()

  if(!success || !user || !canCustomize){
    return {
        error : true,
        message : "There was an error updating your banner",
    }
  }

    await db.update(ProductCustomizationTable).set(data).where(eq(ProductCustomizationTable.productId , productId))
    return { error : false , message : "Banner updated"}
}

export async function getProductForBanner({
    id , countryCode , url
} : {
    id : string , 
    countryCode : string ,
    url : string
}) {
    const data = await db.query.ProductTable.findFirst({
        where : and(eq(ProductTable.id , id),eq(ProductTable.url , url)),
        columns : {
            id: true,
            userId : true
        },
        with : {
            ProductCustomizable : true , 
            countryGroupDiscounts : {
                columns : {
                    coupon : true , 
                    discountPercentage : true
                },
                with : {
                    countryGroup : {
                        columns : {},
                        with : {
                            countries : {
                                columns : {
                                    id : true ,
                                    name : true
                                }, limit : 1,
                                where : eq(CountryTable.code , countryCode)
                            }
                        }
                    }
                }
            }
        }
    })

    const discount = data?.countryGroupDiscounts.find(discount => discount.countryGroup.countries.length > 0 )
    const country = discount?.countryGroup.countries[0]
    const product = data == null || data.ProductCustomizable == null  ? undefined : {
        id : data.id,
        userId : data.userId,
        customization : data.ProductCustomizable
    }
   

    return {
        product ,
        country , 
        discount : discount == null ? undefined : {
            coupon : discount.coupon , 
            percentage : discount.discountPercentage
        }
    } 

}




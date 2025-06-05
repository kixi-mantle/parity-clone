"use server"

import { cookies } from "next/headers";
import { UserTable } from "../db/schema";
import db from "../index";
import { eq } from "drizzle-orm";
import { eventHandler } from "./event";


export const signin = async(username : string) => {

    try {
        
        if(!username) return {success : false};
         const user = await db.query.UserTable.findFirst({where : eq(UserTable.name , username)})
         if(!user) return {success : false , msg: "user doesnt exist"}
        
        await setCookie(user.id)

        return {success : true}
    } catch (error) {
        console.error(error)
        return {success : false , msg : "Internal error"}
    }
}


export const setCookie = async(id : string)=>{
    try {
        
        const cookieStore = await cookies();
        cookieStore.set("user_id" , id)
        
    } catch (error) {
        return error
    }
}

export const signup = async(username : string) => {

    try {
        
        if(!username) return {success : false};
        const user = await db.query.UserTable.findFirst({where : eq(UserTable.name , username)})
        if(user) return {success: false , msg: "user already exist"}
       const [newUser] = await db.insert(UserTable).values({name : username}).returning()

        const res = await eventHandler({type : "user.created" , data : { id : newUser.id}})
        if(!res.success){
            console.error("failed to perform the event")
        }

        await setCookie(newUser.id)

        return {success : true}
    } catch (error) {
        console.error(error)
        return {success : false}
    }
}

export const getUser = async()=>{

    const cookieStore = await cookies();
    const userId  =  cookieStore.get("user_id")?.value
    if(!userId) return null
    const user = await db.query.UserTable.findFirst({where : eq(UserTable.id , userId)})

    return user as {id: string , name : string}

}
import { UserSubscriptionTable } from "../db/schema";
import db from "../index";


type UserCreatedEvent = {
  type: "user.created";
  data: {
    id: string;
  };
};

type Event = UserCreatedEvent


export async function eventHandler(event : Event) {



    switch(event.type) {
        case "user.created" : {
               await db.insert(UserSubscriptionTable).values({
                userId : event.data.id , 
                tier : "Free"
               })
               return {sucess: true}
               break;
        }
    }

    return { success : false}
}
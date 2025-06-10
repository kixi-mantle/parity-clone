import { redirect } from "next/navigation";
import { getUser } from "../../../actions/auth";
import { getUserSubscriptionTier } from "../../../actions/db/subscription";
import { getProductCount } from "../../../actions/product";
import { getProductViewCount } from "../../../actions/productsView";
import { startOfMonth } from "date-fns";
import { Button } from "../../../components/ui/button"; 
import {
  Card,
  CardContent,
  CardDescription,
  
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

import { subscriptionTiers  } from "../../../data/subscrtiptionTiers";

import { formatCompactNumber } from "../../../lib/formatters";
import { Progress } from "../../../components/ui/progress";



export default async function Subscription(){
    
    const user = await getUser()
    if(!user)  redirect("/signin")
    const res = await getUserSubscriptionTier(user.id)
    const tier= subscriptionTiers[res!] 
    const productCount = await getProductCount(user.id)
    const pricingViewCount = await getProductViewCount(
       user.id , startOfMonth(new Date())
    )
   return  <>
      <h1 className="mb-6 text-3xl font-semibold">Your Subscription</h1>
      <div className="flex flex-col gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Usage</CardTitle>
              <CardDescription>
                {formatCompactNumber(pricingViewCount)} /{" "}
                {formatCompactNumber(tier.maxNumberOfVisits)} pricing page
                visits this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(pricingViewCount / tier.maxNumberOfVisits) * 100}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Number of Products</CardTitle>
              <CardDescription>
                {productCount} / {tier.maxNumberOfProducts} products created
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(productCount / tier.maxNumberOfProducts) * 100}
              />
            </CardContent>
          </Card>
        </div>
        {tier != subscriptionTiers.Free && (
          <Card>
            <CardHeader>
              <CardTitle>You are currently on the {tier.name} plan</CardTitle>
              <CardDescription>
                If you would like to upgrade, cancel, or change your payment
                method use the button below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={undefined}>
                <Button
                  variant="accent"
                  className="text-lg rounded-lg"
                  size="lg"
                >
                  Manage Subscription
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

    </>


    }
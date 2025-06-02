import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { subscriptionTiersInOrder } from "../../data/subscrtiptionTiers"

import { Card ,CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../components/ui/card";
import { cn } from "../../lib/utils";
import { formatCompactNumber } from "../../lib/formatters";
import { ReactNode } from "react";
import Link from "next/link";

export default function Page(){

  return(
    <>
    <section className="min-h-screen  bg-[radial-gradient(hsl(0,72%,65%,40%),hsl(24,62%,73%,40%),hsl(220,15%,95%)_60%)] flex items-center justify-center text-center text-balance flex-col gap-8 px-4">
       <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight m-4">
          Price Smarter, Sell bigger!
        </h1>
        <p className="text-lg lg:text-3xl max-w-screen-xl">
          Optimize your product pricing across countries to maximize sales.
          Capture 85% of the untapped market with location-based dynamic pricing
        </p>
        
          <Button className="text-lg p-6 rounded-xl flex gap-2">
            <Link href={'/dashboard'} className="flex items-center">Get started for free <ArrowRightIcon className="size-5 ml-1" /></Link>
            
          </Button>
        
       
       </section>
       <section id="pricing" className=" px-8 py-16 bg-accent/5">
        <h2 className="text-4xl text-center text-balance font-semibold mb-8">
          Pricing software which pays for itself 20x over
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
          {subscriptionTiersInOrder.map(tier => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
      </section>
      </>
  )
}

function PricingCard({
  name,
  priceInCents,
  maxNumberOfVisits,
  maxNumberOfProducts,
  canRemoveBranding,
  canAccessAnalytics,
  canCustomizeBanner,
}: (typeof subscriptionTiersInOrder)[number]) {
  const isMostPopular = name === "Standard"

  return (
    <Card
      className={cn(
        "relative shadow    border-2 rounded-3xl  overflow-hidden",
        isMostPopular ? "border-black border-2" : "border-gray-300"
      )}
    >
      {isMostPopular && (
        <div className="bg-accent text-primary-foreground absolute py-1 px-10 -right-8 top-24 rotate-45 origin-top-right">
          Most popular
        </div>
      )}
      <CardHeader>
        <div className="text-gray-400 font-semibold mb-8">{name}</div>
        <CardTitle className="text-xl font-bold">
          ${priceInCents / 100} /mo
        </CardTitle>
        <CardDescription>
          {formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo
        </CardDescription>
      </CardHeader>
      <CardContent>
        
          <Button
            className="text-lg w-full rounded-lg"
            variant={isMostPopular ? "accent" : "default"}
          >
            Get Started
          </Button>
        
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-bold">
          {maxNumberOfProducts}{" "}
          {maxNumberOfProducts === 1 ? "product" : "products"}
        </Feature>
        <Feature>PPP discounts</Feature>
        {canAccessAnalytics && <Feature>Advanced analytics</Feature>}
        {canRemoveBranding && <Feature>Remove Easy PPP branding</Feature>}
        {canCustomizeBanner && <Feature>Banner customization</Feature>}
      </CardFooter>
    </Card>
  )
}


function Feature( {children , className} : { children : ReactNode , className? : string}){
   
  return <div className={cn("flex items-center gap-2",className)}>
    <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5"/>
    <span>{children}</span>
  </div>
}
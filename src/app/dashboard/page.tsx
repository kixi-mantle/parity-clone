import { redirect } from "next/navigation"
import { getUser } from "../../actions/auth"
import { getProducts } from "../../actions/product"
import Link from "next/link"
import { ArrowRightIcon, PlusIcon } from "lucide-react"
import { Button } from "../../components/ui/button"
import { NoProducts } from "./_components/NoProducts"


export default async function Page(){

    const user = await getUser()
    if(!user) redirect("/sign-in")
        const products = await getProducts(user.id)

    if (products.length === 0 ) return <NoProducts/>
      

    
    return <>
      <h2 className="mb-6 text-3xl font-semibold flex justify-between">
        <Link
          className="group flex gap-2 items-center hover:underline"
          href="/dashboard/products"
        >
          Products
          <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <PlusIcon className="size-4 mr-2" />
            New Product
          </Link>
        </Button>
      </h2>
      {/* <ProductGrid products={products} /> */}
      <h2 className="mb-6 text-3xl font-semibold flex justify-between mt-12">
        <Link
          href="/dashboard/analytics"
          className="flex gap-2 items-center hover:underline group"
        >
          Analytics
          <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </h2>
      {/* <HasPermission permission={canAccessAnalytics} renderFallback>
        <AnalyticsChart userId={userId} />
      </HasPermission> */}
    </>
}
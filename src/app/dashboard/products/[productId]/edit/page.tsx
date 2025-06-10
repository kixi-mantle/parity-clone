
import { PageWithBackButton } from "@/app/dashboard/_components/PageWithBackButton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { notFound } from "next/navigation"
import { getProduct, getProductCountryGroups, getProductCustomization } from "../../../../../actions/product"
import { ProductDetailsForm } from "../../../_components/forms/ProductDetailForm"
import { CountryDiscountsForm } from "../../../_components/forms/CountryDiscountForm"
import { canCustomizeBanner, canRemoveBranding } from "../../../../../actions/permission"
import { ProductCustomizationForm } from "../../../_components/forms/ProductCustomizationForm"

export default async function EditProductPage({
  params,
  searchParams: { tab = "details" },
}: {
  params: { productId: string }
  searchParams: { tab?: string }
}) {

     const {productId} = params
  const product = await getProduct(productId)
  if (product == null) return notFound()

  return (
    <PageWithBackButton
      backButtonHref="/dashboard/products"
      pageTitle="Edit Product"
    >
      <Tabs defaultValue={tab}>
        <TabsList className="bg-background/60">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="countries">Country</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <DetailsTab product={product} />
        </TabsContent>
        <TabsContent value="countries">
          <CountryTab productId={productId}  />
        </TabsContent>
        <TabsContent value="customization">
          <CustomizationsTab productId={productId}  />
        </TabsContent>
      </Tabs>
    </PageWithBackButton>
  )
}

function DetailsTab({
  product,
}: {
  product: {
    id: string
    name: string
    description: string | null
    url: string
  }
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductDetailsForm product={product} />
      </CardContent>
    </Card>
  )
}

async function CountryTab({
  productId,
  
}: {
  productId: string
 
}) {
  const countryGroups = await getProductCountryGroups({
    productId,
    
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Country Discounts</CardTitle>
        <CardDescription>
          Leave the discount field blank if you do not want to display deals for
          any specific parity group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountryDiscountsForm
          productId={productId}
          countryGroups={countryGroups}
        />
      </CardContent>
    </Card>
  )
}

async function CustomizationsTab({
  productId,
  
}: {
  productId: string
  
}) {
  const customization = await getProductCustomization({ productId })

  if (customization == null) return notFound()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Banner Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductCustomizationForm
          canRemoveBranding={await canRemoveBranding()}
          canCustomizeBanner={await canCustomizeBanner()}
          customization={customization}
        />
      </CardContent>
    </Card>
  )
}
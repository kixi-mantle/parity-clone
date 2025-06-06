import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { ProductDetailsForm } from "../../_components/forms/ProductDetailForm";
import { PageWithBackButton } from "../../_components/PageWithBackButton";


export default function NewProductPage() {
  return (
    <PageWithBackButton
      pageTitle="Create Product"
      backButtonHref="/dashboard/products"
    >
      
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDetailsForm />
          </CardContent>
        </Card>
     
    </PageWithBackButton>
  )
}
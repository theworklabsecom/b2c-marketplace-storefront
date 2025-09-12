import NotFound from "@/app/not-found"
import { Breadcrumbs } from "@/components/atoms"
import { ProductListingSkeleton } from "@/components/organisms/ProductListingSkeleton/ProductListingSkeleton"
import { AlgoliaProductsListing, ProductListing } from "@/components/sections"
import { getCollectionByHandle } from "@/lib/data/collections"
import isBot from "@/lib/helpers/isBot"
import { Suspense } from "react"
import { headers } from "next/headers"

const ALGOLIA_ID = process.env.NEXT_PUBLIC_ALGOLIA_ID
const ALGOLIA_SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY

const SingleCollectionsPage = async ({
  params,
}: {
  params: Promise<{ handle: string; locale: string }>
}) => {
  const { handle, locale } = await params

  const userAgent = headers().get("user-agent") || ""
  const bot = isBot(userAgent)
  const collection = await getCollectionByHandle(handle)
  if (!collection) return <NotFound />

  const breadcrumbsItems = [
    {
      path: collection.handle,
      label: collection.title,
    },
  ]

  return (
    <main className="container">
      <div className="hidden md:block mb-2">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      <h1 className="heading-xl uppercase">{collection.title}</h1>

      <Suspense fallback={<ProductListingSkeleton />}>
        {bot || !ALGOLIA_ID || !ALGOLIA_SEARCH_KEY ? (
          <>
        {console.log("Rendering ProductListing")}
        <ProductListing collection_id={collection.id} showSidebar />
          </>
        ) : (
          <>
        {console.log("Rendering AlgoliaProductsListing")}
        <AlgoliaProductsListing
          collection_id={collection.id}
          locale={locale}
        />
          </>
        )}
      </Suspense>
    </main>
  )
}

export default SingleCollectionsPage

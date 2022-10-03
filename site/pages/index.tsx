import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Marquee, Hero } from '@components/ui'
// import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { createClient } from 'next-sanity'
import { Key, ReactChild, ReactFragment, ReactPortal } from 'react'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { first: 6 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  // contentful
  const contentful = require('contentful')

  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE,
    // environment: '<environment_id>', // defaults to 'master' if not set
    accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
  })

  const entry = await client.getEntry('w4pLeCcf4WroJgGZEVoDd')
  // end contenful

  // sanity
  const sanityClient = createClient({
    projectId: '46g9kq0b',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2022-10-03',
  })
  const animals = await sanityClient.fetch(`*[_type == "animal"]`)
  // end sanity

  return {
    props: {
      products,
      categories,
      brands,
      pages,
      entry,
      animals,
    },
    revalidate: 60,
  }
}

export default function Home({
  products,
  entry,
  animals,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { text, title } = entry.fields
  return (
    <>
      <Grid variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
              priority: true,
            }}
          />
        ))}
      </Grid>
      <Marquee variant="secondary">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>
      <Hero
        // headline="Welcome to the Store!"
        headline={title}
        // description="Cupcake ipsum dolor sit amet lemon drops pastry cotton candy. Sweet carrot cake macaroon bonbon croissant fruitcake jujubes macaroon oat cake. Soufflé bonbon caramels jelly beans. Tiramisu sweet roll cheesecake pie carrot cake. "
        description={text}
      />
      <Grid layout="B" variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
        ))}
      </Grid>
      <Marquee>
        {products.slice(3).map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>
      {/* <HomeAllProductsGrid
        newestProducts={products}
        categories={categories}
        brands={brands}
      /> */}
      <div>
        <h2>Animals</h2>
        {animals.length > 0 && (
          <ul>
            {animals.map(
              (animal: {
                _id: Key | null | undefined
                name:
                  | boolean
                  | ReactChild
                  | ReactFragment
                  | ReactPortal
                  | null
                  | undefined
              }) => (
                <li key={animal._id}>{animal?.name}</li>
              )
            )}
          </ul>
        )}
        {animals.length == 0 && <p>No animals to show</p>}
        {animals.length > 0 && (
          <div>
            <pre>{JSON.stringify(animals, null, 2)}</pre>
          </div>
        )}
        {animals.length == 0 && (
          <div>
            <div>¯\_(ツ)_/¯</div>
            <p>
              Your data will show up here when you've configured everything
              correctly
            </p>
          </div>
        )}
      </div>
    </>
  )
}

Home.Layout = Layout

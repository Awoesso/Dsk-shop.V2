import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product, Category } from '../../types';
import { toFCFA } from '../../utils/currency';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  canonicalUrl?: string;
  keywords?: string[];
  product?: Product;
  category?: Category;
  breadcrumbs?: BreadcrumbItem[];
  noindex?: boolean;
}

const DEFAULT_TITLE = 'DSK-Shop | Boutique Tech & Lifestyle Premium à Lomé, Togo';
const DEFAULT_DESCRIPTION =
  'Boutique en ligne DSK-Shop à Lomé, Togo : casques audio haute fidélité, matériel informatique, accessoires connectés et lifestyle. Livraison rapide, paiement sécurisé et garantie 2 ans.';
const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80';
const SITE_NAME = 'DSK-Shop';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = 'website',
  canonicalUrl,
  keywords,
  product,
  category,
  breadcrumbs,
  noindex = false,
}) => {
  // Format title with site branding
  const fullTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : DEFAULT_TITLE;

  // Resolve current URL dynamically
  const pageUrl =
    canonicalUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://dsk-shop.com');

  // Build JSON-LD structured data
  const structuredDataList: object[] = [];

  // Breadcrumbs Schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    structuredDataList.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http')
          ? crumb.url
          : typeof window !== 'undefined'
          ? `${window.location.origin}${crumb.url}`
          : `https://dsk-shop.com${crumb.url}`,
      })),
    });
  }

  // Product Schema
  if (product) {
    const fcfaPrice = toFCFA(product.price);
    const productSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images,
      description: product.description,
      sku: product.id,
      mpn: product.id,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      category: product.category,
      offers: {
        '@type': 'Offer',
        url: pageUrl,
        priceCurrency: 'XOF',
        price: fcfaPrice,
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
      },
    };

    if (product.rating) {
      productSchema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: Math.max(1, product.reviewCount || product.reviews?.length || 1),
        bestRating: 5,
        worstRating: 1,
      };
    }

    if (product.reviews && product.reviews.length > 0) {
      productSchema.review = product.reviews.map((r) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: r.author,
        },
        datePublished: r.date,
        reviewBody: r.comment,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
      }));
    }

    structuredDataList.push(productSchema);
  }

  // Category Schema
  if (category && !product) {
    structuredDataList.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.name} - DSK-Shop`,
      description: category.description,
      url: pageUrl,
    });
  }

  // General Store Schema for website type
  if (type === 'website' && !product && !category) {
    structuredDataList.push({
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      name: SITE_NAME,
      url: pageUrl,
      logo: DEFAULT_IMAGE,
      description: DEFAULT_DESCRIPTION,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lomé',
        addressCountry: 'TG',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${pageUrl}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph Tags for Social Sharing */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title || SITE_NAME} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={product ? 'product' : type} />

      {/* Product Specific OpenGraph Tags */}
      {product && (
        <>
          <meta property="product:price:amount" content={String(toFCFA(product.price))} />
          <meta property="product:price:currency" content="XOF" />
          <meta
            property="product:availability"
            content={product.inStock ? 'instock' : 'outofstock'}
          />
          <meta property="product:brand" content={product.brand} />
          <meta property="product:category" content={product.category} />
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title || SITE_NAME} />

      {/* JSON-LD Structured Data */}
      {structuredDataList.map((schema, index) => (
        <script key={`json-ld-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;

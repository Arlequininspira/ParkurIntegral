import { Helmet } from 'react-helmet-async'

const DESCRIPTION =
  'Somos la Escuela Integral de Parkour! y nuestro propósito es lograr tu evolución personal desde la práctica física. Con más de 20 años de experiencia te garantizamos una práctica segura, donde tu integridad física va a ser respetada al 100% para que logres vivir una experiencia única de auto superación de manera agradable y divertida. Parkour es el arte de superarse a uno mismo, desde el movimiento generamos superación no solo en la práctica física sino también en la vida cotidiana.'

const OG_IMAGE =
  'https://parkourintegral.com/wp-content/uploads/2021/01/Escudo-Parkour-blanco-fondo-negro-01-1024x1024.png'

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://parkourintegral.com/',
      url: 'https://parkourintegral.com/',
      name: 'Parkour integral Buenos Aires, Argentina',
      isPartOf: { '@id': 'https://parkourintegral.com/#website' },
      about: { '@id': 'https://parkourintegral.com/#organization' },
      primaryImageOfPage: { '@id': 'https://parkourintegral.com/#primaryimage' },
      image: { '@id': 'https://parkourintegral.com/#primaryimage' },
      thumbnailUrl:
        'https://parkourintegral.com/wp-content/uploads/2021/01/Escudo-Parkour-blanco-fondo-negro-01-1024x1024.png',
      datePublished: '2021-01-27T18:08:00+00:00',
      dateModified: '2024-05-12T05:14:16+00:00',
      description: DESCRIPTION,
      breadcrumb: { '@id': 'https://parkourintegral.com/#breadcrumb' },
      inLanguage: 'es',
      potentialAction: [
        { '@type': 'ReadAction', target: ['https://parkourintegral.com/'] },
      ],
    },
    {
      '@type': 'ImageObject',
      inLanguage: 'es',
      '@id': 'https://parkourintegral.com/#primaryimage',
      url: 'https://parkourintegral.com/wp-content/uploads/2021/01/Escudo-Parkour-blanco-fondo-negro-01.png',
      contentUrl:
        'https://parkourintegral.com/wp-content/uploads/2021/01/Escudo-Parkour-blanco-fondo-negro-01.png',
      width: 1773,
      height: 1773,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://parkourintegral.com/#breadcrumb',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Portada' }],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://parkourintegral.com/#website',
      url: 'https://parkourintegral.com/',
      name: 'Parkour integral',
      description: 'Buenos Aires, Argentina',
      publisher: { '@id': 'https://parkourintegral.com/#organization' },
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://parkourintegral.com/?s={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      ],
      inLanguage: 'es',
    },
    {
      '@type': 'Organization',
      '@id': 'https://parkourintegral.com/#organization',
      name: 'Parkour Integral',
      url: 'https://parkourintegral.com/',
      logo: {
        '@type': 'ImageObject',
        inLanguage: 'es',
        '@id': 'https://parkourintegral.com/#/schema/logo/image/',
        url: 'https://parkourintegral.com/wp-content/uploads/2021/01/Escudo-Parkour-blanco-fondo-negro-01.png',
        contentUrl:
          'https://parkourintegral.com/wp-content/uploads/2021/01/Escudo-Parkour-blanco-fondo-negro-01.png',
        width: 1773,
        height: 1773,
        caption: 'Parkour Integral',
      },
      image: { '@id': 'https://parkourintegral.com/#/schema/logo/image/' },
      sameAs: [
        'https://www.facebook.com/Escuela-Integral-de-Parkour-Buenos-Aires-1579156352315583',
        'https://www.instagram.com/parkourintegral/',
      ],
    },
  ],
}

export default function SEO() {
  return (
    <Helmet>
      <title>Parkour integral Buenos Aires, Argentina</title>
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href="https://parkourintegral.com/" />
      <meta property="og:locale" content="es_ES" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Parkour integral Buenos Aires, Argentina" />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:url" content="https://parkourintegral.com/" />
      <meta property="og:site_name" content="Parkour integral" />
      <meta
        property="article:publisher"
        content="https://www.facebook.com/Escuela-Integral-de-Parkour-Buenos-Aires-1579156352315583"
      />
      <meta property="article:modified_time" content="2024-05-12T05:14:16+00:00" />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

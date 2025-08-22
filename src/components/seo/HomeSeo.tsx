// src/components/seo/HomeSeo.tsx
"use client";

import Head from "next/head";

export default function HomeSeo() {
  const title = "NIMC Front-End Partner - Digital Identity Solutions";
  const description = "Jubilee Care ICT Innovative Consult - Official NIMC Front-End Partner providing secure digital identity services and ICT solutions across Nigeria.";
  const url = "https://jcic.vercel.app";
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="NIMC, NIN enrollment, digital identity, ICT training, Nigeria, NIMC FEP, Front-End Partner" />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
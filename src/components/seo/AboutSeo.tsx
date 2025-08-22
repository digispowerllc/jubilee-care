// src/components/seo/AboutSeo.tsx
"use client";

import Head from "next/head";

export default function AboutSeo() {
  const title = "About Us - Jubilee Care ICT Innovative Consult";
  const description = "Learn about Jubilee Care ICT Innovative Consult, an official NIMC Front-End Partner dedicated to digital identity solutions and ICT innovation in Nigeria.";
  const url = "https://jcic.vercel.app/about";
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="about Jubilee Care, NIMC partner, ICT consultancy, digital identity Nigeria, our story" />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
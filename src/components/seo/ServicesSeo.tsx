// src/components/seo/ServicesSeo.tsx
"use client";

import Head from "next/head";

export default function ServicesSeo() {
  const title = "Our Services - NIN Enrollment & ICT Solutions";
  const description = "Comprehensive NIMC services including NIN enrollment, verification, ICT training, and digital consultancy services across Nigeria.";
  const url = "https://jcic.vercel.app/services";
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="NIN services, verification, ICT training, digital consultancy, NIMC services, enrollment centers" />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
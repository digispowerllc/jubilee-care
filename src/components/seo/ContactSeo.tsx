// src/components/seo/ContactSeo.tsx
"use client";

import Head from "next/head";

export default function ContactSeo() {
  const title = "Contact Us - Get in Touch";
  const description = "Contact Jubilee Care ICT Innovative Consult for NIMC services, NIN enrollment, verification, and ICT solutions. We're here to help you.";
  const url = "https://jcic.vercel.app/contact";
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="contact Jubilee Care, NIMC support, help center, customer service, get in touch" />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
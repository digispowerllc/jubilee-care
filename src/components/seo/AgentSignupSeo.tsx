// src/components/seo/AgentSignupSeo.tsx
"use client";

import Head from "next/head";

export default function AgentSignupSeo() {
  const title = "Become a NIMC Agent - Join Jubilee Care";
  const description =
    "Register as a certified NIMC Front-End Partner agent with Jubilee Care. Start offering NIN enrollment and verification services in your community.";
  const url = "https://jcic.vercel.app/agent/signup";

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="NIMC agent registration, become NIN agent, Jubilee Care signup, agent onboarding, NIMC FEP partner, agent application"
      />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description: description,
            url: url,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://jcic.vercel.app",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Agent Signup",
                  item: url,
                },
              ],
            },
          }),
        }}
      />
    </Head>
  );
}

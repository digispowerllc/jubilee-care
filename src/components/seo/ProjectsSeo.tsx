// src/components/seo/ProjectsSeo.tsx (Enhanced version)
"use client";

import Head from "next/head";

interface ProjectsSeoProps {
  projectTitle?: string;
  projectDescription?: string;
  projectImage?: string;
  publishedDate?: string;
}

export default function ProjectsSeo({
  projectTitle,
  projectDescription,
  projectImage,
  publishedDate,
}: ProjectsSeoProps = {}) {
  const isSingleProject = !!projectTitle;
  const baseUrl = "https://jcic.vercel.app";

  const title = isSingleProject
    ? `${projectTitle} - Jubilee Care Project`
    : "Our Projects - ICT Initiatives & Community Impact";

  const description = isSingleProject
    ? projectDescription
    : "Explore Jubilee Care's impactful projects in digital identity, ICT training, and community development initiatives across Nigeria as an NIMC Front-End Partner.";

  const url = isSingleProject
    ? `${baseUrl}/projects/${projectTitle?.toLowerCase().replace(/\s+/g, "-")}`
    : `${baseUrl}/projects`;

  const image = projectImage || `${baseUrl}/projects-og-image.jpg`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="ICT projects, community development, digital inclusion, NIMC initiatives, technology projects, Nigeria ICT, impact stories"
      />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {publishedDate && (
        <meta property="article:published_time" content={publishedDate} />
      )}

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            isSingleProject
              ? {
                  "@context": "https://schema.org",
                  "@type": "CreativeWork",
                  name: projectTitle,
                  description: projectDescription,
                  url: url,
                  image: image,
                  datePublished: publishedDate,
                  publisher: {
                    "@type": "Organization",
                    name: "Jubilee Care ICT Innovative Consult",
                    logo: {
                      "@type": "ImageObject",
                      url: `${baseUrl}/logo.png`,
                    },
                  },
                }
              : {
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  name: "Jubilee Care ICT Projects",
                  description:
                    "Digital identity and ICT development projects across Nigeria",
                  url: url,
                  numberOfItems: 5,
                }
          ),
        }}
      />
    </Head>
  );
}

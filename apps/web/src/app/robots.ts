import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/user/", "/checkout/"],
    },
    sitemap: "https://ansania.com/sitemap.xml",
  };
}

const nextConfig = {
  ...(process.env.NODE_ENV === "development" ? {} : { output: "export" }),
  trailingSlash: true,
  ...(process.env.NODE_ENV === "development"
    ? {
        async rewrites() {
          return [
            {
              source: "/api/contact/:path*",
              destination: "http://127.0.0.1:8787/api/contact/:path*",
            },
          ];
        },
      }
    : {}),
};
export default nextConfig;

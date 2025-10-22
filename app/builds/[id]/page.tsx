// app/builds/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function BuildPreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const build = await prisma.build.findUnique({ where: { id } });
  if (!build) return notFound();

  const html = build.html.replace(/`/g, "\\`");
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Preview — Time-Travel Lab</title>
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.open(); document.write(\`${html}\`); document.close();`,
          }}
        />
      </body>
    </html>
  );
}


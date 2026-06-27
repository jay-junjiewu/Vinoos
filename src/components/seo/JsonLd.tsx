/**
 * Renders one or more JSON-LD structured-data blocks.
 * Search engines parse these <script type="application/ld+json"> tags to
 * understand the business, breadcrumbs and content listings.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}

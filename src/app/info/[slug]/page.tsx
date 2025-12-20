import { getPageContent } from '@/lib/info-pages';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PageProps {
  params: {
    slug: string;
  };
}

// Add the 'async' keyword here
export default async function InfoPage({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise;
  const pageContent = getPageContent(params.slug);

  // If the slug doesn't match any of our pages, show a 404 page
  if (!pageContent) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full bg-[#F9F9F9] px-4 py-12 sm:px-6 lg:py-20">
      <main className="mx-auto max-w-4xl">
        <Card className="rounded-sm border-neutral-200 bg-white shadow-none">
          <CardHeader>
            <CardTitle className="font-serif text-4xl font-medium text-black">
              {pageContent.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-neutral-900">
              <p>{pageContent.content}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

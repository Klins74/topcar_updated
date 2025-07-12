// /app/services/[slug]/page.tsx
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { servicesData } from "@/data/servicesData"; // Мы создадим этот файл на следующем шаге
import { notFound } from "next/navigation";

// Эта функция будет генерировать статические страницы для каждой услуги во время сборки
export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = servicesData.find((s) => s.slug === params.slug);

  if (!service) {
    notFound(); // Если услуга не найдена, показать страницу 404
  }

  return (
    <AnimatedPageWrapper>
      <Header />
      <main className="min-h-screen bg-neutral-950 text-white pt-24 sm:pt-32">
        <section className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 text-center tracking-tight">
              {service.title}
            </h1>
            <div 
              className="prose prose-invert prose-lg max-w-none mx-auto text-neutral-300"
              dangerouslySetInnerHTML={{ __html: service.fullDescriptionHtml }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </AnimatedPageWrapper>
  );
}
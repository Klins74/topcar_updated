// src/app/services/[slug]/page.tsx

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedPageWrapper from "@/components/AnimatedPageWrapper";

// Defines the properties that this page will receive
type Props = {
    params: {
        slug: string;
    };
};

// This is sample data. In the future, you will get this from a database.
const servicesData: { [key: string]: { title: string, description: string, content: string } } = {
    'arenda-s-voditelem': {
        title: 'Аренда с водителем',
        description: 'Максимальный комфорт и безопасность с нашими профессиональными водителями.',
        content: 'Наша услуга аренды автомобиля с водителем идеально подходит для деловых поездок, специальных мероприятий или просто для тех, кто ценит свое время и комфорт. Наши водители - это опытные профессионалы, знающие город и готовые обеспечить вашу безопасность на дороге.'
    },
    'transfer-v-aeroport': {
        title: 'Трансфер в аэропорт',
        description: 'Пунктуальная и комфортная доставка в аэропорт и из него.',
        content: 'Мы предлагаем надежные трансферы в/из международного аэропорта Алматы. Встретим вас или ваших гостей с табличкой, поможем с багажом и обеспечим быструю и комфортную поездку до места назначения на автомобиле премиум-класса.'
    },
    'arenda-na-meropriyatiya': {
        title: 'Аренда на мероприятия',
        description: 'Сделайте ваше событие незабываемым с нашими премиальными автомобилями.',
        content: 'Свадьбы, юбилеи, корпоративные вечера или фотосессии — наши автомобили станут украшением любого события. Мы предлагаем гибкие условия аренды для мероприятий любого масштаба.'
    }
}

// This function generates the page title and description for SEO
export async function generateMetadata({ params }: Props) {
    const service = servicesData[params.slug];

    if (!service) {
        return {
            title: 'Услуга не найдена'
        }
    }

    return {
        title: `${service.title} | TopCar`,
        description: service.description,
    }
}

// This is the main page component that renders the HTML
export default function ServiceDetailPage({ params }: Props) {
    const service = servicesData[params.slug];

    // If a service with the given slug is not found, show an error message
    if (!service) {
        return (
            <AnimatedPageWrapper>
                <Header />
                <main className="container mx-auto px-4 py-24 text-center">
                    <h1 className="text-3xl font-bold">Услуга не найдена</h1>
                    <p className="text-muted-foreground mt-4">К сожалению, мы не смогли найти запрашиваемую вами услугу.</p>
                </main>
                <Footer />
            </AnimatedPageWrapper>
        );
    }
    
    // If the service is found, display its details
    return (
        <AnimatedPageWrapper>
            <Header />
            <main className="bg-background py-16 sm:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            {service.title}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            {service.description}
                        </p>
                        <div className="prose prose-invert lg:prose-xl prose-p:text-muted-foreground">
                           <p>{service.content}</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </AnimatedPageWrapper>
    );
}
// Файл: src/app/dashboard/page.tsx (Восстановленная и упрощенная версия)

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedPageWrapper from '@/components/AnimatedPageWrapper';
import {
  UserCircleIcon,
  PhoneIcon as PhoneSolidIcon,
  EnvelopeIcon as EnvelopeSolidIcon,
  ArrowRightOnRectangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { type User } from '@/types';

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('topcar-user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('topcar-user');
                router.push('/');
            }
        } else {
            router.push('/');
        }
        setIsLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('topcar-user');
        router.push('/');
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <ArrowPathIcon className="h-12 w-12 text-[#d4af37] animate-spin" />
            </div>
        );
    }

    return (
        <AnimatedPageWrapper>
            <Header />
            <main className="min-h-[80vh] bg-neutral-950 text-white font-sans py-16 sm:py-24 px-4">
                <div className="max-w-3xl mx-auto space-y-12">
                    <section>
                        <div className="flex items-center mb-6">
                            <UserCircleIcon className="h-8 w-8 text-[#d4af37] mr-3 shrink-0" />
                            <h1 className="text-2xl font-bold text-white">Ваш профиль</h1>
                            <button 
                                onClick={handleLogout} 
                                title="Выйти" 
                                className="ml-auto p-2 text-neutral-500 hover:text-red-400 transition-colors rounded-full hover:bg-neutral-800"
                            >
                                <ArrowRightOnRectangleIcon className="h-6 w-6"/>
                            </button>
                        </div>
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
                            <div className="flex items-center">
                                <UserCircleIcon className="h-5 w-5 text-neutral-500 mr-4 shrink-0" />
                                <span className="text-sm text-neutral-400">Имя:</span>
                                <span className="ml-auto font-medium text-white text-right">{user.name || 'Не указано'}</span>
                            </div>
                            <div className="flex items-center">
                                <PhoneSolidIcon className="h-5 w-5 text-neutral-500 mr-4 shrink-0" />
                                <span className="text-sm text-neutral-400">Телефон:</span>
                                <span className="ml-auto font-medium text-white">{user.phone}</span>
                            </div>
                            <div className="flex items-center">
                                <EnvelopeSolidIcon className="h-5 w-5 text-neutral-500 mr-4 shrink-0" />
                                <span className="text-sm text-neutral-400">Email:</span>
                                <span className="ml-auto font-medium text-white text-right">{user.email || 'Не указан'}</span>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </AnimatedPageWrapper>
    );
}
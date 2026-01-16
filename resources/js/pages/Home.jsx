
import { Head } from '@inertiajs/react';
import MainLayout from "@/layouts/MainLayout.jsx";
import HeroSlider from "@/features/home/components/HeroSlider.jsx";

export default function Home() {
  return (
    <>
      <Head title="Главная" />

      {/* Hero Слайдер (на всю ширину) */}
      <section className="w-full mb-12">
        <HeroSlider />
      </section>

      <div className="space-y-4">
       {/* Сетка категорий */}
        <div className="grid grid-cols-3 gap-4">
          <div className="h-32 bg-amber-200 rounded flex items-center justify-center">Категория 1</div>
          <div className="h-32 bg-amber-200 rounded flex items-center justify-center">Категория 2</div>
          <div className="h-32 bg-amber-200 rounded flex items-center justify-center">Категория 3</div>
        </div>

        {/* Текстовый блок */}
        <div className="p-6 bg-white rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-2">Добро пожаловать в Letomarket</h1>
        </div>
      </div>
    </>
  );
}

// Указываем, что эта страница использует MainLayout
Home.layout = page => <MainLayout children={page} headerOverlaps={true} />
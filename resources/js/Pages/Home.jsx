import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function Home() {
  return (
    <>
      <Head title="Главная" />

      <div className="space-y-4">
        {/* Hero блок */}
        <div className="h-64 bg-green-200 rounded-lg flex items-center justify-center">
          <span className="text-green-800 font-bold text-xl">[ БЛОК: Баннер с акцией ]</span>
        </div>

        {/* Сетка категорий */}
        <div className="grid grid-cols-3 gap-4">
          <div className="h-32 bg-amber-200 rounded flex items-center justify-center">Категория 1</div>
          <div className="h-32 bg-amber-200 rounded flex items-center justify-center">Категория 2</div>
          <div className="h-32 bg-amber-200 rounded flex items-center justify-center">Категория 3</div>
        </div>

        {/* Текстовый блок */}
        <div className="p-6 bg-white rounded shadow text-center">
          <h1 className="text-2xl font-bold mb-2">Добро пожаловать в Letomarket</h1>
          <p className="text-gray-600">Здесь будет SEO текст и преимущества ДПК.</p>
        </div>
      </div>
    </>
  );
}

// Указываем, что эта страница использует MainLayout
Home.layout = page => <MainLayout children={page} />
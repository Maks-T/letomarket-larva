<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Отображение главной страницы.
     */
    public function __invoke(Request $request): Response
    {
        // В будущем здесь будут запросы к БД:
        // $products = Product::where('is_featured', true)->take(8)->get();
        // $slides = Slider::active()->get();

        return Inertia::render('Home', [
            // Передаем SEO данные для компонента SeoHead
            'seo' => [
                'title' => 'Террасная доска и изделия из ДПК',
                'description' => 'Купить террасную доску, фасадные панели и ограждения из ДПК по ценам производителя. Гарантия качества, монтаж под ключ.',
            ],

            // Заглушки для данных, чтобы фронтенд не падал, если мы обратимся к ним
            'featured_products' => [],
            'hero_blocks' => [],
        ]);
    }
}

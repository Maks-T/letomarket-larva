<?php

namespace App\Jobs;

use App\Services\Integration\MS\MsImportService;
use Filament\Notifications\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ImportProductsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Импорт товаров долгий, ставим большой таймаут (1 час)
    public int $timeout = 3600;

    public function handle(MsImportService $importer): void
    {
        $importer->importProducts();
    }

    public function importProducts(): void
    {
        Log::info('[Filament] Dispatching ImportProductsJob ...');

        try {
            ImportProductsJob::dispatch();
            Log::info('[Filament] ImportProductsJob dispatched successfully');
        } catch (\Exception $e) {
            Log::error('[Filament] Failed to dispatch ImportProductsJob: ' . $e->getMessage());
            Notification::make()->danger()->title('Ошибка запуска импорта')->body($e->getMessage())->send();
        }
    }
}

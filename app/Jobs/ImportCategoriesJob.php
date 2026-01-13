<?php

namespace App\Jobs;

use App\Services\Integration\MS\MsImportService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ImportCategoriesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 600; // Даем 10 минут на выполнение

    public function handle(MsImportService $importer): void
    {
        $importer->importCategories();
    }
}

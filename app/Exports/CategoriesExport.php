<?php

namespace App\Exports;

use App\Models\Category;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class CategoriesExport implements FromCollection, WithCustomCsvSettings, WithHeadings
{
    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ','
        ];
    }

    public function headings(): array
    {
        return ["Id","Name", "Name (Bangla)","Description","Deleted by","Deleted at"];
    }
    
    public function collection()
    {
        return Category::select('id','name','name_bangla','description','deleted_by','deleted_at')
        ->withTrashed()->get();
    }
}

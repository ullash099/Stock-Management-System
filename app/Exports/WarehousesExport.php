<?php

namespace App\Exports;

use App\Models\Warehouse;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class WarehousesExport implements FromCollection, WithCustomCsvSettings, WithHeadings
{
    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ','
        ];
    }

    public function headings(): array
    {
        return ["Id","Name", "Name (Bangla)","Address","Deleted by","Deleted at"];
    }
    
    public function collection()
    {
        return Warehouse::select('id','name','name_bangla','address','deleted_by','deleted_at')
        ->withTrashed()->get();
    }
}

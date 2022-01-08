<?php

namespace App\Exports;

use App\Models\Supplier;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class SuppliersExport implements FromCollection, WithCustomCsvSettings, WithHeadings
{
    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ','
        ];
    }

    public function headings(): array
    {
        return ["Id","Name", "Name (Bangla)","Phone",'Phone (Alternative)','Email',
        'Supplier Address','Balance',"Deleted by","Deleted at"];
    }
    
    public function collection()
    {
        return Supplier::select('id','name','name_bangla','phone','phone_alt','email',
        'supplier_address','outstanding','deleted_by','deleted_at')
        ->withTrashed()->get();
    }
}

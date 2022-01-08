<?php

namespace App\Exports;

use App\Models\AccountHead;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class ExpenseHeadsExport implements FromCollection, WithCustomCsvSettings, WithHeadings
{
    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ','
        ];
    }

    public function headings(): array
    {
        return ["Id","Name", "Name (Bangla)","search","calculation","Deleted by","Deleted at"];
    }
    
    public function collection()
    {
        return AccountHead::select('id','name','name_bangla','search','calculation','deleted_by','deleted_at')
        ->where('head_type','expenses')
        ->withTrashed()->get();
    }
}

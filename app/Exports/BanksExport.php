<?php

namespace App\Exports;

use App\Models\Bank;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class BanksExport implements FromCollection, WithCustomCsvSettings, WithHeadings
{
    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ','
        ];
    }

    public function headings(): array
    {
        return ["Id","Bank Type","Name", "Account Holder","Account No","Balance","Deleted by","Deleted at"];
    }
    
    public function collection()
    {
        return Bank::select('id','bank_type','name','account_holder','account_no','outstanding','deleted_by','deleted_at')
        ->withTrashed()->get();
    }
}

<?php

namespace App\Exports;

use App\Models\Customer;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class CustomersExport implements FromCollection, WithCustomCsvSettings, WithHeadings
{
    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ','
        ];
    }

    public function headings(): array
    {
        return ["Id",
        'Name','Name (Bangla)',
        'Phone','Phone (Alternative)','Email',
        'Address','discount','Balance',
        "Deleted by","Deleted at"];
    }
    
    public function collection()
    {
        return Customer::select('id',
        'name','name_bangla',
        'phone','phone_alt','email',
        'customer_address','discount','outstanding',
        'deleted_by','deleted_at')
        ->withTrashed()->get();
    }
}

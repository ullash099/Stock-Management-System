<?php

namespace App\Exports;

use App\Models\Measurement;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class MeasurementsExport implements FromCollection, WithCustomCsvSettings, WithHeadings
{
    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ','
        ];
    }

    public function headings(): array
    {
        return ["Id","Name", "Name (Bangla)","Deleted by","Deleted at"];
    }
    
    public function collection()
    {
        return Measurement::select('id','name','name_bangla','deleted_by','deleted_at')
        ->withTrashed()->get();
    }
}

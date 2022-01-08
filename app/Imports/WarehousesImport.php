<?php

namespace App\Imports;

use Carbon\Carbon;
use App\Models\Warehouse;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class WarehousesImport implements ToModel, WithStartRow, WithCustomCsvSettings
{
    public function startRow(): int
    {
        return 2;
    }

    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ','
        ];
    }

    public function model(array $row)
    {
        return new Warehouse([
            'id'            =>  $row[0],
            'name'          =>  $row[1],
            'name_bangla'   =>  $row[2],
            'address'       =>  $row[3],
            'created_by'    =>  Auth::user()->id,
            'deleted_by'    =>  $row[4],
            'deleted_at'    =>  (!empty($row[5])) ? Carbon::now()->format('Y-m-d H:i:s') : null,
        ]);
    }
}

<?php

namespace App\Imports;

use Carbon\Carbon;
use App\Models\AccountHead;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class IncomeHeadsImport implements ToModel, WithStartRow, WithCustomCsvSettings
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
        return new AccountHead([
            'id'            =>  $row[0],
            'name'          =>  $row[1],
            'name_bangla'   =>  $row[2],
            'head_type'     =>  'income',
            'search'        =>  $row[3],
            'calculation'   =>  $row[4],
            'created_by'    =>  Auth::user()->id,
            'deleted_by'    =>  $row[5],
            'deleted_at'    =>  (!empty($row[6])) ? Carbon::now()->format('Y-m-d H:i:s') : null,
        ]);
    }
}

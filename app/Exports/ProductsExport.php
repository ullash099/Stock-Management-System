<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithCustomCsvSettings;

class ProductsExport implements FromCollection, WithCustomCsvSettings, WithHeadings
{
    public function getCsvSettings(): array
    {
        return [
            'delimiter' => ','
        ];
    }

    public function headings(): array
    {
        return ["Id","Name", "Name (Bangla)",
        "Category",'Measurement','Purchase Price',
        'Sales Price','VAT','Sales Price',
        "Deleted by","Deleted at"];
    }
    
    public function collection()
    {
        return Product::join('measurements', 'products.measurement_id', '=', 'measurements.id')
        ->join('categories', 'products.category_id', '=', 'categories.id')
        ->select('products.id','products.name','products.name_bangla',
        'categories.name as category','measurements.name as measurement',
        'products.purchase_price', 'products.sales_price',
        'products.vat', 'products.reorder_qty',
        'products.deleted_by','products.deleted_at')
        ->withTrashed()->get();
    }
}

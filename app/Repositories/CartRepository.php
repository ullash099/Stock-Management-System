<?php

namespace App\Repositories;

use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\Request;
#use Darryldecode\Cart\Cart As Cart;
use Cart;

class CartRepository
{
    public function GetProductInfo($id)
    {
        return Product::select(
            'products.id',
            'products.name',
            'products.name_bangla',
            'products.purchase_price',
            'products.sales_price',
            'products.vat',
            'products.measurement_id',
            'measurements.name as measurement_name',
            'measurements.name_bangla as measurement_name_l'
        )
            ->join('measurements', 'measurements.id', '=', 'products.measurement_id')
            ->where('products.id', $id)->first();
    }

    public function GetWarehouse($id)
    {
        return Warehouse::find($id);
    }

    public function addToCart(Request $request)
    {        
        $productInfo    =   $this->GetProductInfo($request->product);
        $warehouseInfo  =   $this->GetWarehouse($request->warehouse);

        //$price          =   $productInfo->sales_price;
        $price          =   $request->price;
        $vat            =   $productInfo->vat;
        
        $qty            =   $request->qty;
        //$note         =   $request->note;

        $vatAmount      =   ((($price * $vat) / 100) * $qty);
        $discountAmount =   0;#(($price * $discount) / 100);

        $productPrice   =    ($price - $discountAmount);
        $total_vat      =   0;

        if(Cart::getCondition('VAT')){
            $condition = Cart::getCondition('VAT');
            if ((int)$condition->parsedRawValue !== 0) {
                $total_vat = number_format($condition->parsedRawValue, 2);
            }
        }
        $amtVat = number_format($total_vat + $vatAmount, 2);
        $saleCondition = new \Darryldecode\Cart\CartCondition([
            'name'      => 'VAT',
            'type'      => 'tax',
            'target'    => 'total',
            'value'     => number_format($amtVat, 2),
        ]);

        Cart::add([
            'id'            => $request->warehouse.$request->product,
            'name'          => $productInfo->name,
            'price'         => $productPrice,
            'quantity'      => $qty,
            'attributes'    => [
                'barcode'           =>  $request->barcode,
                'product_id'        =>  $productInfo->id,
                'regular_price'     =>  $price,
                'warehouse_id'      =>  $warehouseInfo->id,
                'warehouse_name'    =>  $warehouseInfo->name,
                'vat'               =>  $vat,
                'vat_amount'        =>  $vatAmount,
                #'discount'          =>  $discount,
                #'discount_amount'   =>  $discountAmount,
                'measurement_id'    =>  $productInfo->measurement_id,
                'measurement'       =>  $productInfo->measurement_name,
                #'note'              =>  $note,
                #'commission'        =>  $commission,
                #'commission_amount' =>  $commission_amount
            ]
        ]);
        Cart::condition($saleCondition);
        $data = [
            'cart'          =>  Cart::getContent(),
            'sub_total'     =>  Cart::getSubTotal(),
            'total_vat'     =>  Cart::getCondition('VAT')->parsedRawValue ?? 0,
            'total'         =>  Cart::getTotal(),
        ];
        return $data;
    }

    public function clearCart()
    {
        Cart::clear();
        Cart::removeCartCondition('VAT');
        return true;
    }

    public function removeCartProduct($rowid)
    {
        $productInfo    =   Cart::get($rowid);
        $vatAmount      =   number_format($productInfo->attributes->vat_amount ?? 0, 2);

        $condition = Cart::getCondition('VAT');
        $total_vat = number_format($condition->parsedRawValue, 2);
        $amtVat = $total_vat - $vatAmount;

        Cart::remove($rowid);
        Cart::removeCartCondition('VAT');

        $saleCondition = new \Darryldecode\Cart\CartCondition([
            'name'      => 'VAT',
            'type'      => 'tax',
            'target'    => 'total',
            'value'     => $amtVat,
        ]);
        Cart::condition($saleCondition);

        $data = [
            'cart'          =>  Cart::getContent(),
            'sub_total'     =>  Cart::getSubTotal(),
            'total_vat'     =>  Cart::getCondition('VAT'),
            'total'         =>  Cart::getTotal()
        ];
        return $data;
    }
}
<?php
namespace App\Repositories;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Actions\Fortify\PasswordValidationRules;

class ValidationRepository
{
    use PasswordValidationRules;
    public function isValidProfileInfo(Request $request)
    {
        $user = Auth::user()->id;
        return Validator::make($request->all(), [
            'name'  => 'required|max:190',
            'email' => 'required|max:190|unique:users,email,' . $user
        ]);
    }
    
    public function isValidProfilePhoto(Request $request)
    {
        return Validator::make($request->all(), [
            'file'   => 'required|image|max:1024|mimes:jpg,jpeg,png'
        ]);
    }

    public function isPasswordMatches(Request $request)
    {
        $user = Auth::user();
        return Validator::make($request->all(), [
            'password'  =>  'required|confirmed|min:8|max:190'
        ])->after(function ($validator) use ($user, $request) {
            if (!Hash::check($request->current_password, $user->password)) {
                return $validator->errors()->add('current_password', __('The provided password does not match your current password.'));
            }
        });
    }

    #file validetion
    public function isValidfile(Request $request)
    {
        return Validator::make($request->all(), [
            'file'   => 'required|image|max:1024|mimes:jpg,jpeg,png'#,pdf,docx,doc,xlsx,xlx,pptx,ppt'
        ]);
    }

    public function isValidProductfile(Request $request)
    {
        return Validator::make($request->all(), [
            'file'   => 'required|max:10240|mimes:jpg,jpeg,png,pdf,zip'#,docx,doc,xlsx,xlx,pptx,ppt'
        ]);
    }
    
    public function isValidImportfile(Request $request)
    {
        return Validator::make($request->all(), [
            'file'   => 'required|mimes:csv,txt'
        ]);
    }

    #settings
    public function isValidCompanyProfile(Request $request)
    {
        return Validator::make($request->all(), [
            'company_name'      =>  'required|max:190',
            'company_phone'     =>  'required|max:190',
            'company_email'     =>  'nullable|max:190',
            'company_address'   =>  'required|max:300'
        ]);
    }
    
    public function isValidCurrencyInfo(Request $request)
    {
        return Validator::make($request->all(), [
            'default_currency'  =>  'required|exists:currencies,id',
            'bin_no'            =>  'nullable|max:190',
            'mushak_no'         =>  'nullable|max:190',
            'vat'               =>  'nullable|numeric|between:0,999',
        ]);
    }
    
    public function isValidInvoiceLayout(Request $request)
    {
        return Validator::make($request->all(), [
            'invoice_print_layout'  =>  'required|in:pos,a4',
            'invoice_font_size'     =>  'required|numeric|between:5,99',
            'invoice_footer_note'   =>  'nullable|max:500',
        ]);
    }
    
    public function isValidIncomeVoucherLayout(Request $request)
    {
        return Validator::make($request->all(), [
            'income_voucher_print_layout'  =>  'required|in:pos,a4',
            'income_voucher_font_size'     =>  'required|numeric|between:5,99',
            'income_voucher_footer_note'   =>  'nullable|max:500',
        ]);
    }
    
    public function isValidExpenseVoucherLayout(Request $request)
    {
        return Validator::make($request->all(), [
            'expense_voucher_print_layout'  =>  'required|in:pos,a4',
            'expense_voucher_font_size'     =>  'required|numeric|between:5,99',
            'expense_voucher_footer_note'   =>  'nullable|max:500',
        ]);
    }
    
    public function isValidPurchaseVoucher(Request $request)
    {
        return Validator::make($request->all(), [
            'purchase_voucher_print_layout'  =>  'required|in:pos,a4',
            'purchase_voucher_font_size'     =>  'required|numeric|between:5,99',
            'purchase_voucher_footer_note'   =>  'nullable|max:500',
        ]);
    }
    
    public function isValidReportLayout(Request $request)
    {
        return Validator::make($request->all(), [
            'report_print_layout'  =>  'required|in:pos,a4',
            'report_font_size'     =>  'required|numeric|between:5,99',
            'report_footer_note'   =>  'nullable|max:500',
        ]);
    }
    
    #Measurement
    public function isValidMeasurement(Request $request)
    {
        if(!empty($request->id)){
            return Validator::make($request->all(), [
                'name'              =>  'required|max:190|unique:measurements,name,'. $request->id,
                'name_bangla'       =>  'nullable|max:190|unique:measurements,name_bangla,'. $request->id,
            ]);
        }
        return Validator::make($request->all(), [
            'name'              =>  'required|max:190|unique:measurements,name',
            'name_bangla'       =>  'nullable|max:190|unique:measurements,name_bangla',
        ]);
    }

    #Warehouse
    public function isValidWarehouse(Request $request)
    {
        if(!empty($request->id)){
            return Validator::make($request->all(), [
                'name'              =>  'required|max:190|unique:warehouses,name,'. $request->id,
                'name_bangla'       =>  'nullable|max:190|unique:warehouses,name_bangla,'. $request->id,
                'address'           =>  'nullable|max:30000',
            ]);
        }
        return Validator::make($request->all(), [
            'name'              =>  'required|max:190|unique:warehouses,name',
            'name_bangla'       =>  'nullable|max:190|unique:warehouses,name_bangla',
            'address'           =>  'nullable|max:30000',
        ]);
    }
    
    #Account Head
    public function isValidAccountHead(Request $request)
    {
        if(!empty($request->id)){
            return Validator::make($request->all(), [
                'name'              =>  'required|max:190|unique:account_heads,name,'. $request->id,
                'name_bangla'       =>  'nullable|max:190|unique:account_heads,name_bangla,'. $request->id,
                'search'            =>  'required|in:na,bank,customer,supplier',#investor,employee,agent
                'calculation'       =>  'required|in:n,i,d'
            ]);
        }
        return Validator::make($request->all(), [
            'name'              =>  'required|max:190|unique:account_heads,name',
            'name_bangla'       =>  'nullable|max:190|unique:account_heads,name_bangla',
            'search'            =>  'required|in:na,bank,customer,supplier',#investor,employee,agent
            'calculation'       =>  'required|in:n,i,d'
        ]);
    }

    #user
    public function isValidUser(Request $request)
    {
        return Validator::make($request->all(), [
            'name'      =>  'required|max:190',
            'email'     => 'required|unique:users,email',
            'role'      => 'required|exists:roles,id',
            'password'  =>  'required|confirmed|min:8|max:190'
        ]);
    }

    #Bank
    public function isValidBank(Request $request)
    {
        if(!empty($request->id)){
            return Validator::make($request->all(), [
                'name'              => 'required|max:190',
                'account_holder'    => 'required|max:190',
                'account_no'        => 'required|max:190|unique:banks,account_no,' . $request->id,
                'bank_address'      =>  'nullable|max:65535',
                'bank_type'         =>  'required|in:mobile_bank,bank'
            ]);
        }
        return Validator::make($request->all(), [
            'name'              => 'required|max:190',
            'account_holder'    => 'required|max:190',
            'opening_balance'   => 'required|numeric|between:0,999999999.99',
            'account_no'        => 'required|max:190|unique:banks,account_no',
            'bank_address'      =>  'nullable|max:65535',
            'bank_type'         =>  'required|in:mobile_bank,bank'
        ]);
    }
    
    #Supplier
    public function isValidSupplier(Request $request)
    {
        if(!empty($request->id)){
            return Validator::make($request->all(), [
                'name'              =>  'required|max:190',
                'name_bangla'       =>  'nullable|max:190',
                'phone'             =>  'required|max:20|unique:suppliers,phone,'. $request->id,
                'phone_alt'         =>  'nullable|max:20',
                'email'             =>  'nullable|max:190|unique:suppliers,email,'. $request->id,
                'supplier_address'  =>  'nullable|max:65535'
            ]);
        }
        return Validator::make($request->all(), [
            'name'              =>  'required|max:190',
            'name_bangla'       =>  'nullable|max:190',
            'phone'             =>  'required|max:20|unique:suppliers,phone',
            'phone_alt'         =>  'nullable|max:20',
            'email'             =>  'nullable|max:190|unique:suppliers,email',
            'opening_balance'   =>  'required|numeric|between:0,999999999.99',
            'supplier_address'  =>  'nullable|max:65535'
        ]);
    }
    
    #Customer
    public function isValidCustomer(Request $request)
    {
        if(!empty($request->id)){
            return Validator::make($request->all(), [
                'name'              =>  'required|max:190',
                'name_bangla'       =>  'nullable|max:190',
                'phone'             =>  'required|max:20|unique:customers,phone,'. $request->id,
                'phone_alt'         =>  'nullable|max:20',
                'email'             =>  'nullable|max:190|unique:customers,email,'. $request->id,
                'opening_balance'   =>  'required|numeric|between:0,999999999.99',
                'discount'          =>  'required|numeric|between:0,100',
                'customer_address'  =>  'nullable|max:65535'
            ]);
        }
        return Validator::make($request->all(), [
            'name'              =>  'required|max:190',
            'name_bangla'       =>  'nullable|max:190',
            'phone'             =>  'required|max:20|unique:customers,phone',
            'phone_alt'         =>  'nullable|max:20',
            'email'             =>  'nullable|max:190|unique:customers,email',
            'opening_balance'   =>  'required|numeric|between:0,999999999.99',
            'discount'          =>  'required|numeric|between:0,100',
            'customer_address'  =>  'nullable|max:65535'
        ]);
    }

    #Category
    public function isValidCategory(Request $request)
    {
        if(!empty($request->id)){
            return Validator::make($request->all(), [
                'name'          => 'required|max:190|unique:categories,name,' . $request->id,
                'name_bangla'   => 'nullable|max:190|unique:categories,name_bangla,' . $request->id,
                'parent'        => (empty($request->parent)) ? 'nullable' : 'exists:categories,id',
                'description'   => 'nullable|max:65000',
            ]);
        }
        return Validator::make($request->all(), [
            'name'          => 'required|max:190|unique:categories,name',
            'name_bangla'   => 'nullable|max:190|unique:categories,name_bangla',
            'parent'        => (empty($request->parent)) ? 'nullable' : 'exists:categories,id',
            'description'   => 'nullable|max:65000',
        ]);
    }
    
    #Product
    public function isValidProduct(Request $request)
    {
        if(!empty($request->id)){
            return Validator::make($request->all(), [
                'name'              => 'required|max:190|unique:products,name,'. $request->id,
                'name_bangla'       => 'nullable|max:190|unique:products,name_bangla,'. $request->id,
                'measurement'       => 'required|exists:measurements,id',
                'category'          => 'required|exists:categories,id',            
                'purchase_price'    => 'required|numeric|between:0,999999999.99',
                'sales_price'       => 'required|numeric|between:0,999999999.99',
                'vat'               => 'required|numeric|between:0,999999999.99',
                'reorder_qty'       => 'required|numeric|between:0,999999999.99'
            ]);
        }
        return Validator::make($request->all(), [
            'name'              => 'required|max:190|unique:products,name',
            'name_bangla'       => 'nullable|max:190|unique:products,name_bangla',
            'measurement'       => 'required|exists:measurements,id',
            'category'          => 'required|exists:categories,id',            
            'purchase_price'    => 'required|numeric|between:0,999999999.99',
            'sales_price'       => 'required|numeric|between:0,999999999.99',
            'vat'               => 'required|numeric|between:0,999999999.99',
            'reorder_qty'       => 'required|numeric|between:0,999999999.99'
        ]);
    }
    
    #Opening Stock
    public function isValidOpeningStock(Request $request)
    {
        return Validator::make($request->all(), [
            'warehouse' => 'required|exists:warehouses,id',
            'category'  => 'required|exists:categories,id',
            'product'   => 'required|exists:products,id',
            'qty'       => 'required|numeric|between:0,999999999.99'
        ]);
    }

    #Purchase
    public function isValidPurchase(Request $request)
    {
        return Validator::make($request->all(), [
            'voucher'           => 'required|max:190|unique:purchase_masters,voucher',
            'purchase_date'     => 'required',
            'supplier'          => 'required|exists:suppliers,id',
            'ref'               => 'nullable|max:190',

            'product.*'         => 'required|exists:products,id',
            'warehouse.*'       => 'required|exists:warehouses,id',
            'purchase_price.*'  => 'required|numeric|between:0,999999999.99',
            
            'qty.*'             => 'required|numeric|between:0,999999999.99',
            'subtotal.*'        => 'required|numeric|between:0,999999999.99',

            'sales_price.*'     => 'required|numeric|between:0,999999999.99',
            'vat.*'             => 'required|numeric|between:0,999999999.99',

            'total'             => 'required|numeric|between:0,999999999.99',
        ]);
    }

    public function isValidPurchaseReturn(Request $request)
    {
        return Validator::make($request->all(), [
            'id.*'          =>  'required|exists:purchase_details,id',
            'rtn_qty.*'     =>  'nullable|numeric|between:0,999999999.99',
        ]);
    }

    public function isValidCart(Request $request)
    {
        return Validator::make($request->all(), [
            'warehouse' =>  'nullable|exists:warehouses,id',
            'product'   =>  'required|exists:products,id',
            'price'     =>  'required|numeric|between:0,999999999.99',
            'qty'       =>  'required|numeric|between:0.001,999999999.99',
            'note'      =>  'nullable|max:190'
        ]);
    }

    #sales
    public function isValidSales(Request $request)
    {
        return Validator::make($request->all(), [
            'customer'      => !empty($request->customer) ? 'required|exists:customers,id' : 'nullable',
            
            'sub_total'     => 'required|numeric|between:0,999999999.99',
            'vat'           => 'required|numeric|between:0,999999999.99',
            'total'         => 'required|numeric|between:0,999999999.99',
            'advance'       => 'required|numeric|between:0,999999999.99',
            'discount'      => 'required|numeric|between:0,999999999.99',
            'net_payable'   => 'required|numeric|between:0,999999999.99',
            'cash'          => 'nullable|numeric|between:0,999999999.99',
            'bank_amount'   => 'nullable|numeric|between:0,999999999.99',
            'bank'          => $request->bank_amount > 0 ? 'required|exists:banks,id' : 'nullable',
            'bank_ref'      => 'nullable|max:190',
            'receive'       => 'required|numeric|between:0,999999999.99',
            'return_due'    => 'required|numeric|between:-999999999.99,999999999.99',
        ]);
    }

    public function isValidDeliveryInfo(Request $request)
    {
        return Validator::make($request->all(), [
            'invoice'           =>  'required|exists:invoice_masters,invoice',
            'id.*'              =>  'required|exists:invoice_details,id',
            'delivery_qty.*'    =>  'required|numeric|between:0,999999999.99',
        ]);
    }
    
    public function isValidReturnInfo(Request $request)
    {
        $str = 'nullable';
        if ($request->search == 'customer') {
            $str = 'required|exists:customers,id';
        } elseif ($request->search == 'supplier') {
            $str = 'required|exists:suppliers,id';
        } elseif ($request->search == 'bank') {
            $str = 'required|exists:banks,id';
        }

        return Validator::make($request->all(), [
            'invoice'           =>  'required|exists:invoice_masters,id',
            'product_id'        =>  'required|exists:products,id',
            'warehouse_id'      =>  'required|exists:warehouses,id',
            'return_id'         =>  'required|exists:invoice_details,id',
            'return_qty.*'      =>  'required|numeric|between:0,999999999.99',

            'search'            =>  'required|in:na,customer,supplier,bank',
            'account_head'      =>  'required|exists:account_heads,id',
            'transactions_type' =>  'required|in:cash,bank,both',
            'voucher_date'      =>  'required',
            'expense_to'        =>  $str,
            'withdraw_from_bank'=> ($request->transactions_type != 'cash') ? 'required|exists:banks,id' : 'nullable',
            
            'description'       =>  'required|max:190',
            'amount'            =>  'required|numeric|between:1,999999999.99',
            'total'             =>  'required|numeric|between:0,999999999.99',
            'cash'              => ($request->transactions_type == 'cash' || $request->transactions_type == 'both') ? 'required|numeric|between:0,999999999.99' : 'nullable|numeric|between:0,999999999.99',
            'bank'              => ($request->transactions_type == 'bank' || $request->transactions_type == 'both') ? 'required|numeric|between:0,999999999.99' : 'nullable|numeric|between:0,999999999.99',
        ]);
    }

    #income voucher
    public function isValidIncomeVoucher(Request $request)
    {
        $str = 'nullable';
        if ($request->search == 'customer') {
            $str = 'required|exists:customers,id';
        } elseif ($request->search == 'supplier') {
            $str = 'required|exists:suppliers,id';
        } elseif ($request->search == 'bank') {
            $str = 'required|exists:banks,id';
        }

        return Validator::make($request->all(), [
            'search'            =>  'required|in:na,customer,supplier,bank',
            'account_head'      =>  'required|exists:account_heads,id',
            'transactions_type' =>  'required|in:cash,bank,both',
            'voucher_date'      =>  'required',
            'income_from'       =>  $str,
            'deposit_in_bank'   => ($request->transactions_type != 'cash') ? 'required|exists:banks,id' : 'nullable',
            'description.*'     =>  'required|max:190',
            'amount.*'          =>  'required|numeric|between:0,999999999.99',
            'total'             =>  'required|numeric|between:0,999999999.99',
            'cash'              => ($request->transactions_type == 'cash' || $request->transactions_type == 'both') ? 'required|numeric|between:0,999999999.99' : 'nullable|numeric|between:0,999999999.99',
            'bank'              => ($request->transactions_type == 'bank' || $request->transactions_type == 'both') ? 'required|numeric|between:0,999999999.99' : 'nullable|numeric|between:0,999999999.99',
        ]);
    }
    
    #expense voucher
    public function isValidExpenseVoucher(Request $request)
    {
        $str = 'nullable';
        if ($request->search == 'customer') {
            $str = 'required|exists:customers,id';
        } elseif ($request->search == 'supplier') {
            $str = 'required|exists:suppliers,id';
        } elseif ($request->search == 'bank') {
            $str = 'required|exists:banks,id';
        }

        return Validator::make($request->all(), [
            'search'            =>  'required|in:na,customer,supplier,bank',
            'account_head'      =>  'required|exists:account_heads,id',
            'transactions_type' =>  'required|in:cash,bank,both',
            'voucher_date'      =>  'required',
            'expense_to'        =>  $str,
            'withdraw_from_bank'=> ($request->transactions_type != 'cash') ? 'required|exists:banks,id' : 'nullable',
            'description.*'     =>  'required|max:190',
            'amount.*'          =>  'required|numeric|between:0,999999999.99',
            'total'             =>  'required|numeric|between:0,999999999.99',
            'cash'              => ($request->transactions_type == 'cash' || $request->transactions_type == 'both') ? 'required|numeric|between:0,999999999.99' : 'nullable|numeric|between:0,999999999.99',
            'bank'              => ($request->transactions_type == 'bank' || $request->transactions_type == 'both') ? 'required|numeric|between:0,999999999.99' : 'nullable|numeric|between:0,999999999.99',
        ]);
    }
}
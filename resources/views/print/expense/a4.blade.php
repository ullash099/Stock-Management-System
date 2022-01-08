<?php 
$currency = GetCurrencySymbol($default_currency ?? '');
$lang = $expense_voucher_language ?? 'en';
app()->setLocale($lang);
?>
@extends('print.app')
@section('lang'){{ $lang }}@endsection
@section('title')expense-vouche-{{ $record->voucher ?? '' }}@endsection
@section('style')
@endsection

@section('content')
{{-- {!! DebugMe() !!} --}}
<div class="row">
    <div class="col-12">
        <address class="text-center mb-0">
            <h3 class="h2 font-weight-bold mb-0">{{ $company_name ?? '' }}</h4>
            @if (!empty($company_phone))
                {{ __('Phone') }} : {{ $company_phone }} <br />
            @endif
            @if (!empty($company_email))
                {{ __('Email') }} : {{ $company_email }} <br />
            @endif
            @if (!empty($mushak_no))
                {{ __('Mushak') }} : {{ $mushak_no }} <br />
            @endif
            @if (!empty($bin_no))
                <p class="m-0">{{ _('BIN No.') }} : {{ $bin_no }}</p>
            @endif
            <div class="mb-3">{!! $company_address !!}</div>
            <div class="border border-dark voucher"> {{ __('Expense Voucher') }}</div>
        </address>
    </div>
</div>

<div class="row">
    <div class="col">

        <p class="m-0"><strong>{{ __('Account Head') }} : </strong>{{ ConvertToLangPrint($record->account_head,$lang) }}</p>
        
        @if (!empty($record->customer_id))
            <p class="m-0"><strong>{{ __('Name') }} : </strong>{{ ConvertToLangPrint($record->customer,$lang) }}</p>
            <p class="m-0"><strong>{{ __('Phone') }} : </strong>{{ $record->customer->phone }}</p>
            @if (!empty($record->customer->customer_address))
                <p class="m-0"><strong>{{ _('Address') }} : </strong>{!! $record->customer->customer_address !!}</p>
            @endif
        @elseif (!empty($record->supplier_id))
            <p class="m-0"><strong>{{ __('Name') }} : </strong>{{ ConvertToLangPrint($record->supplier,$lang) }}</p>
            <p class="m-0"><strong>{{ __('Phone') }} : </strong>{{ $record->supplier->phone }}</p>
            @if (!empty($record->supplier->supplier_address))
                <p class="m-0"><strong>{{ _('Address') }} : </strong>{!! $record->supplier->supplier_address !!}</p>
            @endif
        @elseif (!empty($record->bank_id))
            <p class="m-0"><strong>{{ __('Bank Name') }} : </strong>{{ $record->bank->name }}</p>
            <p class="m-0"><strong>{{ __('A/C Name') }} : </strong>{{ $record->bank->account_holder }}</p>
            <p class="m-0"><strong>{{ __('A/C No.') }} : </strong>{{ $record->bank->account_no }}</p>
            @if (!empty($record->bank->bank_address))
                <p class="m-0"><strong>{{ _('Address') }} : </strong>{!! $record->bank->bank_address !!}</p>
            @endif
        @endif


    </div>
    <div class="col text-end">
        <p class="m-0"><strong>{{ __('Date') }} : </strong>{{ date('d-m-Y',strtotime($record->voucher_date)) }}</p>
        <p class="m-0"><strong>{{ __('Voucher') }} : </strong>{{ $record->voucher }}</p>
        @if (!empty($record->withdraw_from_bank_id))
            <p class="m-0"><strong>{{ __('Withdraw Bank') }} : </strong>{{ $record->withdraw_from_bank->name }}</p>
            <p class="m-0"><strong>{{ __('A/C Name') }} : </strong>{{ $record->withdraw_from_bank->account_holder }}</p>
            <p class="m-0"><strong>{{ __('A/C No.') }} : </strong>{{ $record->withdraw_from_bank->account_no }}</p>
            @if (!empty($record->withdraw_from_bank->bank_address))
                <p class="m-0"><strong>{{ _('Address') }} : </strong>{!! $record->withdraw_from_bank->bank_address !!}</p>
            @endif
        @endif
        <p class="mt-1"><strong>{{ __('Created by')}} : </strong>{{ $record->user->name }}</p>
    </div>
</div>

<div class="row">
    <div class="col-12">
        <table class="table table-bordered">
            <thead>
            <tr>
                <th style="width:70%;">
                    {{ __('Description') }}
                </th>
                <th style="width:30%;" class="text-end">
                    {{ __('Total') }}
                </th>
            </tr>
            </thead>
            <tbody>
                @foreach($record->details as $detail)
                    <tr>
                        <td>
                            {{ $detail->description }}
                        </td>
                        <td class="text-end">
                            {!! $currency !!}{{ number_format($detail->amount,2) }}
                        </td>
                    </tr>
                @endforeach
                <tr>
                    <td class="text-end">{{ __('Total') }}</td>
                    <td class="text-end">
                        {!! $currency !!}{{ number_format($record->total,2) }}
                    </td>
                </tr>
                <tr>
                    <td class="text-end">{{ __('Cash') }}</td>
                    <td class="text-end">
                        {!! $currency !!}{{ number_format($record->cash_amount,2) }}
                    </td>
                </tr>
                <tr>
                    <td class="text-end">{{ __('Bank') }}</td>
                    <td class="text-end">
                        {!! $currency !!}{{ number_format($record->bank_amount,2) }}
                    </td>
                </tr>
            </tbody>
        </table>
        <p>{!! $expense_voucher_footer_note ?? '' !!}</p>
    </div>
</div>
@endsection

@section('js')
<script>
    window.onafterprint = function() {
        window.close();
    };
</script>
@endsection
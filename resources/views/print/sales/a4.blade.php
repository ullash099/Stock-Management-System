<?php 
$currency = GetCurrencySymbol($default_currency ?? '');
$lang = $invoice_print_language ?? 'en';
app()->setLocale($lang);
?>
@extends('print.app')
@section('lang'){{ $lang }}@endsection
@section('title')invoice-{{ $record->invoice ?? '' }}@endsection
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
            <div class="border border-dark voucher"> {{ __('Invoice') }}</div>
        </address>
    </div>
</div>

<div class="row">
    <div class="col">
        <p class="m-0"><strong>{{ __('Date') }} : </strong>{{ date('d-m-Y',strtotime($record->invoice_date)) }}</p>
        <p class="m-0"><strong>{{ __('Invoice') }} : </strong>{{ $record->invoice }}</p>

        @if (!empty($record->customer_id))
            <p class="m-0"><strong>{{ __('Customer') }} : </strong>{{ ConvertToLangPrint($record->customer,$lang) }}</p>
            <p class="m-0"><strong>{{ __('Phone') }} : </strong>{{ $record->customer->phone }}</p>
            @if (!empty($record->customer->customer_address))
                <p class="m-0"><strong>{{ _('Address') }} : </strong>{!! $record->customer->customer_address !!}</p>
            @endif
        @endif

        <p class="m-0"><strong>{{ __('Created by')}} : </strong>{{ $record->user->name }}</p>

    </div>
    <div class="col text-end"></div>
</div>

<div class="row">
    <div class="col-12">
        <table class="table table-bordered">
            <thead>
            <tr>
                <th style="width:50%;">
                    {{ __('Items') }}
                </th>
                <th style="width:15%;" class="text-center">
                    {{ __('Price') }}
                </th>
                <th style="width:15%;" class="text-center">
                    {{ __('Qty') }}
                </th>
                <th style="width:20%;" class="text-end">
                    {{ __('Total') }}
                </th>
            </tr>
            </thead>
            <tbody>
                @foreach($record->details as $detail)
                    <tr>
                        <td>
                            {{ ConvertToLangPrint($detail->product,$lang) }}
                            @if (!empty($detail->barcode))
                                <br />({{ $detail->barcode }})
                            @endif
                            @if (!empty($detail->meter_id))
                                <br/>{{ __('Meter') }} {{ $detail->meter->meter_no }} <br/>
                            @endif
                            {{ $detail->note }}
                        </td>
                        <td class="text-center">
                            {!! $currency !!}{{ number_format($detail->price,2) }}/{{ ConvertToLangPrint($detail->product->measurement,$lang) }}
                        </td>
                        <td class="text-center">
                            {{ number_format($detail->quantity,2) }}
                        </td>
                        <td class="text-end">
                            {!! $currency !!}{{ number_format($detail->price*$detail->quantity,2) }}
                        </td>
                    </tr>
                @endforeach
                <tr>
                    <td colspan="3" class="text-end pt-1 pb-1">
                        {{ __('Sub Total') }}
                    </td>
                    <td class="text-end pt-1 pb-1">
                        {!! $currency !!}{{ number_format($record->sub_total,2) }}
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="text-end pt-1 pb-1">
                        {{ __('VAT') }}
                    </td>
                    <td class="text-end pt-1 pb-1">
                        {!! $currency !!}{{ number_format($record->vat,2) }}
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="text-end pt-1 pb-1">
                        {{ __('Total') }}
                    </td>
                    <td class="text-end pt-1 pb-1">
                        {!! $currency !!}{{ number_format($record->total,2) }}
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="text-end pt-1 pb-1">
                        (-) {{ __('Advance') }}
                    </td>
                    <td class="text-end pt-1 pb-1">
                        {!! $currency !!}{{ number_format($record->advance,2) }}
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="text-end pt-1 pb-1">
                        (-) {{ __('Discount') }}
                    </td>
                    <td class="text-end pt-1 pb-1">
                        {!! $currency !!}{{ number_format($record->discount,2) }}
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="text-end pt-1 pb-1">
                        {{ __('Net Payable') }}
                    </td>
                    <td class="text-end pt-1 pb-1">
                        {!! $currency !!}{{ number_format($record->net_payable,2) }}
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="text-end pt-1 pb-1">
                        {{ __('Cash') }}
                    </td>
                    <td class="text-end pt-1 pb-1">
                        {!! $currency !!}{{ number_format($record->cash,2) }}
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="text-end pt-1 pb-1">
                        {{ __('Card/Bank') }}
                    </td>
                    <td class="text-end pt-1 pb-1">
                        {!! $currency !!}{{ number_format($record->bank_amount,2) }}
                    </td>
                </tr>
                <tr>
                    <td colspan="3" class="text-end pt-1 pb-1">
                        @if($record->return_due < 0)
                            {{ __('Due') }}
                        @else
                            {{ __('Return') }}
                        @endif
                    </td>
                    <td class="text-end pt-1 pb-1">
                        {!! $currency !!}{{ number_format($record->return_due,2) }}
                    </td>
                </tr>
                @if (!empty($record->exchange_amount))
                    <tr>
                        <td colspan="3" class="text-end pt-1 pb-1">
                            {{ __('Sales Return') }}
                        </td>
                        <td class="text-end pt-1 pb-1">
                            {!! $currency !!}{{ number_format($record->exchange_amount*-1,2) }}
                        </td>
                    </tr>
                @endif
            </tbody>
        </table>

        <p>{!! $invoice_footer_note ?? '' !!}</p>
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
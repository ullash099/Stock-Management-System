<?php 
$currency = GetCurrencySymbol($default_currency ?? '');
$lang = $report_print_language ?? 'en';
app()->setLocale($lang);
?>
@extends('print.app')
@section('lang'){{ $lang }}@endsection
@section('title')sales-report @endsection
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
            <div class="border border-dark voucher"> {{ __('Stock Status') }}</div>
        </address>
    </div>
</div>

<div class="row">
    <div class="col-12">
        <small>Report generate on {{ date('Y-m-d') }}.</small>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th style="width : 40%">{{ __('Warehouse') }}</th>
                <th style="width : 40%">{{ __('Product') }}</th>
                <th class="text-end">{{ __('Quantity') }}</th>
            </tr>
            </thead>
            <tbody>
                @foreach ($details as $detail)
                <tr>
                    <td>{{$detail->warehouse->name ?? ''}}</td>
                    <td>{{$detail->product->name ?? ''}}</td>
                    <td class="text-end">{{$detail->qty}} /{{ $detail->product->measurement->name ?? ''}}</td>
                </tr>
                @endforeach                
            </tbody>
        </table>
        <p>{!! $report_footer_note ?? '' !!}</p>
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
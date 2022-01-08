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
            <div class="border border-dark voucher"> {{ __('Sales Statement') }}</div>
        </address>
    </div>
</div>

<div class="row">
    <div class="col-12">
        <small>Report is showing from {{ $start_date }} to {{ $end_date }}. Report generate on {{ date('Y-m-d') }}.</small>
        <table class="table table-bordered">
            <thead>
            <tr>
                <th style="width : 15%">{{ __('Date') }}</th>
                <th style="width : 50%">{{ __('Description') }}</th>
                <th class="text-end">{{ __('Quantity') }}</th>
                <th class="text-end">{{ __('Total Sales') }}</th>
            </tr>
            </thead>
            <tbody>
                <?php $total = 0; ?>
                @foreach ($details as $detail)
                <tr>
                    <td>{{ $detail->invoice_date }}</td>
                    <td colspan="3">
                        Invoice : {{$detail->invoice}}
                        @if ($detail->customer)
                            <p className='m-0 p-0'>customer : {{$detail->customer->name}}</p>
                            <p className='m-0 p-0'>Phone : {{$detail->customer->phone}}</p>
                            @if ($detail->customer->customer_address)
                                {!! $detail->customer->customer_address !!}                                
                            @endif
                        @endif
                    </td>
                </tr>
                @if ($detail->details)
                    @foreach ($detail->details as $d)
                        <tr>
                            <td></td>
                            <td>{{$d->product->name}}</td>
                            <td class='text-end'>
                                {{ number_format($d->quantity-$d->rtn_quantity,3) }} 
                                {{ $d->product->measurement->name ?? ''}}
                                * 
                                {!! $currency !!}{{number_format($d->price,2)}}
                            </td>
                            <td class='text-end'>
                                {!! $currency !!} {{number_format($d->price*($d->quantity-$d->rtn_quantity),2)}}
                            </td>
                        </tr>
                        <?php $total += $d->price*($d->quantity-$d->rtn_quantity); ?>
                    @endforeach 
                @endif
                @endforeach                
            </tbody>
            <tfoot>
                <tr>
                    <th class="text-end" colspan="3">Total</th>
                    <th class="text-end">{!! $currency !!}{{ number_format($total,2) }}</th>
                </tr>
            </tfoot>
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
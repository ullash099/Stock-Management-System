<!DOCTYPE html>
<html lang="@yield('lang')">
<head>
    <title>@yield('title')</title>
    <meta charset="UTF-8">

    <script src="{{ asset('jquery/jquery.min.js') }}"></script>
    <link href="{{ asset('saas/css/app.min.css') }}" rel="stylesheet" type="text/css" id="light-style" />
    <style>
        /**{
            font-size: {{ $fontSize ?? 10 }}pt !important;
            margin :0px !important;
        }
        body{
            background-color:#ffffff !important;
        }*/
        body{
            font: {{ $fontSize ?? 10 }}pt Georgia, "Times New Roman", Times, serif;
            line-height: 1.3;
            background-color:#ffffff !important;
        }
        *{
            font-size: {{ $fontSize ?? 10 }}pt !important;
            margin :0px !important;
        }
        .voucher{
            margin: 5px auto 5px !important;
        }
        @page {
            /* set page margins */
            margin: 0.5cm 0.5cm;
            /* Default footers */
            @bottom-left {
                /*content: "Powered By {{--str_replace('_',' ',env('BRAND_NAMES'))--}}";*/
            }
            @bottom-right {
                content: counter(page) " of " counter(pages);
            }
        }
        @media print {
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
        }
        #footer {
            position: fixed;
            bottom: 0;
        }
        .voucher {
            border: 1px solid #5b5b61;
            padding: 6px;
            border-radius: 5px;
            margin: 5px auto 5px;
            width: -webkit-fit-content;
            width: -moz-fit-content;
            width: fit-content;
            text-align: center;
        }
    </style>
    @yield('style')
</head>
<body>
<div class="container-fluid">
@yield('content')
    <div class="row">
        <div class="col-12">
            <p class="text-center mt-2">
                <small class="fw-bold" style="font-size: 10pt !important;">
                    Powered by: Rowshan Soft. | www.rowshansoft.com | rowshansoft@gmail.com
                </small>
            </p>
        </div>
    </div>
</div>
<script type="text/javascript">
    $(document).ready(function() {
        window.print();
    });
</script>
@yield('js')
</body>
</html>
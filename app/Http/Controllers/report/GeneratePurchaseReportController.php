<?php

namespace App\Http\Controllers\report;

use App\Models\BasicSetting;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\ReportRepository;

class GeneratePurchaseReportController extends Controller
{
    private $report;
    public function __construct(ReportRepository $reportRepository)
    {
        $this->report = $reportRepository;
    }

    public function index(Request $request)
    {
        return $this->report->PurchaseReport($request->startData,$request->endData);
    }
    
    public function print()
    {
        $startData = $_GET['startData'];
        $endData = $_GET['endData'];

        $data = $this->report->PurchaseReport($startData,$endData);
        $basicSettings = BasicSetting::all();
        foreach ($basicSettings as $setting) {
            if (in_array($setting->name,[
                'company_name','company_phone','company_address','company_email',
                'report_print_layout','report_font_size',
                'report_print_language','report_footer_note'
            ])) {
                if ($setting->name == 'report_font_size') {
                    $data['fontSize'] = $setting->val;
                }
                else{
                    $data[$setting->name] = $setting->val;
                } 
            }
        }
        $data['start_date']   = $startData;
        $data['end_date']   = $endData;
        $layout = $data['report_print_layout'];

        return view('print.report.purchase.a4')->with($data);
        /* if ($layout == 'pos') {
            return view('print.report.sales.pos')->with($data);
        } else {
            return view('print.report.sales.a4')->with($data);
        } */
    }
}

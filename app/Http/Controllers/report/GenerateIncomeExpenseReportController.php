<?php

namespace App\Http\Controllers\report;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\ReportRepository;

class GenerateIncomeExpenseReportController extends Controller
{
    private $report;
    public function __construct(ReportRepository $reportRepository)
    {
        $this->report = $reportRepository;
    }

    public function index(Request $request)
    {
        return $this->report->IncomeExpenseReport($request->startData,$request->endData);
    }
}

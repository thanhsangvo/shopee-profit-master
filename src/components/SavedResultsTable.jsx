import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Download, ExternalLink, FileSpreadsheet } from "lucide-react";
import { exportAllToExcel } from "@/utils/exportUtils";

export default function SavedResultsTable({ savedResults, onDelete, onClearAll, onLoad }) {
    if (!savedResults || savedResults.length === 0) return null;

    // Calculate Totals for Footer
    const totals = savedResults.reduce((acc, item) => {
        const f = item.fullData?.fees || {};
        acc.sellingPrice += Number(item.sellingPrice) || 0;
        acc.importPrice += Number(item.fullData?.inputData?.importPrice) || 0;
        acc.fixedFee += Number(f.fixedFee) || 0;
        acc.paymentFee += Number(f.paymentFee) || 0;
        acc.serviceFee += Number(f.serviceFee) || 0;
        acc.tax += Number(f.tax) || 0;
        acc.netProfit += Number(item.netProfit) || 0;
        return acc;
    }, {
        sellingPrice: 0,
        importPrice: 0,
        fixedFee: 0,
        paymentFee: 0,
        serviceFee: 0,
        tax: 0,
        netProfit: 0
    });

    // Calculate overall margin: (Total Profit / Total Revenue) * 100
    const overallMargin = totals.sellingPrice > 0
        ? ((totals.netProfit / totals.sellingPrice) * 100).toFixed(2)
        : 0;

    return (
        <Card className="border-slate-200 shadow-sm mt-8">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div>
                    <CardTitle className="text-xl">Kết Quả Đã Lưu</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">Danh sách các lần tính toán gần đây nhất của bạn.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        onClick={() => exportAllToExcel(savedResults)}
                    >
                        <FileSpreadsheet className="w-4 h-4 mr-2" /> Xuất Excel
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={onClearAll}
                    >
                        Xóa tất cả
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-[13px] text-left border-collapse">
                        <thead className="text-[11px] text-slate-700 uppercase bg-slate-50 border-b">
                            <tr>
                                <th className="px-3 py-3 font-semibold">Sản phẩm</th>
                                <th className="px-3 py-3 text-right font-semibold">Giá nhập</th>
                                <th className="px-3 py-3 text-right font-semibold">Giá bán</th>
                                <th className="px-3 py-3 text-right font-semibold">Phí Cố định</th>
                                <th className="px-3 py-3 text-right font-semibold">Phí T.Toán</th>
                                <th className="px-3 py-3 text-right font-semibold">Phí Dịch vụ</th>
                                <th className="px-3 py-3 text-right font-semibold">Thuế</th>
                                <th className="px-3 py-3 text-right font-semibold">Lợi nhuận</th>
                                <th className="px-3 py-3 text-center font-semibold">Biên LN</th>
                                <th className="px-3 py-3 text-right font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {savedResults.map((item, index) => {
                                const f = item.fullData?.fees || {};
                                return (
                                    <tr key={item.id || index} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-3 py-3">
                                            <div className="font-medium text-slate-900 leading-tight">{item.productName}</div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">{item.categoryLabel?.split(' (')[0]}</div>
                                        </td>
                                        <td className="px-3 py-3 text-right text-slate-600">
                                            {Number(item.fullData?.inputData?.importPrice || 0).toLocaleString()}đ
                                        </td>
                                        <td className="px-3 py-3 text-right font-semibold text-slate-900">
                                            {Number(item.sellingPrice).toLocaleString()}đ
                                        </td>
                                        <td className="px-3 py-3 text-right text-slate-500">
                                            {Number(f.fixedFee || 0).toLocaleString()}đ
                                        </td>
                                        <td className="px-3 py-3 text-right text-slate-500">
                                            {Number(f.paymentFee || 0).toLocaleString()}đ
                                        </td>
                                        <td className="px-3 py-3 text-right text-slate-500">
                                            {Number(f.serviceFee || 0).toLocaleString()}đ
                                        </td>
                                        <td className="px-3 py-3 text-right text-slate-500">
                                            {Number(f.tax || 0).toLocaleString()}đ
                                        </td>
                                        <td className={`px-3 py-3 text-right font-bold ${item.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {item.netProfit.toLocaleString()}đ
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.profitMargin >= 15 ? 'bg-emerald-100 text-emerald-700' :
                                                item.profitMargin >= 5 ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {item.profitMargin}%
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-red-400 hover:text-red-600"
                                                onClick={() => onDelete(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-slate-900 text-white font-bold whitespace-nowrap">
                            <tr>
                                <td className="px-3 py-4 text-emerald-400 uppercase text-[11px] tracking-wider">TỔNG CỘNG ({savedResults.length} SP)</td>
                                <td className="px-3 py-4 text-right border-l border-slate-700">
                                    {totals.importPrice.toLocaleString()}đ
                                </td>
                                <td className="px-3 py-4 text-right border-l border-slate-700">
                                    {totals.sellingPrice.toLocaleString()}đ
                                </td>
                                <td className="px-3 py-4 text-right border-l border-slate-700 text-slate-400 text-[12px]">
                                    {totals.fixedFee.toLocaleString()}đ
                                </td>
                                <td className="px-3 py-4 text-right border-l border-slate-700 text-slate-400 text-[12px]">
                                    {totals.paymentFee.toLocaleString()}đ
                                </td>
                                <td className="px-3 py-4 text-right border-l border-slate-700 text-slate-400 text-[12px]">
                                    {totals.serviceFee.toLocaleString()}đ
                                </td>
                                <td className="px-3 py-4 text-right border-l border-slate-700 text-slate-400 text-[12px]">
                                    {totals.tax.toLocaleString()}đ
                                </td>
                                <td className={`px-3 py-4 text-right border-l border-slate-700 ${totals.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {totals.netProfit.toLocaleString()}đ
                                </td>
                                <td className="px-3 py-4 text-center border-l border-slate-700 text-emerald-400">
                                    {overallMargin}%
                                </td>
                                <td className="bg-slate-800 border-l border-slate-700"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

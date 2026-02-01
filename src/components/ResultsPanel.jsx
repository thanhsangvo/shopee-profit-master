import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download, FileText, Save } from "lucide-react";
import { exportToExcel, exportToWord } from "@/utils/exportUtils";
import AIAdvisor from "@/components/AIAdvisor";

const COLORS = ['#FFBB28', '#FF8042', '#0088FE', '#00C49F', '#8884d8'];

export default function ResultsPanel({ result, inputData, onSave }) {
    if (!result) return null;

    const { netProfit, profitMargin, fees } = result;

    // Data for Chart
    const chartData = [
        { name: 'Phí Thanh Toán', value: fees.paymentFee },
        { name: 'Phí Cố Định', value: fees.fixedFee },
        { name: 'Phí Dịch Vụ', value: fees.serviceFee },
        { name: 'Vận Hành (PiShip)', value: fees.operatingFee },
        { name: 'Thuế (VAT/CIT)', value: fees.tax || 0 },
        { name: 'Bao Bì/Đóng Gói', value: fees.packagingCost || 0 },
        { name: 'Marketing/Ads', value: fees.marketingCost || 0 },
        { name: 'Giá Vốn', value: Number(inputData.importPrice) || 0 }
    ];

    // Prepare full data for export
    const fullData = {
        ...inputData,
        fees,
        netProfit,
        profitMargin,
        breakevenPrice: result.breakevenPrice,
        categoryLabel: inputData.categoryLabel
    };

    return (
        <div className="space-y-6">
            {/* 1. Key Metrics & Advisor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 text-white border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-slate-200 text-lg font-medium">Lợi Nhuận Dự Tính</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold mb-2">
                            {netProfit.toLocaleString('vi-VN')} đ
                        </div>
                        <div className={`text-sm font-medium px-2 py-1 rounded inline-block ${profitMargin > 15 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                            Biên LN: {profitMargin}%
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>Điểm Hòa Vốn:</span>
                                <span className="text-white font-medium">{result.breakevenPrice.toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <AIAdvisor profitMargin={profitMargin} netProfit={netProfit} />
            </div>

            {/* 2. Charts & Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Column */}
                <Card className="lg:col-span-1 border-none shadow-none bg-transparent lg:bg-white lg:shadow-sm lg:border">
                    <CardHeader><CardTitle className="text-base">Cơ Cấu Chi Phí</CardTitle></CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val) => `${val.toLocaleString()}đ`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500 mt-2">
                            {chartData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full" style={{ background: COLORS[index] }}></div>
                                    <span>{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Table Column */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Chi Tiết Các Loại Phí (2026)</CardTitle>
                        <div className="flex gap-2">
                            <Button size="sm" variant="default" className="bg-emerald-600 hover:bg-emerald-700 shadow-sm" onClick={onSave}>
                                <Save className="w-4 h-4 mr-2" /> Lưu
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => exportToExcel(fullData)}>
                                <Download className="w-4 h-4 mr-2" /> Excel
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => exportToWord(fullData)}>
                                <FileText className="w-4 h-4 mr-2" /> Word
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-slate-600">Doanh Thu (Giá Bán)</span>
                                <span className="font-bold">{Number(inputData.sellingPrice).toLocaleString()} đ</span>
                            </div>

                            <div className="space-y-2">
                                <FeeRow label="Phí Cố Định (Theo ngành hàng)" value={fees.fixedFee} />
                                <FeeRow label="Phí Thanh Toán (4.91%)" value={fees.paymentFee} />
                                <FeeRow label="Phí Dịch Vụ (Xtra)" value={fees.serviceFee} />
                                <FeeRow label="Phí Vận Hành (PiShip)" value={fees.operatingFee} />
                                <FeeRow label="Thuế GTGT/TNCN" value={fees.tax || 0} />
                                <FeeRow label="Phí Bao Bì/Đóng Gói" value={fees.packagingCost || 0} />
                                <FeeRow label="Phí Marketing/Ads" value={fees.marketingCost || 0} />
                                <FeeRow label="Tổng Phí Sàn & Thuế" value={fees.totalFees} isTotal />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function FeeRow({ label, value, isTotal }) {
    return (
        <div className={`flex justify-between items-center py-1 ${isTotal ? "font-bold text-slate-900 pt-2 mt-2 border-t" : "text-sm text-slate-500"}`}>
            <span>{label}</span>
            <span className={isTotal ? "text-red-500" : ""}>-{value.toLocaleString()} đ</span>
        </div>
    )
}

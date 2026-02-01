import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw } from "lucide-react";
import ResultsPanel from "./ResultsPanel";
import { calculateFees, calculateProfit, calculateBreakeven, CONSTANTS } from "@/utils/feeCalculators";

export default function CalculatorForm({ onSaveResult }) {
    const [formData, setFormData] = useState({
        productName: "",
        sellingPrice: 100000,
        importPrice: 50000,
        category: "fashion",
        isMall: false,
        hasFreeshipXtra: false,
        hasVoucherXtra: false,
        hasPiShip: true,
        taxRate: 8,
        packagingCost: 0,
        marketingCost: 0,
    });

    const [result, setResult] = useState(null);

    const CATEGORIES = [
        { value: "fashion", label: "Thời trang Nữ/Nam/Trẻ em (13.5%)" },
        { value: "beauty_skincare", label: "Sắc đẹp - Chăm sóc da mặt (14.0%)" },
        { value: "health_supplements", label: "Sức khỏe - Thực phẩm chức năng (14.0%)" },
        { value: "phones_accessories", label: "Điện thoại & Phụ kiện (12.0%)" },
        { value: "audio_cameras", label: "Thiết bị âm thanh/Cameras (10.0%)" },
        { value: "computers_components", label: "Máy tính & Laptop (Linh kiện) (7.5%)" },
        { value: "electronics_tv", label: "Điện tử - Tivi & Phụ kiện (8.0%)" },
        { value: "large_appliances", label: "Điện gia dụng lớn (7.5%)" },
        { value: "kitchen_home", label: "Đồ gia dụng nhà bếp (10.0%)" },
        { value: "food_beverage", label: "Thực phẩm & Đồ uống (11.0%)" },
        { value: "pet_care", label: "Chăm sóc thú cưng (13.0%)" },
        { value: "auto_parts", label: "Ô tô - Phụ tùng & Chăm sóc (13.0%)" },
        { value: "voucher_services", label: "Voucher & Dịch vụ (11.0%)" },
        { value: "devices_premium", label: "Laptop / Màn hình / Điện thoại (máy) (2.0%)" },
        { value: "default", label: "Khác (Mặc định - 10.0%)" },
    ];

    useEffect(() => {
        handleCalculate();
    }, [formData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const isStringField = name === "category" || name === "productName";
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : (isStringField ? value : Number(value))
        }));
    };

    const handleCalculate = () => {
        const fees = calculateFees({
            sellingPrice: formData.sellingPrice,
            category: formData.category,
            isMall: formData.isMall,
            hasFreeshipXtra: formData.hasFreeshipXtra,
            hasVoucherXtra: formData.hasVoucherXtra,
            taxRate: formData.taxRate,
            hasPiShip: formData.hasPiShip,
            packagingCost: formData.packagingCost,
            marketingCost: formData.marketingCost
        });

        const profitData = calculateProfit({
            sellingPrice: formData.sellingPrice,
            importPrice: formData.importPrice,
            fees
        });

        const breakeven = calculateBreakeven({
            importPrice: formData.importPrice,
            category: formData.category,
            isMall: formData.isMall,
            hasFreeshipXtra: formData.hasFreeshipXtra,
            hasVoucherXtra: formData.hasVoucherXtra,
            taxRate: formData.taxRate,
            hasPiShip: formData.hasPiShip,
            packagingCost: formData.packagingCost,
            marketingCost: formData.marketingCost
        });

        // Get category label
        const catLabel = CATEGORIES.find(c => c.value === formData.category)?.label || "Khác";

        setResult({
            ...profitData,
            fees,
            breakevenPrice: breakeven,
            inputData: { ...formData, categoryLabel: catLabel }
        });
    };

    return (
        <div className="space-y-8">
            <Card className="border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Column 1: Prices */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="productName">Tên Sản Phẩm (Tùy chọn)</Label>
                                <Input
                                    id="productName"
                                    name="productName"
                                    type="text"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    placeholder="VD: Áo Thun Nam, Kem Chống Nắng..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sellingPrice">Giá Bán Dự Kiến (đ)</Label>
                                <Input
                                    id="sellingPrice"
                                    name="sellingPrice"
                                    type="number"
                                    value={formData.sellingPrice}
                                    onChange={handleChange}
                                    className="font-bold text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="importPrice">Giá Nhập (Giá Vốn) (đ)</Label>
                                <Input
                                    id="importPrice"
                                    name="importPrice"
                                    type="number"
                                    value={formData.importPrice}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Ngành Hàng</Label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="packagingCost">Phí Bao Bì/Đóng Gói (đ)</Label>
                                <Input
                                    id="packagingCost"
                                    name="packagingCost"
                                    type="number"
                                    value={formData.packagingCost}
                                    onChange={handleChange}
                                    placeholder="VD: 5000"
                                />
                                <p className="text-[10px] text-orange-600 bg-orange-50 p-1.5 rounded flex items-center gap-1">
                                    💡 <a href="https://s.shopee.vn/9AIpdhAWHq" target="_blank" rel="noopener noreferrer" className="font-bold underline">Mua băng keo giá xưởng</a> để tiết kiệm chi phí đóng gói.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="marketingCost">Phí Marketing/Ads Dự Tính (đ)</Label>
                                <Input
                                    id="marketingCost"
                                    name="marketingCost"
                                    type="number"
                                    value={formData.marketingCost}
                                    onChange={handleChange}
                                    placeholder="VD: 10000"
                                />
                            </div>
                        </div>

                        {/* Column 2: Fees & Services */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 border p-3 rounded-lg bg-slate-50">
                                <input
                                    type="checkbox"
                                    id="isMall"
                                    name="isMall"
                                    checked={formData.isMall}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950"
                                />
                                <Label htmlFor="isMall" className="flex-1 cursor-pointer">Shop Bạn là Shopee Mall?</Label>
                            </div>

                            <div className="flex items-center space-x-2 border p-3 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="hasFreeshipXtra"
                                    name="hasFreeshipXtra"
                                    checked={formData.hasFreeshipXtra}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950"
                                />
                                <Label htmlFor="hasFreeshipXtra" className="flex-1 cursor-pointer">Tham gia Freeship Xtra? (~6%)</Label>
                            </div>

                            <div className="flex items-center space-x-2 border p-3 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="hasVoucherXtra"
                                    name="hasVoucherXtra"
                                    checked={formData.hasVoucherXtra}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950"
                                />
                                <Label htmlFor="hasVoucherXtra" className="flex-1 cursor-pointer">Tham gia Voucher Xtra? (~4%)</Label>
                            </div>

                            <div className="flex items-center space-x-2 border p-3 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="hasPiShip"
                                    name="hasPiShip"
                                    checked={formData.hasPiShip}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-950"
                                />
                                <Label htmlFor="hasPiShip" className="flex-1 cursor-pointer">Sử dụng gói PiShip? (1.620đ)</Label>
                            </div>

                            <div className="space-y-2 pt-2 border-t mt-4">
                                <Label htmlFor="taxRate">VAT/Thuế TNCN (%)</Label>
                                <div className="relative">
                                    <Input
                                        id="taxRate"
                                        name="taxRate"
                                        type="number"
                                        value={formData.taxRate}
                                        onChange={handleChange}
                                        placeholder="VD: 8"
                                        className="pr-10"
                                    />
                                    <span className="absolute right-3 top-2.5 text-sm text-slate-400">%</span>
                                </div>
                                <p className="text-xs text-slate-500">Mặc định: 8%. Điều chỉnh nếu mức thuế của bạn khác.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Results Display */}
            {result && (
                <ResultsPanel
                    result={result}
                    inputData={result.inputData}
                    onSave={() => onSaveResult(result)}
                />
            )}
        </div>
    );
}

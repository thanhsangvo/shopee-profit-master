import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIAdvisor({ profitMargin, netProfit }) {
    // Determine status and message
    let status = "neutral";
    let Icon = Lightbulb;
    let title = "AI Tư Vấn";
    let message = "Nhập dữ liệu để nhận phân tích.";
    let bgClass = "bg-slate-50 border-slate-200";
    let textClass = "text-slate-600";

    if (profitMargin !== undefined && !isNaN(profitMargin)) {
        if (netProfit < 0) {
            status = "danger";
            Icon = AlertTriangle;
            title = "Cảnh Báo: Lỗ Vốn!";
            message = "Sản phẩm này đang lỗ. Bạn cần kiểm tra lại giá nhập hoặc cắt giảm các gói phí dịch vụ (Freeship/Voucher Xtra).";
            bgClass = "bg-red-50 border-red-200";
            textClass = "text-red-700";
        } else if (profitMargin < 10) {
            status = "warning";
            Icon = AlertTriangle;
            title = "Biên Lợi Nhuận Thấp (<10%)";
            message = "Lợi nhuận mỏng. Rủi ro cao nếu có hoàn hàng. Cân nhắc tăng giá bán hoặc tối ưu chi phí bao bì/vận hành.";
            bgClass = "bg-amber-50 border-amber-200";
            textClass = "text-amber-700";
        } else if (profitMargin >= 10 && profitMargin < 20) {
            status = "good";
            Icon = CheckCircle;
            title = "Lợi Nhuận Ổn Định (10-20%)";
            message = "Mức lợi nhuận chấp nhận được. Có thể chạy quảng cáo nhẹ để tăng số lượng bán.";
            bgClass = "bg-blue-50 border-blue-200";
            textClass = "text-blue-700";
        } else {
            status = "excellent";
            Icon = TrendingUp;
            title = "Lợi Nhuận Tốt (>20%)";
            message = "Tuyệt vời! Sản phẩm này có biên lợi nhuận tốt. Hãy tập trung đẩy traffic và tham gia Campaign.";
            bgClass = "bg-emerald-50 border-emerald-200";
            textClass = "text-emerald-700";
        }
    }

    return (
        <Card className={cn("border transition-colors", bgClass)}>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                <Icon className={cn("h-5 w-5", textClass)} />
                <CardTitle className={cn("text-base", textClass)}>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={cn("text-sm", textClass)}>
                    {message}
                </p>
            </CardContent>
        </Card>
    );
}

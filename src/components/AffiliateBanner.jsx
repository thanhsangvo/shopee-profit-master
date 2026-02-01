import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, Coffee } from "lucide-react";

export default function AffiliateBanner() {
    const affiliateUrl = "https://s.shopee.vn/9AIpdhAWHq";

    return (
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 shadow-md">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 shrink-0">
                        <ShoppingBag className="w-12 h-12 text-[#EE4D2D]" />
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
                            Ủng hộ tác giả <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        </h3>
                        <p className="text-slate-600">
                            Cảm ơn anh/chị đã sử dụng công cụ! Để em có kinh phí duy trì hosting và cập nhật chính sách phí mới nhất, anh/ chị có thể ghé thăm shop
                            <span className="font-bold text-[#EE4D2D]"> Băng keo đóng hàng </span>
                            giá xưởng của em tại đây nhé. Mỗi đơn hàng của anh/chị là động lực rất lớn cho em!
                        </p>
                    </div>

                    <div className="shrink-0 flex flex-col gap-3">
                        <Button
                            asChild
                            className="bg-[#EE4D2D] hover:bg-[#d73211] text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-orange-200 transition-all hover:scale-105"
                        >
                            <a href={affiliateUrl} target="_blank" rel="noopener noreferrer">
                                Ghé Thăm Shop <ShoppingBag className="ml-2 w-5 h-5" />
                            </a>
                        </Button>
                        <p className="text-[10px] text-center text-slate-400 italic">Giá rẻ hơn thị trường - Giao nhanh 24h</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

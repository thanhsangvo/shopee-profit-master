import React, { useState, useEffect } from 'react';
import CalculatorForm from "@/components/CalculatorForm";
import SavedResultsTable from "@/components/SavedResultsTable";
import AffiliateBanner from "@/components/AffiliateBanner";
import { Facebook, MessageCircle } from "lucide-react";

function App() {
  const [savedResults, setSavedResults] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('shopee_saved_results');
    if (stored) {
      try {
        setSavedResults(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved results", e);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('shopee_saved_results', JSON.stringify(savedResults));
  }, [savedResults]);

  const handleSaveResult = (resultData) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      productName: resultData.inputData.productName || "Sản phẩm chưa đặt tên",
      sellingPrice: resultData.inputData.sellingPrice,
      categoryLabel: resultData.inputData.categoryLabel,
      netProfit: resultData.netProfit,
      profitMargin: resultData.profitMargin,
      // Store full data in case we need to reload it later
      fullData: resultData
    };

    setSavedResults(prev => [newEntry, ...prev]);
  };

  const handleDeleteResult = (id) => {
    setSavedResults(prev => prev.filter(item => item.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tất cả kết quả đã lưu?")) {
      setSavedResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8 -mt-15">
        <header className="space-y-0">
          <div className="flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Shopee Logo"
              className="h-50 w-auto"
            />
          </div>

          <div className="text-center space-y-3 -mt-10">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Shopee Profit Master <span className="text-primary">2026</span></h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Công cụ tối ưu lợi nhuận chính xác nhất dành cho nhà bán hàng chuyên nghiệp, cập nhật chính sách phí mới (29/12/2025).
            </p>
          </div>
        </header>

        <main className="space-y-8">
          <CalculatorForm onSaveResult={handleSaveResult} />

          <AffiliateBanner />

          <SavedResultsTable
            savedResults={savedResults}
            onDelete={handleDeleteResult}
            onClearAll={handleClearAll}
          />
        </main>

        <footer className="text-center text-sm text-slate-400 pt-10 pb-4 border-t border-slate-100 mt-10">
          <div className="flex items-center justify-center gap-6 mb-4">
            <a
              href="https://zalo.me/g/qlkrld553"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#0068FF] transition-colors font-medium bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100"
            >
              <MessageCircle className="w-4 h-4 text-[#0068FF]" /> Zalo Group
            </a>
            <a
              href="https://www.facebook.com/pl.thanhsang"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#1877F2] transition-colors font-medium bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100"
            >
              <Facebook className="w-4 h-4 text-[#1877F2]" /> Facebook
            </a>
          </div>
          <p>© 2026 Shopee Profit Master by Dev Sang.</p>
        </footer>
      </div>
    </div>
  )
}

export default App;

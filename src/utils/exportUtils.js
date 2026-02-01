import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export function exportToExcel(data, fileName = "shopee-profit-report") {
  // Format data for clearer Excel output
  const formattedData = {
    "Tên Sản Phẩm": data.productName || "Sản phẩm A",
    "Ngày Báo Cáo": new Date().toLocaleDateString('vi-VN'),
    "Loại Shop": data.isMall ? "Shopee Mall" : "Shop Thường",
    "Ngành Hàng": data.categoryLabel,
    "Giá Bán (đ)": data.sellingPrice,
    "Giá Vốn (đ)": data.importPrice,
    "Phí Cố Định (đ)": data.fees.fixedFee,
    "Phí Thanh Toán (đ)": data.fees.paymentFee,
    "Phí Dịch Vụ (đ)": data.fees.serviceFee,
    "Phí Vận Hành (đ)": data.fees.operatingFee,
    "Tổng Phí Sàn (đ)": data.fees.totalFees,
    "Lợi Nhuận Ròng (đ)": data.netProfit,
    "Biên Lợi Nhuận (%)": `${data.profitMargin}%`,
    "Điểm Hòa Vốn (đ)": data.breakevenPrice
  };

  const ws = XLSX.utils.json_to_sheet([formattedData]);

  // Adjust column widths
  ws['!cols'] = [
    { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    { wch: 15 }, { wch: 15 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Báo Cáo Lợi Nhuận");

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `${fileName}_${Date.now()}.xlsx`);
}

export function exportToWord(data, fileName = "baocao-chien-luoc") {
  // Simple HTML export that Word can open
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Báo Cáo Chiến Lược</title></head>
    <body style="font-family: 'Times New Roman', serif;">
      <h1 style="text-align: center; color: #EE4D2D;">BÁO CÁO PHÂN TÍCH LỢI NHUẬN SHOPEE</h1>
      <p style="text-align: center;">Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}</p>
      <hr/>
      <h2>1. Thông Tin Sản Phẩm</h2>
      <ul>
        <li><b>Sản Phẩm:</b> ${data.productName || "Sản phẩm mẫu"}</li>
        <li><b>Loại Shop:</b> ${data.isMall ? "Shopee Mall" : "Shop Thường"}</li>
        <li><b>Ngành Hàng:</b> ${data.categoryLabel}</li>
      </ul>
      
      <h2>2. Chỉ Số Tài Chính</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f0f0f0;">
          <th>Chỉ Số</th>
          <th>Giá Trị</th>
        </tr>
        <tr>
          <td>Giá Bán</td>
          <td style="text-align: right;">${data.sellingPrice.toLocaleString('vi-VN')} đ</td>
        </tr>
        <tr>
          <td>Lợi Nhuận Ròng</td>
          <td style="text-align: right; font-weight: bold; color: ${data.netProfit > 0 ? 'green' : 'red'};">${data.netProfit.toLocaleString('vi-VN')} đ</td>
        </tr>
        <tr>
          <td>Biên Lợi Nhuận</td>
          <td style="text-align: right;">${data.profitMargin}%</td>
        </tr>
        <tr>
          <td>Điểm Hòa Vốn</td>
          <td style="text-align: right;">${data.breakevenPrice.toLocaleString('vi-VN')} đ</td>
        </tr>
      </table>
      
      <h2>3. Chi Tiết Các Loại Phí (2026)</h2>
      <ul>
        <li>Phí Cố Định: ${data.fees.fixedFee.toLocaleString('vi-VN')} đ</li>
        <li>Phí Thanh Toán (4.91%): ${data.fees.paymentFee.toLocaleString('vi-VN')} đ</li>
        <li>Phí Dịch Vụ (Freeship/Voucher): ${data.fees.serviceFee.toLocaleString('vi-VN')} đ</li>
        <li>Phí Vận Hành (PiShip): ${data.fees.operatingFee.toLocaleString('vi-VN')} đ</li>
      </ul>
      
      <p><i>Báo cáo được tạo tự động bởi Shopee Profit Master 2026.</i></p>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  });
  saveAs(blob, `${fileName}_${Date.now()}.doc`);
}

export function exportAllToExcel(results, fileName = "shopee-saved-calculations") {
  if (!results || results.length === 0) return;

  const formattedData = results.map(item => {
    const f = item.fullData?.fees || {};
    return {
      "Ngày Lưu": new Date(item.timestamp).toLocaleString('vi-VN'),
      "Tên Sản Phẩm": item.productName || "N/A",
      "Ngành Hàng": item.categoryLabel || "Khác",
      "Giá Nhập (đ)": item.fullData?.inputData?.importPrice || 0,
      "Giá Bán (đ)": item.sellingPrice,
      "Phí Cố Định (đ)": f.fixedFee || 0,
      "Phí Thanh Toán (đ)": f.paymentFee || 0,
      "Phí Dịch Vụ (đ)": f.serviceFee || 0,
      "Thuế (đ)": f.tax || 0,
      "Lợi Nhuận Ròng (đ)": item.netProfit,
      "Biên Lợi Nhuận (%)": `${item.profitMargin}%`
    };
  });

  // Add summary row
  const totals = results.reduce((acc, item) => {
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

  const overallMargin = totals.sellingPrice > 0
    ? ((totals.netProfit / totals.sellingPrice) * 100).toFixed(2)
    : 0;

  formattedData.push({
    "Ngày Lưu": "TỔNG CỘNG",
    "Tên Sản Phẩm": `Số lượng: ${results.length}`,
    "Ngành Hàng": "-",
    "Giá Nhập (đ)": totals.importPrice,
    "Giá Bán (đ)": totals.sellingPrice,
    "Phí Cố Định (đ)": totals.fixedFee,
    "Phí Thanh Toán (đ)": totals.paymentFee,
    "Phí Dịch Vụ (đ)": totals.serviceFee,
    "Thuế (đ)": totals.tax,
    "Lợi Nhuận Ròng (đ)": totals.netProfit,
    "Biên Lợi Nhuận (%)": `${overallMargin}%`
  });

  const ws = XLSX.utils.json_to_sheet(formattedData);

  // Adjust column widths
  ws['!cols'] = [
    { wch: 20 }, { wch: 30 }, { wch: 25 },
    { wch: 15 }, { wch: 15 }, { wch: 15 },
    { wch: 15 }, { wch: 15 }, { wch: 15 },
    { wch: 15 }, { wch: 20 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Danh Sách Đã Lưu");

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `${fileName}_${Date.now()}.xlsx`);
}

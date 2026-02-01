/**
 * Shopee Profit Master 2026 - Fee Calculation Engine
 */

export const CONSTANTS = {
    PAYMENT_FEE_RATE: 0.0491, // 4.91% (VAT included)
    PISHIP_FEE: 1620,         // Fixed operating cost per order

    // Service Fees (Approximate, usually capped)
    FREESHIP_XTRA_RATE: 0.06, // Example rate
    FREESHIP_XTRA_CAP: 20000,

    VOUCHER_XTRA_RATE: 0.04,
    VOUCHER_XTRA_CAP: 20000, // Check specific caps

    // Specific Fixed Fees by Category (Non-Mall) - 2026 Policy
    FIXED_FEES_NON_MALL: {
        "fashion": 0.135,           // Thời trang Nữ/Nam/Trẻ em (13.5%)
        "beauty_skincare": 0.14,    // Sắc đẹp - Chăm sóc da mặt (14.0%)
        "health_supplements": 0.14, // Sức khỏe - Thực phẩm chức năng (14.0%)
        "phones_accessories": 0.12, // Điện thoại & Phụ kiện (12.0%)
        "audio_cameras": 0.10,      // Thiết bị âm thanh/Cameras (10.0%)
        "computers_components": 0.075, // Máy tính & Laptop (Linh kiện) (7.5%)
        "electronics_tv": 0.08,     // Điện tử - Tivi & Phụ kiện (8.0%)
        "large_appliances": 0.075,  // Điện gia dụng lớn (7.5%)
        "kitchen_home": 0.10,       // Đồ gia dụng nhà bếp (10.0%)
        "food_beverage": 0.11,      // Thực phẩm & Đồ uống (11.0%)
        "pet_care": 0.13,           // Chăm sóc thú cưng (13.0%)
        "auto_parts": 0.13,         // Ô tô - Phụ tùng & Chăm sóc (13.0%)
        "voucher_services": 0.11,   // Voucher & Dịch vụ (11.0%)
        "devices_premium": 0.02,    // Laptop / Màn hình / Điện thoại (máy) (2.0%)
        "default": 0.10             // Mức trung bình
    },

    FIXED_FEES_MALL: {
        "fashion": 0.12,
        "electronics": 0.06,
        "default": 0.10
    }
};

export function calculateFees({
    sellingPrice, // Giá bán
    category = "default",
    isMall = false,
    hasFreeshipXtra = false,
    hasVoucherXtra = false,
}) {
    const fees = {};

    // 1. Payment Fee (Phí thanh toán)
    // Shopee công thức: (Giá bán + Phí vận chuyển) * Rate. 
    // Ở đây giả sử shopee trả ship hoặc tính trên giá bán người mua trả.
    // Thường tính trên Tổng giá trị đơn hàng.
    fees.paymentFee = Math.round(sellingPrice * CONSTANTS.PAYMENT_FEE_RATE);

    // 2. Fixed Fee (Phí cố định)
    const rateMap = isMall ? CONSTANTS.FIXED_FEES_MALL : CONSTANTS.FIXED_FEES_NON_MALL;
    const fixedRate = rateMap[category] || rateMap["default"];
    fees.fixedFee = Math.round(sellingPrice * fixedRate);

    // 3. Service Fees (Phí dịch vụ)
    fees.serviceFee = 0;

    if (hasFreeshipXtra) {
        let fsFee = sellingPrice * CONSTANTS.FREESHIP_XTRA_RATE;
        if (fsFee > CONSTANTS.FREESHIP_XTRA_CAP) fsFee = CONSTANTS.FREESHIP_XTRA_CAP;
        fees.serviceFee += Math.round(fsFee);
    }

    if (hasVoucherXtra) {
        let vxFee = sellingPrice * CONSTANTS.VOUCHER_XTRA_RATE;
        if (vxFee > CONSTANTS.VOUCHER_XTRA_CAP) vxFee = CONSTANTS.VOUCHER_XTRA_CAP;
        fees.serviceFee += Math.round(vxFee);
    }

    // 4. Operating/PiShip Fee
    const hasPiShip = arguments[0].hasPiShip ?? true; // Default to true if not specified for backward compat, or update caller.
    fees.operatingFee = hasPiShip ? CONSTANTS.PISHIP_FEE : 0;

    // 5. Tax (VAT/CIT)
    // We treat this as an expense deducted from revenue.
    // Formula: Tax = SellingPrice * (taxRate / 100)
    const taxRate = arguments[0].taxRate || 0;
    fees.tax = Math.round(sellingPrice * (taxRate / 100));

    // 6. Packaging/Wrapping Cost (User input - absolute value)
    fees.packagingCost = Number(arguments[0].packagingCost) || 0;

    // 7. Marketing/Ads Cost (User input - absolute value)
    fees.marketingCost = Number(arguments[0].marketingCost) || 0;

    fees.totalFees = fees.paymentFee + fees.fixedFee + fees.serviceFee + fees.operatingFee + fees.tax + fees.packagingCost + fees.marketingCost;

    return fees;
}

export function calculateProfit({
    sellingPrice,
    importPrice,
    fees
}) {
    const netProfit = sellingPrice - importPrice - fees.totalFees;
    const profitMargin = (netProfit / sellingPrice) * 100;

    return {
        netProfit,
        profitMargin: parseFloat(profitMargin.toFixed(2))
    };
}

export function calculateBreakeven({
    importPrice,
    category = "default",
    isMall = false,
    hasFreeshipXtra = false,
    hasVoucherXtra = false,
    taxRate = 0,
    hasPiShip = true,
    packagingCost = 0,
    marketingCost = 0
}) {
    // Breakeven Price = (Import Price + Fixed Costs) / (1 - Variable Fee Rates - Tax Rate)
    // Variable Rates: Payment Fee + Fixed Fee % + Service Fee % + Tax %

    const paymentRate = CONSTANTS.PAYMENT_FEE_RATE;

    const rateMap = isMall ? CONSTANTS.FIXED_FEES_MALL : CONSTANTS.FIXED_FEES_NON_MALL;
    const fixedRate = rateMap[category] || rateMap["default"];

    let serviceRate = 0;
    if (hasFreeshipXtra) serviceRate += CONSTANTS.FREESHIP_XTRA_RATE;
    if (hasVoucherXtra) serviceRate += CONSTANTS.VOUCHER_XTRA_RATE;

    const taxPercent = taxRate / 100;

    // Note: Cap logic makes exact formula complex. For simplicity, we assume fees are under cap for breakeven estimation
    // Or purely divide.

    const totalVariableRate = paymentRate + fixedRate + serviceRate + taxPercent;

    // Fixed costs per unit: PiShip + Packaging + Marketing
    const piShipCost = hasPiShip ? CONSTANTS.PISHIP_FEE : 0;
    const totalFixedCostPerUnit = importPrice + piShipCost + Number(packagingCost) + Number(marketingCost);

    const breakevenPrice = totalFixedCostPerUnit / (1 - totalVariableRate);

    return Math.ceil(breakevenPrice);
}

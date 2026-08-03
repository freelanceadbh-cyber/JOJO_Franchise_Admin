export const GST_RATE = 0.05;
export const GST_PERCENT = 5;

export function calculateTaxBreakdown(subtotal: number) {
  const gstAmount = subtotal * GST_RATE;
  const finalAmount = subtotal + gstAmount;

  return {
    subtotal,
    gstAmount,
    finalAmount,
  };
}
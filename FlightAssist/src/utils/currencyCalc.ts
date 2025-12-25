export const currencyCalc = (value: number, fractionDigits = 6): string => {
  return (
    new Intl.NumberFormat("vi-VN", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value) + " ₫"
  );
};

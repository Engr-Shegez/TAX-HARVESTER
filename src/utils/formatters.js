export const formatCurrency = (value)=> {
    return new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};
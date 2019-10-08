function getTax(data) {
  return getSubtotal(data) * 0.13;
}

function getSubtotal(data) {
  return data.reduce((acc, item) => {
    return acc + item.quantity * item.cost;
  }, 0);
}

export function getTotals(data) {
  const tax = getTax(data);
  const subtotal = getSubtotal(data);
  const total = subtotal + tax;

  return {
    subtotal,
    tax,
    total
  };
}

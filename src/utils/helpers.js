export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatMoney = (amount) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount);
};

export const groupRecordsByDate = (records) => {
  return records.reduce((groups, record) => {
    const date = new Date(record.date).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {});
};

export const calculateTotals = (records) => {
  return records.reduce(
    (totals, record) => {
      if (record.type === 'income') {
        totals.income += Number(record.amount);
      } else {
        totals.expense += Number(record.amount);
      }
      totals.balance = totals.income - totals.expense;
      return totals;
    },
    { income: 0, expense: 0, balance: 0 }
  );
}; 
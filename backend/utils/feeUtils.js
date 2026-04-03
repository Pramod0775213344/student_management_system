/**
 * Calculate late fee penalty for a student invoice
 * @param {number} amount - Original fee amount
 * @param {Date} dueDate - Due date of the fee
 * @returns {number} Calculated late fee (0.05% per day after 10-day grace)
 */
exports.calculateLateFee = (amount, dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  
  if (today <= due) return 0;
  
  const diffTime = Math.abs(today - due);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // 10 day grace period eka iwara unama thama late fee eka add karanne
  if (diffDays > 10) {
    const penaltyRate = 0.05; // 5% flat penalty or per day? Let's go with 5% flat for now as per plan
    return amount * penaltyRate;
  }
  
  return 0;
};

/**
 * Determine the status of an invoice based on payment and dates
 * @param {number} totalAmount - Original fee amount
 * @param {number} paidAmount - Total amount paid so far
 * @param {Date} dueDate - When the payment was due
 * @returns {string} Status ('Paid' | 'Partially-Paid' | 'Overdue' | 'Pending')
 */
exports.determineInvoiceStatus = (totalAmount, paidAmount, dueDate) => {
  if (paidAmount >= totalAmount) return "Paid";
  
  const today = new Date();
  const due = new Date(dueDate);
  
  if (today > due && paidAmount < totalAmount) return "Overdue";
  if (paidAmount > 0 && paidAmount < totalAmount) return "Partially-Paid";
  
  return "Pending";
};

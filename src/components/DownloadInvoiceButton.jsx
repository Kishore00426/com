import React from 'react';

const DownloadInvoiceButton = ({ order }) => {
  const downloadInvoice = () => {
    const invoiceData = {
      orderId: order.id,
      date: order.date,
      shippingInfo: order.shippingInfo,
      paymentMethod: order.paymentMethod,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
    };

    const dataStr = JSON.stringify(invoiceData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.download = `invoice-${order.id}.json`;
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadInvoice}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
    >
      Download Invoice
    </button>
  );
};

export default DownloadInvoiceButton;

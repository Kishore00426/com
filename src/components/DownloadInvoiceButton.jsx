import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DownloadInvoiceButton = ({ order }) => {
  const downloadInvoice = async () => {
    // Create a temporary div to render the invoice HTML
    const invoiceDiv = document.createElement('div');
    invoiceDiv.style.position = 'absolute';
    invoiceDiv.style.left = '-9999px';
    invoiceDiv.style.top = '-9999px';
    invoiceDiv.style.width = '800px';
    invoiceDiv.style.backgroundColor = 'white';
    invoiceDiv.style.color = 'black';
    invoiceDiv.style.fontFamily = 'Arial, sans-serif';
    invoiceDiv.style.padding = '20px';
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.title}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">$${item.price.toFixed(2)}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    invoiceDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #333;">Invoice</h1>
        <p>Order ID: ${order.id}</p>
        <p>Date: ${order.date}</p>
      </div>
      <div style="margin-bottom: 20px;">
        <h2>Shipping Information</h2>
        <p>${order.shippingInfo.name}</p>
        <p>${order.shippingInfo.address}</p>
        <p>${order.shippingInfo.city}, ${order.shippingInfo.zipCode}</p>
        <p>${order.shippingInfo.email}</p>
        <p>${order.shippingInfo.phone}</p>
      </div>
      <div style="margin-bottom: 20px;">
        <h2>Payment Method</h2>
        <p>${order.paymentMethod}</p>
      </div>
      <div style="margin-bottom: 20px;">
        <h2>Items</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>
      <div style="text-align: right;">
        <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
        <p>Tax: $${order.tax.toFixed(2)}</p>
        <p>Shipping: $${order.shipping.toFixed(2)}</p>
        <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
      </div>
    `;
    document.body.appendChild(invoiceDiv);

    try {
      const canvas = await html2canvas(invoiceDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${order.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      document.body.removeChild(invoiceDiv);
    }
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

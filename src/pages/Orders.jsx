import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import DownloadInvoiceButton from '../components/DownloadInvoiceButton';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, []);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <main className="flex-grow p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">Your Orders</h2>
        {orders.length === 0 ? (
          <div className="bg-zinc-950 rounded-lg shadow-md p-6">
            <p className="text-gray-200 text-center">You have no orders yet.</p>
            <p className="text-gray-500 text-center mt-2">Start shopping to see your order history here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-zinc-950 rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-left">
                    <p className="text-gray-400 text-sm whitespace-nowrap">
                      Order No: #{order.id} | Placed on: <span className='text-orange-200'>{new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}</span> | Payment Method: <span className='text-sky-300'>{
                        order.paymentMethod === 'card' ? 'Credit Card' :
                        order.paymentMethod === 'paypal' ? 'PayPal' :
                        order.paymentMethod === 'upi' ? 'UPI' :
                        order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod
                      }</span>
                    </p>
                  </div>
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="flex items-center justify-center p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    {expandedOrder === order.id ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {expandedOrder === order.id && (
                  <div className="mt-4">
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-2">Product Name</th>
                            <th className="text-center py-2">Quantity</th>
                            <th className="text-center py-2">Price</th>
                            <th className="text-center py-2">Discount</th>
                            <th className="text-center py-2">Offers</th>
                            <th className="text-center py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.id} className="border-b border-gray-700">
                              <td className="py-2">{item.title}</td>
                              <td className="text-center py-2">{item.quantity}</td>
                              <td className="text-center py-2">${item.price.toFixed(2)}</td>
                              <td className="text-center py-2">{item.discountPercentage ? `${item.discountPercentage.toFixed(0)}%` : 'N/A'}</td>
                              <td className="text-center py-2">{item.discountPercentage > 0 ? 'Discount Applied' : 'No Offers'}</td>
                              <td className="text-center py-2 font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-left">
                      <div className="space-y-1 text-sm ">
                        <div className="flex justify-between">
                          <span>Subtotal :</span>
                          <span className='md:mr-5'>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax :</span>
                          <span className='md:mr-5'>${order.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping :</span>
                          <span className='md:mr-5'>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-gray-600 pt-1">
                          <span>Total</span>
                          <span className='md:mr-5'>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-1">Shipping Address:</h4>
                      <p className="text-gray-300 text-sm">{order.shippingInfo.name}</p>
                      <p className="text-gray-300 text-sm">{order.shippingInfo.address}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-300 text-sm">{order.shippingInfo.city}, {order.shippingInfo.zipCode}</p>
                        <DownloadInvoiceButton order={order} />
                      </div>
                    </div>
                  </div>
                )}


              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

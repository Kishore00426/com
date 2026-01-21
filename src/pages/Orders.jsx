import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import DownloadInvoiceButton from '../components/DownloadInvoiceButton';
import { fetchOrders, selectOrders, selectOrdersLoading } from '../redux/ordersSlice';
import Loader from '../components/Loader';

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrdersLoading);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return <Loader />;
  }

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
                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                  <div className="text-left mb-4 md:mb-0 w-full md:w-auto">
                    <p className="text-gray-400 text-sm flex flex-col md:block">
                      <span className="mb-1 md:mb-0">Order No: #{order.id}</span>
                      <span className="hidden md:inline"> | </span>
                      <span className="mb-1 md:mb-0">Placed on: <span className='text-orange-200'>{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</span></span>
                      <span className="hidden md:inline"> | </span>
                      <span>Payment Method: <span className='text-sky-300'>{
                        order.paymentMethod === 'card' ? 'Credit Card' :
                          order.paymentMethod === 'paypal' ? 'PayPal' :
                            order.paymentMethod === 'upi' ? 'UPI' :
                              order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod
                      }</span></span>
                    </p>
                  </div>
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="flex items-center justify-center p-3 md:p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors self-end md:self-center ml-auto md:ml-0"
                  >
                    {expandedOrder === order.id ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {expandedOrder === order.id && (
                  <div className="mt-4 animate-fadeIn">
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full text-sm text-left">
                        <thead className="hidden md:table-header-group text-gray-400 uppercase bg-zinc-900">
                          <tr>
                            <th className="py-3 px-4">Product Name</th>
                            <th className="text-center py-3 px-4">Quantity</th>
                            <th className="text-center py-3 px-4">Price</th>
                            <th className="text-center py-3 px-4">Discount</th>
                            <th className="text-center py-3 px-4">Offers</th>
                            <th className="text-center py-3 px-4">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {order.items.map((item, idx) => (
                            <tr key={`${item.orderId}-${item.productId}-${idx}`} className="flex flex-col md:table-row bg-zinc-900/50 md:bg-transparent mb-4 md:mb-0 rounded-lg md:rounded-none p-4 md:p-0">
                              <td className="py-2 md:py-4 px-2 md:px-4 font-medium text-white flex justify-between md:table-cell">
                                <span className="md:hidden text-gray-400 font-normal">Product:</span>
                                <span>{item.title}</span>
                              </td>
                              <td className="text-right md:text-center py-1 md:py-4 px-2 md:px-4 flex justify-between md:table-cell">
                                <span className="md:hidden text-gray-400">Qty:</span>
                                {item.quantity}
                              </td>
                              <td className="text-right md:text-center py-1 md:py-4 px-2 md:px-4 flex justify-between md:table-cell">
                                <span className="md:hidden text-gray-400">Price:</span>
                                ₹{Number(item.price).toFixed(2)}
                              </td>
                              <td className="text-right md:text-center py-1 md:py-4 px-2 md:px-4 flex justify-between md:table-cell">
                                <span className="md:hidden text-gray-400">Discount:</span>
                                {item.discountPercentage && Number(item.discountPercentage) > 0 ? `${Number(item.discountPercentage).toFixed(0)}%` : <span className="text-gray-600">N/A</span>}
                              </td>
                              <td className="text-right md:text-center py-1 md:py-4 px-2 md:px-4 flex justify-between md:table-cell">
                                <span className="md:hidden text-gray-400">Offer:</span>
                                {item.discountPercentage && Number(item.discountPercentage) > 0 ? <span className="text-green-400">Applied</span> : <span className="text-gray-600">-</span>}
                              </td>
                              <td className="text-right md:text-center py-2 md:py-4 px-2 md:px-4 font-bold text-white flex justify-between md:table-cell border-t md:border-none border-gray-700 mt-2 md:mt-0 pt-2 md:pt-0">
                                <span className="md:hidden text-gray-400 font-normal">Total:</span>
                                ₹{(Number(item.price) * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-col md:flex-row justify-end border-t border-gray-800 pt-4">
                      <div className="w-full md:w-1/3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="font-medium">₹{Number(order.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tax</span>
                          <span className="font-medium">₹{Number(order.tax).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shipping</span>
                          <span className="font-medium text-green-400">{Number(order.shipping) === 0 ? 'FREE' : `₹${Number(order.shipping).toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-white border-t border-gray-700 pt-2 mt-2">
                          <span>Total</span>
                          <span>₹{Number(order.totalAmount).toFixed(2)}</span>
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
    </main >
  );
}

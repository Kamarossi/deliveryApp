import React, { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useDeliveriesStore } from '../store/deliveries';
import { Package, CheckCircle, Clock, Truck } from 'lucide-react';
import { DeliveryDetails } from './DeliveryDetails';
import { Delivery } from '../types';

export function DeliveryList() {
  const { user } = useAuthStore();
  const { deliveries, updateDelivery } = useDeliveriesStore();
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  const filteredDeliveries = user.role === 'DRIVER'
    ? deliveries.filter(d => d.driverId === user.id)
    : deliveries;

  const statusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'IN_PROGRESS':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {user.role === 'DRIVER' ? 'My Deliveries' : 'All Deliveries'}
          </h2>
          <div className="space-y-4">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedDelivery(delivery)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {statusIcon(delivery.status)}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {delivery.customerName}
                      </h3>
                      <p className="text-sm text-gray-500">{delivery.address}</p>
                      <p className="text-sm text-gray-500">
                        Scheduled: {new Date(delivery.scheduledDate).toLocaleDateString()}
                      </p>
                      {delivery.comments && (
                        <p className="text-sm text-gray-600 mt-2">
                          Comments: {delivery.comments}
                        </p>
                      )}
                    </div>
                  </div>
                  {user.role === 'DRIVER' && delivery.status !== 'COMPLETED' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDelivery(delivery.id, {
                            status: 'IN_PROGRESS',
                          });
                        }}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Start Delivery
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDelivery(delivery.id, {
                            status: 'COMPLETED',
                          });
                        }}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDelivery && (
        <DeliveryDetails
          delivery={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
          isDriver={user.role === 'DRIVER'}
        />
      )}
    </>
  );
}
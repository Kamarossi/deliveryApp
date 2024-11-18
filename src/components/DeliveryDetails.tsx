import React from 'react';
import { format, parseISO } from 'date-fns';
import { MapPin, Navigation, Phone, Mail, Clock, FileText, User, MessageCircle } from 'lucide-react';
import { Delivery } from '../types';
import { useCustomersStore } from '../store/customers';

interface Props {
  delivery: Delivery;
  onClose: () => void;
  isDriver?: boolean;
}

export function DeliveryDetails({ delivery, onClose, isDriver }: Props) {
  const { customers } = useCustomersStore();
  const customer = customers.find(c => c.name === delivery.customerName);

  const handleNavigate = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const destination = encodeURIComponent(delivery.address);
        const url = `https://www.google.com/maps/dir/${latitude},${longitude}/${destination}`;
        window.open(url, '_blank');
      }, (error) => {
        console.error('Error getting location:', error);
        // Fallback to just the destination
        const destination = encodeURIComponent(delivery.address);
        const url = `https://www.google.com/maps/search/?api=1&query=${destination}`;
        window.open(url, '_blank');
      });
    }
  };

  const handleCall = () => {
    if (customer?.phone) {
      window.location.href = `tel:${customer.phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (customer?.phone) {
      // Remove any non-numeric characters from phone number
      const phoneNumber = customer.phone.replace(/\D/g, '');
      const message = encodeURIComponent(`Hi, this is your delivery driver for order from ${delivery.customerName}.`);
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Delivery Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Customer</h3>
                <p className="text-sm text-gray-500">{delivery.customerName}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Delivery Address</h3>
                <p className="text-sm text-gray-500">{delivery.address}</p>
                {isDriver && (
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={handleNavigate}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigate
                    </button>
                    <button
                      onClick={handleCall}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </button>
                    <button
                      onClick={handleWhatsApp}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>

            {customer && (
              <>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Contact</h3>
                    <p className="text-sm text-gray-500">
                      {customer.contactPerson} - {customer.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email</h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
              </>
            )}

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">Schedule</h3>
                <p className="text-sm text-gray-500">
                  {format(parseISO(delivery.scheduledDate), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            {customer?.specialRequirements && (
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Special Requirements</h3>
                  {customer.specialRequirements.ppe && (
                    <div className="mt-1">
                      <h4 className="text-xs font-medium text-gray-700">PPE Required:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-500 ml-2">
                        {customer.specialRequirements.ppe.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {customer.specialRequirements.handlingInstructions && (
                    <div className="mt-1">
                      <h4 className="text-xs font-medium text-gray-700">Handling Instructions:</h4>
                      <p className="text-sm text-gray-500">
                        {customer.specialRequirements.handlingInstructions}
                      </p>
                    </div>
                  )}
                  {customer.specialRequirements.accessInstructions && (
                    <div className="mt-1">
                      <h4 className="text-xs font-medium text-gray-700">Access Instructions:</h4>
                      <p className="text-sm text-gray-500">
                        {customer.specialRequirements.accessInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
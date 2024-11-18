import React, { useState, useMemo } from 'react';
import { useDeliveriesStore } from '../../store/deliveries';
import { useFleetStore } from '../../store/fleet';
import { format, parseISO, isSameDay } from 'date-fns';
import { FileText, Download, Calendar, Truck, MapPin, ClipboardList } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function DeliverySheet() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { deliveries } = useDeliveriesStore();
  const { trucks } = useFleetStore();

  const deliveriesByTruck = useMemo(() => {
    const grouped = new Map();
    
    trucks.forEach(truck => {
      grouped.set(truck.id, {
        truck,
        deliveries: [],
      });
    });

    grouped.set('unassigned', {
      truck: { id: 'unassigned', registrationNumber: 'Unassigned', fleetNumber: '-' },
      deliveries: [],
    });

    deliveries.forEach(delivery => {
      if (isSameDay(parseISO(delivery.scheduledDate), parseISO(selectedDate))) {
        const truckId = delivery.truckId || 'unassigned';
        const group = grouped.get(truckId);
        if (group) {
          group.deliveries.push(delivery);
        }
      }
    });

    return Array.from(grouped.values()).filter(group => group.deliveries.length > 0);
  }, [deliveries, trucks, selectedDate]);

  const downloadDeliverySheet = () => {
    const doc = new jsPDF();
    let yPos = 15;

    deliveriesByTruck.forEach((group, index) => {
      if (index > 0) {
        doc.addPage();
        yPos = 15;
      }

      doc.setFontSize(16);
      doc.text(`Delivery Sheet - ${format(parseISO(selectedDate), 'MMMM d, yyyy')}`, 14, yPos);
      
      yPos += 10;
      doc.setFontSize(14);
      doc.text(`Vehicle: ${group.truck.registrationNumber} (Fleet #${group.truck.fleetNumber})`, 14, yPos);
      
      yPos += 10;
      
      const tableData = group.deliveries.map((delivery, index) => [
        (index + 1).toString(),
        delivery.customerName,
        delivery.address,
        delivery.status,
        '', // Space for driver notes
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Customer', 'Address', 'Status', 'Notes']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 37, 88] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 70 },
          3: { cellWidth: 25 },
          4: { cellWidth: 45 },
        },
      });
    });

    doc.save(`delivery-sheet-${selectedDate}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 shadow-lg rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="w-72">
            <label className="block text-sm font-medium text-indigo-100">
              <Calendar className="h-4 w-4 inline-block mr-2" />
              Select Delivery Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border-0 bg-indigo-800/50 text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            onClick={downloadDeliverySheet}
            className="inline-flex items-center px-4 py-2 bg-white text-indigo-900 rounded-lg font-medium shadow-sm hover:bg-indigo-50 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Sheet
          </button>
        </div>
      </div>

      {deliveriesByTruck.map((group) => (
        <div key={group.truck.id} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-indigo-600" />
              {group.truck.registrationNumber}
              <span className="ml-2 text-sm text-gray-500">Fleet #{group.truck.fleetNumber}</span>
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center">
                        <ClipboardList className="h-4 w-4 mr-1" />
                        Order
                      </span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Address
                      </span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {group.deliveries.map((delivery, index) => (
                    <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{delivery.customerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {delivery.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${delivery.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                          ${delivery.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${delivery.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {delivery.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          placeholder="Add notes..."
                          className="text-sm text-gray-500 w-full border-0 bg-transparent focus:ring-0 placeholder-gray-400"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      {deliveriesByTruck.length === 0 && (
        <div className="bg-white shadow-lg rounded-xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Deliveries Scheduled</h3>
          <p className="text-gray-500">There are no deliveries scheduled for the selected date.</p>
        </div>
      )}
    </div>
  );
}
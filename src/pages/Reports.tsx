import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FileSpreadsheet, 
  FileText, 
  Filter,
  Table as TableIcon,
  Truck
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useDeliveriesStore } from '../store/deliveries';
import { BackButton } from '../components/BackButton';
import { exportToExcel, exportToPdf } from '../utils/export';
import { DeliverySheet } from '../components/reports/DeliverySheet';

const schema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(['ALL', 'COMPLETED', 'PENDING', 'CANCELLED']).default('ALL'),
  groupBy: z.enum(['TOWN', 'REGION', 'TRUCK', 'DRIVER']).default('TOWN'),
});

type FormData = z.infer<typeof schema>;

type ReportType = 'SUMMARY' | 'DELIVERY_SHEET';

export function Reports() {
  const { register, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      startDate: format(new Date().setDate(1), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      status: 'ALL',
      groupBy: 'TOWN',
    },
  });

  const [reportType, setReportType] = useState<ReportType>('SUMMARY');
  const formValues = watch();
  const { deliveries } = useDeliveriesStore();
  const [showFilters, setShowFilters] = useState(true);

  const filteredData = useMemo(() => {
    return deliveries.filter(delivery => {
      const deliveryDate = parseISO(delivery.scheduledDate);
      const startDate = parseISO(formValues.startDate);
      const endDate = parseISO(formValues.endDate);
      
      const isInDateRange = deliveryDate >= startDate && deliveryDate <= endDate;
      const matchesStatus = formValues.status === 'ALL' || delivery.status === formValues.status;
      
      return isInDateRange && matchesStatus;
    });
  }, [deliveries, formValues]);

  const groupedData = useMemo(() => {
    const groups: Record<string, typeof filteredData> = {};
    
    filteredData.forEach(delivery => {
      let groupKey = '';
      switch (formValues.groupBy) {
        case 'TOWN':
          groupKey = delivery.address.split(',')[1]?.trim() || 'Unknown';
          break;
        case 'REGION':
          groupKey = delivery.address.split(',')[2]?.trim() || 'Unknown';
          break;
        case 'TRUCK':
          groupKey = delivery.truckId || 'Unassigned';
          break;
        case 'DRIVER':
          groupKey = delivery.driverId || 'Unassigned';
          break;
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(delivery);
    });
    
    return groups;
  }, [filteredData, formValues.groupBy]);

  const handleExportExcel = () => {
    exportToExcel(groupedData, formValues);
  };

  const handleExportPdf = () => {
    exportToPdf(groupedData, formValues);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <BackButton />
        <h1 className="text-2xl font-semibold text-gray-900">Delivery Reports</h1>
        <div className="flex space-x-2">
          {reportType === 'SUMMARY' && (
            <>
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </button>
              <button
                onClick={handleExportPdf}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setReportType('SUMMARY')}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              reportType === 'SUMMARY'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Summary Report
          </button>
          <button
            onClick={() => setReportType('DELIVERY_SHEET')}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              reportType === 'DELIVERY_SHEET'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Truck className="h-4 w-4 mr-2" />
            Delivery Sheet
          </button>
        </div>
      </div>

      {showFilters && reportType === 'SUMMARY' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                {...register('startDate')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                {...register('endDate')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Outstanding</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Group By</label>
              <select
                {...register('groupBy')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="TOWN">Town</option>
                <option value="REGION">Region</option>
                <option value="TRUCK">Truck</option>
                <option value="DRIVER">Driver</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {reportType === 'SUMMARY' ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            {Object.entries(groupedData).map(([group, deliveries]) => (
              <div key={group} className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <TableIcon className="h-5 w-5 mr-2 text-gray-500" />
                  {formValues.groupBy.charAt(0) + formValues.groupBy.slice(1).toLowerCase()}: {group}
                  <span className="ml-2 text-sm text-gray-500">
                    ({deliveries.length} deliveries)
                  </span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {deliveries.map((delivery) => (
                        <tr key={delivery.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {delivery.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {delivery.address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(parseISO(delivery.scheduledDate), 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${delivery.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                              ${delivery.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                              ${delivery.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                              {delivery.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <DeliverySheet />
      )}
    </div>
  );
}
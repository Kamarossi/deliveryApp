import React, { useRef, useState } from 'react';
import { useCustomersStore } from '../store/customers';
import { read, utils } from 'xlsx';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  address: z.string().min(1, 'Address is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
  ppe: z.string().optional(),
  handlingInstructions: z.string().optional(),
  accessInstructions: z.string().optional(),
});

type ImportData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
}

export function ImportCustomers({ onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<ImportData[]>([]);
  const [isPreview, setIsPreview] = useState(false);
  const { addCustomer } = useCustomersStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json<ImportData>(worksheet);

        const validationErrors: string[] = [];
        const validData: ImportData[] = [];

        jsonData.forEach((row, index) => {
          try {
            const validated = schema.parse(row);
            validData.push(validated);
          } catch (error) {
            if (error instanceof z.ZodError) {
              error.errors.forEach((err) => {
                validationErrors.push(`Row ${index + 2}: ${err.message}`);
              });
            }
          }
        });

        if (validationErrors.length > 0) {
          setErrors(validationErrors);
        } else {
          setPreview(validData);
          setIsPreview(true);
          setErrors([]);
        }
      } catch (error) {
        setErrors(['Invalid Excel file format']);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = () => {
    preview.forEach((customer) => {
      const ppeArray = customer.ppe?.split(',').map(item => item.trim()).filter(Boolean);
      
      addCustomer({
        name: customer.name,
        address: customer.address,
        contactPerson: customer.contactPerson,
        phone: customer.phone,
        email: customer.email,
        specialRequirements: {
          ppe: ppeArray,
          handlingInstructions: customer.handlingInstructions,
          accessInstructions: customer.accessInstructions,
        },
      });
    });
    onClose();
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Import Customers from Excel
        </h3>

        {!isPreview ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">Excel files only</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {errors.length > 0 && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Import Errors
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Expected Excel Format:</h4>
              <p className="text-sm text-gray-500">
                The Excel file should have the following columns:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-500">
                <li>name (required)</li>
                <li>address (required)</li>
                <li>contactPerson (required)</li>
                <li>phone (required)</li>
                <li>email (required)</li>
                <li>ppe (optional, comma-separated)</li>
                <li>handlingInstructions (optional)</li>
                <li>accessInstructions (optional)</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.map((customer, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.contactPerson}<br/>
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsPreview(false);
                  setPreview([]);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Import {preview.length} Customers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format, parseISO } from 'date-fns';
import { Delivery } from '../types';

type GroupedData = Record<string, Delivery[]>;

interface ReportFilters {
  startDate: string;
  endDate: string;
  status: string;
  groupBy: string;
}

export function exportToExcel(groupedData: GroupedData, filters: ReportFilters) {
  const workbook = utils.book_new();
  let hasData = false;
  
  Object.entries(groupedData).forEach(([group, deliveries]) => {
    if (deliveries.length > 0) {
      hasData = true;
      const worksheet = utils.json_to_sheet(
        deliveries.map(d => ({
          Customer: d.customerName,
          Address: d.address,
          Date: format(parseISO(d.scheduledDate), 'MMM d, yyyy'),
          Status: d.status,
        }))
      );
      
      utils.book_append_sheet(workbook, worksheet, group.substring(0, 31));
    }
  });

  if (!hasData) {
    // Create a default sheet with headers if no data
    const worksheet = utils.json_to_sheet([{
      Customer: '',
      Address: '',
      Date: '',
      Status: '',
    }], { header: ['Customer', 'Address', 'Date', 'Status'] });
    
    utils.book_append_sheet(workbook, worksheet, 'No Data');
  }

  const fileName = `delivery-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
  writeFile(workbook, fileName);
}

export function exportToPdf(groupedData: GroupedData, filters: ReportFilters) {
  const doc = new jsPDF();
  
  // Add title and filters
  doc.setFontSize(16);
  doc.text('Delivery Report', 14, 15);
  
  doc.setFontSize(10);
  doc.text(`Period: ${format(parseISO(filters.startDate), 'MMM d, yyyy')} - ${format(parseISO(filters.endDate), 'MMM d, yyyy')}`, 14, 25);
  doc.text(`Status: ${filters.status}`, 14, 30);
  doc.text(`Grouped by: ${filters.groupBy}`, 14, 35);
  
  let yPos = 45;
  let hasData = false;
  
  Object.entries(groupedData).forEach(([group, deliveries]) => {
    if (deliveries.length > 0) {
      hasData = true;
      // Add group header
      doc.setFontSize(12);
      doc.text(`${filters.groupBy}: ${group}`, 14, yPos);
      
      // Add table
      autoTable(doc, {
        startY: yPos + 5,
        head: [['Customer', 'Address', 'Date', 'Status']],
        body: deliveries.map(d => [
          d.customerName,
          d.address,
          format(parseISO(d.scheduledDate), 'MMM d, yyyy'),
          d.status,
        ]),
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
      
      // Add new page if needed
      if (yPos > 270) {
        doc.addPage();
        yPos = 15;
      }
    }
  });

  if (!hasData) {
    doc.setFontSize(12);
    doc.text('No data available for the selected filters', 14, yPos);
  }
  
  doc.save(`delivery-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}
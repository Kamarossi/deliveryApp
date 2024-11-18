import React, { useState } from 'react';
import { useFleetStore } from '../../store/fleet';
import { AlertTriangle, FileText, Download } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function IncidentList() {
  const { incidents, trucks } = useFleetStore();
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const getTruckDetails = (truckId: string) => {
    const truck = trucks.find(t => t.id === truckId);
    return truck ? `${truck.registrationNumber} (Fleet #${truck.fleetNumber})` : 'Unknown Vehicle';
  };

  const getIncidentTypeColor = (type: string) => {
    switch (type) {
      case 'ACCIDENT':
        return 'bg-red-100 text-red-800';
      case 'THEFT':
        return 'bg-purple-100 text-purple-800';
      case 'DAMAGE':
        return 'bg-yellow-100 text-yellow-800';
      case 'BREAKDOWN':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadReport = (incident: any) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(`Incident Report #${incident.reportNumber}`, 14, 15);
    
    // Add incident details
    doc.setFontSize(10);
    const details = [
      ['Vehicle:', getTruckDetails(incident.truckId)],
      ['Type:', incident.type],
      ['Date:', format(parseISO(incident.date), 'PPpp')],
      ['Location:', incident.location],
      ['Description:', incident.description],
      ['Police Report:', incident.policeReport || 'N/A'],
      ['Insurance Claim:', incident.insuranceClaim || 'N/A'],
      ['Estimated Cost:', incident.estimatedCost ? `$${incident.estimatedCost}` : 'N/A'],
      ['Witnesses:', incident.witnesses || 'N/A'],
    ];
    
    autoTable(doc, {
      startY: 25,
      head: [],
      body: details,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 140 },
      },
    });
    
    doc.save(`incident-report-${incident.reportNumber}.pdf`);
  };

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {getTruckDetails(incident.truckId)}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIncidentTypeColor(incident.type)}`}>
                    {incident.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {format(parseISO(incident.date), 'PPpp')}
                </p>
                <p className="text-sm text-gray-500">
                  Location: {incident.location}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => setSelectedIncident(selectedIncident === incident.id ? null : incident.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedIncident === incident.id ? 'Show less' : 'Show more'}
                  </button>
                </div>
                {selectedIncident === incident.id && (
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    <p><strong>Description:</strong> {incident.description}</p>
                    {incident.policeReport && (
                      <p><strong>Police Report:</strong> {incident.policeReport}</p>
                    )}
                    {incident.insuranceClaim && (
                      <p><strong>Insurance Claim:</strong> {incident.insuranceClaim}</p>
                    )}
                    {incident.estimatedCost && (
                      <p><strong>Estimated Cost:</strong> ${incident.estimatedCost}</p>
                    )}
                    {incident.witnesses && (
                      <p><strong>Witnesses:</strong> {incident.witnesses}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => downloadReport(incident)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </button>
            </div>
          </div>
        </div>
      ))}
      {incidents.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No incidents reported
        </div>
      )}
    </div>
  );
}
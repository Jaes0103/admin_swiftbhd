import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';  
import { jsPDF } from 'jspdf';
import axios from 'axios';
import logo from '../assets/images/bantay_hayop_logo.jpg';

const ReportPreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management
  const [reports, setReports] = useState([]);
  const [rescuedAnimals, setRescuedAnimals] = useState([]);
  const [falseReports, setFalseReports] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [totalUnsuccessfulReports, setTotalUnsuccessfulReports] = useState(0);
  const [totalProcessingReports, setTotalProcessingReports] = useState(0);
  const [totalAnimalsInShelter, setTotalAnimalsInShelter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const url = `${process.env.REACT_APP_BASE_URL}/api/admin/dashboard`;
        const response = await axios.get(url);

        if (response.data) {
          const { reports, adoptableAnimals, rescuedAnimals, falseReports, adoptions } = response.data;
          setReports(reports);
          setRescuedAnimals(rescuedAnimals);
          setFalseReports(falseReports);
          setAdoptions(adoptions);

          // Set total counts
          setTotalReports(reports.length);
          setTotalUnsuccessfulReports(response.data.summary.totalUnsuccessfulReports);
          setTotalProcessingReports(response.data.summary.totalProcessingReports);
          setTotalAnimalsInShelter(response.data.summary.totalAnimalsInShelter);
        } else {
          setError('Invalid response structure');
        }
      } catch (err) {
        console.error('Fetch error:', err.response ? err.response.data : err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to get counts by month
  const getCountsByMonth = (data, dateKey) => {
    const counts = new Array(12).fill(0);
    if (Array.isArray(data)) {
      data.forEach(item => {
        const dateString = item[dateKey];
        const date = new Date(dateString);
  
        // Skip invalid dates (set to 0 counts for months with invalid dates)
        if (isNaN(date.getTime())) {
          return; // Skip this entry if the date is invalid
        }
  
        const month = date.getMonth();
        counts[month]++;
      });
    }
    return counts;
  };
  
  
  const getCountsByYear = (data, dateKey) => {
    const counts = {};
    if (Array.isArray(data)) {
      data.forEach(item => {
        const dateString = item[dateKey];
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return; // Skip this entry if the date is invalid
        }
        const year = date.getFullYear();
        if (!counts[year]) {
          counts[year] = 0;
        }
        counts[year]++;
      });
    }
    return counts;
  };
  
  

  const months = new Array(12).fill(0).map((_, i) => new Date(0, i).toLocaleString('default', { month: 'short' }));

  
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.addImage(logo, 'PNG', 20, 10, 30, 30);
    const pageWidth = doc.internal.pageSize.width;

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Bantay Hayop Davao Report', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 50, 40);

    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('Report Overview:', 20, 50);

    doc.setFontSize(8);
    doc.setFont('Helvetica', 'normal');
    doc.text(
      'This report summarizes the animal rescue, adoption, false reports, and total reports generated by Bantay Hayop Davao in the past year.',
      20,
      55
    );
    doc.text(
      'The following sections provide a breakdown of reports by month and year.',
      20,
      60
    );

    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('Summary:', 20, 65);

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    let y = 70;
    const lineSpacing = 5;
    doc.text(`Total Reports: ${totalReports}`, 20, y);
    doc.text(`Total Adoptions: ${adoptions.length}`, 20, (y += lineSpacing));
    doc.text(`Total Rescues: ${rescuedAnimals.length}`, 20, (y += lineSpacing));
    doc.text(`Total False Reports: ${falseReports.length}`, 20, (y += lineSpacing));
    doc.text(`Total Unsuccessful Rescues: ${totalUnsuccessfulReports}`, 20, (y += lineSpacing));
    doc.text(`Total Processing Reports: ${totalProcessingReports}`, 20, (y += lineSpacing));
    doc.text(
      `Total Animals in the Shelter: ${totalAnimalsInShelter}`,
      20,
      (y += lineSpacing)
    );

    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('Reports by Month:', 20, (y += lineSpacing + 5));

    doc.setFontSize(8);
    let yOffset = y + 5;
    doc.text('Month', 20, yOffset);
    doc.text('Reports', 50, yOffset);
    doc.text('Rescued', 90, yOffset);
    doc.text('False Reports', 130, yOffset);
    doc.text('Adoptions', 170, yOffset);
    yOffset += lineSpacing;

    const reportCounts = getCountsByMonth(reports, 'created_at');
    const rescuedCounts = getCountsByMonth(rescuedAnimals, 'rescued_date');
    const falseReportCounts = getCountsByMonth(falseReports, 'false_report_date');
    const adoptionCounts = getCountsByMonth(adoptions, 'adoption_date');

    months.forEach((month, index) => {
      doc.text(month, 20, yOffset);
      doc.text(reportCounts[index].toString(), 50, yOffset);
      doc.text(rescuedCounts[index].toString(), 90, yOffset);
      doc.text(falseReportCounts[index].toString(), 130, yOffset);
      doc.text(adoptionCounts[index].toString(), 170, yOffset);
      yOffset += lineSpacing;
    });

    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    // doc.text('Reports by Year:', 20, yOffset + lineSpacing);

    // doc.setFontSize(8);
    // yOffset += lineSpacing + 5;
    // doc.text('Year', 20, yOffset);
    // doc.text('Reports', 50, yOffset);
    // doc.text('Rescued', 90, yOffset);
    // doc.text('False Reports', 130, yOffset);
    // doc.text('Adoptions', 170, yOffset);
    // yOffset += lineSpacing;

    const years = [
      ...new Set([
        ...reports.map(item => new Date(item.created_at).getFullYear()),
        ...rescuedAnimals.map(item => new Date(item.rescued_date).getFullYear()),
        ...falseReports.map(item => new Date(item.false_report_date).getFullYear()),
        ...adoptions.map(item => new Date(item.adoption_date).getFullYear()),
      ]),
    ].sort((a, b) => a - b); // Sorting years for consistent display
    const reportYearCounts = getCountsByYear(reports, 'created_at');
    const rescuedYearCounts = getCountsByYear(rescuedAnimals, 'rescued_date');
    const falseReportYearCounts = getCountsByYear(falseReports, 'false_report_date');
    const adoptionYearCounts = getCountsByYear(adoptions, 'adoption_date');

    // years.forEach(year => {
    //   doc.text(year.toString(), 20, yOffset);
    //   doc.text((reportYearCounts[year] || 0).toString(), 50, yOffset);
    //   doc.text((rescuedYearCounts[year] || 0).toString(), 90, yOffset);
    //   doc.text((falseReportYearCounts[year] || 0).toString(), 130, yOffset);
    //   doc.text((adoptionYearCounts[year] || 0).toString(), 170, yOffset);
    //   yOffset += lineSpacing;
    // });
    
    doc.setFontSize(6);
    const footerText1 = 'Bantay Hayop Davao | Contact: info@bantayhayop.com | Phone: +63 912 345 6789';
    const footerText2 = 'Address: Malagamot, Davao City, Philippines';
    const footerWidth1 = doc.getStringUnitWidth(footerText1) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const footerWidth2 = doc.getStringUnitWidth(footerText2) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const xPosition1 = (pageWidth - footerWidth1) / 2;
    const xPosition2 = (pageWidth - footerWidth2) / 2;
    doc.setFont('Helvetica', 'normal');
    doc.text(footerText1, xPosition1, yOffset + 10);
    doc.text(footerText2, xPosition2, yOffset + 15);
    doc.save('Bantay_Hayop_Davao_Report.pdf');

  };

  return (
    <div className="report-preview-container" style={{ fontFamily: 'Arial, sans-serif', margin: '20px' }}>
      <h1 
        style={{ 
          fontSize: '48px', 
          color: '#0066cc', 
          textAlign: 'center', 
          marginBottom: '20px', 
          fontWeight: '900',  
          fontFamily: "'Arial Black', Gadget, sans-serif" 
        }}
      >
        Bantay Hayop Davao Annual Report
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading data: {error}</p>
      ) : (
        <>
          <section className="report-summary" style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', color: '#333333' }}>Report Summary</h2>
            <p style={{ fontSize: '18px', color: '#000000' }}>
              <strong>Total Reports:</strong> {totalReports}
            </p>
            <p style={{ fontSize: '18px', color: '#000000' }}>
              <strong>Total Unsuccessful Reports:</strong> {totalUnsuccessfulReports}
            </p>
            <p style={{ fontSize: '18px', color: '#000000' }}>
              <strong>Total Processing Reports:</strong> {totalProcessingReports}
            </p>
            <h3 style={{ fontSize: '20px', color: '#0066cc' }}>Reports by Month</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Month</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Reports</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Rescued</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>False Reports</th>
                  <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>Adoptions</th>
                </tr>
              </thead>
              <tbody>
                {months.map((month, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>{month}</td>
                    <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                      {getCountsByMonth(reports, 'created_at')[index]}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                      {getCountsByMonth(rescuedAnimals, 'rescued_date')[index]}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                      {getCountsByMonth(falseReports, 'false_report_date')[index]}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                      {getCountsByMonth(adoptions, 'adoption_date')[index]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="report-actions" style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                marginRight: '10px',
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#cccccc',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
            <button
              onClick={generatePDF}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#0066cc',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Generate PDF
            </button>
          </section>
        </>
      )}
    </div>
  );
};

export default ReportPreviewPage;

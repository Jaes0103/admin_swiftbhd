import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';  
import 'jspdf-autotable';  
import '../style/ReportPreviewPage.css';
import logo from '../assets/images/bantay_hayop_logo.jpg';

const ReportPreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filteredReports, startDate, endDate } = location.state || {};

  if (!filteredReports) {
    return <p>No reports available.</p>;
  }

  // Count total reports and categorized reports
  const totalReports = filteredReports.length;
  const totalRescued = filteredReports.filter(report => report.status === 'Rescued').length;
  const totalFalseReports = filteredReports.filter(report => report.status === 'False').length;
  const totalUnsuccessful = filteredReports.filter(report => report.status === 'Unsuccessful').length;

  const generatePDF = (filteredReports, startDate, endDate) => {
    const doc = new jsPDF();

    doc.addImage(logo, 'PNG', 25, 10, 30, 30); 

    const startDateText = new Date(startDate).toLocaleDateString();
    const endDateText = new Date(endDate).toLocaleDateString();
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    doc.setTextColor(2, 43, 89); 
    doc.setFont('arial', 'black');
    doc.setFontSize(30); 
    doc.text("Bantay Hayop Davao Reports", 60, 30);
    doc.setLineWidth(0.3);
    doc.setDrawColor(128, 128, 128);
    doc.line(13, 40, 195, 40); 

    doc.setFont('helvetica', 'bold'); 
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`From:`, 14, 47);
    doc.text(`To:`, 14, 52);
    doc.text(`Generated at:`, 14, 57); 

    doc.setFont('helvetica', 'normal'); 
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`${startDateText}`, 40, 47);
    doc.text(`${endDateText}`, 40, 52);
    doc.text(`${formattedDate} ${formattedTime}`, 40, 57); 

    doc.setLineWidth(0.3); 
    doc.setDrawColor(128, 128, 128);
    doc.line(13, 60, 195, 60); 
    doc.setTextColor(0, 0, 0); 
    doc.setFont('helvetica', 'bold'); 
    doc.setFontSize(12);
    doc.text("Animal Cruelty Reports - Filtered Data", 70, 65);
    doc.setFont('helvetica', 'normal'); 
    doc.setFontSize(10);
    doc.text(
      `This report contains the details of animal cruelty reports filed between `, 14, 70
    );

    doc.setTextColor(255, 0, 0); 
    doc.text(startDateText, 124, 70); 
    doc.setTextColor(0, 0, 0); 
    doc.text("and", 145, 70);
    doc.setTextColor(255, 0, 0); 
    doc.text(endDateText, 155, 70); 

    doc.setTextColor(0, 0, 0); 
    doc.text(".", 270, 70);

    doc.setFontSize(10);
    doc.text(`Total Reports: ${totalReports}`, 14, 75);
    doc.text(`Total Rescued: ${totalRescued}`, 14, 80);
    doc.text(`Total False Reports: ${totalFalseReports}`, 14, 85);
    doc.text(`Total Unsuccessful: ${totalUnsuccessful}`, 14, 90);

    doc.text("", 14, 110);
    doc.setFontSize(12);
    doc.setFont('Arial', 'bold'); 
    doc.text(`Reports List `, 14, 100);
    doc.autoTable({
      startY: 105,
      head: [
        ["ID", "Animal Type", "Details", "Location", "Date Created", "Status"],
      ],
      body: filteredReports.map((report) => [
        report.id,
        report.animal_type,
        report.animal_details,
        report.location.replace(/Davao Region, 8000, Pilipinas/g, ""),
        new Date(report.created_at).toLocaleDateString(),
        report.status,
      ]),
      theme: "grid",  
      styles: {
        fontSize: 10,  
        cellPadding: 3,  
        lineWidth: 0,  
        halign: "center",  
      },
      headStyles: {
        fillColor: [169, 169, 169],  
        textColor: 0,  
        fontSize: 10,  
        halign: "center",  
        valign: "middle",  
        lineWidth: 0,  
      },
      bodyStyles: {
        fontSize: 10,  
        halign: "center",  
        valign: "middle",  
        textColor: 0,  
        lineWidth: 0,  
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],  
      },
    });

    doc.setFontSize(8); 
    doc.setTextColor(0, 0, 0);
    const firstColumn = "Bantay Hayop Davao | Malagamot, Davao City, Philippines | bantayhayopdavao@gmail.com";
    const secondColumn = "Phone: +63 123 456 7890 | Facebook: facebook.com/BantayHayopDavao";

    const pageWidth = doc.internal.pageSize.width;
    const yPositionFooter = doc.internal.pageSize.height - 20;

    const firstColumnWidth = doc.getStringUnitWidth(firstColumn) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const xPositionFirstColumn = (pageWidth - firstColumnWidth) / 2;

    doc.text(firstColumn, xPositionFirstColumn, yPositionFooter);

    const yPositionSecondColumn = yPositionFooter + 6;

    const secondColumnWidth = doc.getStringUnitWidth(secondColumn) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const xPositionSecondColumn = (pageWidth - secondColumnWidth) / 2;

    doc.text(secondColumn, xPositionSecondColumn, yPositionSecondColumn);

    doc.save(`animal-cruelty-report-${startDate}-${endDate}.pdf`);
  };

  return (
    <div className="report-preview-container">
      <header className="report-header">
        <h1>Report Preview</h1>
        <p>Below are the filtered reports from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}</p>
      </header>

      <section className="report-introduction">
        <p>
          This document contains reports that fall within the selected date range. 
          The data is compiled based on various animal cruelty cases reported during this period. 
          Below you can see the details for each report, including the animal type, status, and location of the incident.
        </p>
      </section>

      <section className="report-details">
        <h3>Summary of Report Details</h3>
        <ul>
          <li><strong>Total Reports:</strong> {totalReports}</li>
          <li><strong>Total Rescued:</strong> {totalRescued}</li>
          <li><strong>Total False Reports:</strong> {totalFalseReports}</li>
          <li><strong>Total Unsuccessful:</strong> {totalUnsuccessful}</li>
        </ul>
      </section>

      <section className="report-table">
        {filteredReports.length === 0 ? (
          <p>No reports found for the selected date range.</p>
        ) : (
          <table className="report-preview-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Animal Type</th>
                <th>Details</th>
                <th>Location</th>
                <th>Date Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.animal_type}</td>
                  <td>{report.animal_details}</td>
                  <td>{report.location.replace(/Davao Region, 8000, Pilipinas/g, "")}</td>
                  <td>{new Date(report.created_at).toLocaleDateString()}</td>
                  <td>{report.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="report-actions">
        <button className="download-pdf-btn" onClick={() => generatePDF(filteredReports, startDate, endDate)}>
          Download as PDF
        </button>
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </section>

      <footer className="report-footer">
        <p>Generated on {new Date().toLocaleDateString()} by Bantay Hayop Davao</p>
      </footer>
    </div>
  );
};

export default ReportPreviewPage;

import { jsPDF } from "jspdf";
import { Submission } from "../types";

export const generateGrievancePDF = async (submission: Submission) => {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  // Helper to load image
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 102, 204);
  doc.text("Official Grievance Document", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Reference ID: ${submission.id}`, margin, y);
  y += 5;
  doc.text(`Date: ${new Date(submission.timestamp).toLocaleString()}`, margin, y);
  y += 15;

  // Citizen Information
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Citizen Details", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Name: ${submission.name}`, margin, y);
  y += 6;
  doc.text(`Phone: ${submission.phone || "Not provided"}`, margin, y);
  y += 6;
  doc.text(`Location: ${submission.latitude && submission.longitude 
     ? `${submission.latitude.toFixed(4)}, ${submission.longitude.toFixed(4)} (GPS Verified)` 
     : "Constituency Level"}`, margin, y);
  y += 6;
  doc.text(`Target Department: ${submission.targetDepartment || "General Administration"}`, margin, y);
  y += 12;

  // Grievance Information
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Grievance Information", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Category: ${submission.category}`, margin, y);
  y += 6;
  doc.text(`Urgency: ${submission.urgency}`, margin, y);
  y += 6;
  doc.text(`Status: ${submission.status}`, margin, y);
  y += 10;

  // AI Summary
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary:", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  const summaryText = submission.aiSummary || "No summary provided.";
  const summaryLines = doc.splitTextToSize(summaryText, 170);
  doc.text(summaryLines, margin, y);
  y += (summaryLines.length * 6) + 10;

  // Suggested Actions
  if (submission.suggestedActions && submission.suggestedActions.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Proposed Action Plan:", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    submission.suggestedActions.forEach((action, i) => {
      const actionText = `${i + 1}. ${action}`;
      const actionLines = doc.splitTextToSize(actionText, 160);
      doc.text(actionLines, margin + 5, y);
      y += (actionLines.length * 6);
    });
    y += 10;
  }

  // Full Grievance Text
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Grievance Statement:", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  const descriptionText = submission.translatedText || submission.originalText || "No description provided.";
  const contentLines = doc.splitTextToSize(descriptionText, 170);
  
  // Check for page overflow
  if (y + (contentLines.length * 6) > 280) {
    doc.addPage();
    y = 20;
  }
  
  doc.text(contentLines, margin, y);
  y += (contentLines.length * 6) + 15;

  // Attachments (Photos)
  if (submission.photoUrls && submission.photoUrls.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Evidence Attachments:", margin, y);
    y += 10;

    for (const url of submission.photoUrls) {
      try {
        const img = await loadImage(url);
        const imgProps = doc.getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - (margin * 2);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (y + pdfHeight > 280) {
          doc.addPage();
          y = 20;
        }

        doc.addImage(img, 'JPEG', margin, y, pdfWidth, pdfHeight);
        y += pdfHeight + 10;
      } catch (err) {
        console.error("Failed to load image for PDF:", err);
      }
    }
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text("This is an AI-generated grievance document for the MP Citizen Portal.", margin, 285);

  doc.save(`Grievance_${submission.id}.pdf`);
};

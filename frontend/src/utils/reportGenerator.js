import jsPDF from 'jspdf';

export const downloadJSON = (data, filename) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_review.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const downloadPDF = (data) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add text with word wrap
    const addText = (text, fontSize = 10, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont(undefined, isBold ? 'bold' : 'normal');
        const lines = doc.splitTextToSize(text, maxWidth);

        lines.forEach(line => {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
            doc.text(line, margin, yPosition);
            yPosition += fontSize * 0.5;
        });
        yPosition += 5;
    };

    // Title
    addText('AI Code Review Report', 18, true);
    yPosition += 5;

    // Filename
    if (data.filename) {
        addText(`File: ${data.filename}`, 12, true);
    }

    // Timestamp
    addText(`Generated: ${new Date().toLocaleString()}`, 10);
    yPosition += 5;

    // Summary
    addText('Summary', 14, true);
    addText(data.summary || 'No summary available');
    yPosition += 5;

    // Severity (if available)
    if (data.severity) {
        addText('Severity Analysis', 14, true);
        Object.entries(data.severity).forEach(([level, count]) => {
            addText(`${level}: ${count} issue(s)`, 10);
        });
        yPosition += 5;
    }

    // Original Code
    addText('Original Code', 14, true);
    addText(data.originalCode || 'No code available', 8);
    yPosition += 5;

    // Improved Code
    addText('Improved Code', 14, true);
    addText(data.improvedCode || 'No improved code available', 8);
    yPosition += 5;

    // Diff
    if (data.diff) {
        addText('Changes Summary', 14, true);
        addText('See JSON export for detailed diff', 10);
    }

    // Save PDF
    doc.save(`${data.filename || 'code'}_review.pdf`);
};

const handleDownloadPDF = (doc) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;

    // --- PAGE 1: DIGITIZED DETAILS & OFFICIAL EXTRACT ---
    pdf.setDrawColor(20, 60, 120);
    pdf.setLineWidth(1);
    pdf.rect(10, 10, 190, 277);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(20, 60, 120);
    pdf.text('SMART DIGITAL DOCUMENTATION PORTAL', 105, 25, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100);
    pdf.text('Official Digitized Registry Extract', 105, 32, { align: 'center' });

    pdf.setDrawColor(200);
    pdf.line(15, 36, 195, 36);

    pdf.setFontSize(11);
    pdf.setTextColor(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Title / Subject: ', 20, 48);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.title || ''}`, 60, 48);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Department: ', 20, 56);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.department || ''}`, 60, 56);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Category: ', 20, 64);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${doc.category || ''}`, 60, 64);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Date Digitized: ', 20, 72);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${new Date(doc.uploadedAt).toLocaleString()}`, 60, 72);

    pdf.setDrawColor(200);
    pdf.line(15, 80, 195, 80);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Extracted / Scanned Content:', 20, 90);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const splitText = pdf.splitTextToSize(doc.fileData || 'No additional content provided.', 170);
    pdf.text(splitText, 20, 98);

    pdf.setFontSize(9);
    pdf.setTextColor(130);
    pdf.text('Digitally verified & archived in Citizen Vault.', 105, 280, { align: 'center' });

    // --- PAGE 2: ATTACHED ORIGINAL DOCUMENT (Agar Image Hai) ---
    if (doc.imageUrl) {
      const img = new Image();
      img.src = doc.imageUrl;
      img.onload = () => {
        pdf.addPage(); // Second page add karein

        const margin = 12;
        const maxWidth = pageWidth - (margin * 2);
        const maxHeight = pageHeight - (margin * 2);

        let imgWidth = img.width;
        let imgHeight = img.height;
        const ratio = imgWidth / imgHeight;

        let renderWidth = maxWidth;
        let renderHeight = renderWidth / ratio;

        if (renderHeight > maxHeight) {
          renderHeight = maxHeight;
          renderWidth = renderHeight * ratio;
        }

        const xPos = (pageWidth - renderWidth) / 2;
        const yPos = (pageHeight - renderHeight) / 2;

        pdf.addImage(doc.imageUrl, 'JPEG', xPos, yPos, renderWidth, renderHeight);
        pdf.save(`${(doc.title || 'document').replace(/[^a-zA-Z0-9]/g, '_')}_Official_Record.pdf`);
      };

      img.onerror = () => {
        pdf.save(`${(doc.title || 'document').replace(/[^a-zA-Z0-9]/g, '_')}_Official_Record.pdf`);
      };
      return;
    }

    // Agar image nahi thi toh single page download
    pdf.save(`${(doc.title || 'document').replace(/[^a-zA-Z0-9]/g, '_')}_Official_Record.pdf`);
  };
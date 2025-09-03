import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateReportPDFLib(action: string, weekInfo: any, notesInfo: any) {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();

    // Load fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Load Manrope fonts
    let manrope, manropeBold;
    try {
        const manropeRegularResponse = await fetch('/fonts/Manrope-Regular.ttf');
        const manropeRegularBytes = await manropeRegularResponse.arrayBuffer();
        manrope = await pdfDoc.embedFont(manropeRegularBytes);
        
        const manropeBoldResponse = await fetch('/fonts/Manrope-Bold.ttf');
        const manropeBoldBytes = await manropeBoldResponse.arrayBuffer();
        manropeBold = await pdfDoc.embedFont(manropeBoldBytes);
    } catch (error) {
        console.log('Manrope fonts not found, falling back to Helvetica');
        manrope = helvetica;
        manropeBold = helveticaBold;
    }

    // Colors
    const darkGray = rgb(0.2, 0.2, 0.2);
    const lightGray = rgb(0.9, 0.9, 0.9);
    const cardGray = rgb(0.99, 0.99, 0.99);
    const separatorGray = rgb(0.8, 0.8, 0.8);

    // Add logo/brasão (top left corner)
    try {
        const logoResponse = await fetch('/brasao.png');
        const logoBytes = await logoResponse.arrayBuffer();
        const logoImage = await pdfDoc.embedPng(logoBytes);
        
        // Add logo (20x20 size, positioned at top left)
        page.drawImage(logoImage, {
            x:10,
            y: height - 50,
            width: 40,
            height: 40,
        });
    } catch (error) {
        console.log('Logo not found, continuing without it');
    }

    // Header - Institution name (centered)
    const titleText = 'PONTIFÍCIO COLÉGIO PIO BRASILEIRO';
    const titleWidth = manropeBold.widthOfTextAtSize(titleText, 18);
    page.drawText(titleText, {
        x: (width - titleWidth) / 2,
        y: height - 50,
        size: 18,
        font: manropeBold,
        color: darkGray,
    });
    
    // Subtitle (centered)
    const subtitleText = 'Lista de agendamento de refeições';
    const subtitleWidth = manropeBold.widthOfTextAtSize(subtitleText, 14);
    page.drawText(subtitleText, {
        x: (width - subtitleWidth) / 2,
        y: height - 80,
        size: 14,
        font: manropeBold,
        color: darkGray,
    });
    
    // Summary section
    const summaryY = height - 120;
    
    // Period
    page.drawText('Período: ', {
        x: 50,
        y: summaryY,
        size: 11,
        font: manrope,
        color: darkGray,
    });
    page.drawText(weekInfo.period || 'Data não informada', {
        x: 100,
        y: summaryY,
        size: 11,
        font: manropeBold,
        color: darkGray,
    });
    
    // Vertical separator line 1
    page.drawLine({
        start: { x: 200, y: summaryY - 10 },
        end: { x: 200, y: summaryY + 10 },
        thickness: 0.5,
        color: separatorGray,
    });
    
    // Total lunches
    page.drawText('Total de almoços: ', {
        x: 220,
        y: summaryY,
        size: 11,
        font: manrope,
        color: darkGray,
    });
    page.drawText(weekInfo.totalAlmoco.toString(), {
        x: 320,
        y: summaryY,
        size: 11,
        font: manropeBold,
        color: darkGray,
    });
    
    // Vertical separator line 2
    page.drawLine({
        start: { x: 350, y: summaryY - 10 },
        end: { x: 350, y: summaryY + 10 },
        thickness: 0.5,
        color: separatorGray,
    });
    
    // Total dinners
    page.drawText('Total de jantares: ', {
        x: 370,
        y: summaryY,
        size: 11,
        font: manrope,
        color: darkGray,
    });
    page.drawText(weekInfo.totalJantares.toString(), {
        x: 470,
        y: summaryY,
        size: 11,
        font: manropeBold,
        color: darkGray,
    });
    
    // Daily meal cards

    
    let cardY = height - 160;
    const cardHeight = 46; // Increased height for more padding
    const cardWidth = 500;
    
    weekInfo.daysInfo.forEach((dayInfo: any) => {
        // Card background
        page.drawRectangle({
            x: 50,
            y: cardY - cardHeight,
            width: cardWidth,
            height: cardHeight,
            color: cardGray,
            borderColor: separatorGray,
            borderWidth: 0.5,
        });
        
        // Date and day (Column 1) - with more padding
        page.drawText(dayInfo.date, {
            x: 70,
            y: cardY - 20,
            size: 10,
            font: manropeBold,
            color: darkGray,
        });
        page.drawText(dayInfo.day, {
            x: 70,
            y: cardY - 32,
            size: 9,
            font: manrope,
            color: darkGray,
        });
        
        // Total lunches (Column 2) - with more padding
        page.drawText(dayInfo.mealsInfo.totalAlmoco.toString(), {
            x: 220,
            y: cardY - 20,
            size: 12,
            font: manropeBold,
            color: darkGray,
        });
        page.drawText('almoços', {
            x: 220,
            y: cardY - 32,
            size: 9,
            font: manrope,
            color: darkGray,
        });
        
        // Lunch breakdown (Column 3) - removed boldness from text
        page.drawText(`${dayInfo.mealsInfo.totalAlmocoColegio} No Colégio PIO`, {
            x: 300,
            y: cardY - 20,
            size: 9,
            font: manrope, // Using Manrope regular
            color: darkGray,
        });
        page.drawText(`${dayInfo.mealsInfo.totalAlmocoLevar} Para levar`, {
            x: 300,
            y: cardY - 32,
            size: 9,
            font: manrope, // Using Manrope regular
            color: darkGray,
        });
        
        // Total dinners (Column 4) - with more padding
        page.drawText(dayInfo.mealsInfo.totalJanta.toString(), {
            x: 480,
            y: cardY - 20,
            size: 12,
            font: manropeBold,
            color: darkGray,
        });
        page.drawText('jantares', {
            x: 480,
            y: cardY - 32,
            size: 9,
            font: manrope,
            color: darkGray,
        });
        
        cardY -= cardHeight + 16; // Increased spacing between cards
    });
    
    // Add second page if needed
    const secondPage = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width: secondWidth, height: secondHeight } = secondPage.getSize();

     // Add logo/brasão (top left corner)
     try {
        const logoResponse = await fetch('/brasao.png');
        const logoBytes = await logoResponse.arrayBuffer();
        const logoImage = await pdfDoc.embedPng(logoBytes);
        
        // Add logo (20x20 size, positioned at top left)
        secondPage.drawImage(logoImage, {
            x:10,
            y: secondHeight - 50,
            width: 40,
            height: 40,
        });
    } catch (error) {
        console.log('Logo not found, continuing without it');
    }
    
    // Header - Institution name (centered)
    const title2Text = 'PONTIFÍCIO COLÉGIO PIO BRASILEIRO';
    const title2Width = manropeBold.widthOfTextAtSize(title2Text, 18);
    secondPage.drawText(title2Text, {
        x: (secondWidth - title2Width) / 2,
        y: secondHeight - 50,
        size: 18,
        font: manropeBold,
        color: darkGray,
    });
    
    // Subtitle (centered)
    const subtitle2Text = 'Observações adicionais';
    const subtitle2Width = manropeBold.widthOfTextAtSize(subtitle2Text, 14);
    secondPage.drawText(subtitle2Text, {
        x: (secondWidth - subtitle2Width) / 2,
        y: secondHeight - 80,
        size: 14,
        font: manropeBold,
        color: darkGray,
    });
    
    // Summary section
    const summary2Y = secondHeight - 120;
    
    // Period
    secondPage.drawText('Período: ', {
        x: 50,
        y: summary2Y,
        size: 11,
        font: manrope,
        color: darkGray,
    });
    secondPage.drawText(weekInfo.period || 'Data não informada', {
        x: 100,
        y: summary2Y,
        size: 11,
        font: manropeBold,
        color: darkGray,
    });

    // Helper function to create a notes page
    const createNotesPage = (page: any, pageWidth: number, pageHeight: number, notes: any[], pageNumber: number) => {
        const tableStartY = pageHeight - 130;
        const tableWidth = 500;
        const baseRowHeight = 42;
        const headerHeight = 25;
        const lineHeight = 12;
        const padding = 10;
        
        // Table header
        page.drawRectangle({
            x: 50,
            y: tableStartY - headerHeight,
            width: tableWidth,
            height: headerHeight,
            color: rgb(0.95, 0.95, 0.95), // Light gray background
        });
        
        // Header text
        page.drawText('Nome', {
            x: 60,
            y: tableStartY - 15,
            size: 11,
            font: manropeBold,
            color: darkGray,
        });
        
        page.drawText('Observações', {
            x: 220,
            y: tableStartY - 15,
            size: 11,
            font: manropeBold,
            color: darkGray,
        });
        
        // Header borders
        page.drawLine({
            start: { x: 50, y: tableStartY - headerHeight },
            end: { x: 550, y: tableStartY - headerHeight },
            thickness: 0.5,
            color: separatorGray,
        });
        
        page.drawLine({
            start: { x: 50, y: tableStartY },
            end: { x: 550, y: tableStartY },
            thickness: 0.5,
            color: separatorGray,
        });
        
        page.drawLine({
            start: { x: 50, y: tableStartY - headerHeight },
            end: { x: 50, y: tableStartY },
            thickness: 0.5,
            color: separatorGray,
        });
        
        page.drawLine({
            start: { x: 550, y: tableStartY - headerHeight },
            end: { x: 550, y: tableStartY },
            thickness: 0.5,
            color: separatorGray,
        });
        
        page.drawLine({
            start: { x: 200, y: tableStartY - headerHeight },
            end: { x: 200, y: tableStartY },
            thickness: 0.5,
            color: separatorGray,
        });
        
        // Data rows
        let currentY = tableStartY;
        notes.forEach((note: any, index: number) => {
            // Calculate content height for this row
            const nameText = note.name || 'Nome não informado';
            const noteText = note.note || 'Sem observações';
            const notesColumnWidth = 350;
            const maxWidth = notesColumnWidth - 20;
            const observacoesLabelWidth = manropeBold.widthOfTextAtSize('Observações: ', 10);
            const noteMaxWidth = maxWidth - observacoesLabelWidth;
            
            // Calculate how many lines the note text will take
            const words = noteText.split(' ');
            let noteLines = 1;
            let currentLine = '';
            
            for (const word of words) {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                const textWidth = manrope.widthOfTextAtSize(testLine, 10);
                
                if (textWidth > noteMaxWidth && currentLine) {
                    noteLines++;
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
            
            // Calculate how many lines the name text will take
            const nameLabelWidth = manropeBold.widthOfTextAtSize('Nome: ', 10);
            const nameMaxWidth = 150 - nameLabelWidth - 10; // 150 is name column width minus label and padding
            const nameWords = nameText.split(' ');
            let nameLines = 1;
            let currentNameLine = '';
            
            for (const word of nameWords) {
                const testLine = currentNameLine + (currentNameLine ? ' ' : '') + word;
                const textWidth = manrope.widthOfTextAtSize(testLine, 10);
                
                if (textWidth > nameMaxWidth && currentNameLine) {
                    nameLines++;
                    currentNameLine = word;
                } else {
                    currentNameLine = testLine;
                }
            }
            
            // Use the maximum number of lines between name and note
            const maxLines = Math.max(nameLines, noteLines);
            const dynamicRowHeight = Math.max(baseRowHeight, (maxLines * lineHeight) + padding);
            
            // Row background (white) - now with dynamic height
            page.drawRectangle({
                x: 50,
                y: currentY - dynamicRowHeight,
                width: tableWidth,
                height: dynamicRowHeight,
                color: rgb(1, 1, 1), // White background
            });
            
            // Name column with bold label and text wrapping
            page.drawText('Nome: ', {
                x: 60,
                y: currentY - 20,
                size: 10,
                font: manropeBold,
                color: darkGray,
            });
            
            const nameLabelWidth2 = manropeBold.widthOfTextAtSize('Nome: ', 10);
            let nameLineY = currentY - 20;
            let currentNameLine2 = '';
            
            for (const word of nameWords) {
                const testLine = currentNameLine2 + (currentNameLine2 ? ' ' : '') + word;
                const textWidth = manrope.widthOfTextAtSize(testLine, 10);
                
                if (textWidth > nameMaxWidth && currentNameLine2) {
                    // Draw current line and start new one
                    page.drawText(currentNameLine2, {
                        x: 60 + nameLabelWidth2,
                        y: nameLineY,
                        size: 10,
                        font: manrope,
                        color: darkGray,
                    });
                    currentNameLine2 = word;
                    nameLineY -= lineHeight;
                } else {
                    currentNameLine2 = testLine;
                }
            }
            
            // Draw the last name line
            if (currentNameLine2) {
                page.drawText(currentNameLine2, {
                    x: 60 + nameLabelWidth2,
                    y: nameLineY,
                    size: 10,
                    font: manrope,
                    color: darkGray,
                });
            }
            
            // Notes column with text wrapping and bold label
            page.drawText('Observações: ', {
                x: 220,
                y: currentY - 20,
                size: 10,
                font: manropeBold,
                color: darkGray,
            });
            
            // Calculate position for note text after the label
            const observacoesLabelWidth2 = manropeBold.widthOfTextAtSize('Observações: ', 10);
            const noteStartX = 220 + observacoesLabelWidth2;
            const noteMaxWidth2 = maxWidth - observacoesLabelWidth2;
            
            // Simple text wrapping - split long text into lines
            let currentLine2 = '';
            let lineY = currentY - 20;
            
            for (const word of words) {
                const testLine = currentLine2 + (currentLine2 ? ' ' : '') + word;
                const textWidth = manrope.widthOfTextAtSize(testLine, 10);
                
                if (textWidth > noteMaxWidth2 && currentLine2) {
                    // Draw current line and start new one
                    page.drawText(currentLine2, {
                        x: noteStartX,
                        y: lineY,
                        size: 10,
                        font: manrope,
                        color: darkGray,
                    });
                    currentLine2 = word;
                    lineY -= lineHeight;
                } else {
                    currentLine2 = testLine;
                }
            }
            
            // Draw the last line
            if (currentLine2) {
                page.drawText(currentLine2, {
                    x: noteStartX,
                    y: lineY,
                    size: 10,
                    font: manrope,
                    color: darkGray,
                });
            }
            
            // Row borders - now with dynamic height
            page.drawLine({
                start: { x: 50, y: currentY - dynamicRowHeight },
                end: { x: 550, y: currentY - dynamicRowHeight },
                thickness: 0.5,
                color: separatorGray,
            });
            
            page.drawLine({
                start: { x: 50, y: currentY - dynamicRowHeight },
                end: { x: 50, y: currentY },
                thickness: 0.5,
                color: separatorGray,
            });
            
            page.drawLine({
                start: { x: 550, y: currentY - dynamicRowHeight },
                end: { x: 550, y: currentY },
                thickness: 0.5,
                color: separatorGray,
            });
            
            page.drawLine({
                start: { x: 200, y: currentY - dynamicRowHeight },
                end: { x: 200, y: currentY },
                thickness: 0.5,
                color: separatorGray,
            });
            
            currentY -= dynamicRowHeight;
        });
        
        // Final bottom border with left and right borders
        page.drawLine({
            start: { x: 50, y: currentY },
            end: { x: 550, y: currentY },
            thickness: 0.5,
            color: separatorGray,
        });
        
        page.drawLine({
            start: { x: 50, y: tableStartY - headerHeight },
            end: { x: 50, y: currentY },
            thickness: 0.5,
            color: separatorGray,
        });
        
        page.drawLine({
            start: { x: 550, y: tableStartY - headerHeight },
            end: { x: 550, y: currentY },
            thickness: 0.5,
            color: separatorGray,
        });
    };

    // Helper function to calculate row height for a note
    const calculateRowHeight = (note: any) => {
        const nameText = note.name || 'Nome não informado';
        const noteText = note.note || 'Sem observações';
        const notesColumnWidth = 350;
        const maxWidth = notesColumnWidth - 20;
        const observacoesLabelWidth = manropeBold.widthOfTextAtSize('Observações: ', 10);
        const noteMaxWidth = maxWidth - observacoesLabelWidth;
        const lineHeight = 12;
        const padding = 10;
        const baseRowHeight = 42;
        
        // Calculate how many lines the note text will take
        const words = noteText.split(' ');
        let noteLines = 1;
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const textWidth = manrope.widthOfTextAtSize(testLine, 10);
            
            if (textWidth > noteMaxWidth && currentLine) {
                noteLines++;
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        
        // Calculate how many lines the name text will take
        const nameLabelWidth = manropeBold.widthOfTextAtSize('Nome: ', 10);
        const nameMaxWidth = 150 - nameLabelWidth - 10;
        const nameWords = nameText.split(' ');
        let nameLines = 1;
        let currentNameLine = '';
        
        for (const word of nameWords) {
            const testLine = currentNameLine + (currentNameLine ? ' ' : '') + word;
            const textWidth = manrope.widthOfTextAtSize(testLine, 10);
            
            if (textWidth > nameMaxWidth && currentNameLine) {
                nameLines++;
                currentNameLine = word;
            } else {
                currentNameLine = testLine;
            }
        }
        
        // Use the maximum number of lines between name and note
        const maxLines = Math.max(nameLines, noteLines);
        return Math.max(baseRowHeight, (maxLines * lineHeight) + padding);
    };

    // Helper function to calculate how many rows fit on a page
    const calculateRowsPerPage = (notes: any[], startIndex: number, availableHeight: number) => {
        const headerHeight = 25;
        const tableStartY = availableHeight - 130;
        const bottomMargin = 50; // Leave some white space at bottom
        const usableHeight = tableStartY - bottomMargin - headerHeight;
        
        let currentHeight = 0;
        let rowCount = 0;
        
        for (let i = startIndex; i < notes.length; i++) {
            const rowHeight = calculateRowHeight(notes[i]);
            
            if (currentHeight + rowHeight > usableHeight) {
                break;
            }
            
            currentHeight += rowHeight;
            rowCount++;
        }
        
        return rowCount;
    };

    // Handle notes pagination with dynamic row heights
    if (notesInfo && notesInfo.length > 0) {
        const pages = [];
        let currentIndex = 0;
        
        // Calculate pages based on actual content height
        while (currentIndex < notesInfo.length) {
            const rowsForThisPage = calculateRowsPerPage(notesInfo, currentIndex, secondHeight);
            const pageNotes = notesInfo.slice(currentIndex, currentIndex + rowsForThisPage);
            pages.push(pageNotes);
            currentIndex += rowsForThisPage;
        }
        
        // Create additional pages if needed (beyond the second page)
        for (let pageNum = 1; pageNum < pages.length; pageNum++) {
            const additionalPage = pdfDoc.addPage([595.28, 841.89]);
            const { width: addPageWidth, height: addPageHeight } = additionalPage.getSize();
            
            // Add logo to additional page
            try {
                const logoResponse = await fetch('/brasao.png');
                const logoBytes = await logoResponse.arrayBuffer();
                const logoImage = await pdfDoc.embedPng(logoBytes);
                
                additionalPage.drawImage(logoImage, {
                    x: 10,
                    y: addPageHeight - 50,
                    width: 40,
                    height: 40,
                });
            } catch (error) {
                console.log('Logo not found, continuing without it');
            }
            
            // Add header to additional page
            const titleText = 'PONTIFÍCIO COLÉGIO PIO BRASILEIRO';
            const titleWidth = manropeBold.widthOfTextAtSize(titleText, 18);
            additionalPage.drawText(titleText, {
                x: (addPageWidth - titleWidth) / 2,
                y: addPageHeight - 50,
                size: 18,
                font: manropeBold,
                color: darkGray,
            });
            
            const subtitleText = 'Observações adicionais';
            const subtitleWidth = manropeBold.widthOfTextAtSize(subtitleText, 14);
            additionalPage.drawText(subtitleText, {
                x: (addPageWidth - subtitleWidth) / 2,
                y: addPageHeight - 80,
                size: 14,
                font: manropeBold,
                color: darkGray,
            });
            
            // Add period info
            const summaryY = addPageHeight - 120;
            additionalPage.drawText('Período: ', {
                x: 50,
                y: summaryY,
                size: 11,
                font: manrope,
                color: darkGray,
            });
            additionalPage.drawText(weekInfo.period || 'Data não informada', {
                x: 100,
                y: summaryY,
                size: 11,
                font: manropeBold,
                color: darkGray,
            });
        }
        
        // Create notes tables on all pages
        for (let pageNum = 0; pageNum < pages.length; pageNum++) {
            const pageNotes = pages[pageNum];
            
            let targetPage;
            if (pageNum === 0) {
                targetPage = secondPage;
            } else {
                targetPage = pdfDoc.getPage(pageNum + 1); // +1 because first page is index 0
            }
            
            createNotesPage(targetPage, secondWidth, secondHeight, pageNotes, pageNum + 1);
        }
    } else {
        // No notes - show message
        secondPage.drawText('Não há observações a serem feitas', {
            x: 50,
            y: summary2Y - 60,
            size: 14,
            font: manrope,
            color: darkGray,
        });
    }
    
    // Generate PDF
    const pdfBytes = await pdfDoc.save();
    
    if (action === 'save') {
        // Create blob and download
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Generate dynamic filename based on weekInfo
        const filename = `relatorio-refeicoes-${weekInfo.period.replace(' a ', '-')}.pdf`;
        
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    } else if (action === 'print') {
        // Generate dynamic filename for print
        const filename = `relatorio-refeicoes-${weekInfo.period.replace(' a ', '-')}.pdf`;
        
        // Create blob with filename
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Open in new tab with filename
        const printWindow = window.open(url, '_blank');
        
        // Set the document title for better print experience
        if (printWindow) {
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                }, 1000); // Wait 1 second for PDF to fully load
            };
        }
        
        // Clean up URL after a delay
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 10000); // Clean up after 10 seconds
    }
}
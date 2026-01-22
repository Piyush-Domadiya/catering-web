import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface EventData {
  name: string;
  date: string;
  location: string;
  type: string;
  guestCount: number | null;
  perPlateCost: number | null;
  taxRate: number | null;
  discount: number | null;
  menuItems: string | null;
  customer: {
    name: string;
    phone: string;
    email?: string | null;
  };
}

interface BusinessInfo {
  companyName: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
}

export const generateQuotePDF = (event: EventData, business: BusinessInfo) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Colors
  const amber: [number, number, number] = [245, 158, 11]; // #f59e0b
  const darkGray: [number, number, number] = [31, 41, 55]; // #1f2937
  const lightGray: [number, number, number] = [107, 114, 128]; // #6b7280

  // Header
  doc.setFillColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(business.companyName.toUpperCase(), 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("EVENT QUOTATION", pageWidth - 20, 25, { align: "right" });

  // Business Info
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  const businessContact = [
    business.address,
    business.phone ? `Phone: ${business.phone}` : null,
    business.email ? `Email: ${business.email}` : null,
  ].filter(Boolean);
  
  businessContact.forEach((line, i) => {
    if (line) doc.text(line, pageWidth - 20, 32 + i * 4, { align: "right" });
  });

  // Client Info Section
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("QUOTATION FOR:", 20, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(event.customer.name, 20, 62);
  doc.text(event.customer.phone, 20, 67);
  if (event.customer.email) doc.text(event.customer.email, 20, 72);

  // Event Summary Section
  doc.setFont("helvetica", "bold");
  doc.text("EVENT DETAILS", pageWidth / 2, 55);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Event: ${event.name}`, pageWidth / 2, 62);
  doc.text(`Type: ${event.type}`, pageWidth / 2, 67);
  doc.text(`Date: ${new Date(event.date).toLocaleDateString()}`, pageWidth / 2, 72);
  doc.text(`Venue: ${event.location}`, pageWidth / 2, 77);

  // Pricing Table
  const guestCount = event.guestCount || 0;
  const perPlate = event.perPlateCost || 0;
  const subtotal = guestCount * perPlate;
  const tax = (subtotal * (event.taxRate || 0)) / 100;
  const discount = event.discount || 0;
  const total = subtotal + tax - discount;

  autoTable(doc, {
    startY: 90,
    head: [["Description", "Qty", "Unit Price", "Total"]],
    body: [
      [
        `Catering Service: ${event.type}\n(Per Plate Cost)`,
        guestCount,
        `₹${perPlate.toLocaleString()}`,
        `₹${subtotal.toLocaleString()}`,
      ],
    ],
    theme: "striped",
    headStyles: { fillColor: amber, textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Calculation Block
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const calcX = pageWidth - 20;

  doc.text("Subtotal:", calcX - 40, finalY);
  doc.text(`₹${subtotal.toLocaleString()}`, calcX, finalY, { align: "right" });

  if (tax > 0) {
    doc.text(`Tax (${event.taxRate}%):`, calcX - 40, finalY + 7);
    doc.text(`₹${tax.toLocaleString()}`, calcX, finalY + 7, { align: "right" });
  }

  if (discount > 0) {
    doc.setTextColor(220, 38, 38); // Red
    doc.text("Discount:", calcX - 40, finalY + 14);
    doc.text(`-₹${discount.toLocaleString()}`, calcX, finalY + 14, { align: "right" });
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  }

  doc.setLineWidth(0.5);
  doc.line(calcX - 50, finalY + 18, calcX, finalY + 18);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Total Amount:", calcX - 50, finalY + 25);
  doc.text(`₹${total.toLocaleString()}`, calcX, finalY + 25, { align: "right" });

  // Menu Selection
  if (event.menuItems) {
    const menuY = finalY + 40;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PROPOSED MENU", 20, menuY);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const menuLines = doc.splitTextToSize(event.menuItems, pageWidth - 40);
    doc.text(menuLines, 20, menuY + 7);
  }

  // Footer / Terms
  doc.setFontSize(8);
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
  const footerY = doc.internal.pageSize.height - 20;
  doc.text("Thank you for choosing our services!", pageWidth / 2, footerY - 5, { align: "center" });
  doc.text("This is a computer-generated quotation and does not require a signature.", pageWidth / 2, footerY, { align: "center" });

  // Return the PDF document object
  return doc;
};

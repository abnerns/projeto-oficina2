import PDFDocument from "pdfkit";

const CertificateModel = {
  async generate(alunoNome, oficinaTema, oficinaData) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        layout: "landscape",
        size: "A4",
        margins: { top: 60, bottom: 60, left: 60, right: 60 },
      });

      const chunks = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      doc.rect(0, 0, pageWidth, pageHeight).fill("#fafafa");

      doc.rect(20, 20, pageWidth - 40, pageHeight - 40).lineWidth(3).stroke("#1a365d");

      doc.rect(30, 30, pageWidth - 60, pageHeight - 60).lineWidth(1).stroke("#2b6cb0");

      doc
        .fontSize(36)
        .font("Helvetica-Bold")
        .fillColor("#1a365d")
        .text("CERTIFICADO", { align: "center" });

      doc.moveDown(1.5);

      doc
        .fontSize(14)
        .font("Helvetica")
        .fillColor("#4a5568")
        .text("Certificamos que", { align: "center" });

      doc.moveDown(0.8);

      doc
        .fontSize(28)
        .font("Helvetica-Bold")
        .fillColor("#1a365d")
        .text(alunoNome, { align: "center" });

      doc.moveDown(0.8);

      doc
        .fontSize(14)
        .font("Helvetica")
        .fillColor("#4a5568")
        .text("participou da oficina", { align: "center" });

      doc.moveDown(0.8);

      doc
        .fontSize(22)
        .font("Helvetica-Bold")
        .fillColor("#2b6cb0")
        .text(oficinaTema, { align: "center" });

      doc.moveDown(0.5);

      const dataFormatada = new Date(oficinaData).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#4a5568")
        .text(`Realizada em ${dataFormatada}`, { align: "center" });

      doc.moveDown(3);

      const now = new Date().toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      doc
        .fontSize(11)
        .font("Helvetica")
        .fillColor("#718096")
        .text(`Emitido em ${now}`, { align: "center" });

      doc.end();
    });
  },
};

export default CertificateModel;

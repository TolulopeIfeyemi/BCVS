const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { FRONTEND_URL } = require("../../config/contants");
const QRCode = require("qrcode");

module.exports = async function certificateTemplate(data) {
  const publicPath = path.join(process.cwd(), "./public");

  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
  });

  // Helper to move to next line
  function jumpLine(doc, lines) {
    for (let index = 0; index < lines; index++) {
      doc.moveDown();
    }
  }

  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#fff");

  doc.fontSize(10);

  // Margin
  const distanceMargin = 18;

  doc
    .fillAndStroke("#0e8cc3")
    .lineWidth(20)
    .lineJoin("round")
    .rect(
      distanceMargin,
      distanceMargin,
      doc.page.width - distanceMargin * 2,
      doc.page.height - distanceMargin * 2
    )
    .stroke();

  // Header
  const maxWidth = 140;
  const maxHeight = 70;

  doc.image(
    `${publicPath}/assets/seal.png`,
    doc.page.width / 2 - maxWidth / 2,
    60,
    {
      fit: [maxWidth, maxHeight],
      align: "center",
    }
  );

  jumpLine(doc, 5);

  doc
    .font(`${publicPath}/fonts/NotoSansJP-Regular.otf`)
    .fontSize(30)
    .fill("#021c27")
    .text("Olabisi Onabanjo University", {
      align: "center",
    });

  //   jumpLine(doc, 2);

  // Content
  doc
    .font(`${publicPath}/fonts/NotoSansJP-Regular.otf`)
    .fontSize(16)
    .fill("#021c27")
    .text("CERTIFICATE OF BACHELOR DEGREE", {
      align: "center",
    });

  jumpLine(doc, 1);

  doc
    .font(`${publicPath}/fonts/NotoSansJP-Light.otf`)
    .fontSize(10)
    .fill("#021c27")
    .text("This is to certify that", {
      align: "center",
    });

  jumpLine(doc, 2);

  doc
    .font(`${publicPath}/fonts/NotoSansJP-Bold.otf`)
    .fontSize(24)
    .fill("#021c27")
    .text(`${data.firstname} ${data.lastname} ${data.middlename}`, {
      align: "center",
    });

  jumpLine(doc, 1);

  doc
    .font(`${publicPath}/fonts/NotoSansJP-Light.otf`)
    .fontSize(10)
    .fill("#021c27")
    .text(`has successfully completed ${data.degreeAwarded}`, {
      align: "center",
    });

  jumpLine(doc, 9);

  doc.lineWidth(1);

  // Signatures
  const lineSize = 174;
  const signatureHeight = 390;

  doc.fillAndStroke("#021c27");
  doc.strokeOpacity(0.2);

  //   const startLine1 = 128;
  //   const endLine1 = 128 + lineSize;
  //   doc
  //     .moveTo(startLine1, signatureHeight)
  //     .lineTo(endLine1, signatureHeight)
  //     .stroke();

  const startLine2 = 325;
  const endLine2 = startLine2 + lineSize;
  doc
    .moveTo(startLine2, signatureHeight)
    .lineTo(endLine2, signatureHeight)
    .stroke();

  //   const startLine3 = endLine2 + 32;
  //   const endLine3 = startLine3 + lineSize;
  //   doc
  //     .moveTo(startLine3, signatureHeight)
  //     .lineTo(endLine3, signatureHeight)
  //     .stroke();

  //   doc
  //     .font(`${publicPath}/fonts/NotoSansJP-Bold.otf`)
  //     .fontSize(10)
  //     .fill("#021c27")
  //     .text("John Doe", startLine1, signatureHeight + 10, {
  //       columns: 1,
  //       columnGap: 0,
  //       height: 40,
  //       width: lineSize,
  //       align: "center",
  //     });

  //   doc
  //     .font(`${publicPath}/fonts/NotoSansJP-Light.otf`)
  //     .fontSize(10)
  //     .fill("#021c27")
  //     .text("Associate Professor", startLine1, signatureHeight + 25, {
  //       columns: 1,
  //       columnGap: 0,
  //       height: 40,
  //       width: lineSize,
  //       align: "center",
  //     });

  doc
    .font(`${publicPath}/fonts/NotoSansJP-Bold.otf`)
    .fontSize(10)
    .fill("#021c27")
    .text("Prof. Agboola, Ayodeji", startLine2, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  doc
    .font(`${publicPath}/fonts/NotoSansJP-Light.otf`)
    .fontSize(10)
    .fill("#021c27")
    .text("Vice Chancelor", startLine2, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  //   doc
  //     .font(`${publicPath}/fonts/NotoSansJP-Bold.otf`)
  //     .fontSize(10)
  //     .fill("#021c27")
  //     .text(data.firstname, startLine3, signatureHeight + 10, {
  //       columns: 1,
  //       columnGap: 0,
  //       height: 40,
  //       width: lineSize,
  //       align: "center",
  //     });

  //   doc
  //     .font(`${publicPath}/fonts/NotoSansJP-Light.otf`)
  //     .fontSize(10)
  //     .fill("#021c27")
  //     .text("Director", startLine3, signatureHeight + 25, {
  //       columns: 1,
  //       columnGap: 0,
  //       height: 40,
  //       width: lineSize,
  //       align: "center",
  //     });

  jumpLine(doc, 4);

  // Validation link
  const link = `${FRONTEND_URL}/verify`;

  const linkWidth = doc.widthOfString(link);
  const linkHeight = doc.currentLineHeight();

  doc
    .underline(doc.page.width / 2 - linkWidth / 2, 448, linkWidth, linkHeight, {
      color: "#021c27",
    })
    .link(doc.page.width / 2 - linkWidth / 2, 448, linkWidth, linkHeight, link);

  doc
    .font(`${publicPath}/fonts/NotoSansJP-Light.otf`)
    .fontSize(10)
    .fill("#021c27")
    .text(
      `Certificate ID: ${data.certificateId}`,
      doc.page.width / 2 - linkWidth / 2,
      448,
      linkWidth,
      linkHeight
    );

  // Footer
  const bottomHeight = doc.page.height - 100;

  //   doc.image(
  //     `${publicPath}/assets/qr.png`,
  //     doc.page.width / 2 - 30,
  //     bottomHeight,
  //     {
  //       fit: [60, 60],
  //     }
  //   );

  // Generate QR code data URL
  const url = await QRCode.toDataURL(link);

  // Add QR code image to document
  doc.image(url, doc.page.width / 2 - 30, bottomHeight, {
    fit: [70, 70],
  });

  return doc;
};

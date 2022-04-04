import Path from 'path';
import PdfPrinter from 'pdfmake';

const fonts = {
  Roboto: {
    normal: Path.resolve(__dirname, '../../assets/fonts/Roboto/Roboto-Regular.ttf'),
    bold: Path.resolve(__dirname, '../../assets/fonts/Roboto/Roboto-Bold.ttf'),
    italics: Path.resolve(__dirname, '../../assets/fonts/Roboto/Roboto-Italic.ttf'),
    bolditalics: Path.resolve(__dirname, '../../assets/fonts/Roboto/Roboto-MediumItalic.ttf'),
  },
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique',
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic',
  },
  Symbol: {
    normal: 'Symbol',
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats',
  },
};

const printer = new PdfPrinter(fonts);

const generatePdf = (docDefinition) => new Promise((resolve, reject) => {
  try {
    const doc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    doc.on('end', () => resolve(Buffer.concat(chunks)));

    doc.end();
  } catch (error) {
    reject(error);
  }
});

export default generatePdf;

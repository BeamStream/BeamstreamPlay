package utils
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileInputStream
import java.io.InputStream

import org.dopdf.document.model.PageDetail
import org.dopdf.document.read.pdf.PDFDocumentReader

import javax.imageio.ImageIO

object PreviewOfPDF {

  def convertPdfToImage(docReceived: File, docName: String) = {
    println("coming here")
    val baos: ByteArrayOutputStream = new ByteArrayOutputStream
    val inputStream = new FileInputStream(docReceived)

    val document = new PDFDocumentReader(inputStream)
    val pageDetail = new PageDetail("", "", 0, "")
    val det = document.getPageAsImage(pageDetail)

    val image = ImageIO.read(new ByteArrayInputStream(det.getBytes()))
    ImageIO.write(image, "jpg", baos)
    val imageInByte = baos.toByteArray
    val decodedInput: InputStream = new ByteArrayInputStream(imageInByte)
    (new AmazonUpload).uploadCompressedFileToAmazon("PdfFrame" + docName, decodedInput, 0, true, "")
    println("LoGDone")
    "https://s3.amazonaws.com/BeamStream/" + "PdfFrame" + docName
  }
}
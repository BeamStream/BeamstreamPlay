package utils
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileInputStream
import java.io.InputStream
import org.dopdf.document.model.PageDetail
import org.dopdf.document.read.pdf.PDFDocumentReader
import javax.imageio.ImageIO

object PreviewOfPDFUtil {

  /**
   * @param docReceived is the pdf file
   * @param docName is the name of the pdf file
   */
  def convertPdfToImage(docReceived: File, docName: String): String = {
    val byteArrayOutPutStream: ByteArrayOutputStream = new ByteArrayOutputStream
    val inputStream = new FileInputStream(docReceived)

    val document = new PDFDocumentReader(inputStream)
    val pageDetail = new PageDetail("", "", 0, "")
    val resourceDetails = document.getPageAsImage(pageDetail)

    val image = ImageIO.read(new ByteArrayInputStream(resourceDetails.getBytes()))
    ImageIO.write(image, "jpg", byteArrayOutPutStream)
    val imageInByte = byteArrayOutPutStream.toByteArray
    val decodedInput: InputStream = new ByteArrayInputStream(imageInByte)
    (new AmazonUpload).uploadCompressedFileToAmazon("PdfFrame" + docName, decodedInput, 0, true, "")
    "https://s3.amazonaws.com/BeamStream/" + "PdfFrame" + docName
  }
}
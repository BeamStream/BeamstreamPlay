package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication
import java.io.File
import java.io.InputStream
import java.io.FileInputStream

@RunWith(classOf[JUnitRunner])
class PreviewOfPDFUtilTest extends FunSuite {

  test("Convert PDF to Image") {
    running(FakeApplication()) {
      val docReceived = new File("/home/himanshu/Documents/BeamStream-Case-Study-v1.2.pdf")
      val result = PreviewOfPDFUtil.convertPdfToImage(docReceived, "Himanshu")
      assert((new AmazonUpload).isFileExists("PdfFrameHimanshu") === true)
      (new AmazonUpload).deleteFileFromAmazon("PdfFrameHimanshu")
      assert((new AmazonUpload).isFileExists("PdfFrameHimanshu") === false)
    }
  }
  
}
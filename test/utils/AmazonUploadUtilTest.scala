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
class AmazonUploadUtilTest extends FunSuite {

  test("Upload File to Amazon") {
    running(FakeApplication()) {
      val profilePic = new File("README")
      (new AmazonUpload).uploadFileToAmazon("Himanshu", profilePic)
      assert((new AmazonUpload).isFileExists("Himanshu") === true)
      (new AmazonUpload).deleteFileFromAmazon("Himanshu")
      assert((new AmazonUpload).isFileExists("Himanshu") === false)
    }
  }

  test("Upload Compressed File to Amazon") {
    running(FakeApplication()) {
      val profilePic = new FileInputStream("README")
      (new AmazonUpload).uploadCompressedFileToAmazon("Himanshu", profilePic)
      assert((new AmazonUpload).isFileExists("Himanshu") === true)
      (new AmazonUpload).deleteFileFromAmazon("Himanshu")
      assert((new AmazonUpload).isFileExists("Himanshu") === false)
    }
  }
  
}
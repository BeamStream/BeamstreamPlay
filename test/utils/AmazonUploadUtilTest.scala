/*package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication

@RunWith(classOf[JUnitRunner])
class AmazonUploadUtilTest extends FunSuite {

  test("Upload File to Amazon") {
    running(FakeApplication()) {
      (new AmazonUpload).uploadFileToAmazon("Himanshu.jpg", profilePic)
      assert(shortUrl.split(",")(0).split(":")(1) === "200")
    }
  }

}*/
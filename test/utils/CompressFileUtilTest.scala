package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication
import java.io.File
import java.io.InputStream

@RunWith(classOf[JUnitRunner])
class CompressFileUtilTest extends FunSuite {

  test("Compress Image") {
    running(FakeApplication()) {
      val file = new File("/home/himanshu/Pictures/high_res.jpg")
      val result = CompressFileUtil.compressImage(file, "Himanshu", 1)
      assert(result.getClass().toString() === "class java.io.ByteArrayInputStream")
    }
  }
  
}
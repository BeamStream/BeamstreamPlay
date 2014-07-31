package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication

@RunWith(classOf[JUnitRunner])
class ExtractFrameFromVideoUtilTest extends FunSuite {

  test("Extract Frame from Video") {
    running(FakeApplication()) {
      val extractedFrameFromVideo = ExtractFrameFromVideoUtil.extractFrameFromVideo("/home/himanshu/Videos/test.mp4")
      assert(extractedFrameFromVideo.getClass().toString() === "class java.io.ByteArrayInputStream")
    }
  }

}
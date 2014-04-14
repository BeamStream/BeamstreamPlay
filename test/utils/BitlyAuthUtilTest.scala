package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication

@RunWith(classOf[JUnitRunner])
class BitlyAuthUtilTest extends FunSuite {

  test("Get short URL via Bitly") {
    running(FakeApplication()) {
      val shortUrl = BitlyAuthUtil.returnShortUrlViabitly("http://blog.knoldus.com/2014/04/12/mock-unit-testing-using-mockito-in-play-scala-project/")
      assert(shortUrl.split(",")(0).split(":")(1) === "200")
    }
  }

}

package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication

@RunWith(classOf[JUnitRunner])
class PasswordHashingUtilTest extends FunSuite {

  test("Get Decrypted Password") {
    running(FakeApplication()) {
      val decryptedPassword = (new PasswordHashingUtil).decryptThePassword("bZBkmmKeQiDIoApAE1YavA==")
      assert(decryptedPassword === "123456")
    }
  }

}
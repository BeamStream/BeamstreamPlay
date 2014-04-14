package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication

@RunWith(classOf[JUnitRunner])
class ConversionUtilityTest extends FunSuite {

  test("Get encrypted password") {
    running(FakeApplication()) {
      val encryptedPassword = ConversionUtility.encryptPassword("123456")
      assert(encryptedPassword === "f1f2f3f4f5f6")
    }
  }

}

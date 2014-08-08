package utils

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import play.api.test.FakeApplication

@RunWith(classOf[JUnitRunner])
class SendEmailUtilityTest extends FunSuite {

  test("Send Message via Email") {
    running(FakeApplication()) {
      val messageSent = SendEmailUtility.sendMessage("himanshu@knoldus.com", "Unit Testing Beamstream", "Successful")
      assert(messageSent.toString === "()")
    }
  }

  test("Send Password via Email") {
    running(FakeApplication()) {
      val passwordSent = SendEmailUtility.sendPassword("himanshu@knoldus.com", "123456")
      assert(passwordSent.toString === "()")
    }
  }
  
  test("Notify All Users of a Stream for a New User via Email") {
    running(FakeApplication()) {
      val notificationSent = SendEmailUtility.notifyUsersOfStreamForANewUser("himanshu@knoldus.com", "Himanshu", "Gupta", "DB")
      assert(notificationSent.toString === "()")
    }
  }
  
  test("Invite User To Beamstream via Email") {
    running(FakeApplication()) {
      val invitationSent = SendEmailUtility.inviteUserToBeamstream("himanshu@knoldus.com")      
      assert(invitationSent.toString === "()")
    }
  }
  
  test("Invite User To Beamstream with Referral via Email") {
    running(FakeApplication()) {
      val invitationWithReferralSent = SendEmailUtility.inviteUserToBeamstreamWithReferral("himanshu@knoldus.com", "Hi", "Neel")      
      assert(invitationWithReferralSent.toString === "()")
    }
  }
  
  test("Send Google Doc Access Permission Mail") {
    running(FakeApplication()) {
      val invitationWithReferralSent = SendEmailUtility.sendGoogleDocAccessMail("himanshu@knoldus.com", "himanshu@knoldus.com", "", "")
      assert(invitationWithReferralSent.toString === "()")
    }
  }
  
}

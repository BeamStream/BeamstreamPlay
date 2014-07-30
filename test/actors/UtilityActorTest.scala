package actors

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers.running
import org.scalatest.BeforeAndAfter
import play.api.test.FakeApplication
import java.util.Date
import models.UserDAO
import models.User
import models.UserType
import utils.SendEmailUtility
import org.bson.types.ObjectId
import java.text.DateFormat
import com.mongodb.casbah.commons.MongoDBObject
import models.TokenDAO
import models.Token
import utils.TokenEmailUtil

@RunWith(classOf[JUnitRunner])
class UtilityActorTest extends FunSuite with BeforeAndAfter{
  
  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
    }
  }

  test("Send Message via Email") {
    running(FakeApplication()) {
      val messageSent = UtilityActor.sendMail("himanshu@knoldus.com", "Unit Testing Beamstream", "Successful", "himanshu@knoldus.com")
      assert(messageSent.toString === "()")
    }
  }
  
  test("Send Message via Email when Source Email Address is not provided") {
    running(FakeApplication()) {
      val messageSent = UtilityActor.sendMail("himanshu@knoldus.com", "Unit Testing Beamstream", "Successful", "")
      assert(messageSent.toString === "()")
    }
  }

  test("Send Email after User SignsUp") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val tokenTobeCreated = Token(new ObjectId, userId.get.toString(), TokenEmailUtil.securityToken, false)
      Token.addToken(tokenTobeCreated)
      val registrationLinkSent = UtilityActor.sendMailAfterSignUp(userId.get.toString(), tokenTobeCreated.tokenString, "himanshu@knoldus.com")
      assert(registrationLinkSent.toString === "()")
    }
  }
  
  test("Send Forgot Password via Email") {
    running(FakeApplication()) {
      val passwordSent = UtilityActor.forgotPasswordMail("himanshu@knoldus.com", "123456")
      assert(passwordSent.toString === "()")
    }
  }
  
  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
    }
  }  
}

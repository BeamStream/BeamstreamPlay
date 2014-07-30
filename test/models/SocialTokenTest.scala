package models

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat
import play.api.test.Helpers.running
import play.api.test.FakeApplication
import play.api.Play
import java.util.Date
import utils.TokenEmailUtil

@RunWith(classOf[JUnitRunner])
class SocialTokenTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
  val refreshToken = "1/LMMF-mRLuNabgh9xdP80hMKLh7CXn4_4uoIaJi1ejdU"

  before {
    running(FakeApplication()) {
      SocialTokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    }
  }

  test("Find Social Token") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val socialToken = SocialToken(new ObjectId(userId.get.toString()), refreshToken, false, "")
      SocialToken.addToken(socialToken)
      assert(SocialToken.findSocialToken(userId.get).get === refreshToken)
    }
  }

  test("Find Social Token Object") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val socialToken = SocialToken(new ObjectId(userId.get.toString()), refreshToken, false, "")
      SocialToken.addToken(socialToken)
      assert(SocialToken.findSocialTokenObject(userId.get).get.refreshToken === refreshToken)
    }
  }
  
  test("Update Social Token Flag") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val socialToken = SocialToken(new ObjectId(userId.get.toString()), refreshToken, false, "")
      SocialToken.addToken(socialToken)
      SocialToken.updateTokenFlag(userId.get, true)
      assert(SocialToken.findSocialTokenObject(userId.get).get.tokenFlag === true)
    }
  }
  
  test("Delete Social Token") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val socialToken = SocialToken(new ObjectId(userId.get.toString()), refreshToken, false, "")
      SocialToken.addToken(socialToken)
      SocialToken.deleteSocialToken(new ObjectId(userId.get.toString()))
      assert(SocialToken.findSocialTokenObject(userId.get) === None)
    }
  }
  
  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      SocialTokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
    }
  }

}
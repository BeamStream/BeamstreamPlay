package controllers

import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import play.api.libs.json.JsValue
import play.api.test.Helpers._
import play.api.test.FakeApplication
import models.UserDAO
import com.mongodb.casbah.commons.MongoDBObject
import play.api.test.FakeRequest
import play.api.libs.ws.WS
import scala.concurrent._
import scala.concurrent.duration._
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Play
import org.bson.types.ObjectId
import models.User
import models.UserType
import java.util.Date
import models.ClassType
import java.text.DateFormat
import models.Class
import models.ClassDAO
import models.UserMedia
import models.Token
import play.api.mvc.Cookie
import utils.TokenEmailUtil
import models.UserMediaType
import models.Access
import models.TokenDAO
import models.UserMediaDAO
import models.SocialTokenDAO
import models.SocialToken


@RunWith(classOf[JUnitRunner])
class GoogleDocsUploadUtilityControllerTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  val tokenString = "1/xRKyMMkTgYbvY_2BggewKeHMOGu98BI_ZCaKq74im6M"

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      SocialTokenDAO.remove(MongoDBObject("refreshToken" -> ".*".r))
    }
  }

  test("Authenticate to Google") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val socialToken = SocialToken(new ObjectId(userId.get.toString()), tokenString, true, user.email)
      SocialToken.addToken(socialToken)
      val result = route(FakeRequest(GET, "googleDoc/show").withSession("userId" -> userId.get.toString()))
      assert(status(result.get) === 200)
    }
  }

  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      SocialTokenDAO.remove(MongoDBObject("refreshToken" -> ".*".r))
    }
  }

}
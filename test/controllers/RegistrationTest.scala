package controllers

import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import play.api.test.Helpers._
import play.api.test.FakeApplication
import models.UserDAO
import models.BetaUserDAO
import com.mongodb.casbah.commons.MongoDBObject
import play.api.test.FakeRequest
import play.api.test.Helpers._
import play.api.libs.concurrent.Execution.Implicits._
import models.UserMediaDAO
import models.StreamDAO
import models.TokenDAO
import models.UserMedia
import models.User
import models.Token
import org.bson.types.ObjectId
import utils.TokenEmailUtil
import models.UserType
import java.util.Date
import models.UserMediaType
import models.Access
import play.api.mvc.Cookie
import play.api.libs.json.JsValue
import models.UserSchoolDAO
import models.UserSchool
import java.text.DateFormat
import models.Year
import models.Degree
import models.Graduated
import models.DegreeExpected
import play.api.cache.Cache
import play.api.Play.current

@RunWith(classOf[JUnitRunner])
class RegistrationTest extends FunSuite with BeforeAndAfter {
  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }

  test("Render Login page") {
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/login")).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val result1 = route(FakeRequest(GET, "/login").withSession("userId" -> userId.get.toString())).get
      assert(status(result) === 200)
      val result2 = route(FakeRequest(GET, "/login").withCookies(Cookie("Beamstream", userId.get.toString() + " class"))).get
      assert(status(result) === 200)
    }
  }

  test("Render Registration page") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val tokenTobeCreated = Token(new ObjectId, userId.get.toString(), TokenEmailUtil.securityToken, false)
      Token.addToken(tokenTobeCreated)
      val userMedia = UserMedia(new ObjectId, "", "", userId.get, new Date, "", UserMediaType.Image, Access.Public, true, None, "", 0, Nil, Nil, 0)
      UserMedia.saveMediaForUser(userMedia)
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + tokenTobeCreated.id))
      /*result onComplete {
        case stat => assert(stat.isSuccess === true)
      }*/
      assert(status(result.get) == 303)
      running(FakeApplication()) {
        val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + tokenTobeCreated.id).withSession("userId" -> userId.get.toString())).get
        result onComplete {
          case stat => assert(stat.isSuccess === true)
        }
      }
      running(FakeApplication()) {
        val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + new ObjectId).withCookies(Cookie("Beamstream", userId.get.toString() + " class"))).get
        result onComplete {
          case stat => assert(stat.isSuccess === false)
        }
        assert(status(result) === 303)
      }
      running(FakeApplication()) {
        val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + new ObjectId).withCookies(Cookie("Beamstream", userId.get.toString() + " stream"))).get
        result onComplete {
          case stat => assert(stat.isSuccess === false)
        }
        assert(status(result) === 303)
      }
      running(FakeApplication()) {
        val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + tokenTobeCreated.id).withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
        result onComplete {
          case stat => assert(stat.isSuccess === false)
        }
        assert(status(result) === 303)
      }

    }
  }

  /*test("Register User") {
    val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

    val myUserSchool = UserSchool(new ObjectId, new ObjectId("5347af57c4aa242096d8eb4d"), "IIITD", Year.Graduated_Masters, Degree.Masters,
      "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Winter2014), None)
    val schoolId = UserSchool.createSchool(myUserSchool)
    val jsonString = """{"firstName":"Himanshu","lastName":"Gupta","schoolName":"IIITD","major":"CSE","gradeLevel":"Graduated(Master's)","degreeProgram":"Master's","graduate":"no","location":"Delhi","cellNumber":"(995) 870-4887","aboutYourself":"Master of Technology","username":"himanshug735","degreeExpected":"Winter 2014","userId":"5347af05c4aa242096d8eb4b","associatedSchoolId":""" + """"""" + schoolId.get + """"""" + """}"""
    val json: JsValue = play.api.libs.json.Json.parse(jsonString)
    running(FakeApplication()) {
      val result = route(
        FakeRequest(POST, "/registration").
          withJsonBody(json))
      assert(status(result.get) === 200)
    }
  }
*/

  test("Registration Complete") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val tokenTobeCreated = Token(new ObjectId, userId.get.toString(), TokenEmailUtil.securityToken, false)
      Token.addToken(tokenTobeCreated)
      val result = route(FakeRequest(GET, "/registrationComplete").withSession("userId" -> userId.get.toString())).get
      assert(status(result) === 200)
    }
  }

  test("Get UserData from Cache") {
    running(FakeApplication()) {
      val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
      val myUserSchool = UserSchool(new ObjectId, new ObjectId("5347af57c4aa242096d8eb4d"), "IIITD", Year.Graduated_Masters, Degree.Masters,
        "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Winter2014), None)
      val schoolId = UserSchool.createSchool(myUserSchool)
      val jsonString = """{"firstName":"Himanshu","lastName":"Gupta","schoolName":"IIITD","major":"CSE","gradeLevel":"Graduated(Master's)","degreeProgram":"Master's","graduate":"no","location":"Delhi","cellNumber":"(995) 870-4887","aboutYourself":"Master of Technology","username":"himanshug735","degreeExpected":"Winter 2014","userId":"5347af05c4aa242096d8eb4b","associatedSchoolId":""" + """"""" + schoolId.get + """"""" + """}"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      Cache.set("userData", json)
      val result = route(FakeRequest(GET, "/findUserData")).get
      assert(status(result) === 200)
    }
  }

  after {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }
}
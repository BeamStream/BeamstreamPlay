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
import models.SchoolDAO
import models.School

@RunWith(classOf[JUnitRunner])
class RegistrationTest extends FunSuite with BeforeAndAfter {
  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
      SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
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
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
    val userId = User.createUser(user)
    val tokenTobeCreated = Token(new ObjectId, userId.get.toString(), TokenEmailUtil.securityToken, false)
    Token.addToken(tokenTobeCreated)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + tokenTobeCreated.id).withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
      assert(status(result) === 303)
    }
    val userMedia = UserMedia(new ObjectId, "", "", userId.get, new Date, "", UserMediaType.Image, Access.Public, true, None, "", 0, Nil, Nil, 0)
    UserMedia.saveMediaForUser(userMedia)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + tokenTobeCreated.id))
      assert(status(result.get) == 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get.toString() + "&token=" + tokenTobeCreated.id.toString()).withSession("userId" -> userId.get.toString())).get
      result onComplete {
        case stat => assert(stat.isSuccess === true)
      }
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + new ObjectId).withCookies(Cookie("Beamstream", userId.get.toString() + " class"))).get
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + new ObjectId).withCookies(Cookie("Beamstream", userId.get.toString() + " stream"))).get
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + tokenTobeCreated.id).withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + tokenTobeCreated.id).withCookies(Cookie("Beamstream", userId.get.toString() + " browsemedia"))).get
      assert(status(result) === 303)
    }
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + userId.get + "&token=" + tokenTobeCreated.id).withCookies(Cookie("Beamstream", userId.get.toString() + " signup"))).get
      assert(status(result) === 303)
    }

    val user2 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
    val user2Id = User.createUser(user2)
    val token2TobeCreated = Token(new ObjectId, user2Id.get.toString(), TokenEmailUtil.securityToken, false)
    Token.addToken(token2TobeCreated)
    running(FakeApplication()) {
      val result = route(FakeRequest(GET, "/registration?userId=" + user2Id.get + "&token=" + token2TobeCreated.id).withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
      assert(status(result) === 303)
    }
  }

  test("Register User") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
    val userId = User.createUser(user)
    val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

    val myUserSchool = UserSchool(new ObjectId, new ObjectId("5347af57c4aa242096d8eb4d"), "IIITD", Year.Graduated_Masters, Degree.Masters,
      "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Winter2014), None)
    val userSchoolId = UserSchool.createSchool(myUserSchool)
    val school = School(new ObjectId, "IIITD", "www.iiitd.ac.in")
    val schoolId = School.addNewSchool(school)
    val jsonString = """{"firstName":"Himanshu","lastName":"Gupta","schoolName":"IIITD","major":"CSE","gradeLevel":"Graduated(Master's)","degreeProgram":"Master's","graduate":"no","location":"Delhi","cellNumber":"(995) 870-4887","aboutYourself":"Master of Technology","username":"himanshug735","degreeExpected":"Winter 2014","userId":""" + """"""" + userId.get + """"""" + ""","mailId":"himanshu1205@iiitd.ac.in","associatedSchoolId":""" + """"""" + schoolId.get + """"""" + """}"""
    val json: JsValue = play.api.libs.json.Json.parse(jsonString)
    running(FakeApplication()) {
      val result = route(FakeRequest(POST, "/registration").withBody(json))
      assert(status(result.get) === 200)
    }
  }

  test("Edit User Info") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
    val userId = User.createUser(user)
    val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

    val myUserSchool = UserSchool(new ObjectId, new ObjectId("5347af57c4aa242096d8eb4d"), "IIITD", Year.Graduated_Masters, Degree.Masters,
      "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Winter2014), None)
    val userSchoolId = UserSchool.createSchool(myUserSchool)
    val school = School(new ObjectId, "IIITD", "www.iiitd.ac.in")
    val schoolId = School.addNewSchool(school)
    val jsonString = """{"firstName":"Himanshu","lastName":"Gupta","schoolName":"IIITD","major":"CSE","gradeLevel":"Graduated(Master's)","degreeProgram":"Master's","graduate":"yes","location":"Delhi","cellNumber":"(995) 870-4887","aboutYourself":"Master of Technology","username":"himanshug735","degreeExpected":"Winter 2014","userId":""" + """"""" + userId.get + """"""" + ""","mailId":"himanshu1205@iiitd.ac.in","associatedSchoolId":""" + """"""" + schoolId.get + """"""" + ""","userSchoolId":""" + """"""" + userSchoolId.get + """"""" + """}"""
    val json: JsValue = play.api.libs.json.Json.parse(jsonString)
    running(FakeApplication()) {
      val result = route(FakeRequest(PUT, "/registration/" + userId.get).withBody(json))
      assert(status(result.get) === 200)
    }
  }

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
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
      val myUserSchool = UserSchool(new ObjectId, new ObjectId("5347af57c4aa242096d8eb4d"), "IIITD", Year.Graduated_Masters, Degree.Masters,
        "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Winter2014), None)
      val schoolId = UserSchool.createSchool(myUserSchool)
      val jsonString = """{"firstName":"Himanshu","lastName":"Gupta","schoolName":"IIITD","major":"CSE","gradeLevel":"Graduated(Master's)","degreeProgram":"Master's","graduate":"no","location":"Delhi","cellNumber":"(995) 870-4887","aboutYourself":"Master of Technology","username":"himanshug735","degreeExpected":"Winter 2014","userId":"5347af05c4aa242096d8eb4b","associatedSchoolId":""" + """"""" + schoolId.get + """"""" + """}"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      Cache.set(userId.get.toString(), json)
      val result1 = route(FakeRequest(GET, "/findUserData").withCookies(Cookie("Beamstream", userId.get.toString() + " registration"))).get
      assert(status(result1) === 200)
      val result2 = route(FakeRequest(GET, "/findUserData").withCookies(Cookie("Beamstream", (new ObjectId).toString() + " registration"))).get
      assert(status(result2) === 200)
    }
  }

  after {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
      StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
      TokenDAO.remove(MongoDBObject("tokenString" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
      SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }
}
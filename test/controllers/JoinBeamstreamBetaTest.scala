package controllers

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.BetaUserDAO
import play.api.libs.json.JsValue
import play.api.test.FakeApplication
import play.api.test.FakeRequest
import play.api.test.Helpers._
import org.scalatest.junit.JUnitRunner
import play.api.Play
import play.api.libs.ws.WS
import play.api.libs.concurrent.Execution.Implicits._
import models.UserDAO
import models.UserSchoolDAO
import models.UserSchool
import models.User
import org.bson.types.ObjectId
import models.Year
import models.UserType
import models.Degree
import java.util.Date
import models.Graduated
import models.DegreeExpected
import java.text.DateFormat
import models.Class
import models.ClassType

@RunWith(classOf[JUnitRunner])
class JoinBeamstreamBetaTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  
  val userA = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
  val userB = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "NeelS", Option("Neel"), "Knoldus", "", "", "", new Date, Nil, Nil, Nil, Option("Facebook"), None, None)

  val myUserSchoolA = UserSchool(new ObjectId, new ObjectId, "MPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), None)
  val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())

  
  before {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("emailId" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }

  test("Render beta user registration page") {
    running(FakeApplication()) {
      val result1 = route(FakeRequest(GET, "/")).get
      result1 onComplete {
        case stat => assert(stat.isSuccess === true)
      }
      val userId = User.createUser(userA)
      val result2 = route(FakeRequest(GET, "/").withSession("userId" -> userId.get.toString())).get
      assert(status(result2) === 200)
      val schoolCreated = UserSchool.createSchool(myUserSchoolA)
      User.addSchoolToUser(userId.get, schoolCreated.get)
      val result3 = route(FakeRequest(GET, "/").withSession("userId" -> userId.get.toString())).get
      assert(status(result3) === 303)
      User.addClassToUser(userId.get, List(classToBeCretaed.id))
      val result4 = route(FakeRequest(GET, "/").withSession("userId" -> userId.get.toString())).get
      assert(status(result4) === 303)
    }
  }

  test("Add beta user") {
    val jsonString = """{"mailId": "neelkanth@knoldus.com"}"""
    val json: JsValue = play.api.libs.json.Json.parse(jsonString)
    running(FakeApplication()) {
      val result1 = route(FakeRequest(POST, "/betaUser").withJsonBody(json)).get
      assert(status(result1) === 200)
      val result2 = route(FakeRequest(POST, "/betaUser").withJsonBody(json)).get
      assert(status(result2) === 200)
    }
  }
  
  after {
    running(FakeApplication()) {
      BetaUserDAO.remove(MongoDBObject("emailId" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }

}
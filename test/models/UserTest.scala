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

@RunWith(classOf[JUnitRunner])
class UserTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val userA = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
  val userB = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "NeelS", Option("Neel"), "Knoldus", "", "", "", new Date, Nil, Nil, Nil, Option("Facebook"), None, None)

  val myUserSchoolA = UserSchool(new ObjectId, new ObjectId, "MPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), None)
  val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())

  before {
    running(FakeApplication()) {
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }

  test("Create User") {
    running(FakeApplication()) {
      val userId = User.createUser(userA)
      assert(UserDAO.find(MongoDBObject()).size === 1)
    }
  }

  test("RemoveUser User") {
    running(FakeApplication()) {
      val userId = User.createUser(userA)
      assert(UserDAO.find(MongoDBObject()).size === 1)
      User.removeUser(userA.id)
      assert(UserDAO.find(MongoDBObject()).size === 0)
    }
  }

  test("Find User By EmailId") {
    running(FakeApplication()) {
      val userId = User.createUser(userA)
      val userFound = User.findUserByEmailId("neel@knoldus.com")
      assert(userFound.size === 1)
      val userNotFound = User.findUserByEmailId("neel@gmail.com")
      assert(userNotFound.size === 0)
    }
  }

  test("Add a school to user") {
    running(FakeApplication()) {
      val userId = User.createUser(userA)
      val schoolCreated = UserSchool.createSchool(myUserSchoolA)
      User.addSchoolToUser(userId.get, schoolCreated.get)
      val userFound = User.getUserProfile(userId.get)
      assert(userFound.head.schools.size === 1)
    }
  }

  test("Get User Profile") {
    running(FakeApplication()) {
      val userId = User.createUser(userA)
      val userObtained = User.getUserProfile(userId.get)
      assert(userObtained.get.email === "neel@knoldus.com")
      val userNotObtained = User.getUserProfile(new ObjectId)
      assert(userNotObtained === None)
    }
  }

  test("Add Info to user") {
    running(FakeApplication()) {
      val userId = User.createUser(userA)
      User.addInfo(List(myUserSchoolA), userId.get)
      val userFound = User.getUserProfile(userId.get)
      assert(userFound.head.schools.size === 1)
    }
  }

  test("Update User") {
    running(FakeApplication()) {
      val userId = User.createUser(userA)
      val user = User.getUserProfile(userId.get)
      assert(user.get.firstName === "")
      User.updateUser(userId.get, "Neelkanth", "Sachdeva", "", "", "Rewari", "", "")
      val userObtained = User.getUserProfile(userId.get)
      assert(userObtained.get.firstName === "Neelkanth")
      assert(userObtained.get.location === "Rewari")
    }
  }

  test("Find User Coming via social sites") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, Option("Facebook"), None, None)
      val userId = User.createUser(user)
      val userObtained = User.findUserComingViaSocailSite("NeelS", "Facebook")
      assert(userObtained.size === 1)
      val userNotObtained = User.findUserComingViaSocailSite("Neel", "Facebook")
      assert(userNotObtained.size === 0)
    }
  }

  test("Is the User Already Registered") {
    running(FakeApplication()) {
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(userA)
      val userCreated = User.getUserProfile(userId.get)
      User.updateUser(userId.get, "Neelkanth", "Sachdeva", "Rewari", "", "", "", "")
      val userObtained = User.getUserProfile(userId.get)
      val userFound = User.canUserRegisterWithThisUsername("NeelS")
      assert(userFound === true)
      val userFoundWithSameEmail = User.canUserRegisterWithThisEmail("neel@knoldus.com")
      assert(userFoundWithSameEmail === true)
    }
  }

  test("Count roles of a user") {
    running(FakeApplication()) {
      val user1Id = User.createUser(userA)
      val user2Id = User.createUser(userB)
      assert(User.countRolesOfAUser(List(user1Id.get, user2Id.get)) === Map("Student" -> 0, "Educator" -> 0, "Professional" -> 2, "TeachersAssistant" -> 0))
    }
  }

  test("Find User By Email Or Name") {
    running(FakeApplication()) {
      val user1Id = User.createUser(userA)
      val user2Id = User.createUser(userB)
      val userNotFoundByUserName = User.findUser("Neel", "Neel")
      assert(userNotFoundByUserName == None)
      val userNotFoundByEmail = User.findUser("neel@gmail.com", "Neel")
      assert(userNotFoundByEmail == None)
      val userFoundByUserName = User.findUser("NeelS", "Neel")
      assert(userFoundByUserName != None)
      val userFoundByEmail = User.findUser("neel@knoldus.com", "Neel")
      assert(userFoundByEmail != None)
    }
  }
  test("Add Info To User") {
    running(FakeApplication()) {
      val user1Id = User.createUser(userA)
      assert(User.getUserProfile(user1Id.get).get.schools.size === 0)
      val userSchoolId = UserSchool.createSchool(myUserSchoolA)
      User.addInfo(List(myUserSchoolA), user1Id.get)
      assert(User.getUserProfile(user1Id.get).get.schools.size === 1)

    }
  }

  test("Add/remove class to user") {
    running(FakeApplication()) {
      val user1Id = User.createUser(userA)
      assert(User.getUserProfile(user1Id.get).get.classes.size === 0)
      User.addClassToUser(user1Id.get, List(classToBeCretaed.id))
      assert(User.getUserProfile(user1Id.get).get.classes.size === 1)
      User.removeClassFromUser(user1Id.get, List(classToBeCretaed.id))
      assert(User.getUserProfile(user1Id.get).get.classes.size === 0)
    }
  }

  test("Give rockers name") {
    running(FakeApplication()) {
      val user1Id = User.createUser(userA)
      val rockers = User.giveMeTheRockers(List(user1Id.get))
      assert(rockers.head === " ")
    }
  }

  test("Follow User") {
    running(FakeApplication()) {
      val userId = User.createUser(userA)
      User.followUser(new ObjectId, userId.get)
      val user = User.getUserProfile(userId.get)
      assert(user.get.followers.size === 1)
      val userAlreadyFollowing = User.getUserProfile(userId.get)
      assert(userAlreadyFollowing.get.followers.size === 1)
    }
  }

  test("Found Forgot Password") {
    running(FakeApplication()) {
      val userId = User.createUser(userB)
      val passwordNotFound = User.forgotPassword("neel@gmail.com")
      assert(passwordNotFound === false)
    }
  }

  /*test("Can User Register with this Email") {
    running(FakeApplication()) {
      val userId = User.createUser(userA)
      val emailIdAvailableToRegister = User.canUserRegisterWithThisEmail("neel@gmail.com")
      assert(emailIdAvailableToRegister === true)
      val emailIdNotAvailableToRegister = User.canUserRegisterWithThisEmail("neel@knoldus.com")
      assert(emailIdNotAvailableToRegister === false)
    }
  }

  test("Can User Register with this Username") {
    running(FakeApplication()) {
      val userNameAvailableToRegister = User.canUserRegisterWithThisUsername("NeelS")
      assert(userNameAvailableToRegister === true)
      val userId = User.createUser(userA)
      val userNameNotAvailableToRegister = User.canUserRegisterWithThisUsername("NeelS")
      assert(userNameNotAvailableToRegister === false)
    }
  }*/

  after {
    running(FakeApplication()) {
      ClassDAO.remove(MongoDBObject("className" -> ".*".r))
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }

}
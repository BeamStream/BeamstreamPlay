package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat

@RunWith(classOf[JUnitRunner])
class UserTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, Nil, Nil, Nil, Nil, Nil, None, None)
  val user2 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "NeelS", "Neil", Option("Neel"), "Knoldus", "", "", "", "", None, Nil, Nil, Nil, Nil, Nil, None, None)
  val myUserSchool1 = UserSchool(new ObjectId, new ObjectId, "MPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), None)
  val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())
  before {
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }

  test("Create User") {
    val userId = User.createUser(user1)
    assert(UserDAO.find(MongoDBObject()).size === 1)
  }

  test("RemoveUser User") {
    val userId = User.createUser(user1)
    assert(UserDAO.find(MongoDBObject()).size === 1)
    User.removeUser(user1)
    assert(UserDAO.find(MongoDBObject()).size === 0)
  }

  test("Get User Profile") {
    val userId = User.createUser(user1)
    val userObtained = User.getUserProfile(userId.get)
    assert(userObtained.get.email === "neel@knoldus.com")
  }

  test("Update User") {
    val userId = User.createUser(user1)
    val user = User.getUserProfile(userId.get)
    assert(user.get.firstName === "")
    User.updateUser(userId.get, "Neelkanth", "Sachdeva", "", "Rewari", "", "")
    val userObtained = User.getUserProfile(userId.get)
    assert(userObtained.get.firstName === "Neelkanth")
    assert(userObtained.get.location === "Rewari")
  }

  test("Find User Coming via social sites") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", Option("Google"), Nil, Nil, Nil, Nil, Nil, None, None)
    val userId = User.createUser(user1)
    val userCreated = User.getUserProfile(userId.get)
    User.updateUser(userId.get, "Neelkanth", "Sachdeva", "Rewari", "", "", "")
    val userObtained = User.getUserProfile(userId.get)
    val userFound = User.findUser("NeelS", "Neel")
    assert(userFound.size === 1)
  }

  test("Is the User Already Registered") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", Option("Google"), Nil, Nil, Nil, Nil, Nil, None, None)
    val userId = User.createUser(user1)
    val userCreated = User.getUserProfile(userId.get)
    User.updateUser(userId.get, "Neelkanth", "Sachdeva", "Rewari", "", "", "")
    val userObtained = User.getUserProfile(userId.get)
    val userFound = User.canUserRegister("NeelS")
    assert(userFound === false)
    val userFoundWithSameEmail = User.canUserRegister("neel@knoldus.com")
    assert(userFoundWithSameEmail === true)
  }

  test("Count roles of a user") {
    val user1Id = User.createUser(user1)
    val user2Id = User.createUser(user2)
    assert(User.countRolesOfAUser(List(user1Id.get, user2Id.get)) === Map("Student" -> 0, "Educator" -> 0, "Professional" -> 2))
  }

  test("Find User By Email Or Name") {
    val user1Id = User.createUser(user1)
    val user2Id = User.createUser(user2)
    val useFound = User.findUser("NeelS", "Neel")
    assert(useFound != None)

  }
  test("Add Info To User") {
    val user1Id = User.createUser(user1)
    assert(User.getUserProfile(user1Id.get).get.schools.size === 0)
    val userSchoolId = UserSchool.createSchool(myUserSchool1)
    User.addInfo(List(myUserSchool1), user1Id.get)
    assert(User.getUserProfile(user1Id.get).get.schools.size === 1)

  }

  test("Add/remove class to user") {
    val user1Id = User.createUser(user1)
    assert(User.getUserProfile(user1Id.get).get.classes.size === 0)
    User.addClassToUser(user1Id.get, List(classToBeCretaed.id))
    assert(User.getUserProfile(user1Id.get).get.classes.size === 1)
    User.removeClassFromUser(user1Id.get, List(classToBeCretaed.id))
    assert(User.getUserProfile(user1Id.get).get.classes.size === 0)
  }
  
  test("Give rockers name"){
    val user1Id = User.createUser(user1)
    val rockers=User.giveMeTheRockers(List(user1Id.get))
    assert(rockers.head===" ")
  }

  after {
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }

}
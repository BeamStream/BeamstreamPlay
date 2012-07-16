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

  val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List(), List())
  val user2 = User(new ObjectId, UserType.Professional, "crizzcoxx@beamstream.com", "Crizz", "coxx", "", "Chris", "Crizz", "BeamStream", "", List(), List(), List(), List())

  val mySchool1 = School(new ObjectId, "MPS", Year.Freshman, Degree.Assosiates, "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), "", List())
  val class1 = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId, List())

  before {
    User.createUser(user1)
    User.createUser(user2)

  }

  test("testing invalid email for common domain") {
    assert("Invalid email address" ===
      User.registerUser(new User(new ObjectId, UserType.Professional, "vikas@gmail.com", "Vikas", "Hazrati", "", "Vikki", "Vikas", "Knoldus", "", List(), List(), List(), List())))
  }

  test("testing invalid email for broken Email") {
    assert("Invalid email address" === User.registerUser(new User(new ObjectId, UserType.Professional, "vikas@gmail..com", "Vikas", "Hazrati", "", "Vikki", "Vikas", "Knoldus", "", List(), List(), List(), List())))
  }

  test("testing valid email") {
    assert("Registration Successful" === User.registerUser(new User(new ObjectId, UserType.Professional, "vikas@knoldus.com", "Vikas", "Hazrati", "", "Vikki", "Vikas", "Knoldus", "", List(), List(), List(), List())))
  }

  test("Finding the user by email and password") {
    assert(User.findUser("crizzcoxx@beamstream.com", "Crizz").size === 1)
  }

  test("Add School to User") {
    val user3 = User(new ObjectId, UserType.Professional, "john@knoldus.com", "John", "Sachdeva", "", "John", "John", "Knoldus", "", List(), List(), List(), List())
    val userId = User.createUser(user3)
    assert(UserDAO.find(MongoDBObject()).size === 3)

    val createdUser = UserDAO.find(MongoDBObject("email" -> "john@knoldus.com")).toList(0)
    assert(createdUser.schoolId.size == 0)

    User.addInfo(List(mySchool1), userId)
    val createdUserAfteraddingSchool = UserDAO.find(MongoDBObject("email" -> "john@knoldus.com")).toList(0)
    assert(createdUserAfteraddingSchool.schoolId.size === 1)
  }

  test("Add Class to User") {
    val user3 = User(new ObjectId, UserType.Professional, "john@knoldus.com", "John", "Sachdeva", "", "John", "John", "Knoldus", "", List(), List(), List(), List())
    val userId = User.createUser(user3)
    assert(UserDAO.find(MongoDBObject()).size === 3)

    val createdUser = UserDAO.find(MongoDBObject("email" -> "john@knoldus.com")).toList(0)
    assert(createdUser.classId.size == 0)

    val classIdList = Class.createClass(List(class1), new ObjectId)

    User.addClassToUser(userId, classIdList)
    val createdUserAfteraddingSchool = UserDAO.find(MongoDBObject("email" -> "john@knoldus.com")).toList(0)
    assert(createdUserAfteraddingSchool.classId.size === 1)

  }

  test("Get User Profile") {
    val user3 = User(new ObjectId, UserType.Professional, "john@knoldus.com", "John", "Sachdeva", "", "John", "John", "Knoldus", "", List(), List(), List(), List())
    val userId = User.createUser(user3)
    val userObtained = User.getUserProfile(userId)
    assert(userObtained.email === "john@knoldus.com")
  }

  test("Is User already registered ?") {
    val user3 = User(new ObjectId, UserType.Professional, "john@knoldus.com", "John", "Sachdeva", "Johny", "John", "John", "Knoldus", "", List(), List(), List(), List())
    val userId = User.createUser(user3)
    // Checking for user name
    val isUseralreadyregistered = User.isAlreadyRegistered("john@knoldus.com", "Johny")
    assert(isUseralreadyregistered === false)

    // Checking for user Email
    val isUseralreadyregistered1 = User.isAlreadyRegistered("john@gmail.com", "Johny")
    assert(isUseralreadyregistered1 === false)

  }

  after {

    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
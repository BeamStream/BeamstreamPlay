package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat

//@RunWith(classOf[JUnitRunner])
//class UserTest extends FunSuite with BeforeAndAfter {
//
//  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
//
//  val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "NeelS", "Neil", "Neel", "Knoldus", "", "", List(), List(), List(), List(), List(), List())
//  val user2 = User(new ObjectId, UserType.Professional, "crizzcoxx@beamstream.com", "Crizz", "coxx", "", "Chris", "Crizz", "BeamStream", "", "", List(), List(), List(), List(), List(), List())
//
//  val school1 = UserSchool(new ObjectId, "MPS", new ObjectId, Year.Freshman, Degree.Assosiates, "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), "", List())
//  val class1 = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId, List())
//
//  before {
//    val user1Id = User.createUser(user1)
//    val user2Id = User.createUser(user2)
//
//  }
//
//  /**
//   * Add School To User
//   */
//  test("Add School to User") {
//    val user3 = User(new ObjectId, UserType.Professional, "john@knoldus.com", "John", "Sachdeva", "", "John", "John", "Knoldus", "", "", List(), List(), List(), List(), List(), List())
//    val userId = User.createUser(user3)
//    assert(UserDAO.find(MongoDBObject()).size === 3)
//
//    val createdUser = UserDAO.find(MongoDBObject("email" -> "john@knoldus.com")).toList(0)
//    assert(createdUser.schoolId.size == 0)
//
//    User.addInfo(List(school1), userId)
//    val createdUserAfteraddingSchool = UserDAO.find(MongoDBObject("email" -> "john@knoldus.com")).toList(0)
//    assert(createdUserAfteraddingSchool.schoolId.size === 1)
//  }
//
//  /**
//   *  Getting the User Profile
//   */
//  test("Get User Profile") {
//    val user3 = User(new ObjectId, UserType.Professional, "john@knoldus.com", "John", "Sachdeva", "", "John", "John", "Knoldus", "", "", List(), List(), List(), List(), List(), List())
//    val userId = User.createUser(user3)
//    val userObtained = User.getUserProfile(userId)
//    assert(userObtained.email === "john@knoldus.com")
//  }
//
//  /**
//   *  Checking if the user is already registered
//   */
//  test("Is User already registered ?") {
//    val user3 = User(new ObjectId, UserType.Professional, "john@knoldus.com", "John", "Sachdeva", "Johny", "John", "John", "Knoldus", "", "", List(), List(), List(), List(), List(), List())
//    val userId = User.createUser(user3)
//    // Checking for user name
//    val isUseralreadyregistered = User.isAlreadyRegistered("john@knoldus.com", "Johny")
//    assert(isUseralreadyregistered === false)
//
//    // Checking for user Email
//    val isUseralreadyregistered1 = User.isAlreadyRegistered("john@gmail.com", "Johny")
//    assert(isUseralreadyregistered1 === false)
//
//  }
//
//  /**
//   * Counting the Role of a user
//   */
//
//  test("Count roles of a user") {
//    val user1Id = User.createUser(user1)
//    val user2Id = User.createUser(user2)
//    assert(User.countRolesOfAUser(List(user1Id, user2Id)) === Map("Student" -> 0, "Educator" -> 0, "Professional" -> 2))
//  }
//
//  /**
//   * Find User By UserName
//   */
//  test("Find User By Name") {
//    val user = User.findUserComingViaSocailSite("NeelS")
//    assert(user.size === 1)
//  }
//
//  /**
//   * Follow The User
//   */
//  test("Follow The User") {
//    val user1Id = User.createUser(user1)
//    val user2Id = User.createUser(user2)
//    User.getUserProfile(user1Id).followers.size === 0
//    User.followUser(user2Id, user1Id)
//    assert(User.getUserProfile(user1Id).followers.size === 1)
//    assert(User.getUserProfile(user1Id).followers.head === user2Id)
//
//  }
//
//  after {
//
//    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
//    SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
//    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
//  }
//
//}

@RunWith(classOf[JUnitRunner])
class UserTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, List(), List(), List(), List(), List())
  val user2 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "NeelS", "Neil", Option("Neel"), "Knoldus", "", "", "", "", None, List(), List(), List(), List(), List())

  test("Create User") {
    val userId = User.createUser(user1)
    assert(UserDAO.find(MongoDBObject()).size === 1)
  }

  /**
   *  Getting the User Profile
   */
  test("Get User Profile") {
    val userId = User.createUser(user1)
    val userObtained = User.getUserProfile(userId)
    assert(userObtained.email === "neel@knoldus.com")
  }

  test("Update User") {
    val userId = User.createUser(user1)
    val user = User.getUserProfile(userId)
    assert(user.firstName === "")
    User.updateUser(userId, "Neelkanth", "Sachdeva", "Rewari", "", "")
    val userObtained = User.getUserProfile(userId)
    assert(userObtained.firstName === "Neelkanth")
    assert(userObtained.location === "Rewari")
  }
  after {

    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
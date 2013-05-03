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

  val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, Nil, Nil, Nil, Nil, Nil, None)
  val user2 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "NeelS", "Neil", Option("Neel"), "Knoldus", "", "", "", "", None, Nil, Nil, Nil, Nil, Nil, None)
  val socialUser = User(new ObjectId, UserType.Professional, "", "", "", "John.Martin", "", Option("Neel"), "", "", "Google", "", "", None, Nil, Nil, Nil, Nil, Nil, None)
  before {
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
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
    User.updateUser(userId.get, "Neelkanth", "Sachdeva","", "Rewari",  "", "")
    val userObtained = User.getUserProfile(userId.get)
    assert(userObtained.get.firstName === "Neelkanth")
    assert(userObtained.get.location === "Rewari")
  }

  test("Find User Coming via social sites") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", Option("Google"), Nil, Nil, Nil, Nil, Nil, None)
    val userId = User.createUser(user1)
    val userCreated = User.getUserProfile(userId.get)
    User.updateUser(userId.get, "Neelkanth", "Sachdeva", "Rewari", "", "", "")
    val userObtained = User.getUserProfile(userId.get)
    val userFound = User.findUser("NeelS", "Neel")
    assert(userFound.size === 1)
  }

  test("Is the User Already Registered") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", Option("Google"), Nil, Nil, Nil, Nil, Nil, None)
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
  
  after {
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
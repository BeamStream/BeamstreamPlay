package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId

@RunWith(classOf[JUnitRunner])
class UserTest extends FunSuite with BeforeAndAfter {

  val user1 = User(100, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "Neil", "Neel", "Knoldus", true, List(100, 101), List(), List())
  val user2 = User(102, UserType.Professional, "crizzcoxx@beamstream.com", "Crizz", "coxx", "Chris", "Crizz", "BeamStream", true, List(100, 101), List(), List())
  before {

    User.createUser(user1)
    User.createUser(user2)

  }

  test("Checking the User Crreation") {
    val user = UserDAO.findOneByID(100)
    assert(user.get.firstName === "Neel")
    assert(user.get.streams.contains(101))
  }

  test("testing invalid email for common domain") {
    assert("Invalid email address" ===
      User.registerUser(new User(101, UserType.Professional, "vikas@gmail.com", "Vikas", "Hazrati", "Vikki", "Vikas", "Knoldus", true, List(100, 101), List(), List())))
  }

  test("testing invalid email for broken Email") {
    assert("Invalid email address" === User.registerUser(new User(101, UserType.Professional, "vikas@gmail..com", "Vikas", "Hazrati", "Vikki", "Vikas", "Knoldus", true, List(100, 101), List(), List())))
  }

  test("testing valid email") {
    assert("Registration Successful" === User.registerUser(new User(101, UserType.Professional, "vikas@knoldus.com", "Vikas", "Hazrati", "Vikki", "Vikas", "Knoldus", true, List(100, 101), List(), List())))
  }

  test("add school to user") {
    assert(UserDAO.findOneByID(100).get.schoolId.size === 0)
    User.addSchoolToUser(100, new ObjectId)
    assert(UserDAO.findOneByID(100).get.schoolId.size === 1)

  }

  test("add class to user") {
    assert(UserDAO.findOneByID(100).get.classId.size === 0)
    User.addClassToUser(100, new ObjectId)
    assert(UserDAO.findOneByID(100).get.classId.size === 1)

  }

  test("get user profile") {

    assert(User.getUserProfile(100).firstName === "Neel")
    assert(User.getUserProfile(100).email.contains("knol"))

  }

  after {

   UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
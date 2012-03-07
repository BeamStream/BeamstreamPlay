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

  val user1 = User(100, UserType.Professional, "neel@gmail.com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List(), List())
  val user2 = User(101, UserType.Professional, "vikas@sapient.com", "Vikas", "Hazrati", "Knoldus", true, List(200, 201, 202), List(new ObjectId,new ObjectId), List(), List())

  before {

    User.createUser(user1)
    User.createUser(user2)
  
  }

  test("Create User") {
    val user = UserDAO.findOneByID(100)
    assert(user.get.firstName === "Neel")
    assert(user.get.streams.contains(101))
    User.removeUser(user1)

  }

  test("testing invalid email for common domain") {
    assert("Invalid email address" ===
      User.registerUser(new User(100, UserType.Professional, "neel@gmail.com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List(), List())))
  }

  test("testing invalid email") {
    assert("Invalid email address" === User.registerUser(new User(100, UserType.Professional, "neel@gmail..com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List(), List())))
  }

  test("testing valid email") {
    assert("Registration Successful" === User.registerUser(new User(100, UserType.Professional, "neel@gmasdsdil.com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List(), List())))
  }

  test("add school to user") {
    assert(UserDAO.findOneByID(100).get.schoolId.size === 0)
    User.addSchoolToUser(100, new ObjectId)
    assert(UserDAO.findOneByID(100).get.schoolId.size === 1)

  }

  test("add class to user") {
    assert(UserDAO.findOneByID(100).get.classId.size === 0)
    User.addClassToUser(100, 1001)
    assert(UserDAO.findOneByID(100).get.classId.size === 1)

  }
  
  
  test("get user profile"){
     val user = UserDAO.findOneByID(101)
     assert(user.get.firstName==="Vikas")
     assert(user.get.email.contains("sapient"))
     assert(user.get.location===true)
     assert(user.get.streams(0)===200)
     assert(user.get.classId.size===1)
    
  }

  after {

    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
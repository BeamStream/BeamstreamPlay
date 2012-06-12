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

  val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(100, 101), List(), List())
  val user2 = User(new ObjectId, UserType.Professional, "crizzcoxx@beamstream.com", "Crizz", "coxx", "", "Chris", "Crizz", "BeamStream", "", List(100, 101), List(), List())
  before {

    User.createUser(user1)
    User.createUser(user2)

  }


  test("testing invalid email for common domain") {
    assert("Invalid email address" ===
      User.registerUser(new User(new ObjectId, UserType.Professional, "vikas@gmail.com", "Vikas", "Hazrati", "", "Vikki", "Vikas", "Knoldus", "", List(100, 101), List(), List())))
  }

  test("testing invalid email for broken Email") {
    assert("Invalid email address" === User.registerUser(new User(new ObjectId, UserType.Professional, "vikas@gmail..com", "Vikas", "Hazrati", "", "Vikki", "Vikas", "Knoldus", "", List(100, 101), List(), List())))
  }

  test("testing valid email") {
    assert("Registration Successful" === User.registerUser(new User(new ObjectId, UserType.Professional, "vikas@knoldus.com", "Vikas", "Hazrati", "", "Vikki", "Vikas", "Knoldus", "", List(100, 101), List(), List())))
  }

  after {

    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
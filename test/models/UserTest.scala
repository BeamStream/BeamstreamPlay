package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject

@RunWith(classOf[JUnitRunner])
class UserTest extends FunSuite with BeforeAndAfter {

  val user1 = User(100, "user1", "u@u.com", List())
  val user2 = User(101, "user2", "u2@u2.com", List())

  
  before {

    User.createUser(user1)
    User.createUser(user2)

  }

  test("Fetch if the user was inserted") {
    val user = UserDAO.findOneByID(id=100)
    assert(user.get.name === "user1")
    

  }

  after {
    User.removeUser(user1)
    User.removeUser(user2)
  }

}
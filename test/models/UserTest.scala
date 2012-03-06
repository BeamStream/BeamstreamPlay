package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject


@RunWith(classOf[JUnitRunner])
class UserTest extends FunSuite with BeforeAndAfter {

  val user1 = User(100,UserType.Professional,"neel@gmail.com","Neel" ,"Sachdeva" ,"Knoldus",true,List(100,101),List())
  val user2 = User(101,UserType.Professional,"vikas@sapient.com","Vikas" ,"Hazrati" ,"Knoldus",true,List(200,201,202),List())

  before {
    
//    User.createUser(user1)
//    User.createUser(user2)
//    User.validateEmail(user1.email)
//    User.validateEmail(user2.email)
      
      User.registerUser(user1)
    

  }

  test("Fetch if the user was inserted") {
    
//    val user = UserDAO.findOneByID(id = 100)
//    assert(user.get.firstName === "Neel")
//    assert(user.get.streams.contains(101))
//    
//    val userA=UserDAO.find(MongoDBObject("orgName" -> "Knoldus"))
//    assert(userA.size===2)
    
    val userA=UserDAO.find(MongoDBObject("orgName" -> "Knoldus"))
    assert(userA.size===1)
    
    
  }

  after {
    
//    User.removeUser(user1)
//    User.removeUser(user2)
  
  }

}
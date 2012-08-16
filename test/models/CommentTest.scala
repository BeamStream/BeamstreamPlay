package models
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.util.Date

@RunWith(classOf[JUnitRunner])
class CommentTest extends FunSuite with BeforeAndAfter  {
  
   val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List(), List(),List())
  
  

  test("Create a new Comment"){
    val userId=User.createUser(user)
    val comment=new Comment(new ObjectId,"Comment1", new Date,userId,user.firstName,user.lastName,0,List(userId),0,List(userId))
    val commentId=Comment.createComment(comment)
    assert(CommentDAO.find(MongoDBObject()).toList.size===1)
    
  }
  
  after {
    CommentDAO.remove(MongoDBObject("commentBody" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }
  
  
}
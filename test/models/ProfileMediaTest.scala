package models
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject
import java.util.Date

@RunWith(classOf[JUnitRunner])
class UserMediaTest extends FunSuite with BeforeAndAfter {

  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "","", List(), List(), List(), List(),List(),List())

  test("Get all media for a user") {
    val userId = User.createUser(user)
    val UserMediaObj = new UserMedia(new ObjectId,"","", userId, new Date ,"http://beamstream.com/Neel.png", UserMediaType.Image, true,"",0,List())
    UserMedia.saveMediaForUser(UserMediaObj)
    val UserMediaForAUser = UserMediaDAO.find(MongoDBObject())
    assert(UserMediaForAUser.toList(0).mediaUrl === "http://beamstream.com/Neel.png")

  }

  test("get all media for a user") {
    val userId = User.createUser(user)
    val UserMediaObj1 = new UserMedia(new ObjectId,"","", userId, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, true,"",0,List())
    val UserMediaObj2 = new UserMedia(new ObjectId,"","",userId,new Date , "http://beamstream.com/Neel.png", UserMediaType.Image, true,"",0,List())
    UserMedia.saveMediaForUser(UserMediaObj1)
    UserMedia.saveMediaForUser(UserMediaObj2)
    val mediaForAUser = UserMedia.getProfilePicForAUser(userId)
   

  }

  after {
    UserMediaDAO.remove(MongoDBObject("profileImageUrl" -> ".*".r))
     UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
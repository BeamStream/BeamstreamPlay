package models
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject

@RunWith(classOf[JUnitRunner])
class ProfileMediaTest extends FunSuite with BeforeAndAfter {
  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List(), List())

  test("Get all media for a user") {
    val userId = User.createUser(user)
    val profileMediaObj = new ProfileMedia(new ObjectId, userId, "http://beamstream.com/Neel.png", "http://beamstream.com/Neel.mp4", "2323232", "PDF")
    ProfileMedia.saveMediaForUser(profileMediaObj)
    val profileMediaForAUser=ProfileMediaDAO.find(MongoDBObject())
    assert(profileMediaForAUser.toList(0).profileImageUrl==="http://beamstream.com/Neel.png")
  
  }

}
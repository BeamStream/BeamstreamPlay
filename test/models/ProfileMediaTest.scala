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
    val profileMediaObj = new ProfileMedia(new ObjectId, userId, "http://beamstream.com/Neel.png", ProfileMediaType.Image, true)
    ProfileMedia.saveMediaForUser(profileMediaObj)
    val profileMediaForAUser = ProfileMediaDAO.find(MongoDBObject())
    assert(profileMediaForAUser.toList(0).mediaUrl === "http://beamstream.com/Neel.png")

  }

  test("get all media for a user") {
    val userId = User.createUser(user)
    val profileMediaObj1 = new ProfileMedia(new ObjectId, userId, "http://beamstream.com/Neel.png", ProfileMediaType.Image, true)
    val profileMediaObj2 = new ProfileMedia(new ObjectId, userId, "http://beamstream.com/Neel.png", ProfileMediaType.Image, true)
    ProfileMedia.saveMediaForUser(profileMediaObj1)
    ProfileMedia.saveMediaForUser(profileMediaObj2)
    val mediaForAUser = ProfileMedia.getProfilePicForAUser(userId)
   

  }

  after {
    ProfileMediaDAO.remove(MongoDBObject("profileImageUrl" -> ".*".r))
  }

}
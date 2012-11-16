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

  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", "", List(), List(), List(), List(), List(), List())

  test("Get all media for a user") {
    val userId = User.createUser(user)
    val UserMediaObj = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, true, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj)
    val UserMediaForAUser = UserMediaDAO.find(MongoDBObject("userId" -> userId))
    assert(UserMediaForAUser.toList(0).mediaUrl === "http://beamstream.com/Neel.png")

  }

  test("Get Profile Pic Of A User") {
    val userId = User.createUser(user)
    val UserMediaObj1 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, true, "", 0, List())
    val UserMediaObj2 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, false, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj1)
    UserMedia.saveMediaForUser(UserMediaObj2)
    val mediaForAUser = UserMedia.getProfilePicForAUser(userId)
    assert(mediaForAUser(0).mediaUrl === "http://beamstream.com/NeelK.png")
  }

  /**
   * Save Media For A User  ( make present one primary )
   */

  test("Save Media For A User") {
    val userId = User.createUser(user)
    val UserMediaObj1 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, true, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj1)
    val UserMediaForAUser = UserMediaDAO.find(MongoDBObject("userId" -> userId))
    assert(UserMediaForAUser.size === 1)
    val UserMediaObj2 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, true, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj2)
    assert(UserMedia.findMediaById(UserMediaObj1.id).toList(0).isPrimary === false)
  }

  /**
   * Get All Profile Pic Of A User
   */
  test("Get All Profile Pics Of A User") {
    val userId = User.createUser(user)
    val UserMediaObj1 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, true, "", 0, List())
    val UserMediaObj2 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, false, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj1)
    UserMedia.saveMediaForUser(UserMediaObj2)
    val UserMediaObj3 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/Neel.png", UserMediaType.Video, false, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj3)
    val mediaForAUser = UserMedia.getAllProfilePicForAUser(userId)
    assert(mediaForAUser.size === 2)
  }

  /**
   * Get All Profile Pic Of A User
   */
  test("Get All Profile Videos Of A User") {
    val userId = User.createUser(user)
    val UserMediaObj1 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, true, "", 0, List())
    val UserMediaObj2 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, false, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj1)
    UserMedia.saveMediaForUser(UserMediaObj2)
    val UserMediaObj3 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/Neel.png", UserMediaType.Video, false, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj3)
    val mediaForAUser = UserMedia.getAllProfileVideoForAUser(userId)
    assert(mediaForAUser.size === 1)
  }

  /**
   * Get All Media For A User
   */
  test("Get All Media Of A User") {
    val userId = User.createUser(user)
    val UserMediaObj1 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, true, "", 0, List())
    val UserMediaObj2 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, false, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj1)
    UserMedia.saveMediaForUser(UserMediaObj2)
    val UserMediaObj3 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/Neel.png", UserMediaType.Video, false, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj3)
    val mediaForAUser = UserMedia.getAllMediaForAUser(userId)
    assert(mediaForAUser.size === 3)
  }

  /**
   * Rock User Media & Rockers Name
   */
  test("Rock User Media & Rockers Name") {
    val userId = User.createUser(user)
    val UserMediaObj1 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, true, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj1)
    UserMedia.rockUserMedia(UserMediaObj1.id, userId)
    assert(UserMedia.rockersNamesOfUserMedia(UserMediaObj1.id).head === "Neel")
  }
  
   /**
   * Update Title & Description
   */
  test("Update Title & Description") {
    val userId = User.createUser(user)
    val UserMediaObj1 = new UserMedia(new ObjectId, "", "", userId, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, true, "", 0, List())
    UserMedia.saveMediaForUser(UserMediaObj1)
    UserMedia.updateTitleAndDescription(UserMediaObj1.id,"NeelKanth","Neelkanth's Doc")
    UserMedia.findMediaById(UserMediaObj1.id).head.description==="Neelkanth's Doc"
  }

  after {
    UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

}
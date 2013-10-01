//package models
//import org.junit.runner.RunWith
//import org.scalatest.junit.JUnitRunner
//import org.scalatest.BeforeAndAfter
//import org.scalatest.FunSuite
//import org.bson.types.ObjectId
//import com.mongodb.casbah.commons.MongoDBObject
//import java.util.Date
//
//@RunWith(classOf[JUnitRunner])
//class UserMediaTest extends FunSuite with BeforeAndAfter {
//
//  before {
//    UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
//    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
//  }
//
//  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, Nil, Nil, Nil, Nil, Nil, None, None)
//
//  test("Create User Media") {
//    val userId = User.createUser(user)
//    val UserMediaObj = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj)
//    val UserMediaForAUser = UserMediaDAO.find(MongoDBObject())
//    assert(UserMediaForAUser.isEmpty === false)
//
//  }
//
//  test("Get all media for a user") {
//    val userId = User.createUser(user)
//    val UserMediaObj = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj)
//    val UserMediaForAUser = UserMedia.findUserMediaByUserId(userId.get)
//    assert(UserMediaForAUser.toList(0).mediaUrl === "http://beamstream.com/Neel.png")
//
//  }
//
//  test("Find User Media By Id") {
//    val userId = User.createUser(user)
//    val UserMediaObj = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    val userMediaId = UserMedia.saveMediaForUser(UserMediaObj)
//    val UserMediaForAUser = UserMedia.findMediaById(userMediaId.get)
//    assert(UserMediaForAUser.isEmpty === false)
//
//  }
//
//  test("Get Profile Pic Of A User") {
//    val userId = User.createUser(user)
//    val UserMediaObj = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    val userMediaId = UserMedia.saveMediaForUser(UserMediaObj)
//    val UserMediaForAUser = UserMedia.findMediaById(userMediaId.get)
//    assert(UserMediaForAUser.isEmpty === false)
//    val profilePicForAUser = UserMedia.getProfilePicForAUser(userId.get)
//    assert(profilePicForAUser.isEmpty === false)
//    assert(profilePicForAUser.head.mediaUrl === "http://beamstream.com/Neel.png")
//  }
//
//  /**
//   * Save Media For A User  ( make present one primary )
//   */
//
//  test("Save Media For A User") {
//    val userId = User.createUser(user)
//    val UserMediaObj1 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj1)
//    val UserMediaForAUser = UserMediaDAO.find(MongoDBObject("userId" -> userId))
//    assert(UserMediaForAUser.size === 1)
//    val UserMediaObj2 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel1.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj2)
//    assert(UserMedia.findMediaById(UserMediaObj1.id).toList.head.isPrimary === false)
//  }
//
//  /**
//   * Get All  Pic Of A User
//   */
//  test("Get All Profile Pics Of A User") {
//    val userId = User.createUser(user)
//    val UserMediaObj1 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    val UserMediaObj2 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj1)
//    UserMedia.saveMediaForUser(UserMediaObj2)
//    val UserMediaObj3 = UserMedia(new ObjectId, "", "", new ObjectId, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj3)
//    val mediaForAUser = UserMedia.getAllPicsForAUser(userId.get)
//    assert(mediaForAUser.size === 2)
//  }
//
//  /**
//   * Get All Profile Pic Of A User
//   */
//  test("Get All  Videos Of A User") {
//    val userId = User.createUser(user)
//    val UserMediaObj1 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    val UserMediaObj2 = UserMedia(new ObjectId, "", "", new ObjectId, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, false, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj1)
//    UserMedia.saveMediaForUser(UserMediaObj2)
//    val UserMediaObj3 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Video, Access.Public, false, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj3)
//    val mediaForAUser = UserMedia.allVideosForAuser(userId.get)
//    assert(mediaForAUser.size === 1)
//  }
//
//  /**
//   * Get All Media For A User
//   */
//  test("Get All Media Of A User") {
//    val userId = User.createUser(user)
//    val UserMediaObj1 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    val UserMediaObj2 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Image, Access.Public, false, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj1)
//    UserMedia.saveMediaForUser(UserMediaObj2)
//    val UserMediaObj3 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/Neel.png", UserMediaType.Video, Access.Public, false, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj3)
//    val mediaForAUser = UserMedia.getAllMediaForAUser(userId.get)
//    assert(mediaForAUser.size === 3)
//  }
//
//  /**
//   * Rock User Media & Rockers Name
//   */
//  test("Rock User Media & Rockers Name") {
//    val userId = User.createUser(user)
//    val UserMediaObj1 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj1)
//    UserMedia.rockUserMedia(UserMediaObj1.id, userId.get)
//    assert(UserMedia.rockersNamesOfUserMedia(UserMediaObj1.id).head === "Neel ")
//  }
//
//  /**
//   * Update Title & Description
//   */
//  test("Update Title & Description") {
//    val userId = User.createUser(user)
//    val UserMediaObj1 = UserMedia(new ObjectId, "", "", userId.get, new Date, "http://beamstream.com/NeelK.png", UserMediaType.Image, Access.Public, true, Option(new ObjectId), "", 0, Nil, Nil, 0)
//    UserMedia.saveMediaForUser(UserMediaObj1)
//    UserMedia.updateTitleAndDescription(UserMediaObj1.id, "NeelKanth", "Neelkanth's Doc")
//    UserMedia.findMediaById(UserMediaObj1.id).head.description === "Neelkanth's Doc"
//  }
//
//  after {
//    UserMediaDAO.remove(MongoDBObject("name" -> ".*".r))
//    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
//  }
//
//}
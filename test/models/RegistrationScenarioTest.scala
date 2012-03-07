package models
import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.junit.JUnitRunner
import org.bson.types.ObjectId
import org.joda.time.DateTime
import com.mongodb.casbah.commons.MongoDBObject
import java.io.File
import com.mongodb.Mongo
import com.mongodb.gridfs.GridFS

@RunWith(classOf[JUnitRunner])
class RegistrationScenarioTest extends FunSuite with BeforeAndAfter {
  val myDate = DateTime.now.toString()
  val imageFile1 = new File("/home/neel/Desktop/Shiv.jpg")
  val mongo = new Mongo("localhost", 27017)
  val db = mongo.getDB("beamstream")
  val collection = db.getCollection("media")
  
  val gfsPhoto = new GridFS(db, "photo")
  
  val gfsFile = gfsPhoto.createFile(imageFile1)
  gfsFile.save
  
  val videoFile = new File("/home/neel/Downloads/Kyun.3gp")
  val gfsVideoFile = gfsPhoto.createFile(videoFile)
  gfsVideoFile.save

  val picture = gfsFile.getId().asInstanceOf[ObjectId]
  val video = gfsVideoFile.getId().asInstanceOf[ObjectId]
  before {

    val mpsSchool = School(new ObjectId, "MPS")
    val dpsSchool = School(new ObjectId, "DPS")
    val classIT = Class(001, 1201, "IT", ClassType.Quarter, myDate)
    val classHR = Class(003, 1202, "HR", ClassType.Quarter, myDate)
    School.createSchool(mpsSchool)
    School.createSchool(dpsSchool)
    Class.createClass(classIT)
    Class.createClass(classHR)

  }

  test("User Registration Scenario") {
    /* Registering user with a common email address */

    assert("Invalid email address" ===
      User.registerUser(new User(201, UserType.Professional, "neel@gmail.com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List(), List())))

    assert("Invalid email address" ===
      User.registerUser(new User(201, UserType.Professional, "neel@aol.com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List(), List())))

    assert("Invalid email address" ===
      User.registerUser(new User(201, UserType.Professional, "neel@gmail...com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List(), List())))

    /* Register user with a valid email address */
    assert("Registration Successful" ===
      User.registerUser(new User(201, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List(), List())))

    /* User finds a school to add to his profile */

    val schools = School.findSchoolsByName("DP")

    /* The user adds a school to his profile */

    User.addSchoolToUser(201, schools.toList(0).id)

    assert(UserDAO.findOneByID(201).get.schoolId.size === 1)

    /* User adds another school to his profile */

    User.addSchoolToUser(201, schools.toList(0).id)
    assert(UserDAO.findOneByID(201).get.schoolId.size === 2)

    /* User finds a class to add to his pro"file */
    val classes = Class.findClassByName("IT")

    /*user adds the class to his profile */

    User.addClassToUser(201, classes.toList(0).id)

    assert(UserDAO.findOneByID(201).get.classId.size === 1)

    /* User adds media */

    assert(Media.getAllMediaByUser(201).size === 0)
    val pictureMedia = Media(001, 201, "VikasImage", MediaType.Image, picture)
    Media.createMedia(pictureMedia)

    val videoMedia = Media(002, 201, "video", MediaType.Video, video)
    Media.createMedia(videoMedia)

    /* user should get the media against his profile */
    assert(Media.getAllMediaByUser(201).size === 2)
    
    /*fetch User profile */
    
    val userProfile = User.getUserProfile(201)
    assert(userProfile.classId.size===1)
    assert(userProfile.schoolId.size===2)
    assert(userProfile.firstName==="Neel")

  }

  after {
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    MediaDAO.remove(MongoDBObject("mediaName" -> ".*".r))

  }

}
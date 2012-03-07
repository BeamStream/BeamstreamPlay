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
import java.io.FileInputStream

@RunWith(classOf[JUnitRunner])
class RegistrationScenarioTest extends FunSuite with BeforeAndAfter {
  val myDate = DateTime.now.toString()

  before {

    val mpsSchool = School(new ObjectId, "MPS")
    val dpsSchool = School(new ObjectId, "DPS")
    val classIT = Class(new ObjectId, 1201, "IT", ClassType.Quarter, myDate)
    val classHR = Class(new ObjectId, 1202, "HR", ClassType.Quarter, myDate)
    School.createSchool(mpsSchool)
    School.createSchool(dpsSchool)
    Class.createClass(classIT)
    Class.createClass(classHR)

  }

  test("User Registration Scenario") {
    /* Registering user with a common email address */

    assert("Invalid email address" ===
      User.registerUser(new User(201, UserType.Professional, "neel@gmail.com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List())))

    assert("Invalid email address" ===
      User.registerUser(new User(201, UserType.Professional, "neel@aol.com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List())))

    assert("Invalid email address" ===
      User.registerUser(new User(201, UserType.Professional, "neel@gmail...com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List())))

    /* Register user with a valid email address */
    assert("Registration Successful" ===
      User.registerUser(new User(201, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "Knoldus", true, List(100, 101), List(), List())))

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
    val imageFile1 = new File("/home/neel/Desktop/Shiv.jpg")
    val mediaTransfer = MediaTransfer(201, MediaType.Image, false, new FileInputStream(imageFile1))
    Media.createMedia(mediaTransfer)
    assert(Media.getAllMediaByUser(201).size === 1)

    /*fetch User profile */

    val userProfile = User.getUserProfile(201)
    assert(userProfile.classId.size === 1)
    assert(userProfile.schoolId.size === 2)
    assert(userProfile.firstName === "Neel")

  }

  after {
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    MediaDAO.remove(MongoDBObject("mediaName" -> ".*".r))

  }

}
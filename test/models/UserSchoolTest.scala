package models
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat
import play.api.test.Helpers.running
import play.api.test.FakeApplication
import java.util.Date
@RunWith(classOf[JUnitRunner])
class UserSchoolTest extends FunSuite with BeforeAndAfter {

  before {
    running(FakeApplication()) {
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val myUserSchool = UserSchool(new ObjectId, new ObjectId, "MPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), None)

  test("Create User School") {
    running(FakeApplication()) {
      UserSchool.createSchool(myUserSchool)
      assert(UserSchoolDAO.find(MongoDBObject()).size === 1)
    }
  }

  test("Remove User School") {
    running(FakeApplication()) {
      val userSchoolId = UserSchool.createSchool(myUserSchool)
      val schoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
      assert(schoolFound != None)
      val schoolsList = UserSchool.removeSchool(schoolFound.get)
      assert(UserSchoolDAO.find(MongoDBObject()).toList.size == 0)
    }
  }

  test("finding all schools by school ids") {
    running(FakeApplication()) {
      UserSchool.createSchool(myUserSchool)
      val schoolsReturnedByName = UserSchoolDAO.find(MongoDBObject("schoolName" -> "MPS")).toList
      assert(schoolsReturnedByName.size === 1)
      val userSchoolId = schoolsReturnedByName.head.id
      val schoolsReturnedById = UserSchoolDAO.find(MongoDBObject("_id" -> userSchoolId)).toList
      assert(schoolsReturnedById.size === 1)
      val schoolsList = UserSchool.getAllSchools(List(userSchoolId))
      assert(schoolsList.size === 1)
    }
  }
  test("Get All User School For A User") {
    running(FakeApplication()) {
      val userSchoolId = UserSchool.createSchool(myUserSchool)
      val schoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
      assert(schoolFound != None)
      val schoolsList = UserSchool.removeSchool(schoolFound.get)
      assert(UserSchoolDAO.find(MongoDBObject()).toList.size == 0)
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      assert(User.getUserProfile(userId.get).get.schools.size === 0)
      User.addSchoolToUser(userId.get, userSchoolId.get)
      assert(User.getUserProfile(userId.get).get.schools.size === 1)
    }
  }
  test("Get All Schools By SchoolIds") {
    running(FakeApplication()) {
      val userSchoolId = UserSchool.createSchool(myUserSchool)
      val schoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
      assert(schoolFound != None)
      val userSchoolNotFound = UserSchool.getUserSchoolById(new ObjectId)
      assert(userSchoolNotFound === None)
      val userSchoolsFound = UserSchool.getAllSchools(List(userSchoolId.get))
      assert(userSchoolsFound.head.schoolName == "MPS")
    }
  }

  test("Is User Already Contains the School") {
    running(FakeApplication()) {
      val userSchoolId = UserSchool.createSchool(myUserSchool)
      val schoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
      assert(schoolFound != None)
      val schoolsList = UserSchool.removeSchool(schoolFound.get)
      assert(UserSchoolDAO.find(MongoDBObject()).toList.size == 0)
      val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
      val userId = User.createUser(user)
      assert(User.getUserProfile(userId.get).get.schools.size === 0)
      User.addSchoolToUser(userId.get, userSchoolId.get)
      assert(User.getUserProfile(userId.get).get.schools.size === 1)
      val hasUserContainsTheSchoolAlready = UserSchool.isUserAlreadyContainsTheSchoolThatUserWantsToJoin(userSchoolId.get, userId.get)
      assert(hasUserContainsTheSchoolAlready == true)
    }
  }

  test("Update user School") {
    running(FakeApplication()) {
      val userSchoolId = UserSchool.createSchool(myUserSchool)
      val schoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
      assert(schoolFound.get.schoolName === "MPS")
      val myUpdatedUserSchool = UserSchool(userSchoolId.get, new ObjectId, "DPS", Year.Freshman, Degree.Assosiates,
        "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), None)
      UserSchool.updateUserSchool(myUpdatedUserSchool)
      val updatedSchoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
      assert(updatedSchoolFound.get.schoolName === "DPS")
    }
  }
  
  test("Update User School with original School Id") {
    running(FakeApplication()) {
      val userSchoolId = UserSchool.createSchool(myUserSchool)
      val originalSchoolId = new ObjectId
      UserSchool.updateUserSchoolWithOriginalSchoolId(userSchoolId.get, originalSchoolId)
      assert(UserSchoolDAO.find(MongoDBObject()).toList(0).assosiatedSchoolId === originalSchoolId)
    }
  }
  
  test("Get all Schools of a User") {
    running(FakeApplication()) {
      assert(UserSchool.getAllSchoolforAUser(new ObjectId).size === 0)
    }
  }

  after {
    running(FakeApplication()) {
      UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
    }
  }
}
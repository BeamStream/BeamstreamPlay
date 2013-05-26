package models
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat

@RunWith(classOf[JUnitRunner])
class UserSchoolTest extends FunSuite with BeforeAndAfter {

  before {
    UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val myUserSchool = UserSchool(new ObjectId, new ObjectId, "MPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), None)

  test("Create User School") {
    UserSchool.createSchool(myUserSchool)
    assert(UserSchoolDAO.find(MongoDBObject()).size === 1)
  }

  test("Remove User School") {
    val userSchoolId = UserSchool.createSchool(myUserSchool)
    val schoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
    assert(schoolFound != None)
    val schoolsList = UserSchool.removeSchool(schoolFound.get)
    assert(UserSchoolDAO.find(MongoDBObject()).toList.size == 0)
  }

  test("finding all schools by school ids") {
    UserSchool.createSchool(myUserSchool)
    val schoolsReturnedByName = UserSchoolDAO.find(MongoDBObject("schoolName" -> "MPS")).toList
    assert(schoolsReturnedByName.size === 1)
    val userSchoolId = schoolsReturnedByName.head.id
    val schoolsReturnedById = UserSchoolDAO.find(MongoDBObject("_id" -> userSchoolId)).toList
    assert(schoolsReturnedById.size === 1)
    val schoolsList = UserSchool.getAllSchools(List(userSchoolId))
    assert(schoolsList.size === 1)
  }

  test("Get All User School For A User") {
    val userSchoolId = UserSchool.createSchool(myUserSchool)
    val schoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
    assert(schoolFound != None)
    val schoolsList = UserSchool.removeSchool(schoolFound.get)
    assert(UserSchoolDAO.find(MongoDBObject()).toList.size == 0)
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, Nil, Nil, Nil, Nil, Nil, None, None)
    val userId = User.createUser(user)
    assert(User.getUserProfile(userId.get).get.schools.size === 0)
    User.addSchoolToUser(userId.get, userSchoolId.get)
    assert(User.getUserProfile(userId.get).get.schools.size === 1)
  }

  test("Get All Schools By SchoolIds") {
    val userSchoolId = UserSchool.createSchool(myUserSchool)
    val schoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
    assert(schoolFound != None)
    val userSchoolsFound = UserSchool.getAllSchools(List(userSchoolId.get))
    assert(userSchoolsFound.head.schoolName == "MPS")
  }

  test("Is User Already Contains the School") {
    val userSchoolId = UserSchool.createSchool(myUserSchool)
    val schoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
    assert(schoolFound != None)
    val schoolsList = UserSchool.removeSchool(schoolFound.get)
    assert(UserSchoolDAO.find(MongoDBObject()).toList.size == 0)
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, Nil, Nil, Nil, Nil, Nil, None, None)
    val userId = User.createUser(user)
    assert(User.getUserProfile(userId.get).get.schools.size === 0)
    User.addSchoolToUser(userId.get, userSchoolId.get)
    assert(User.getUserProfile(userId.get).get.schools.size === 1)
    val hasUserContainsTheSchoolAlready = UserSchool.isUserAlreadyContainsTheSchoolThatUserWantsToJoin(userSchoolId.get, userId.get)
    assert(hasUserContainsTheSchoolAlready == true)
  }

  test("Update user School") {
    val userSchoolId = UserSchool.createSchool(myUserSchool)
    val schoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
    assert(schoolFound.get.schoolName === "MPS")
    val myUpdatedUserSchool = UserSchool(userSchoolId.get, new ObjectId, "DPS", Year.Freshman, Degree.Assosiates,
      "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), None)
    UserSchool.updateUserSchool(myUpdatedUserSchool)
    val updatedSchoolFound = UserSchool.getUserSchoolById(userSchoolId.get)
    assert(updatedSchoolFound.get.schoolName === "DPS")

  }

  after {
    UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }
}
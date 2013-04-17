package models
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat

@RunWith(classOf[JUnitRunner])
class SchoolTest extends FunSuite with BeforeAndAfter {

  before {
    UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val myUserSchool1 = UserSchool(new ObjectId, new ObjectId, "MPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), None)

  test("Create User School") {
    UserSchool.createSchool(myUserSchool1)
    assert(UserSchoolDAO.find(MongoDBObject()).size === 1)
  }

  test("finding all schools by school ids") {
    UserSchool.createSchool(myUserSchool1)
    val schoolsReturnedByName = UserSchoolDAO.find(MongoDBObject("schoolName" -> "MPS")).toList
    assert(schoolsReturnedByName.size === 1)
    val id = schoolsReturnedByName.head.id

    val schoolsReturnedById = UserSchoolDAO.find(MongoDBObject("_id" -> id)).toList
    assert(schoolsReturnedById.size === 1)

    val schoolObjectIdList: List[ObjectId] = List(id)
    val schoolsList = UserSchool.getAllSchools(schoolObjectIdList)
    assert(schoolsList.size === 1)
  }

    after {
    UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }
}
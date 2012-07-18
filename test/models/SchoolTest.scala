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

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val myschool1 = UserSchool(new ObjectId, "MPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013),"", List())

  val myschool2 = UserSchool(new ObjectId, "DPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013),"", List())

  val myschool3 = UserSchool(new ObjectId, "DPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), "",List())

  before {
    UserSchool.createSchool(List(myschool1, myschool2, myschool3))

  }

  test("Check the School Creation") {
    
    val schoolA = UserSchoolDAO.find(MongoDBObject("schoolName" -> "MPS"))
    assert(schoolA.size === 1)

    val schoolB = UserSchoolDAO.find(MongoDBObject("schoolName" -> "DPS"))
    assert(schoolB.size === 2)

    UserSchool.removeSchool(myschool3)

    val schoolC = UserSchoolDAO.find(MongoDBObject("schoolName" -> "DPS"))
    assert(schoolC.size === 1)

  }

  test("finding schools by school name") {
    assert(UserSchool.findSchoolsByName("PS").size === 3)
    assert(UserSchool.findSchoolsByName("DP").size === 2)
  }

  test("finding all schools by school ids") {
    val schoolsReturnedByName = UserSchoolDAO.find(MongoDBObject("schoolName" -> "DPS")).toList
    assert(schoolsReturnedByName.size === 2)
    val id = schoolsReturnedByName(0).id
    val otherid = schoolsReturnedByName(1).id

    val schoolsReturnedById = UserSchoolDAO.find(MongoDBObject("_id" -> id)).toList
    assert(schoolsReturnedById.size === 1)

    val anotherschoolsReturnedById = UserSchoolDAO.find(MongoDBObject("_id" -> otherid)).toList
    assert(anotherschoolsReturnedById.size === 1)

    val schoolObjectIdList: List[ObjectId] = List(id, otherid)
    val schoolsList = UserSchool.getAllSchools(schoolObjectIdList)
    assert(schoolsList.size === 2)

  }

  after {
    UserSchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }
}
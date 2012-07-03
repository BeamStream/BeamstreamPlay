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

  val myschool1 = School(new ObjectId, "MPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013),"", List())

  val myschool2 = School(new ObjectId, "DPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013),"", List())

  val myschool3 = School(new ObjectId, "DPS", Year.Freshman, Degree.Assosiates,
    "CSE", Graduated.No, Option(formatter.parse("12-07-2011")), Option(DegreeExpected.Summer2013), "",List())

  before {
    School.createSchool(List(myschool1, myschool2, myschool3))

  }

  test("Check the School Creation") {
    
    val schoolA = SchoolDAO.find(MongoDBObject("schoolName" -> "MPS"))
    assert(schoolA.size === 1)

    val schoolB = SchoolDAO.find(MongoDBObject("schoolName" -> "DPS"))
    assert(schoolB.size === 2)

    School.removeSchool(myschool3)

    val schoolC = SchoolDAO.find(MongoDBObject("schoolName" -> "DPS"))
    assert(schoolC.size === 1)

  }

  test("finding schools by school name") {
    assert(School.findSchoolsByName("PS").size === 3)
    assert(School.findSchoolsByName("DP").size === 2)
  }

  test("finding all schools by school ids") {
    val schoolsReturnedByName = SchoolDAO.find(MongoDBObject("schoolName" -> "DPS")).toList
    assert(schoolsReturnedByName.size === 2)
    val id = schoolsReturnedByName(0).id
    val otherid = schoolsReturnedByName(1).id

    val schoolsReturnedById = SchoolDAO.find(MongoDBObject("_id" -> id)).toList
    assert(schoolsReturnedById.size === 1)

    val anotherschoolsReturnedById = SchoolDAO.find(MongoDBObject("_id" -> otherid)).toList
    assert(anotherschoolsReturnedById.size === 1)

    val schoolObjectIdList: List[ObjectId] = List(id, otherid)
    val schoolsList = School.getAllSchools(schoolObjectIdList)
    assert(schoolsList.size === 2)

  }

  after {
    SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }
}
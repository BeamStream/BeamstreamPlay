package models
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject

@RunWith(classOf[JUnitRunner])
class SchoolTest extends FunSuite with BeforeAndAfter {

  val myschool1 = School(001, "MPS")
  val myschool2 = School(002, "DPS")
  val myschool3 = School(003, "DPS")

  before {
    School.createSchool(myschool1)
    School.createSchool(myschool2)
    School.createSchool(myschool3)
  }

  test("Check the School Creation") {
    val schoolA = SchoolDAO.findOneByID(001)
    assert(schoolA.get.schoolName === "MPS")

    val schoolB = SchoolDAO.find(MongoDBObject("schoolName" -> "DPS"))
    assert(schoolB.size === 2)
   
    School.removeSchool(myschool3)

    val schoolC = SchoolDAO.find(MongoDBObject("schoolName" -> "DPS"))
    assert(schoolC.size === 1)
   
  }

  after {
    SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }
}
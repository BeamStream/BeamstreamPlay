package models
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId

@RunWith(classOf[JUnitRunner])
class SchoolTest extends FunSuite with BeforeAndAfter {

  val myschool1 = School(new ObjectId, "MPS",Year.FirstYear,DegreeExpected.Spring2012,
        "CSE",Degree.Masters,"Cambridge",true,"12/09/12","CSE",PreviousDegree.Masters,List())
  val myschool2 = School(new ObjectId, "DPS",Year.FirstYear,DegreeExpected.Spring2012,
        "CSE",Degree.Masters,"Cambridge",true,"12/09/12","CSE",PreviousDegree.Masters,List())
  val myschool3 = School(new ObjectId, "DPS",Year.FirstYear,DegreeExpected.Spring2012,
        "CSE",Degree.Masters,"Cambridge",true,"12/09/12","CSE",PreviousDegree.Masters,List())

  before {
    School.createSchool(myschool1)
    School.createSchool(myschool2)
    School.createSchool(myschool3)
  }

  test("Check the School Creation") {
    val schoolA = SchoolDAO.find(MongoDBObject("schoolName" -> "MPS"))
    
    assert(schoolA.size===1)

    val schoolB = SchoolDAO.find(MongoDBObject("schoolName" -> "DPS"))
    assert(schoolB.size === 2)
   
    School.removeSchool(myschool3)

    val schoolC = SchoolDAO.find(MongoDBObject("schoolName" -> "DPS"))
    assert(schoolC.size === 1)
   
  }
  
  test("finding schools by school name"){
    assert(School.findSchoolsByName("PS").size===3)
    assert(School.findSchoolsByName("DP").size===2)
  }

  after {
    SchoolDAO.remove(MongoDBObject("schoolName" -> ".*".r))
  }
}
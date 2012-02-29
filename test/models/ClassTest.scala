package models
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject

@RunWith(classOf[JUnitRunner])
class ClassTest extends FunSuite with BeforeAndAfter {

  val class1 = Class(001, 201, "IT")
  val class2 = Class(002, 202, "CSE")
  val class3 = Class(003, 203, "ECE")
  val class4 = Class(004, 204, "CSE")

  before {
    Class.createClass(class1)
    Class.createClass(class2)
    Class.createClass(class3)
    Class.createClass(class4)
  }

  test("Createing & Deleting Classes") {
    val classA = ClassDAO.findOneByID(002)
    assert(classA.get.className === "CSE")

    val classB = ClassDAO.find(MongoDBObject("className" -> "CSE"))
    assert(classB.size === 2)

    Class.deleteClass(class4)

    val classC = ClassDAO.find(MongoDBObject("className" -> "CSE"))
    assert(classC.size === 1)

    Class.createClass(Class(005, 205, "ME"))

    val classD = ClassDAO.findOneByID(005)
    assert(classD.get.classCode === 205)
    assert(classD.get.className === "ME")

  }

  after {
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
  }

}
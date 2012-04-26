package models
import org.scalatest.FunSuite
import org.scalatest.BeforeAndAfter
import org.junit.runner.RunWith
import org.scalatest._
import org.scalatest.junit.JUnitRunner
import com.mongodb.casbah.commons.MongoDBObject
import org.joda.time.DateTime
import com.mongodb.casbah.commons.conversions.scala._
import org.joda.time.format.DateTimeFormatter
import org.joda.time.base.BaseDateTime
import org.joda.time.LocalDateTime
import org.bson.types.ObjectId

@RunWith(classOf[JUnitRunner])
class ClassTest extends FunSuite with BeforeAndAfter {

  //  RegisterConversionHelpers
  //  RegisterJodaTimeConversionHelpers
  val myDate = DateTime.now.toString()

  val class1 = Class(new ObjectId, "201", "IT", ClassType.Quarter, myDate,myDate,new ObjectId,List())
  val class2 = Class(new ObjectId, "202", "CSE", ClassType.Quarter, myDate,myDate,new ObjectId,List())
  val class3 = Class(new ObjectId, "203", "ECE", ClassType.Quarter, myDate,myDate,new ObjectId,List())
  val class4 = Class(new ObjectId, "204", "CSE", ClassType.Yearly, myDate,myDate,new ObjectId,List())

  before {

    Class.createClass(class1)
    Class.createClass(class2)
    Class.createClass(class3)
    Class.createClass(class4)
  }

  test("Createing & Deleting Classes") {
    val classA = ClassDAO.find(MongoDBObject("classCode" -> "201"))
    assert(classA.size === 1)

    val classB = ClassDAO.find(MongoDBObject("className" -> "CSE"))
    assert(classB.size === 2)

  }

  test("finding class by class name") {
    assert(Class.findClassByName("SE").size === 2)
    assert(Class.findClassByName("E").size === 3)
    assert(Class.findClassByName("T").size === 1)

  }

  after {
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
  }

}
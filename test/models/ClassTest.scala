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
import java.text.DateFormat

@RunWith(classOf[JUnitRunner])
class ClassTest extends FunSuite with BeforeAndAfter {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val class1 = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId, List())
  val class2 = Class(new ObjectId, "202", "CSE", ClassType.Quarter, "3:34", formatter.parse("31-01-2010"), new ObjectId, List())
  val class3 = Class(new ObjectId, "203", "ECE", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId, List())
  val class4 = Class(new ObjectId, "204", "CSE", ClassType.Yearly, "3:30", formatter.parse("31-01-2010"), new ObjectId, List())

  before {
    Class.createClass(List(class1, class2, class3, class4),new ObjectId)
  }

  /*
   * Find class by class code and class name
   */
  test("Finding a class") {
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


  test("finding class by class time") {
    assert(Class.findClassByTime("3:30").size === 3)

  }

  test("Deleting a class") {
    Class.deleteClass(class1)
    assert(ClassDAO.find(MongoDBObject()).size === 3)
    Class.deleteClass(class2)
    assert(ClassDAO.find(MongoDBObject()).size === 2)

  }

  after {
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
  }

}
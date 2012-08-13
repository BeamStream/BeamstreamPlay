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
  val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", List(), List(), List(), List(),List())

  before {
    val userId = User.createUser(user1)
    Class.createClass(List(class1, class2, class3, class4), userId)
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

  test("Avoid create class if duplicate code exists") {
    val userId = User.createUser(user1)
    val newClass1 = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId, List())
    val classIdList=Class.createClass(List(newClass1), userId)
    assert(classIdList.size===0)
    val newClass2 = Class(new ObjectId, "207", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId, List())
    val newClassIdList=Class.createClass(List(newClass2), userId)
    assert(newClassIdList.size===1)

  }

  after {
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
  }

}
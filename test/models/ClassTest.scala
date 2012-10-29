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

  val class1 = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())
  val class2 = Class(new ObjectId, "201", "CSE", ClassType.Quarter, "3:34", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())
  val class3 = Class(new ObjectId, "203", "ECE", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())
  val class4 = Class(new ObjectId, "204", "CSE", ClassType.Yearly, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())
  val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", "", List(), List(), List(), List(), List())

  test("Create Class/Duplicate Class Exists") {
    val userId = User.createUser(user1)
    val result = Class.createClass(List(class1, class2), userId) // Code Of Class1 and Class2 are equals
    assert(result.status === "Failure")

    val resultObtained = Class.createClass(List(class2, class4), userId) // Name Of Class2 and Class3 are equals
    assert(result.status === "Failure")

    val resultObtained1 = Class.createClass(List(class2, class3), userId)
    assert(resultObtained1.status === "Success")

  }

  test("find class by Id") {
    val userId = User.createUser(user1)
    val resultObtained1 = Class.createClass(List(class2, class3), userId)
    assert(resultObtained1.status === "Success")

    val classObtained = Class.findClasssById(class2.id)
    assert(classObtained.className === "CSE")
  }

  test("Get All Classes For A User") {
    val userId = User.createUser(user1)
    val result = Class.createClass(List(class1, class3, class4), userId)
    assert(result.status === "Success")

    val classesOfAUser = Class.getAllClassesForAUser(userId)
    assert(classesOfAUser.size === 3)
    assert(classesOfAUser(1).className === "ECE")
    assert(classesOfAUser(2).className === "CSE")

  }

  test("Find Class On The Basis Of SchoolId") {
    val userId = User.createUser(user1)
    val result = Class.createClass(List(class1,class3, class4), userId)
    val classesFound=Class.findClassByName("CS",new ObjectId("47cc67093475061e3d95369d"))
    assert(classesFound.size===1)
  }
  /*
   * Find class by class code and class name
   */

  //  test("finding class by class time") {
  //    assert(Class.findClassByTime("3:30").size === 3)
  //
  //  }

  //  test("Avoid create class if duplicate code exists") {
  //    val userId = User.createUser(user1)
  //    val newClass1 = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId, List())
  //    val classIdList = Class.createClass(List(newClass1), userId)
  //    assert(classIdList.size === 0)
  //    val newClass2 = Class(new ObjectId, "207", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId, List())
  //    val newClassIdList = Class.createClass(List(newClass2), userId)
  //    assert(newClassIdList.size === 1)
  //
  //  }
  //
  //  test("Find all classes for a user") {
  //    val userId = User.createUser(user1)
  //    val newClassA = Class(new ObjectId, "302", "CSE", ClassType.Semester, "3:40", formatter.parse("31-01-2011"), new ObjectId, List())
  //    val newClassB = Class(new ObjectId, "301", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId, List())
  //     val classIdList = Class.createClass(List(newClassA,newClassB), userId)
  //     assert(classIdList.size === 2)
  //     assert(Class.findClasssById(classIdList(0)).className==="CSE")
  //  }
  //  
  //  
  //   test("Find all classes Objects for a user") {
  //    val userId = User.createUser(user1)
  //    val newClassA = Class(new ObjectId, "302", "CSE", ClassType.Semester, "3:40", formatter.parse("31-01-2011"), new ObjectId, List())
  //    val newClassB = Class(new ObjectId, "301", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId, List())
  //     val classIdList = Class.createClass(List(newClassA,newClassB), userId)
  //     val classesFetched=Class.getAllClasses(classIdList)
  //     assert(classesFetched.size===2)
  //     assert(classesFetched(0).classType===ClassType.Semester)
  //  }

  after {
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
  }

}
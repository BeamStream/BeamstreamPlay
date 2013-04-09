package models

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import java.text.DateFormat
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject


@RunWith(classOf[JUnitRunner])
class ClassTest extends FunSuite with BeforeAndAfter {
  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
/*
  val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())

  test("Create class test") {
    val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, List(), List(), List(), List(), List())
    val userId = User.createUser(user1)
    assert(Class.getAllClassesIdsForAUser(userId).size === 0)
    Class.createClass(classToBeCretaed, userId)
    assert(ClassDAO.find(MongoDBObject()).size === 1)
    assert(ClassDAO.find(MongoDBObject()).toList(0).className === "IT")
    assert(Class.getAllClassesIdsForAUser(userId).size === 1)
    assert(StreamDAO.find(MongoDBObject()).toList(0).streamName === "IT")
  }

  // Comment out the mail sending part in 'createClass' method in order to run this test
  test("Find Class By Name") {
    val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, List(), List(), List(), List(), List())
    val userId = User.createUser(user1)
    assert(Class.getAllClassesIdsForAUser(userId).size === 0)
    Class.createClass(classToBeCretaed, userId)
    assert(ClassDAO.find(MongoDBObject()).size === 1)
    assert(ClassDAO.find(MongoDBObject()).toList(0).className === "IT")
    val classesFoundForSachool = Class.findClassByName("I", new ObjectId("47cc67093475061e3d95369d"))
    assert(classesFoundForSachool.size == 1)
  }

  test("Find Class By Code") {
    val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, List(), List(), List(), List(), List())
    val userId = User.createUser(user1)
    assert(Class.getAllClassesIdsForAUser(userId).size === 0)
    Class.createClass(classToBeCretaed, userId)
    assert(ClassDAO.find(MongoDBObject()).size === 1)
    assert(ClassDAO.find(MongoDBObject()).toList(0).classCode === "201")
    val classesFoundForSachool = Class.findClassByCode("20", new ObjectId("47cc67093475061e3d95369d"))
    assert(classesFoundForSachool.size == 1)
  }

  test("find class by time") {
    val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, List(), List(), List(), List(), List())
    val userId = User.createUser(user1)
    Class.createClass(classToBeCretaed, userId)
    val classesFoundByTime = Class.findClassByTime("3:30")
    assert(classesFoundByTime.size === 1)
  }

  test("find class by Id") {
    val user1 = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, List(), List(), List(), List(), List())
    val userId = User.createUser(user1)
    Class.createClass(classToBeCretaed, userId)
    val classesFoundById = Class.findClasssById(classToBeCretaed.id)
    assert(classesFoundById != 1)
  }

  after {
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
  }
  */
}
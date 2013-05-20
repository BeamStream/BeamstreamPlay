package models

import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import java.text.DateFormat
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject
import play.api.test.Helpers.running
import play.api.test.FakeApplication
@RunWith(classOf[JUnitRunner])
class ClassTest extends FunSuite with BeforeAndAfter {

  before {
    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
  }

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", "", Option("Neel"), "", "", "", "", "", None, List(), List(), List(), List(), List(), None)

  test("Create class test") {
    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.findClasssById(classToBeCretaed.id).get.className === "IT")
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 1)
      assert(Stream.getStreamByName("IT").head.streamName == "IT")
    }
  }

  test("Find Class By Name") {

    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.findClasssById(classToBeCretaed.id).get.className === "IT")
      val classesFound = Class.findClassByName("IT", new ObjectId("47cc67093475061e3d95369d"))
      assert(classesFound.size === 1)
    }
  }

  test("Find Class By Code") {
    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.findClasssById(classToBeCretaed.id).get.className === "IT")
      val classesFound = Class.findClassByCode("201", new ObjectId("47cc67093475061e3d95369d"))
      assert(classesFound.size === 1)
    }
  }

  test("find class by time") {
    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.findClasssById(classToBeCretaed.id).get.className === "IT")
      val classesFound = Class.findClassByTime("3:30")
      assert(classesFound.size === 1)
    }
  }

  test("find class by Id") {
    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.findClasssById(classToBeCretaed.id).get.className === "IT")
      val classesFound = Class.findClasssById(classToBeCretaed.id)
      assert(classesFound.size === 1)
    }
  }
  test("Remove Class") {
    running(FakeApplication()) {
      val classToBeCretaed = Class(new ObjectId, "201", "IT", ClassType.Quarter, "3:30", formatter.parse("31-01-2010"), new ObjectId("47cc67093475061e3d95369d"), List())
      val userId = User.createUser(user)
      assert(Class.getAllClassesIdsForAUser(userId.get).size === 0)
      Class.createClass(classToBeCretaed, userId.get)
      assert(Class.findClasssById(classToBeCretaed.id).size === 1)
      assert(Class.findClasssById(classToBeCretaed.id).get.className === "IT")
      val classFound = Class.findClasssById(classToBeCretaed.id)
      Class.deleteClass(classFound.get)
      assert(Class.findClasssById(classToBeCretaed.id) === None)
    }
  }

  after {
    ClassDAO.remove(MongoDBObject("className" -> ".*".r))
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    StreamDAO.remove(MongoDBObject("streamName" -> ".*".r))
  }

}
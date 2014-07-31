package controllers

import java.text.DateFormat
import java.util.Date
import scala.Option.option2Iterable
import org.bson.types.ObjectId
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import com.mongodb.casbah.commons.MongoDBObject
import models.Access
import models.Comment
import models.OptionOfQuestion
import models.OptionOfQuestionDAO
import models.Question
import models.QuestionDAO
import models.QuestionPolling
import models.Stream
import models.StreamDAO
import models.StreamType
import models.Type
import models.User
import models.UserDAO
import models.UserType
import play.api.test.FakeApplication
import org.scalatest.junit.JUnitRunner
import play.api.test.FakeApplication
import play.api.test.Helpers._
import play.api.libs.json.JsValue
import play.api.test.FakeRequest

@RunWith(classOf[JUnitRunner])
class QuestionControllerTest extends FunSuite with BeforeAndAfter {
  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date,Nil, Nil, Nil, None, None, None)
  val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, user.id, List(user.id), true, Nil)
  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      QuestionDAO.remove(MongoDBObject("questionBody" -> ".*".r))
      StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

  
  test("Create a Question & remove a Question") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val jsonString = """{"streamId": """ + """"""" + stream.id.toString + """"""" + """ """ + ',' + """ "questionBody" : "how are you","questionAccess":"Public" }"""
      val json: JsValue = play.api.libs.json.Json.parse(jsonString)
      val result = route(FakeRequest(POST, "/question").withJsonBody(json).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Get All Questions") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      val result = route(FakeRequest(GET, "/questions").withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }

  test("Rocking The Question And Getting The Rockers") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      val result = route(FakeRequest(PUT, "/rock/question/" + questionId.get.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)

    }
  }

  /**
   * TODO Testing of Delete The Question
   */
  /*test("Delete The Question") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val result1 = route(FakeRequest(PUT, "/remove/question/" + questionId.get.toString).withSession("userId" -> (new ObjectId).toString))
      assert(status(result1.get) === 200)
      val result2 = route(FakeRequest(PUT, "/remove/question/" + questionId.get.toString).withSession("userId" -> userId.get.toString))
      assert(status(result2.get) === 200)
    }
  }*/

  test("Follow The Question") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val result = route(FakeRequest(PUT, "/follow/question/" + questionId.get.toString).withSession("userId" -> userId.get.toString))
      assert(status(result.get) === 200)
    }
  }
  
  test("Get All Questions of a Stream") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      val result1 = route(FakeRequest(GET, "/getAllQuestionsForAStream/"+ stream.id + "/date/2/1").withSession("userId" -> userId.get.toString))
      assert(status(result1.get) === 200)
      val result2 = route(FakeRequest(GET, "/getAllQuestionsForAStream/"+ stream.id + "/rock/2/1").withSession("userId" -> userId.get.toString))
      assert(status(result2.get) === 200)
      val result3 = route(FakeRequest(GET, "/getAllQuestionsForAStream/"+ stream.id + "/the/2/1").withSession("userId" -> userId.get.toString))
      assert(status(result2.get) === 200)
    }
  }

  test("Get All Answered Questions of a Stream") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, true, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, true, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      val result1 = route(FakeRequest(GET, "/getAllAnswerdQuestionForAStream/" + stream.id + "/2/1/answered").withSession("userId" -> userId.get.toString))
      assert(status(result1.get) === 200)
      val result2 = route(FakeRequest(GET, "/getAllAnswerdQuestionForAStream/" + stream.id + "/2/1/ok").withSession("userId" -> userId.get.toString))
      assert(status(result2.get) === 200)
    }
  }
  
  test("Get All Answers of a Question") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val comment = Comment(new ObjectId, "Good", new Date, userId.get, user.firstName, user.lastName, 0, List(userId.get), stream.id)
      val commentId = Comment.createComment(comment)
      val question = Question(new ObjectId, "How was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, List(commentId.get), Nil, Nil, true, None, None)
      val questionId = Question.addQuestion(question)
      val result = route(FakeRequest(GET, "/answers/" + questionId.get))
      assert(status(result.get) === 200)
    }
  }
  
  test("Get Rockers of a Question") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val comment = Comment(new ObjectId, "Good", new Date, userId.get, user.firstName, user.lastName, 0, List(userId.get), stream.id)
      val commentId = Comment.createComment(comment)
      val question = Question(new ObjectId, "How was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, List(userId.get), Nil, List(commentId.get), Nil, Nil, true, None, None)
      val questionId = Question.addQuestion(question)
      val result = route(FakeRequest(GET, "/rockersOf/question/" + questionId.get))
      assert(status(result.get) === 200)
    }
  }
  
  /**
   * TODO testing of Deleting an Answer of a Question
   */
  /*test("Delete an Answer of a Question") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val comment = Comment(new ObjectId, "Good", new Date, userId.get, user.firstName, user.lastName, 0, List(userId.get))
      val commentId = Comment.createComment(comment)
      val question = Question(new ObjectId, "How was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, List(commentId.get), Nil, Nil, true, None, None)
      val questionId = Question.addQuestion(question)
      val result1 = route(FakeRequest(PUT, "/remove/answer/" + commentId.get.toString() + "/" + questionId.get).withSession("userId" -> userId.get.toString))
      assert(status(result1.get) === 200)
      val result2 = route(FakeRequest(PUT, "/remove/answer/" + commentId.get.toString() + "/" + questionId.get).withSession("userId" -> (new ObjectId).toString()))
      assert(status(result2.get) === 200)
    }
  }*/
  
  test("Get Numner of Unanswered Questions") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val question = Question(new ObjectId, "How was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, List(userId.get), Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val result = route(FakeRequest(GET, "/noOfUnansweredQuestions/" + stream.id))
      assert(status(result.get) === 200)
    }
  }
  
  after {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      QuestionDAO.remove(MongoDBObject("questionBody" -> ".*".r))
      StreamDAO.remove(MongoDBObject("name" -> ".*".r))
    }
  }

}
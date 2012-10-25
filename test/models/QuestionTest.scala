package models

import org.scalatest.FunSuite
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import com.sun.org.apache.xalan.internal.xsltc.compiler.ForEach
import org.scalatest.BeforeAndAfter
import com.mongodb.casbah.commons.MongoDBObject
import org.bson.types.ObjectId
import java.text.DateFormat
import java.util.Date

@RunWith(classOf[JUnitRunner])
class QuestionTest extends FunSuite with BeforeAndAfter {

  test("Create a Question & remove a Question") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", "", List(), List(), List(), List(), List())
    val userId = User.createUser(user)
    var stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List("Tag1", "Tag2"))
    val streamId = Stream.createStream(stream)
    val question = new Question(new ObjectId, "How Was the Class ?", userId, QuestionAccess.Public, streamId, "Neel", "Sachdeva", new Date, 0, List(), List(), 0, List())
    val questionId = Question.addQuestion(question)
    assert((Question.findQuestionById(questionId).get.questionBody) === "How Was the Class ?")
    val anotherQuestion = new Question(new ObjectId, "How Was the Day ?", userId, QuestionAccess.Public, streamId, "Neel", "Sachdeva", new Date, 0, List(), List(), 0, List())
    val anotherQuestionId = Question.addQuestion(anotherQuestion)
    assert((Question.findQuestionById(anotherQuestionId).get.questionBody) === "How Was the Day ?")
    // Remove A Question
    Question.removeQuestion(anotherQuestion)
    assert((Question.findQuestionById(anotherQuestionId) === None))
  }

  test("Get All Questions") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", "", List(), List(), List(), List(), List())
    val userId = User.createUser(user)
    var stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List("Tag1", "Tag2"))
    val streamId = Stream.createStream(stream)
    val question = new Question(new ObjectId, "How Was the Class ?", userId, QuestionAccess.Public, streamId, "Neel", "Sachdeva", new Date, 0, List(), List(), 0, List())
    val questionId = Question.addQuestion(question)
    val anotherQuestion = new Question(new ObjectId, "How Was the Day ?", userId, QuestionAccess.Public, streamId, "Neel", "Sachdeva", new Date, 0, List(), List(), 0, List())
    val anotherQuestionId = Question.addQuestion(anotherQuestion)
    assert(Question.getAllQuestions(List(anotherQuestionId, questionId)).size === 2)
  }
  
  test("Find Question By Id") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", "", List(), List(), List(), List(), List())
    val userId = User.createUser(user)
    var stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List("Tag1", "Tag2"))
    val streamId = Stream.createStream(stream)
    val question = new Question(new ObjectId, "How Was the Class ?", userId, QuestionAccess.Public, streamId, "Neel", "Sachdeva", new Date, 0, List(), List(), 0, List())
    val questionId = Question.addQuestion(question)
    val anotherQuestion = new Question(new ObjectId, "How Was the Day ?", userId, QuestionAccess.Public, streamId, "Neel", "Sachdeva", new Date, 0, List(), List(), 0, List())
    val anotherQuestionId = Question.addQuestion(anotherQuestion)
    assert(Question.findQuestionById(anotherQuestionId).size===1)
  }
  
  test("Rocking The Question And Getting The Rockers") {
    val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "Sachdeva", "", "Neil", "Neel", "Knoldus", "", "", List(), List(), List(), List(), List())
    val userId = User.createUser(user)
    var stream = Stream(new ObjectId, "al1pha", StreamType.Class, userId, List(userId), true, List("Tag1", "Tag2"))
    val streamId = Stream.createStream(stream)
    val question = new Question(new ObjectId, "How Was the Class ?", userId, QuestionAccess.Public, streamId, "Neel", "Sachdeva", new Date, 0, List(), List(), 0, List())
    val questionId = Question.addQuestion(question)
    Question.rockTheQuestion(questionId,userId)
    assert(Question.rockersNameOfAQuestion(questionId)===List("Neel"))
    assert(Question.rockersNameOfAQuestion(questionId).size===1)
  }

  after {
    UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
    QuestionDAO.remove(MongoDBObject("questionBody" -> ".*".r))
  }
}
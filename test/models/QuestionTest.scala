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
import play.api.test.Helpers.running
import play.api.test.FakeApplication

@RunWith(classOf[JUnitRunner])
class QuestionTest extends FunSuite with BeforeAndAfter {
  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")

  val user = User(new ObjectId, UserType.Professional, "neel@knoldus.com", "Neel", "", "NeelS", Option("Neel"), "", "", "", "", new Date, Nil, Nil, Nil, None, None, None)
  val stream = Stream(new ObjectId, "Beamstream stream", StreamType.Class, user.id, List(user.id), true, Nil)

  before {
    running(FakeApplication()) {
      UserDAO.remove(MongoDBObject("firstName" -> ".*".r))
      QuestionDAO.remove(MongoDBObject("questionBody" -> ".*".r))
      StreamDAO.remove(MongoDBObject("name" -> ".*".r))
      User.createUser(user)
      Stream.createStream(stream)
    }
  }

  test("Create a Question & remove a Question") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      assert((Question.findQuestionById(questionId.get).get.questionBody) === "How Was the Class ?")
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      assert((Question.findQuestionById(anotherQuestionId.get).get.questionBody) === "How Was the Day ?")
      // Remove A Question
      Question.removeQuestion(anotherQuestion)
      assert((Question.findQuestionById(anotherQuestionId.get) === None))
    }
  }

  test("Get All Questions") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      assert(Question.getAllQuestions(List(anotherQuestionId.get, questionId.get)).size === 2)
    }
  }

  test("Find Question By Id") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      assert(Question.findQuestionById(questionId.get).get.firstNameofQuestionAsker === "Neel")
    }
  }

  test("Rocking The Question And Getting The Rockers") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.Public, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      val result = Question.rockTheQuestion(questionId.get, user.id)
      assert(result === 1)
      assert(Question.rockersNameOfAQuestion(questionId.get) === List("Neel "))
      assert(Question.rockersNameOfAQuestion(questionId.get).size === 1)
      assert(Question.rockTheQuestion(questionId.get, user.id) === 0)
    }
  }

  test("Privacy Of The Question(For A Class , For A School)") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.PrivateToSchool, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      val yetAnotherQuestion = Question(new ObjectId, "How Was the School ?", user.id, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val yetAnotherQuestionId = Question.addQuestion(yetAnotherQuestion)
      assert(Question.getAllPrivateToAClassQuestionForAUser(user.id).size == 2)
      assert(Question.getAllPrivateToASchoolQuestionForAUser(user.id).size == 1)
    }
  }

  test("Delete The Question") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", user.id, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.PrivateToSchool, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      assert(Question.deleteQuestionPermanently(questionId.get, user.id) === true) //User Who Deletes The Question Is Not The Creator Of Question So Not Authorized To delete
      assert(Question.deleteQuestionPermanently(anotherQuestionId.get, user.id) === true) //User Who Deletes The Question Is  The Creator Of Question So  Authorized To delete
    }
  }

  test("Follow The Question") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.PrivateToSchool, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      assert(Question.findQuestionById(questionId.get).head.followers.size === 0)
      Question.followQuestion(user.id, questionId.get)
      assert(Question.findQuestionById(questionId.get).head.followers.size === 1)
      Question.followQuestion(user.id, questionId.get)
      assert(Question.findQuestionById(questionId.get).head.followers.size === 0)
    }
  }

  test("Add Comment To Question") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.PrivateToSchool, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      assert(Question.findQuestionById(questionId.get).head.comments.size === 0)
      val comment = new Comment(new ObjectId, "Comment1", new Date, user.id, user.firstName, user.lastName, 0, List(user.id), stream.id)
      val commentId = Comment.createComment(comment)
      Question.addCommentToQuestion(commentId.get, questionId.get)
      assert(Question.findQuestionById(questionId.get).head.comments.size === 1)
    }
  }

  test("Remove Comments To Question") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.PrivateToSchool, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      assert(Question.findQuestionById(questionId.get).head.comments.size === 0)
      val comment = new Comment(new ObjectId, "Comment1", new Date, user.id, user.firstName, user.lastName, 0, List(user.id), stream.id)
      val commentId = Comment.createComment(comment)
      Question.addCommentToQuestion(commentId.get, questionId.get)
      assert(Question.findQuestionById(questionId.get).head.comments.size === 1)
      Question.removeCommentFromQuestion(commentId.get, questionId.get)
      assert(Question.findQuestionById(questionId.get).head.comments.size === 0)
    }
  }
  
  test("Add Poll To Question") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val anotherQuestion = Question(new ObjectId, "How Was the Day ?", user.id, Access.PrivateToSchool, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val anotherQuestionId = Question.addQuestion(anotherQuestion)
      assert(Question.findQuestionById(questionId.get).head.pollOptions.size === 0)
      val option = OptionOfQuestion(new ObjectId, "Poll1", List(user.id))
      val pollId = OptionOfQuestionDAO.insert(option)
      Question.addPollToQuestion(pollId.get, questionId.get)
      assert(Question.findQuestionById(questionId.get).head.pollOptions.size === 1)
    }
  }
  
  test("Vote A Option Of A Question") {
    running(FakeApplication()) {
      val option = OptionOfQuestion(new ObjectId, "Poll1", Nil)
      val pollId = OptionOfQuestionDAO.insert(option)
      assert(QuestionPolling.findOptionOfAQuestionById(pollId.get).get.voters.size === 0)
      QuestionPolling.voteTheOptionOfAQuestion(pollId.get, user.id)
      assert(QuestionPolling.findOptionOfAQuestionById(pollId.get).get.voters.size === 1)
      QuestionPolling.voteTheOptionOfAQuestion(pollId.get, user.id)
      assert(QuestionPolling.findOptionOfAQuestionById(pollId.get).get.voters.size === 1)
    }
  }
  
  test("Change Access of a Question") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      Question.changeAccess(questionId.get, Access.PrivateToDegree)
      assert(QuestionDAO.findOneById(questionId.get).get.questionAccess === Access.PrivateToDegree)
    }
  }
  
  test("Total Rocks of a Question") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, List(new ObjectId), Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      assert(Question.totalRocks(questionId.get) === 1)
    }
  }
  
  test("Add Answer to Question") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      Question.addAnswerToQuestion(questionId.get, new ObjectId)
      assert(QuestionDAO.findOneById(questionId.get).get.answered === false)
      assert(QuestionDAO.findOneById(questionId.get).get.answers.size === 1)
    }
  }
  
  test("Remove Answer from Question") {
    running(FakeApplication()) {
      val answerId = new ObjectId
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, List(answerId), Nil, Nil, true, None, None)
      val questionId = Question.addQuestion(question)
      Question.removeAnswerFromQuestion(answerId, questionId.get)
      assert(QuestionDAO.findOneById(questionId.get).get.answers.size === 0)
    }
  }
  
  test("Is a Follower") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, Nil, List(user.id), Nil, true, None, None)
      val questionId = Question.addQuestion(question)
      assert(Question.isAFollower(questionId.get, user.id) === true)
      assert(Question.isAFollower(questionId.get, new ObjectId) === false)
    }
  }
  
  test("Is a Rocker") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, List(user.id), Nil, Nil, Nil, Nil, true, None, None)
      val questionId = Question.addQuestion(question)
      assert(Question.isARocker(questionId.get, user.id) === true)
      assert(Question.isARocker(questionId.get, new ObjectId) === false)
    }
  }
  
  test("Find Answers to a Question") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, List(new ObjectId), Nil, Nil, true, None, None)
      val questionId = Question.addQuestion(question)
      assert(Question.answers(questionId.get).size === 1)
      assert(Question.answers(new ObjectId).size === 0)
    }
  }
  
  test("Get Number of Unanswered Questions") {
    running(FakeApplication()) {
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, List(new ObjectId), Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      assert(Question.getNoOfUnansweredQuestions(stream.id) === 1)
    }
  }
  
  test("Delete Answer Permanently") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val question = Question(new ObjectId, "How Was the Class ?", new ObjectId, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, List(new ObjectId), Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val answer = Comment(new ObjectId, "Good", new Date, userId.get, user.firstName, user.lastName, 0, List(userId.get), stream.id)
      val answerId = Comment.createComment(answer)
      assert(Comment.deleteCommentPermanently(answerId.get, questionId.get, userId.get) === true)
      assert(Comment.deleteCommentPermanently(answerId.get, questionId.get, new ObjectId) === false)
    }
  }
  
  test("Return Questions with Polls") {
    running(FakeApplication()) {
      val userId = User.createUser(user)
      val question = Question(new ObjectId, "How Was the Class ?", userId.get, Access.PrivateToClass, Type.Text, stream.id, "Neel", "Sachdeva", new Date, Nil, Nil, List(new ObjectId), Nil, Nil, false, None, None)
      val questionId = Question.addQuestion(question)
      val answer = Comment(new ObjectId, "Good", new Date, userId.get, user.firstName, user.lastName, 0, List(userId.get), stream.id)
      val answerId = Comment.createComment(answer)
      val questionsList = Question.getAllQuestionsForAStreambyKeyword("How", stream.id, 1, 0, Nil)
      assert(Question.returnQuestionsWithPolls(userId.get, questionsList).size === 1)
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
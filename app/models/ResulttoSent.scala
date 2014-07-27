package models

import java.io.InputStream
import com.novus.salat.dao.SalatDAO
import com.novus.salat.annotations._
import org.bson.types.ObjectId
import com.novus.salat.global._
import utils.MongoHQConfig
import com.novus.salat.global.ctx
import models.mongoContext._
/*
 * JSON format for response
 * @purpose :  Success or failure
 */
case class ResulttoSent(status: String,
  message: String)

//Resultant Class Details
case class ClassWithNoOfUsers(usersMap: Map[String, Int],
  classToReturn: Class)

case class OptionOfQuestion(@Key("_id") id: ObjectId,
  name: String,
  voters: List[ObjectId])

case class AvailableUsers(@Key("_id") id: ObjectId, firstName: String, lastName: String, profileImageUrl: String)
case class OnlineUsersResult(onlineUsers: List[Any])

object OptionOfQuestionDAO extends SalatDAO[OptionOfQuestion, ObjectId](collection = MongoHQConfig.mongoDB("optionofquestion"))

/**
 * Question With Polls
 */
case class QuestionWithPoll(question: Question, rocked: Boolean, followed: Boolean, followerOfQuestionPoster: Boolean, profilePic: Option[String] = None, comments: Option[Int] = None, answers: Option[Int] = None, polls: List[OptionOfQuestion])

/**
 * Comment With Profile Picture
 */
case class CommentResult(comment: Comment, var profilePic: Option[String] = None)

/**
 * Document Results After Uploading From Main Stream
 */
case class DocResulttoSent(message: Option[Message], question: Option[Question] = None, docName: String, docDescription: String, rocked: Boolean, followed: Boolean, profilePic: Option[String] = None, comments: Option[Int] = None, followerOfMessagePoster: Option[Boolean] = None, rockersNames: List[String])
/**
 * User & User School details after Registration
 */
case class RegistrationResults(user: User, userSchool: UserSchool)
/**
 * Stream Result
 */

//TODO :Extra
case class StreamResult(stream: Stream, usersOfStream: Int)
case class ClassResult(stream: Stream, resultToSend: ResulttoSent)
case class LoginResult(result: ResulttoSent, user: Option[User], profilePicOfUser: Option[String], hasClasses: Option[Boolean], server: String)
case class MediaResults(images: Option[UserMedia], videos: Option[UserMedia], documents: Option[Document], googleDocs: Option[Document], audioFiles: Option[Document], pdfFiles: Option[Document], pptFiles: Option[Document])
case class Photos(photos: List[UserMedia])
case class Videos(videos: List[UserMedia])
case class Documents(documents: List[Document])
case class DocumentsAndMedia(documents: List[Document], media: List[UserMedia])
case class RegistrationResultToSet(firstName: Option[String], lastName: Option[String], schoolName: Option[String], major: Option[String], gradeLevel: Option[String], degreeProgram: Option[String], graduate: Option[String], location: Option[String], cellNumber: Option[String], aboutYourself: Option[String], username: Option[String], degreeExpected: Option[String], userId: Option[String], associatedSchoolId: Option[String])

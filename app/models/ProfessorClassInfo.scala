package models

import java.text.DateFormat
import java.util.Date
import java.util.regex.Pattern

import org.bson.types.ObjectId

import com.mongodb.casbah.commons.MongoDBObject
import com.novus.salat.dao.SalatDAO
import com.novus.salat.annotations.raw.Key

import actors.UtilityActor
import models.mongoContext.context
import net.liftweb.json.DefaultFormats
import utils.MongoHQConfig

case class ProfessorClassInfo(@Key("_id") id: ObjectId,
  contactEmail: String,
  contactCellNumber: String,
  contactOfficeHours: String,
  contactDays: String,
  classInfo: String,
  Grade: String,
  weekDays:List[String],
  streams: List[ObjectId])

object ProfessorClassInfo {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  implicit val formats = DefaultFormats
}

object Assignments extends Enumeration {
  val Test = Value(0, "test")
  val Quiz = Value(1, "quiz")
  val Assignments = Value(2, "assignments")
}

object ProfessorClassInfoDAO extends SalatDAO[Class, ObjectId](collection = MongoHQConfig.mongoDB("professorclassinfo"))

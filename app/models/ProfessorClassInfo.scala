package models

import java.text.DateFormat
import java.util.Date
import java.util.regex.Pattern
import org.bson.types.ObjectId
import com.mongodb.casbah.commons.MongoDBObject
import com.mongodb.casbah.Imports._
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
  grade: String,
  studyResource:List[String],
  test: List[String],
  attendance:String)

object ProfessorClassInfo {

  val formatter: DateFormat = new java.text.SimpleDateFormat("dd-MM-yyyy")
  implicit val formats = DefaultFormats

   /**
   * Create Professor class Info 
   */
  def createProfessorClass(classCreated: ProfessorClassInfo): ObjectId = {
    val professorClassInfoId = ProfessorClassInfoDAO.insert(classCreated)
    professorClassInfoId.get
  }
  
  /**
   * Attach a professorclassinfoId to a Class 
   */
  def attachProfessorClassIdToClass(professorclassinfoId: ObjectId, classId: ObjectId) {
    val expectedClass = ClassDAO.find(MongoDBObject("_id" -> classId)).toList(0)
    //ProfessorClassInfoDAO.update(MongoDBObject("_id" -> classId), expectedClass.copy(professorClassInfoId = List(professorclassinfoId)), false, false, new WriteConcern)
  }
}

object AssignmentType extends Enumeration {
  val Test = Value(0, "test")
  val Quiz = Value(1, "quiz")
  val Assignments = Value(2, "assignments")
}

object ProfessorClassInfoDAO extends SalatDAO[ProfessorClassInfo, ObjectId](collection = MongoHQConfig.mongoDB("professorclassinfo"))

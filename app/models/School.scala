package models
import com.novus.salat.dao.SalatDAO
import com.novus.salat.annotations.Key
import com.novus.salat.global._
import org.bson.types.ObjectId
import utils.MongoHQConfig
import com.mongodb.casbah.commons.MongoDBObject

case class School(@Key("_id") id: ObjectId, schoolName: String)

object School {
  
  /*
   * Add New School
   */

  def addNewSchool(school: School): ObjectId = {
    val schoolId = SchoolDAO.insert(school)
    schoolId.get
  }
  
  /*
   * Get All School for autopopulate school screen
   */

  def getAllSchools : List[School] ={
    SchoolDAO.find(MongoDBObject()).toList
  }
  
}

object SchoolDAO extends SalatDAO[School, ObjectId](collection = MongoHQConfig.mongoDB("school"))
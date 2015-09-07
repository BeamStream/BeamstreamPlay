package models

import org.bson.types.ObjectId
import com.mongodb.casbah.Imports.MongoDBObject
import com.mongodb.casbah.Imports.WriteConcern
import com.novus.salat.dao.SalatDAO
import com.novus.salat.annotations.raw.Key
import utils.MongoHQConfig
import models.mongoContext._

case class SystemCode(@Key("_id") id: ObjectId,
  code: String,
  status: Boolean)

object SystemCode {
  /**
   * Create a System Code
   */
  def createSystemCode(systemCode: SystemCode): Option[ObjectId] = SystemCodeDAO.insert(systemCode)
  
  /**
   * Get all system code
   */
  def findAll:List[SystemCode] = SystemCodeDAO.find(MongoDBObject.empty).toList
  
  /**
   * Get all system code
   */
  def finOneById(id : ObjectId):Option[SystemCode] = SystemCodeDAO.findOneById(id)
  
  /**
   * update the code system
   */
  def update(id : ObjectId, status : Boolean):Unit = {
    val obj = finOneById(id).get
    val updateObj = MongoDBObject("_id" -> id ,"code" -> obj.code, "status" -> status )
    SystemCodeDAO.update(MongoDBObject("_id" -> id),updateObj, false, false, new WriteConcern)
  }
  
  /**
   * Remove system code
   */
  def removeById(id : ObjectId):Unit = SystemCodeDAO.removeById(id)
}
 
object SystemCodeDAO extends SalatDAO[SystemCode, ObjectId](collection = MongoHQConfig.mongoDB("system_code"))

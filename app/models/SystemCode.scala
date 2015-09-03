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
  def createSystemCode(systemCode: SystemCode): Option[ObjectId] = {
    SystemCodeDAO.insert(systemCode)
  }
  
 
}

object SystemCodeDAO extends SalatDAO[SystemCode, ObjectId](collection = MongoHQConfig.mongoDB("system_code"))

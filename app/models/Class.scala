package models

import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection

case class Class(@Key("_id") id: Int, classCode: Int, className: String)
object Class {

  def createClass(myclass: Class) {
    ClassDAO.insert(myclass)
  }

  def deleteClass(myclass: Class) {
    ClassDAO.remove(myclass)
  }
}

object ClassDAO extends SalatDAO[Class, Int](collection = MongoConnection()("beamstream")("class"))
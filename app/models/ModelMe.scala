package models
import org.joda.time.DateTime
import com.novus.salat._
import com.novus.salat.global._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import com.mongodb.casbah.MongoConnection
import com.mongodb.casbah.commons.conversions.scala._

case class ModelMe(@Key("_id") id: Int, name: String, date: DateTime)

object ModelMe {
  RegisterConversionHelpers
  RegisterJodaTimeConversionHelpers
  def createModel(mymodel: ModelMe) {
    ModelDAO.insert(mymodel)
  }
}

object ModelDAO extends SalatDAO[ModelMe, Int](collection = MongoConnection()("mydb")("model"))

object TesModel extends App {
  ModelMe.createModel(new ModelMe(12, "", DateTime.now))
}
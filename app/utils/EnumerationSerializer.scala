package utils
import net.liftweb.json.JsonDSL
import net.liftweb.json.MappingException
import net.liftweb.json.TypeInfo
import net.liftweb.json.Formats
import net.liftweb.json.JsonAST.JString
import net.liftweb.json.Serialization
import net.liftweb.json.JsonAST.JValue
import net.liftweb.json.NoTypeHints
import net.liftweb.json.CustomSerializer
import net.liftweb.json.JsonAST.JObject
import org.bson.types.ObjectId
import net.liftweb.json.JsonAST.JField
import net.liftweb.json.Serializer
import net.liftweb.json.JsonAST.JInt
import models.Degree
import models.Year
import net.liftweb.json.TypeInfo
import java.text.DateFormat
import java.util.Date
import models.DegreeExpected


/*
 * Enumeration Serialization
 */
class EnumerationSerializer(enumList: List[Enumeration]) extends net.liftweb.json.Serializer[Enumeration#Value] {
  import JsonDSL._
  val EnumerationClass = classOf[Enumeration#Value]
  val formats = Serialization.formats(NoTypeHints)

  def deserialize(implicit format: Formats): PartialFunction[(TypeInfo, JValue), Enumeration#Value] = {
    case (TypeInfo(EnumerationClass, _), json) => json match {
      case JObject(List(JField(name, JString(value)))) => fetchEnumValue(enumList, value)
      case JString(value) => fetchEnumValue(enumList, value)
      case value => throw new MappingException("Can't convert " +
        value + " to " + EnumerationClass)
    }
  }

  def serialize(implicit format: Formats): PartialFunction[Any, JValue] = {
    case i: Enumeration#Value => i.toString
  }

  private def fetchEnumValue(enumList: List[Enumeration], value: String): Enumeration#Value = {
    var defaultEnumValue: Enumeration#Value = DegreeExpected.withName("Winter 2013")
    for (enumItem <- enumList) {
      for (enumValue <- enumItem.values) {
        enumValue.toString == value match {
          case true => {
            println("Enum is [" + enumItem + "] and value is [" + value + "]")
            defaultEnumValue = enumItem.withName(value)
            println("And it works .......")
          }
          case _ => None
        }
      }
    }
    defaultEnumValue
  }

}


/*
 * ObjectId Serialization
 */

class ObjectIdSerializer extends Serializer[ObjectId] {
  private val Class = classOf[ObjectId]

  def deserialize(implicit format: Formats) = {
    case (TypeInfo(Class, _), json) => json match {
      case JInt(s) =>  new ObjectId
      case JString(s) =>  new ObjectId(s)
      case x => throw new MappingException("Can't convert " + x + " to ObjectId")
    }
  }

  def serialize(implicit format: Formats) = {
    case x: ObjectId => JObject(JField("schoolId", JString(x.toString)) :: Nil)
  }
}


/*
 * Date Time serialization
 */

object DateTimeSerializer extends Serializer[Option[Date]] {
  
  val formatter: DateFormat = new java.text.SimpleDateFormat("dd/MM/yyyy")
  println("Datetime serializer invoked ....")

  
  private val MyDateClass = classOf[Option[Date]]

  def deserialize(implicit format: Formats): PartialFunction[(TypeInfo, JValue), Option[Date]] = {
    case (TypeInfo(MyDateClass, _), json) => json match {
      case JString(s) => {
        println("sads$$$$$" + formatter.parse(s) + "")
        Option(formatter.parse(s))
      }

      case x => throw new MappingException("Can't convert " + x + " to Date")
    }
    case _ => println("Getting to this case and hence it is an error!"); Option(new Date)
  }

  def serialize(implicit format: Formats): PartialFunction[Any, JValue] = {
    case x: Date => JObject(JField("graduationDate", JString(x.toString)) :: Nil)
  }
}
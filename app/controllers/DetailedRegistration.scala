package controllers

import java.text.SimpleDateFormat

import org.bson.types.ObjectId

import models.Degree
import models.DegreeExpected
import models.DetailedRegForm
import models.Graduated
import models.School
import models.User
import models.Year
import play.api.data.Forms.mapping
import play.api.data.Forms.nonEmptyText
import play.api.data.Form
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.EnumerationSerializer
import utils.ObjectIdSerializer

object DetailedRegistration extends Controller {

  val cc: List[Enumeration] = List(Year, Degree, DegreeExpected, Graduated)

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("dd/MM/yyyy")
  } + new EnumerationSerializer(cc) + new ObjectIdSerializer

  //implicit val formats = Serialization.formats(NoTypeHints) + net.liftweb.json.DefaultFormats +  new EnumerationSerializer(cc) + new ObjectIdSerializer 

  /*
   * Map the field values from html
   */

  val detailed_regForm = Form(
    mapping(
      "schoolName" -> nonEmptyText)(DetailedRegForm.apply)(DetailedRegForm.unapply))

  def users = Action {
    Ok(views.html.detailed_reg(detailed_regForm))
  }

  /*
   * Sends the field values & profile related info to User Model for adding the info of a User
   */

  def addInfo = Action { implicit request =>

    val schoolListJsonMap = request.body.asFormUrlEncoded.get
    val schoolListJson = schoolListJsonMap("data").toList
    println("Here's the JSON String extracted" + schoolListJson(0))
    val schoolList = net.liftweb.json.parse(schoolListJson(0)).extract[List[School]]
    println("My School List is " + schoolList)

    User.addInfo(schoolList, new ObjectId("4fb4838e84aec6fb74569f9d"))

    School.createSchool(schoolList)

    Ok
  }
}
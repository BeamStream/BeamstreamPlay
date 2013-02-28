package controllers

import java.text.SimpleDateFormat
import org.bson.types.ObjectId
import models.Degree
import models.DegreeExpected
import models.Graduated
import models.UserSchool
import models.User
import models.Year
import play.api.data.Forms.mapping
import play.api.data.Forms.nonEmptyText
import play.api.data.Form
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.EnumerationSerializer
import utils.ObjectIdSerializer
import net.liftweb.json.{ parse, DefaultFormats }
import net.liftweb.json.Serialization.{ read, write }
import models.ResulttoSent


object DetailedRegistration extends Controller {

  val EnumList: List[Enumeration] = List(Year, Degree, DegreeExpected, Graduated)

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter = new SimpleDateFormat("dd/MM/yyyy")
  } + new EnumerationSerializer(EnumList) + new ObjectIdSerializer

  /**
   * Sends the field values & profile related info to User Model for adding the info of a User
   * @Purpose :-
   * - Will Create the School & Edit the School as well
   * 
   * - Create the school from class stream page 
   */

//  def addInfo = Action { implicit request =>
//    val schoolListJsonMap = request.body.asFormUrlEncoded.get
//    val schoolListJson = schoolListJsonMap("data").toList
//    val schoolList = net.liftweb.json.parse(schoolListJson(0)).extract[List[UserSchool]]
//    val resultObtained = UserSchool.createSchool(schoolList, new ObjectId(request.session.get("userId").get))
//
//    if (resultObtained.status == "Success") {
//      User.addInfo(schoolList, new ObjectId(request.session.get("userId").get))
//      Ok(write(schoolList)).as("application/json")
//    } else {
//      Ok(write(resultObtained)).as("application/json")
//    }
//  }

//  /**
//   * Returns the Schools with their respective school Ids (Tag : Dup)
//   */
//
//  def getSchoolsForLoggedInUser = Action { implicit request =>
//    val schoolIdList = UserSchool.getAllSchoolforAUser(new ObjectId(request.session.get("userId").get))
//    val finalSchooList = UserSchool.getAllSchools(schoolIdList)
//    val schoolListJSON = write(finalSchooList)
//    Ok(schoolListJSON).as("application/json")
//  }

}
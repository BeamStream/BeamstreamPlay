package controllers

import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import org.bson.types.ObjectId
import models.Document
import models.Access
import models.Files
import models.MediaResults
import models.Photos
import models.ResulttoSent
import models.UserMedia
import models.UserMediaType
import models.Videos
import net.liftweb.json.Serialization.write
import play.api.mvc.Action
import play.api.mvc.Controller
import utils.AmazonUpload
import utils.ExtractFrameFromVideoUtil
import utils.ObjectIdSerializer
import utils.TokenEmailUtil
import models.User
import play.api.mvc.Cookie
import models.Token
import play.api.Play
import play.api.mvc.AnyContent
import play.api.mvc.DiscardingCookie
import utils.RotateImageUtil
//import com.beamstream.exifRotate.ExifRotate

object MediaController extends Controller {

  implicit val formats = new net.liftweb.json.DefaultFormats {
    override def dateFormatter: SimpleDateFormat = new SimpleDateFormat("MM/dd/yyyy")
  } + new ObjectIdSerializer


  /**
   * Get All Photos for a user
   *
   */
  def getAllPicsForAUser: Action[AnyContent] = Action { implicit request =>
    val allProfileMediaForAUser = UserMedia.getAllPicsForAUser(new ObjectId(request.session.get("userId").get))
    Ok(write(Photos(allProfileMediaForAUser))).as("application/json")
  }

  /**
   * Get All Video for a user for a user
   * @Purpose : Show all Video For A User
   */
  def allVideosForAuser: Action[AnyContent] = Action { implicit request =>
    val allProfileMediaForAUser = UserMedia.allVideosForAuser(new ObjectId(request.session.get("userId").get))
    Ok(write(Videos(allProfileMediaForAUser))).as("application/json")
  }

  /**
   * Rock the UserMedia (Modified)
   *
   */
  def rockTheUsermedia(mediaId: String): Action[AnyContent] = Action { implicit request =>
    val totalRocks = UserMedia.rockUserMedia(new ObjectId(mediaId), new ObjectId(request.session.get("userId").get))
    Ok(write(totalRocks.toString)).as("application/json")
  }

  /**
   * Rockers of a document
   */
  def giveMeRockersOfUserMedia(mediaId: String): Action[AnyContent] = Action { implicit request =>
    val rockers = UserMedia.rockersNamesOfUserMedia(new ObjectId(mediaId))
    val rockersJson = write(rockers)
    Ok(rockersJson).as("application/json")
  }
  
  /**
   * ***********************************************************REARCHITECTED CODE****************************************************************
   */

  /**
   * Upload Profile photo to Amazon (V)
   */
  def uploadMediaToAmazon: Action[play.api.mvc.MultipartFormData[play.api.libs.Files.TemporaryFile]] = Action(parse.multipartFormData) { implicit request =>

    val media = request.body.file("profileData").map { profileData =>
      val Filename = profileData.filename
      val contentType = profileData.contentType.get
      val uniqueString = TokenEmailUtil.securityToken
      val FileObtained: File = profileData.ref.file.asInstanceOf[File]
      //RotateImageUtil.rotatingImage(FileObtained)
      val fileNameOnAmazon = uniqueString + Filename.replaceAll("\\s", "") // Security Over the images files
      
      (new AmazonUpload).uploadProfilePicToAmazon(fileNameOnAmazon, FileObtained)
      (contentType.contains("image")) match {
        case true =>
          val imageURL = "https://s3.amazonaws.com/BeamStream/" + fileNameOnAmazon

          UserMedia(new ObjectId, Filename, "", new ObjectId(request.session.get("userId").get), new Date, imageURL,
            UserMediaType.Image, Access.Public, true, None, "", 0, Nil, Nil, 0)

        case false =>
          val videoURL = "https://s3.amazonaws.com/BeamStream/" + fileNameOnAmazon
          val frameOfVideo = ExtractFrameFromVideoUtil.extractFrameFromVideo(videoURL)
          (new AmazonUpload).uploadCompressedFileToAmazon(fileNameOnAmazon + "Frame", frameOfVideo)
          val frameURL = "https://s3.amazonaws.com/BeamStream/" + fileNameOnAmazon + "Frame"
          UserMedia(new ObjectId, Filename, "", new ObjectId(request.session.get("userId").get), new Date, videoURL,
            UserMediaType.Image, Access.Public, true, None, frameURL, 0, Nil, Nil, 0)
      }
    }.get

    UserMedia.saveMediaForUser(media)
    Ok(write(media)).as("application/json")

  }

  /**
   * obtaining the profile Picture
   * @ Purpose: fetches the recent profile picture for a user
   */

  def getProfilePicForAUser(userId: String): Action[AnyContent] = Action { implicit request =>
    val mediaObtained = UserMedia.getProfilePicForAUser(new ObjectId(userId))
    if (!mediaObtained.size.equals(0)) {
      val MediaJson = write(mediaObtained.last)
      Ok(MediaJson).as("application/json")
    } else {
      Ok(write(ResulttoSent("Failure", "No picture found for this user")))
    }
  }

  /**
   * Render Browse Media Page
   */
  def browseMedia: Action[AnyContent] = Action { implicit request =>
    (request.session.get("userId")) match {
      case Some(userId) =>
        val userFound = User.getUserProfile(new ObjectId(userId))
        userFound match {
          case Some(user) =>
            user.classes.isEmpty match {
              case true => Redirect("/class").withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000))) //Ok(views.html.classpage())
              case false => Ok(views.html.browsemedia()).withCookies(Cookie("Beamstream", userId.toString() + " browsemedia", Option(864000)))
            }
          case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
        }
      case None =>
        request.cookies.get("Beamstream") match {
          case None => Redirect("/login")
          case Some(cookie) =>
            val userId = cookie.value.split(" ")(0)
            val userFound = User.getUserProfile(new ObjectId(userId))
            cookie.value.split(" ")(1) match {
              case "class" => Redirect("/class").withSession("userId" -> userId)
                .withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000)))
              case "stream" => Redirect("/stream").withSession("userId" -> userId)
                .withCookies(Cookie("Beamstream", userId.toString() + " stream", Option(864000)))
              case "registration" =>
                val tokenFound = Token.findTokenByUserId(userId)
                userFound match {
                  case Some(user) =>
                    val server = Play.current.configuration.getString("server").get
                    user.firstName match {
                      case "" => Redirect(server + "/registration?userId=" + userId + "&token=" + tokenFound(0).tokenString)
                        .withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                      case _ =>
                        val userMedia = UserMedia.findUserMediaByUserId(new ObjectId(userId))
                        userMedia.isEmpty match {
                          case true => Redirect(server + "/registration?userId=" + userId + "&token=" + tokenFound(0).tokenString)
                            .withCookies(Cookie("Beamstream", userId.toString() + " registration", Option(864000)))
                          case false => Redirect("/class").withSession("userId" -> userId)
                            .withCookies(Cookie("Beamstream", userId.toString() + " class", Option(864000)))
                        }
                    }
                  case None => Redirect("/login").withNewSession.discardingCookies(DiscardingCookie("Beamstream"))
                }
              case _ => Redirect("/" + cookie.value.split(" ")(1)).withSession("userId" -> userId)
                .withCookies(Cookie("Beamstream", userId.toString() + " " + cookie.value.split(" ")(1), Option(864000)))
            }
        }
    }
    /*OnlineUserCache.returnOnlineUsers.isEmpty match {
      case false => OnlineUserCache.returnOnlineUsers(0).onlineUsers.isEmpty match {
        case true =>
          Ok(views.html.login())
        case false =>
          Ok(views.html.browsemedia())
      }
      case true =>
        Ok(views.html.browsemedia())
    }
*/ }

  /**
   * Get Recent Media
   */
  def getRecentMediaAndDocs: Action[AnyContent] = Action { implicit request =>
    val recentImage = UserMedia.recentProfilePicForAUser(new ObjectId(request.session.get("userId").get))
    val recentVideo = UserMedia.recentProfileVideoForAUser(new ObjectId(request.session.get("userId").get))

    val recentDocs = Files.getAllDOCSFiles(new ObjectId(request.session.get("userId").get))
    val recentDoc = recentDocs.isEmpty match {
      case false =>
        Option(recentDocs.head)
      case true => None
    }
    val recentGoogleDoc = Document.recentGoogleDocsForAUser(new ObjectId(request.session.get("userId").get))

    val recentPPTs = Files.getAllPPTFiles(new ObjectId(request.session.get("userId").get))
    val recentPPT = recentPPTs.isEmpty match {
      case false =>
        Option(recentPPTs.head)
      case true => None
    }

    val recentPDFs = Files.getAllPDFFiles(new ObjectId(request.session.get("userId").get))
    val recentPDF = recentPDFs.isEmpty match {
      case false => Option(recentPDFs.head)
      case true => None
    }

    val recentAudios = Files.getAllAudioFiles(new ObjectId(request.session.get("userId").get))
    val recentAudio = recentAudios.isEmpty match {
      case false => Option(recentAudios.head)
      case true => None
    }
    recentImage match {
      case None => Ok(write(List(MediaResults(recentImage, recentVideo, recentDoc, recentGoogleDoc, recentAudio, recentPDF, recentPPT)))).as("application/json")
      case Some(recentImageExists) =>
        recentImageExists.mediaUrl match {
          case "" => Ok(write(List(MediaResults(None, recentVideo, recentDoc, recentGoogleDoc, recentAudio, recentPDF, recentPPT))))
            .as("application/json")
          case _ => Ok(write(List(MediaResults(recentImage, recentVideo, recentDoc, recentGoogleDoc, recentAudio, recentPDF, recentPPT))))
            .as("application/json")
        }
    }
  }
  /**
   * Search media and documents
   */
  // TODO Change the response format as required by UI team
  def searchMediaOrDocumentForAUser(keyword: String): Action[AnyContent] = Action { implicit request =>
    val userMediaForAUserByThisKeyword = UserMedia.searchMediaForAUserByName(new ObjectId(request.session.get("userId").get), keyword)
    val documentsForAUserByThisKeyword = Document.searchDocumentForAUserByName(new ObjectId(request.session.get("userId").get), keyword)
    Ok(write(userMediaForAUserByThisKeyword ++ documentsForAUserByThisKeyword)).as("application/json")
  }

  def uploadDefaultMedia: Action[AnyContent] = Action { implicit request =>

    val media = UserMedia(new ObjectId, "", "", new ObjectId(request.session.get("userId").get), new Date, "",
      UserMediaType.Image, Access.Public, true, None, "", 0, Nil, Nil, 0)
    UserMedia.saveMediaForUser(media)
    Ok(write(media)).as("application/json")

  }
}

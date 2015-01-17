package controllers

import play.api.mvc._

import utils.LinkPreview

object LinkPreviewController extends Controller{

  def linkPreview: Action[AnyContent] = Action { implicit request =>
    val longUrlMap = request.body.asFormUrlEncoded.get
    val longUrl = longUrlMap("link").toList(0).toString
    val content = LinkPreview.getRestContent(longUrl)
    Ok(content).as("application/json")
  }
}
package controllers

import play.api.mvc._

import utils.LinkPreview

object LinkPreviewController extends Controller{

  def linkPreview = Action {
    println("zdmgsozidr")
    val content = LinkPreview.getRestContent("http://www.knoldus.com")
    println(content)
    Ok(content).as("application/json")
  }
}
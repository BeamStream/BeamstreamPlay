package controllers

import play.api.mvc._

object Overview extends Controller {

  def index = Action {
    Ok(views.html.overview.overview("Overview Page."))
  }
    
}



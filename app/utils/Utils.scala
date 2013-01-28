package utils

object Utils {

    
    // TODO Visitors Pattern approach (Written For Comment Controller)
    
/**
 *      val consumers: List[CommentConsumer] = List(Message, Document)
        val messageId = commentJson("messageId").toList(0)
        val commentText = commentJson("comment").toList(0)
        val commentPoster = User.getUserProfile(new ObjectId(request.session.get("userId").get))
        val comment = new Comment(new ObjectId, commentText, new Date, new ObjectId(request.session.get("userId").get),
          commentPoster.firstName, commentPoster.lastName, 0, List())
        val commentId = Comment.createComment(comment)
        consumers.map(_.addComment(new ObjectId(messageId), commentId))
        Ok(write(List(comment))).as("application/json")
 */
        
  //TODO MongoDB approach for file saving in GRIDFS (We can use if require )
  
  /**   
 //Original Method
  def getMedia = Action(parse.multipartFormData) { request =>

    val mediaJsonMap = request.body.asFormUrlEncoded.toMap
    val imageStatus = mediaJsonMap("imageStatus").toList(0).toBoolean
    val videoStatus = mediaJsonMap("videoStatus").toList(0).toBoolean

    (request.body.file("imageData").isEmpty) match {

      case true => // No Image Found
      case false =>
        // Fetch the image stream and details
        request.body.file("imageData").map { imageData =>
          val imageAuthenticationToken = tokenEmail.securityToken
          val imageFilename = imageData.filename
          val contentType = imageData.contentType.get
          val uniqueString = tokenEmail.securityToken
          val imageFileObtained: File = imageData.ref.file.asInstanceOf[File]
          val imageNameOnAmazon = uniqueString + imageFilename.replaceAll("\\s", "") // Security Over the images files
          val imageFileInputStream = CompressFile.compressImage(imageFileObtained, imageNameOnAmazon, 0.1f)
          //AmazonUpload.uploadFileToAmazon(imageNameOnAmazon, imageFileObtained)
          AmazonUpload.uploadCompressedFileToAmazon(imageNameOnAmazon, imageFileInputStream)
          val imageURL = "https://s3.amazonaws.com/BeamStream/" + imageNameOnAmazon
          val media = new UserMedia(new ObjectId, new ObjectId(request.session.get("userId").get), imageURL, UserMediaType.Image, imageStatus, "",0,List())
          UserMedia.saveMediaForUser(media)
          ProfileImageProviderCache.setImage(media.userId.toString, media.mediaUrl)
          // For MongoDB
          /*
      val profileImage: File = imageData.ref.file.asInstanceOf[File]
      val profileImageInputStream = new FileInputStream(profileImage)
      new mediaComposite(imageFilename, contentType.get, profileImageInputStream)
      */
        }.get

    }

    (request.body.file("videoData").isEmpty) match {
      case true => // No Video Found
      case false =>
        // Fetch the video stream and details
        request.body.file("videoData").map { videoData =>
          val videoAuthenticationToken = tokenEmail.securityToken
          val videoFilename = videoData.filename
          val contentType = videoData.contentType.get
          val uniqueString = tokenEmail.securityToken
          val videoFileObtained: File = videoData.ref.file.asInstanceOf[File]
          val videoFileNameOnnAmazon = uniqueString + videoFilename.replaceAll("\\s", "") // Security Over the videos files
          println(videoFileNameOnnAmazon)
          AmazonUpload.uploadFileToAmazon(videoFileNameOnnAmazon, videoFileObtained)
          val videoURL = "https://s3.amazonaws.com/BeamStream/" + videoFileNameOnnAmazon

          val frameOfVideo = ExtractFrameFromVideo.extractFrameFromVideo(videoURL)
          AmazonUpload.uploadCompressedFileToAmazon(videoFileNameOnnAmazon + "Frame", frameOfVideo)
          val videoFrameURL = "https://s3.amazonaws.com/BeamStream/" + videoFileNameOnnAmazon + "Frame"

          val media = new UserMedia(new ObjectId, new ObjectId(request.session.get("userId").get), videoURL, UserMediaType.Video, videoStatus, videoFrameURL,0,List())
          UserMedia.saveMediaForUser(media)
          /*
      val profileVideo: File = videoData.ref.file.asInstanceOf[File]
      val profileVideoInputStream = new FileInputStream(profileVideo)
      new mediaComposite(videoFilename, contentType.get, profileVideoInputStream)
    */
        }.get
    }

    /*
    val mediaTransfrerObject = new MediaTransfer(new ObjectId(request.session.get("userId").get), MediaType.Image, true,
    imageComposite.inputStream, imageComposite.name, videoComposite.inputStream, videoComposite.name, mobileNo, uploadType)
    Profile.createMedia(mediaTransfrerObject)
    */

    Ok(write(new ResulttoSent("Success", "Profile Photo Uploaded Successfully"))).as("application/json")
  }
 */
  
  //TODO Cookie management via play
        /**
         *   if(rememberMe==true) Ok(statusToSend).as("application/json").withCookies(Cookie("userName",user.email),Cookie("password",user.password)).withSession(userSession)
                else  Ok(statusToSend).as("application/json").withSession(userSession)
         */
}
package utils

import java.io.File
import java.util.Arrays
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson.JacksonFactory
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse
import com.google.api.client.auth.oauth2.Credential
import java.io.IOException
import com.google.api.services.oauth2.Oauth2

object GoogleDriveAuth {

  val REDIRECT_URI = "http://localhost:9000/driveAuth";
  val SCOPES = Arrays.asList(
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile")
  var flow: GoogleAuthorizationCodeFlow = null
  
  
  

  /**
   * Build an authorization flow and store it as a static class attribute.
   *
   * @return GoogleAuthorizationCodeFlow instance.
   * @throws IOException Unable to load client_secrets.json.
   */
  def getFlow: GoogleAuthorizationCodeFlow = {
    if (flow == null) {
      val httpTransport = new NetHttpTransport();
      val jsonFactory = new JacksonFactory();
      val clientSecrets =
        GoogleClientSecrets.load(jsonFactory,
          GoogleDriveAuth.getClass().getResourceAsStream("/home/neelkanth/Desktop/client_secrets.json"));
      flow =
        new GoogleAuthorizationCodeFlow.Builder(httpTransport, jsonFactory, clientSecrets, SCOPES)
          .setAccessType("offline").setApprovalPrompt("force").build();
    }
    flow
  }

  /**
   * Exchange an authorization code for OAuth 2.0 credentials.
   *
   * @param authorizationCode Authorization code to exchange for OAuth 2.0
   *        credentials.
   * @return OAuth 2.0 credentials.
   * @throws CodeExchangeException An error occurred.
   */
  def exchangeCode(authorizationCode: String): Credential = {
    val flow = getFlow
    val response =
    flow.newTokenRequest(authorizationCode).setRedirectUri(REDIRECT_URI).execute();
    
    flow.createAndStoreCredential(response, null);
  }

  /**
   * Send a request to the UserInfo API to retrieve the user's information.
   *
   * @param credentials OAuth 2.0 credentials to authorize the request.
   * @return User's information.
   * @throws NoUserIdException An error occurred.
   */
  def getUserInfo(credentials: Credential) {
    val userInfoService = new Oauth2.Builder(new NetHttpTransport(), new JacksonFactory(), credentials).build();
    userInfoService.userinfo().get().execute();
  }
  
  
  
  

  

}
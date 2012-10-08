package utils
import java.security.SecureRandom
import java.security.MessageDigest
import java.util.UUID

object tokenEmail {

  def generateToken: String = {
    val secureRandom = SecureRandom.getInstance("SHA1PRNG");
    val digest = MessageDigest.getInstance("SHA-256");
    secureRandom.setSeed(secureRandom.generateSeed(128))
    new String(digest.digest((secureRandom.nextLong() + "").getBytes()))
  }

  def securityToken: String = {

    val uuid = UUID.randomUUID();
    val randomUUIDString = uuid.toString();
    randomUUIDString
  }
 
}

//Try




  
   
  

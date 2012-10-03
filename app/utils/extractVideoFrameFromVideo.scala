package utils
import com.xuggle.xuggler.Global


object extractVideoFrameFromVideo {

  val SECONDS_BETWEEN_FRAMES=1000
  val inputVideoFile=""
  val extractedImagePath=""
    
val mVideoStreamIndex = -1;

	// Time of last frame write
	val mLastPtsWrite = Global.NO_PTS;

	val MICRO_SECONDS_BETWEEN_FRAMES : Long =  (Global.DEFAULT_PTS_PER_SECOND * SECONDS_BETWEEN_FRAMES);
  
}
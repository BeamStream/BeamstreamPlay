<li>
  <div class="field">
    <input type="text" class="dropdowntext" id="gdoc-url" data-name="file.docURL" name="docURL"placeholder="http://www.PasteGDocURLHere.com">
  </div>
  <div class="field">
    <input  type="text" class="dropdowntext-small quest-search" id="gdoc-name" data-name="file.docName" name="docName" placeholder="NAME of Doc">
  </div>
</li>
<li>
  <div class="field">
    <input type="text" class="dropdowntext" id="gdoc-description" data-name="file.docDescription" name="docDescription" placeholder="DESCRIPTION of Doc">
  </div>
  <select id="doc-category-list" class="dropdownselect">
    <option>Class Doc</option>
    <option>Class Notes</option>
    <option>Reference Material</option>
    <option>Tutorial</option>
    <option>Presentation</option>
    <option>Project Doc</option>
    <option>Lecture</option>
    <option class="enterfromcatgry">Enter New Catagory</option>
  </select>
</li>
<li>
  <input type="text" class="dropdowntext" placeholder="TAGS, Seperated by Commas">
  <i class="icon-middle-tag tag-place-dromenu"></i>
   <div class="field">
    <select class="dropdownselect " id="doc-class-list" >
      
    </select>
  </div>
</li>
<li class="private">
  <label  style="color:black;" for="google-doc-access">
  <input  id="doc-private" type="checkbox" checked="checked">
  Private
  </label>
</li>
<li>
  <input type="button" class="upload_button" id="gdoc_uploadbutton"> <span calss="msg"> </span></li>   
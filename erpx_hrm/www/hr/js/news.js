$(function () {
    "use strict";

    // TinyMCE Editor
   var news_editor;

   tinymce.init({
      selector: '#news-editor'
   }).then(function (ret) {
       news_editor = ret;
   });
});
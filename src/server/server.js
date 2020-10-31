var ComfyJS = require("comfy.js");
ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  if( flags.broadcaster && command === "test" ) {
    console.log( "!test was typed in chat" );
  }
}
ComfyJS.Init( "clarkio" );

module.exports = {
  execute(msg){
    let text = msg.content.toLowerCase();
    if(text.includes('dos')){
      msg.react('621197617832919070');
    }
    if(text.includes('department of suggestions')){
      msg.react('621197617832919070');
    }
    if(text.includes('test')){
      msg.react('615403161905135626');
    }
  }
}

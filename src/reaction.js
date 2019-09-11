module.exports = {
  execute(msg){
    let text = msg.content.toLowerCase();
    if(text.includes('DOS')){
      msg.react('478450256418308097');
    }
    if(text.includes('Department of Suggestions')){
      msg.react('478450256418308097');
    }
    if(text.includes('test')){
      msg.react('615403161905135626');
    }
  }
}

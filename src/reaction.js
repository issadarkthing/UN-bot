module.exports = {
  execute(msg){
    return;
    let text = msg.content.toLowerCase();
    if(text.includes('dos')){
      msg.react('478450256418308097');
    }
    if(text.includes('department of suggestions')){
      msg.react('478450256418308097');
    }
  }
}

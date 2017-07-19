import Ember from 'ember';

export default Ember.Component.extend({
  showCommand: function(){
    var command=this.get('model.command')
    if(!command){
      return ''
    }
    return command.map(ele=>ele.value).join(';')
  }.property('model.command')
});

import Ember from 'ember';

export default Ember.Component.extend({
  commandGhost: null,
  init: function(){
    this._super();
  },
  actions: {
    addCommand: function(){
      this.get('selectedModel.command').pushObject({
        value: ''
      });
    },
    removeCommand: function(index){
      this.get('selectedModel.command').removeAt(index);
    }
  }
});

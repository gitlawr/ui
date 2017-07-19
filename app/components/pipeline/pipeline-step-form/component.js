import Ember from 'ember';

export default Ember.Component.extend({
  selectedModel: null,
  init(){
    this._super(...arguments);
    var selectedModel = this.get('model')[this.get('type')];
    this.set('selectedModel',selectedModel);
  },
  whenTypeChange: function(){
    var type = this.get('type');
    var selectedModel = this.get('selectedModel');
    this.get('model').set(selectedModel.type, selectedModel);
    // Arrange it to next lifecycle.
    setTimeout(()=>{
      this.set('selectedModel', this.get('model')[type]);
    },0)
  }.observes('type'),
  actions: {
    changeSCMType: function(type){
      this.set('selectedModel.sourceType',type);
    }
  }
});

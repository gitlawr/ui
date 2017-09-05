import Ember from 'ember';

export default Ember.Component.extend({
  isShellObserves: function(){
    var isService = this.get('selectedModel.isService');
    if(isService){
      this.set('selectedModel.isShell',false);
    }else{
      this.set('selectedModel.isShell',true);
    }
  }.observes('selectedModel.isService'),
  actions: {
    changeTaskModel(state){
      this.set('selectedModel.isShell',state);
    }
  }
});

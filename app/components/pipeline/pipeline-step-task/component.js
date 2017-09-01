import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    changeTaskModel(state){
      this.set('selectedModel.isShell',state);
    }
  }
});

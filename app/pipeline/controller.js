import Ember from 'ember';

export default Ember.Controller.extend({
  model: function(){
    return this.get('model')
  }.property('model'),

  filterdPiplineHistory: function(){
    return this.get('model').pipeline.activities;
  }.property('activeTab'),
  // TODO, when no Activity， default to History
  activeTab: 'activity',
  isHistory: function(){
    return this.get('activeTab') === 'history'
  }.property('activeTab'),

  stageStatusClass: function(){
    return 
  }.property('model.@'),

  actions:{
    setActiveTab: function(tab){
      this.set('activeTab',tab)
    }
  },
  
  init() {
    // var model = this.get('model')
    // console.log(model)
    // this.set('pipelineName',model.name)
  }
});

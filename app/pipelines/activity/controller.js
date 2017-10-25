import Ember from 'ember';

export default Ember.Controller.extend({
  model: null,
  activeTab: 'history',
  filters: {
    activity: ['Waitting', 'Running'],
    history: ['Success', 'Error']
  },
  disableRerun: false,
  rerunObserves: function(){
    var status = this.get('model.activity.status');
    if(status==='Waiting'||status==='Building'||status==='Pending'){
      this.set('disableRerun', true)
      return
    }
    this.set('disableRerun', false)
  }.observes('model.activity.status'), 
  init() {
    this._super();
  },
  runningObserves: function(){
    var stages = this.get('model.activity.activity_stages');
    var runningStage = stages.findIndex(ele=>ele.status==='Building');
    if(runningStage === -1){
      return
    }
    var runningStep = stages[runningStage].activity_steps.findIndex(ele=>ele.status==='Building');
    if(runningStep === -1) {
      return
    }
    this.set('model.stageIndex',runningStage);
    this.set('model.stepIndex',runningStep);
  }.observes('model.activity.activity_stages.@each'),
  filterdPiplineHistory: function() {
    return [{ activity_stages: this.get('model.activity').activity_stages }];
  }.property('model.activity.activity_stages'),
  isHistory: function() {
    return this.get('activeTab') === 'history'
  }.property('activeTab'),
  originalModel: function(){
    return {
      activity: this.get('model.activity'),
      step: [this.get('model.stageIndex'),this.get('model.stepIndex')],
      activityLogs: this.get('model.activityLogs'),
    }
  }.property('model.stageIndex','model.stepIndex'),
  actions: {
    run: function() {
      var disabled = this.get('disableRerun');
      if(disabled){
        return
      }
      this.set('disableRerun', true);
      this.get('model.activity').doAction('rerun')
    },
    showLogsActivity: function(stageIndex,stepIndex){
      this.set('model.stageIndex',stageIndex);
      this.set('model.stepIndex',stepIndex);
    },
  },
  expandFn: function(item) {
    item.toggleProperty('expanded');
  },
});

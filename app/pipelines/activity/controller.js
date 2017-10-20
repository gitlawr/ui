import Ember from 'ember';

export default Ember.Controller.extend({
  model: null,
  activeTab: 'history',
  filters: {
    activity: ['Waitting', 'Running'],
    history: ['Success', 'Error']
  },
  disableRerun: false,
  init() {
    this._super();
  },
  filterdPiplineHistory: function() {
    return [{ activity_stages: this.get('model.activity').activity_stages }];
  }.property('model.activity.activity_stages'),
  isHistory: function() {
    return this.get('activeTab') === 'history'
  }.property('activeTab'),
  originalModel: function(){
    return {
      activity: this.get('model.activity'),
      step: [this.get('model.stageIndex'),this.get('model.stepIndex')]
    }
  }.property('model.stageIndex','model.stepIndex'),
  actions: {
    run: function() {
      this.set('disableRerun',true);
      this.get('model.activity').doAction('rerun').finally(()=>{
        this.set('disableRerun',false);
      });
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

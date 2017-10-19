import Ember from 'ember';

export default Ember.Controller.extend({
  model: null,
  activeTab: 'history',
  filters: {
    activity: ['Waitting', 'Running'],
    history: ['Success', 'Error']
  },
  init() {
    this._super(...arguments);
  },
  filterdPiplineHistory: function() {
    return [{ activity_stages: this.get('model').activity_stages }];
  }.property('model.activity_stages'),
  isHistory: function() {
    return this.get('activeTab') === 'history'
  }.property('activeTab'),
  stepIndex: 0,
  stageIndex: 0,
  originalModel: function(){
    return {
      activity: this.get('model'),
      step: [this.get('stageIndex'),this.get('stepIndex')]
    }
  }.property('stageIndex','stepIndex'),
  actions: {
    run: function() {
      this.get('model').doAction('rerun');
    },
    showLogsActivity: function(stageIndex,stepIndex){
      this.set('stageIndex',stageIndex);
      this.set('stepIndex',stepIndex);
    },
  },
  expandFn: function(item) {
    item.toggleProperty('expanded');
  },
});

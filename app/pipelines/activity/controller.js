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
  repository: function() {
    return this.get('model').pipeline.stages[0].steps[0].repository
  }.property('model'),
  branch: function() {
    return this.get('model').pipeline.stages[0].steps[0].branch
  }.property('model'),
  filterdPiplineHistory: function() {
    return [{ activity_stages: this.get('model').activity_stages }];
  }.property('model.activity_stages'),
  isHistory: function() {
    return this.get('activeTab') === 'history'
  }.property('activeTab'),

  actions: {
    run: function() {
      this.get('model.pipeline').doAction('run');
    }
  },
  expandFn: function(item) {
    item.toggleProperty('expanded');
  },
});

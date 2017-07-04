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
    var tab = this.get('activeTab');
    return this.get('model').activities;
  }.property('activeTab'),

  isHistory: function() {
    return this.get('activeTab') === 'history'
  }.property('activeTab'),

  actions: {
    run: function() {
      this.get('model.pipeline').doAction('run');
    }
  }
});

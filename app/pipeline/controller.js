import Ember from 'ember';

export default Ember.Controller.extend({
  model: function() {
    return this.get('model')
  }.property('model'),
  activeTab: 'history',
  filters: {
    activity: ['Waitting', 'Running'],
    history: ['Success', 'Error']
  },
  init() {
    this._super(...arguments);
    var activities = this.get('model').activities.filter(ele => {
      return this.get('filters')['activity'].indexOf(ele.status) !== -1
    })
    if (activities) {
      this.set('activeTab', 'activity');
    }
  },
  filterdPiplineHistory: function() {
    var tab = this.get('activeTab');
    return this.get('model').activities.filter(ele => {
      return this.get('filters')[tab].indexOf(ele.status) !== -1
    });
  }.property('activeTab'),

  isHistory: function() {
    return this.get('activeTab') === 'history'
  }.property('activeTab'),

  actions: {
    setActiveTab: function(tab) {
      this.set('activeTab', tab)
    },
    run: function() {
      this.get('model.pipeline').doAction('run');
    }
  }
});

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
  initTab: function() {
    Ember.run.once(() => {
      var activities = this.get('model').activities.filter(ele => {
        return this.get('filters')['activity'].indexOf(ele.status) !== -1
      });
      if (activities) {
        this.set('activeTab', 'activity');
      }
    });
  }.observes('model'),
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

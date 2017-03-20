import Ember from 'ember';

export default Ember.Component.extend({
  projects: Ember.inject.service(),
  session:  Ember.inject.service(),

  model: null,
  tagName: '',
  subMatches: null,
  expanded: null,

  showLabelRow: Ember.computed.or('model.displayUserLabelStrings.length'),

  canExpand: function() {
    return !!this.get('model.isReal');
  }.property('model.isReal'),

  actions: {
    toggle() {
      this.sendAction('toggle');
    },
  },
});

import Ember from 'ember';

export default Ember.Component.extend({
  prefs: Ember.inject.service(),

  stickyHeader: false,

  sortBy: 'name',
  body: null,
  filtered: function() {
    let out = this.get('body')||[];
    return out;
  }.property(),
});

import Ember from 'ember';

export const headersAll =  [
  {
    name: 'name',
    sort: ['name'],
    searchField: 'name',
    label: 'Name'
  },
  {
    name: 'activity',
    sort: ['activity'],
    searchField: 'activity',
    label: 'Latest Activity'
  }
];

export default Ember.Component.extend({
  prefs: Ember.inject.service(),

  stickyHeader: true,

  sortBy: 'name',

  headers: function() {
    return headersAll;
  }.property(),

  filtered: function() {
    let out = this.get('body')||[];
    return out;
  }.property(),
});

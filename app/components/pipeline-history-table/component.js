import Ember from 'ember';

export const headersAll =  [
  {
    name: 'name',
    sort: ['name'],
    searchField: 'name',
    translationKey: 'generic.name',
  },
  {
    name: 'status',
    sort: ['name'],
    searchField: 'status',
    translationKey: 'generic.state',
  },
  {
    name: 'status',
    sort: ['name'],
    searchField: 'status',
    translationKey: 'generic.message',
  },
  {
    name: 'status',
    sort: ['name'],
    searchField: 'status',
    translationKey: 'generic.timeStamp',
  },
];

export default Ember.Component.extend({
  prefs: Ember.inject.service(),

  stickyHeader: false,

  sortBy: 'name',
  body: null,
  headers: function() {
    return headersAll;
  }.property(),

  filtered: function() {
    let out = this.get('body')||[];
    return out;
  }.property(),
});

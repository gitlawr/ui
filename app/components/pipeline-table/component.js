import Ember from 'ember';

export const headersAll =  [
  {
    name: 'name',
    sort: ['id'],
    searchField: 'name',
    translationKey: 'generic.pipelineName',
  },
  {
    name: 'status',
    sort: ['id'],
    searchField: 'status',
    translationKey: 'generic.branch',
  },
  {
    name: 'status',
    sort: ['id'],
    searchField: 'status',
    translationKey: 'generic.repository',
  },
  {
    name: 'status',
    sort: ['id'],
    searchField: 'status',
    translationKey: 'pipelinesPage.table.status',
  },
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

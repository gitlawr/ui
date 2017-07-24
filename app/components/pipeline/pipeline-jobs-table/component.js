import Ember from 'ember';

export const headersAll =  [
  {
    name: 'name',
    sort: ['name'],
    searchField: 'name',
    label: 'Name'
  },
  {
    name: 'lastRunId',
    sort: ['lastRunId'],
    width: '200px',
    searchField: 'activity',
    label: 'Latest Activity'
  },
  {
    name: 'nextRunTime',
    sort: ['nextRunTime'],
    searchField: 'nextRunTime',
    label: 'Next RunTime'
  },
  {
    name: 'isActivate',
    sort: ['isActivate'],
    searchField: 'isActivate',
    label: 'Status'
  }
];

export default Ember.Component.extend({
  prefs: Ember.inject.service(),

  stickyHeader: true,

  sortBy: 'name',

  headers: function() {
    return headersAll;
  }.property(),
});

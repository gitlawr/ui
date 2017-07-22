import Ember from 'ember';
import {timezones} from 'ui/utils/timezones';
export default Ember.Component.extend({
   countries: [
    { name: 'United States' },
    { name: 'Spain', },
    { name: 'Portugal' },
    { name: 'Russia' },
    { name: 'Latvia' },
    { name: 'Brazil' },
    { name: 'United Kingdom' },
  ],
  timezones: timezones,
  selected: '',
  selectedObeserves: function(){
    var selected = this.get('selected');
    this.set('pipeline.triggerTimezone',selected.utc[0]);
  }.observes('selected'),
  schedulePatternObserves:function(){
    var schdulePattern = this.get('schdulePattern');
    switch(schdulePattern){
      case 'custom': this.set('schduleInputDisabled',false);return;
      case 'day': this.set('model.pipeline.triggerSpec','0 4 * * *');break;
    }
    this.set('schduleInputDisabled',true);
  }.observes('schdulePattern'),
  expandFn:function(item) {
    item.toggleProperty('expanded');
  },
  schduleInputDisabled: false,
  schdulePattern: 'custom',
  pipeline: function(){
    var pipeline = this.get('model.pipeline')
    return pipeline
  }.property('model'),
});

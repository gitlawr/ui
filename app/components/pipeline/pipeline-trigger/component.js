import Ember from 'ember';
import {timezones} from 'ui/utils/timezones';
export default Ember.Component.extend({
  timezones: timezones,
  selected: '',
  init(){
    this._super();
    var triggerTimezone = this.get('pipeline.triggerTimezone');
    var t = new Date();
    var timeZone = - t.getTimezoneOffset()/60;
    selected = timezones.find(ele => ele.offset === timeZone );
    this.set('selected',selected)
    if(triggerTimezone){
      var selected = timezones.find(ele=> ele.utc[0]=== triggerTimezone);
      if(selected){
        this.set('selected',selected)
      }
    }
    if(this.get('initial')){
      this.set('pipeline.isActivate', true);
    }
  },
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
    var pipeline = this.get('model.pipeline');
    return pipeline;
  }.property('model.pipeline'),
});

import Ember from 'ember';
import { STATUS, STATUS_INTL_KEY, classForStatus } from 'ui/components/accordion-list-item/component';
import { parseVolumeSpec, stringifyVolumeSpec } from 'ui/utils/parse-volume';

export const NEW_VOLUME = 'newVolume';
export const VOLUME = 'volume';
export const BIND_MOUNT = 'bindMount';
export const FROM_CONTAINER = 'volumesFrom';
export const FROM_LAUNCH_CONFIG = 'volumesFromLaunchConfig';
export const CUSTOM = 'custom';

export default Ember.Component.extend({
  classNames: ['accordion-wrapper'],

  didReceiveAttrs() {
    if (!this.get('expandFn')) {
      this.set('expandFn', function(item) {
          item.toggleProperty('expanded');
      });
    }
  },
  statusClass: null,
  status: '',
  destinationUrl: function() {
    return window.location.origin+'/';
  }.property(),

});

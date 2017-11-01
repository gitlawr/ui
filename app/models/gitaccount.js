import Ember from 'ember';
import Resource from 'ember-api-store/models/resource';
import PolledResource from 'ui/mixins/cattle-polled-resource';

var Account = Resource.extend(PolledResource, {
  type: 'gitaccount',
  modalService: Ember.inject.service('modal'),
  actions:{
    remove:function(callback,falseCallback){
      var cb = ()=>{
        this.doAction('remove').then(callback).catch(falseCallback);
      }
      this.get('modalService').toggleModal('confirm-delete', {resources: [{...this, cb}]});
    },
  },
  profilePicture: function(){
    return this.get('avatar_url');
  }.property('avatar_url'),
  profileUrl:function(){
    return this.get('avatar_url');
  }.property('html_url')
});

export default Account;

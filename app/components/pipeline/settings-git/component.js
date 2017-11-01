import Ember from 'ember';
import { STATUS, STATUS_INTL_KEY, classForStatus } from 'ui/components/accordion-list-item/component';
import C from 'ui/utils/constants';

export default Ember.Component.extend({
  accountId: function(){
    return this.get('session.'+C.SESSION.ACCOUNT_ID)
  }.property('session.'+C.SESSION.ACCOUNT_ID),
  classNames: ['accordion-wrapper'],
  github    : Ember.inject.service('pipeline-github'),
  didReceiveAttrs() {
    if (!this.get('expandFn')) {
      this.set('expandFn', function(item) {
          item.toggleProperty('expanded');
      });
    }
  },
  errors: null,
  testing: false,
  statusClass: null,
  status: '',
  secure: false,
  isEnterprise: false,
  confirmDisable          : false,
  accountsInfo: function(){
    var accounts = this.get('accounts');
    if(!accounts){
      return [];
    }
    return accounts
  }.property('accounts'),
  hasPrivateAccounts: function(){
    var accounts = this.get('accounts');
    var accountId = this.get('accountId');
    return !!accounts.find(ele=>ele.rancherUserId===accountId);
  }.property('accounts'),
  hasPublicAccounts: function(){
    var accounts = this.get('accounts');
    var accountId = this.get('accountId');
    return !!accounts.find(ele=>ele.rancherUserId!==accountId);
  }.property('accounts'),
  destinationUrl: function() {
    return window.location.origin+'/';
  }.property(),
  updateEnterprise: function() {
    if ( this.get('isEnterprise') ) {
      var hostname = this.get('model.githubHostName')||'';
      var match = hostname.match(/^http(s)?:\/\//i);

      if ( match ) {
        this.set('secure', ((match[1]||'').toLowerCase() === 's'));
        hostname = hostname.substr(match[0].length).replace(/\/.*$/,'');
        this.set('model.githubHostName', hostname);
      }

    }
    else
    {
      this.set('model.githubHostName', null);
      this.set('secure', true);
    }

    this.set('model.githubScheme', this.get('secure') ? 'https://' : 'http://');
  },

  enterpriseDidChange: function() {
    Ember.run.once(this,'updateEnterprise');
  }.observes('isEnterprise','model.githubHostName','secure'),
  actions:{
    shareAccount: function(item){
      if(item.actionLinks.share){
        item.doAction('share')
      }else{
        item.doAction('unshare')
      }
    },
    removeAccount:function(item){
      item.send('remove',()=>{
      })
    },
    disable: function(){
      this.get('model').doAction('update',{
        isAuth: false
      }).then((res)=>{
        this.set('model',res);
      })
    },
    promptDisable: function() {
      this.set('confirmDisable', true);
      Ember.run.later(this, function() {
        this.set('confirmDisable', false);
      }, 10000);
    },
    authenticate: function() {
      var clientId = this.get('model.githubClientID');
      this.send('clearError');
      this.set('testing', true);
      this.get('github').authorizeTest(
        'https://github.com/login/oauth/authorize?client_id='+clientId+'&response_type=code&scope=repo+admin%3Arepo_hook',
        (err,code) => {
          if ( err )
          {
            this.send('gotError', err);
            this.set('testing', false);
          }
          else
          {
            this.send('gotCode', code , ()=>{
              this.set('testing', false);
            });
            
          }
        }
      );
    },
    gotCode: function(code, cb) {
      var model = this.get('model');
      model.doAction('githuboauth',{
        ...model.serialize(),
        code,
        githubRedirectURL: this.get('destinationUrl')
      }).then(res => {
        cb();
        this.send('authenticationSucceeded', res);
      }).catch(res => {
        // Github auth succeeded but didn't get back a token
        this.send('gotError', res);
      });
    },
    authenticationSucceeded: function(res){
      this.set('model',res);
    },
    gotError: function(err) {
      if ( err.message )
      {
        this.send('showError', err.message + (err.detail? '('+err.detail+')' : ''));
      }
      else
      {
        this.send('showError', 'Error ('+err.status + ' - ' + err.code+')');
      }

      this.set('testing', false);
    },

    showError: function(msg) {
      this.set('errors', [msg]);
      window.scrollY = 10000;
    },

    clearError: function() {
      this.set('errors', null);
    },
  }
});

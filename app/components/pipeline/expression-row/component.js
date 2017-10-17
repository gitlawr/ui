import Ember from 'ember';
import C from 'ui/utils/constants';

function splitEquals(str) {
  var idx = str.indexOf('=');
  if ( idx === -1 )
  {
    return null;
  }

  return [ str.substr(0,idx) , str.substr(idx+1) ];
}

function normalizedLabels(objects) {
  var out = {};
  objects.forEach((obj) => {
    var labels = obj.get('labels')||{};

    Object.keys(labels).filter((key) => {
      return key.indexOf(C.LABEL.SYSTEM_PREFIX) !== 0;
    }).forEach((key) => {
      let normalizedKey = key.trim().toLowerCase();
      if ( out[normalizedKey] )
      {
        out[normalizedKey].push(labels[key].toLowerCase());
      }
      else
      {
        out[normalizedKey] = [labels[key].toLowerCase()];
      }
    });
  });

  return out;
}

export default Ember.Component.extend({
  rule: null,
  instance: null,
  expressionsRelation: [{label: 'Any of these', value: 'any', info:'Run when at least one of the conditions are true'}
  ,{label: 'All of these', value: 'all', info:'Run when all of the conditions are true'}],
  selectedInfo: function(){
    var relation = this.get('expressionsRelation').find(ele => ele.value===this.get('conditions.mode'));
    return relation?relation.info:'';
  }.property('conditions.mode'),
  comparations: [
    {label: '=', value:'='},
    {label: '!=', value:'!='},
  ],
  selectedComparation: '0',
  envvars:[],
  envvarsLoading: true,
  selectedEnv: '',
  tagName: 'TR',
  classNames: 'main-row',

  isGlobal: null,
  kind: null,
  suffix: null,
  userKey: null,
  userValue: null,
  actions: {
    selecteEnv: function(env){
      this.set('rule.env', env);
    },
    setKey: function(key) {
      this.set('userKey', key);
    },

    setValue: function(value) {
      this.set('userValue', value);
    },

    remove: function() {
      this.sendAction('remove', this.get('rule'));
    }
  },

  init: function() {
    this._super();
    var pipelineStore = this.get('pipelineStore');
    pipelineStore.find('envvars', null, {
      url: `${pipelineStore.baseUrl}/envvars`,
      forceReload: true
    }).then((res) => {
      this.set('envvarsLoading', false);
      this.set('envvars', JSON.parse(res));
    });
  }
});

import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
import ModalBase from 'ui/mixins/modal-base';

const showKinds = ['user','admin'];

export default Ember.Component.extend(ModalBase, NewOrEdit, {
  access: Ember.inject.service(),
  classNames: ['large-modal', 'alert'],
  modalOpts: Ember.computed.alias('modalService.modalOpts'),
  settings: Ember.inject.service(),
  model: null,
  clone: null,
  primaryResource: Ember.computed.alias('originalModel'),
  sortBy: 'name',
  userList: [],
  selectedList: function() {
    var selectedList = this.get('userList').filter(ele => !!ele.selected);
    return selectedList;
  }.property('userList.@each.selected'),
  headers: Ember.computed('isLocal', function() {
    let out = [
      {
        translationKey: 'generic.state',
        name: 'state',
        sort: ['state'],
        width: '125'
      },
      {
        translationKey: 'generic.id',
        name: 'id',
        sort: ['id'],
        width: '120'
      },
      {
        translationKey: 'accountsPage.index.table.kind',
        name: 'kind',
        sort: ['kind'],
        width: '120'
      },
    ];

    if ( this.get('isLocal') ) {
      out.push({
        translationKey: 'accountsPage.index.table.username',
        name: 'username',
        sort: ['username'],
      });
    }

    out.push({
      translationKey: 'accountsPage.index.table.identity',
      name: 'name',
      sort: ['name'],
    });

    return out;
  }),
  isLocal: function() {
    return this.get('access.provider') === 'localauthconfig';
  }.property('access.provider'),
  init() {
    this._super(...arguments);
    var opts = this.get('modalOpts');
    if (opts.mode === "edit") {
      this.set('model', opts.stage);
      this.set('editing', true);
      var approvers = opts.stage.approvers;
    } else {
      this.set('model', {
        id: null,
        name: null,
        needApprove: false,
        steps: []
      })
    }

    this.get('userStore')
      .find('account', null, {filter: {'kind_ne': ['service','agent']}, forceReload: true})
        .then((user)=>{
          var userList = user.content.filter((row) => {
            var kind = (row.kind||'').toLowerCase();
            return showKinds.indexOf(kind) !== -1;
          });
          if(approvers&&approvers.length){
            for (var i = 0; i < userList.length; i++) {
              var item = userList[i];
              if(approvers.indexOf(item.id)!==-1){
                item.set('selected',true)
              }
            }
          }
          this.set('userList',userList);
        });
  },
  editing: false,
  doneSaving() {
    this.send('cancel');
  },
  getApprovals(){
    var selectedList = this.get('selectedList');
    return selectedList.map(ele=>ele.id);
  },
  actions: {
    add: function(success) {
      success(true);
      this.get('modalOpts').cb({
        ...this.get('model'),
        id: Date.now(),
        approvers: this.getApprovals()
      });
      this.send('cancel');
    },
    edit: function(success) {
      success(true)
      this.get('modalOpts').cb({
        ...this.get('model'),
        id: Date.now(),
        approvers: this.getApprovals()
      })
      this.send('cancel');
    },
    remove: function() {
      this.get('modalOpts').rmCb();
      this.send('cancel');
    },
    userSelect: function(item){
      var index = this.get('userList').findIndex(ele => ele.id === item.id)
      let selected = this.get('userList')[index].selected;

      this.get('userList')[index].set('selected', !selected);
    }
  }
});

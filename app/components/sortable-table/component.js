import Ember from 'ember';
import Sortable from 'ui/mixins/sortable-base';
import StickyHeader from 'ui/mixins/sticky-table-header';
import pagedArray from 'ember-cli-pagination/computed/paged-array';
import {isAlternate, isMore, isRange} from 'ui/utils/platform';

const {get,set} = Ember;

function matches(fields, token, item) {
  for ( let i = 0 ; i < fields.length ; i++ ) {
    let field = fields[i];
    if ( field ) {
      let val = (get(item,field)+'').toLowerCase();
      if ( val && val.indexOf(token) >= 0) {
        return true;
      }
    }
  }

  return false;
}

export default Ember.Component.extend(Sortable, StickyHeader, {
  prefs: Ember.inject.service(),
  intl: Ember.inject.service(),
  bulkActionHandler: Ember.inject.service(),

  body:              null,
  groupByKey:        null,
  groupByRef:        null,
  sortBy:            null,
  descending:        false,
  headers:           null,
  extraSearchFields: null,
  extraSearchSubFields: null,
  prefix:            false,
  suffix:            false,
  bulkActions:       true,
  search:            true,
  paging:            true,
  subRows:           false,

  availableActions:  null,
  selectedNodes:     null,
  prevNode:          null,
  searchText:        null,
  page:              1,
  perPage:           Ember.computed.alias('prefs.tablePerPage'),
  pagingLabel:       'pagination.generic',

  showHeader: Ember.computed.or('bulkActions','search','paging'),

  init: function() {
    this._super(...arguments);

    if ( !this.get('paging') ) {
      this.set('perPage', 100000);
    }

    this.set('selectedNodes', []);
    if (this.get('bulkActions')) {
      this.actionsChanged();
    }

    Ember.run.schedule('afterRender', () => {
      let tbody = Ember.$(this.element).find('table tbody');
      let self = this; // need this context in click function and can't use arrow func there

      tbody.on('click', 'tr', function(e) {
        self.rowClick(e);
      });

      tbody.on('mousedown', 'tr', function(e) {
        if ( isRange(e) || e.target.tagName === 'INPUT') {
          e.preventDefault();
        }

      });
    });

    this.set('groupedContent', Ember.computed(`pagedContent.@each.${this.get('groupByKey')}`, () => {
      let ary = [];
      let map = {};

      let groupKey = this.get('groupByKey');
      let refKey = this.get('groupByRef');
      this.get('pagedContent').forEach((obj) => {
        let group = obj.get(groupKey)||'';
        let ref = obj.get(refKey);
        let entry = map[group];
        if ( entry ) {
          entry.items.push(obj);
        } else {
          entry = {group: group, ref: ref, items: [obj]};
          map[group] = entry;
          ary.push(entry);
        }
      });

      return ary;
    }));
  },

  actions: {
    clearSearch() {
      this.set('searchText', '');
    },

    executeBulkAction(name, e) {
      e.preventDefault();
      let handler = this.get('bulkActionHandler');
      let nodes = this.get('selectedNodes');

      if (isAlternate(e)) {
        var available= this.get('availableActions');
        var action = available.findBy('action', name);
        let alt = get(action, 'altAction');
        if ( alt ) {
          name = alt;
        }
      }

      if ( typeof handler[name] === 'function' ) {
        this.get('bulkActionHandler')[name](nodes);
      } else {
        nodes.forEach((node) => {
          node.send(name);
        });
      }
    },

    executeAction(action) {
      var node = this.get('selectedNodes')[0];
      node.send(action);
    },
  },

  // -----
  // Table content
  // Flow: body [-> sortableContent] -> arranged -> filtered -> pagedContent [-> groupedContent]
  // -----
  sortableContent: Ember.computed.alias('body'),
  pagedContent: pagedArray('filtered', {pageBinding:  "page", perPageBinding:  "perPage"}),

  // For data-title properties on <td>s
  dt: Ember.computed('headers.@each.{name,label,translationKey}','intl._locale', function() {
    let intl = this.get('intl');
    let out = {};
    this.get('headers').forEach((header) => {
      let name = get(header, 'name');
      let dtKey = get(header,'dtTranslationKey');
      let key = get(header,'translationKey');
      if ( dtKey ) {
        out[name] = intl.t(dtKey) + ': ';
      } else if ( key ) {
        out[name] = intl.t(key) + ': ';
      } else {
        out[name] = (get(header, 'label') || name) + ': ';
      }
    });

    return out;
  }),

  // Pick a new sort if the current column disappears.
  headersChanged: Ember.observer('headers.@each.name', function() {
    let sortBy = this.get('sortBy');
    let headers = this.get('headers')||[];
    if ( headers && headers.get('length') ) {
      let cur = headers.findBy('name', sortBy);
      if ( !cur ) {
        Ember.run.next(this, function() {
          this.send('changeSort', headers.get('firstObject.name'));
        });
      }
    }
  }),

  searchFields: Ember.computed('headers.@each.{searchField,name}','extraSearchFields.[]', function() {
    let out = headersToSearchField(this.get('headers'));
    return out.addObjects(this.get('extraSearchFields')||[]);
  }),

  subFields: Ember.computed('subHeaders.@each.{searchField,name}','extraSearchSubFields.[]', function() {
    let out = headersToSearchField(this.get('subHeaders'));
    return out.addObjects(this.get('extraSearchSubFields')||[]);
  }),

  filtered: Ember.computed('arranged.[]','searchText', function() {
    let out = this.get('arranged').slice();
    let searchFields = this.get('searchFields');
    let searchText =  (this.get('searchText')||'').trim().toLowerCase();
    let subSearchField = this.get('subSearchField');
    let subFields = this.get('subFields');
    let subMatches = null;

    if ( searchText.length ) {
      subMatches = {};
      let searchTokens = searchText.split(/\s*[, ]\s*/);

      for ( let i = out.length-1 ; i >= 0 ; i-- ) {
        let hits = 0;
        let row = out[i];
        let mainFound = true;
        for ( let j = 0 ; j < searchTokens.length ; j++ ) {
          if ( !matches(searchFields, searchTokens[j], row) ) {
            mainFound = false;
            break;
          }
        }

        if ( subFields && subSearchField) {
          let subRows = (row.get(subSearchField)||[]);
          for ( let k = subRows.length-1 ; k >= 0 ; k-- ) {
            let subFound = true;
            for ( let l = 0 ; l < searchTokens.length ; l++ ) {
              if ( !matches(subFields, searchTokens[l], subRows[k]) ) {
                subFound = false;
                break;
              }
            }

            if ( subFound ) {
              hits++;
            }
          }

          subMatches[row.get('id')] = hits;
        }

        if ( !mainFound && hits === 0 ) {
          out.removeAt(i);
        }
      }
    }

    this.set('subMatches', subMatches);
    return out;
  }),

  pagedContentChanged: Ember.observer('pagedContent.[]', function() {
    // Remove selected items not in the current content
    let content = this.get('pagedContent');
    let nodesToRemove = this.get('selectedNodes').filter((node) => {
      return !content.includes(node);
    });

    this.toggleMulti([], nodesToRemove);
  }),

  indexFrom: Ember.computed('page','perPage', function() {
    var current =  this.get('page');
    var perPage =  this.get('perPage');
    return Math.max(0, 1 + perPage*(current-1));
  }),

  indexTo: Ember.computed('indexFrom','perPage','filtered.length', function() {
    return Math.min(this.get('filtered.length'), this.get('indexFrom') + this.get('perPage') - 1);
  }),

  pageCountContent: Ember.computed('indexFrom','indexTo','pagedContent.totalPages', function() {
    let from = this.get('indexFrom') || 0;
    let to = this.get('indexTo') || 0;
    let count = this.get('filtered.length') || 0;
    let pages = this.get('pagedContent.totalPages') || 0;
    let out = '';

    if ( pages <= 1 ) {
      out = `${count} Item` + (count === 1 ? '' : 's');
    } else {
      out = `${from} - ${to} of ${count}`;
    }

    return out;
  }),

  pageCountChanged: Ember.observer('indexFrom', 'filtered.length', function() {
    // Go to the last page if we end up past the last page
    let from = this.get('indexFrom');
    let last = this.get('filtered.length');
    var perPage = this.get('perPage');

    if ( this.get('page') > 1 && from > last) {
      let page = Math.ceil(last/perPage);
      this.set('page', page);
    }
  }),

  sortKeyChanged: Ember.observer('sortBy', function() {
    this.set('page',1);
  }),

  // ------
  // Clicking
  // ------
  rowClick(e) {
    let tagName = e.target.tagName;
    if ( tagName === 'A'  || tagName === 'BUTTON' || $(e.target).parents('.btn').length || $(e.target).data('ember-action') ) {
      return;
    }

    let content = this.get('pagedContent');
    let selection = this.get('selectedNodes');
    let tgt = Ember.$(e.target);
    let isCheckbox = tagName === 'INPUT' || tgt.hasClass('select-for-action');
    let tgtRow = Ember.$(e.currentTarget);
    if ( tgtRow.hasClass('separator-row') || tgt.hasClass('select-all-check')) {
      return;
    }

    while ( tgtRow && tgtRow.length && !tgtRow.hasClass('main-row') ) {
      tgtRow = tgtRow.prev();
    }

    if ( !tgtRow || !tgtRow.length ) {
      return;
    }

    let nodeId = tgtRow.find('input[type="checkbox"]').attr('nodeid');
    if ( !nodeId ) {
      return;
    }

    let node = content.findBy('id', nodeId);
    if ( !node ) {
      return;
    }

    let isSelected = selection.includes(node);
    let prevNode = this.get('prevNode');
    // PrevNode is only valid if it's in the current content
    if ( !content.includes(prevNode) ) {
      prevNode = null;
    }

    if ( !prevNode ) {
      prevNode = node;
    }

    if ( isMore(e) ) {
      this.toggleSingle(node);
    } else if ( isRange(e) ) {
      let from = content.indexOf(prevNode);
      let to = content.indexOf(node);
      [from, to] = [Math.min(from,to), Math.max(from,to)];
      let toToggle = content.slice(from,to+1);

      if ( isSelected ) {
        this.toggleMulti([], toToggle);
      } else {
        this.toggleMulti(toToggle,[]);
      }
    } else if ( isCheckbox ) {
      this.toggleSingle(node);
    } else {
      this.toggleMulti([node], content);
    }

    this.set('prevNode', node);
    e.stopPropagation();
  },

  isAll: Ember.computed('selectedNodes.length', 'pagedContent.length', {
    get() {
      return this.get('selectedNodes.length') === this.get('pagedContent.length');
    },

    set(key, value) {
      var content = this.get('pagedContent');
      if ( value ) {
        this.toggleMulti(content, []);
          return true;
      } else {
        this.toggleMulti([], content);
          return false;
      }
    }
  }),

  toggleSingle(node) {
    let selectedNodes = this.get('selectedNodes');

    if ( selectedNodes.includes(node) ) {
      this.toggleMulti([], [node]);
    } else {
      this.toggleMulti([node], []);
    }
  },

  toggleMulti(nodesToAdd, nodesToRemove) {
    let selectedNodes = this.get('selectedNodes');

    if (nodesToRemove.length) {
      // removeObjects doesn't use ArrayProxy-safe looping
      if ( typeof nodesToRemove.toArray === 'function' ) {
        nodesToRemove = nodesToRemove.toArray();
      }
      selectedNodes.removeObjects(nodesToRemove);
      nodesToRemove.forEach((node) => {
        toggle(node, false);
      });
    }

    if (nodesToAdd.length) {
      selectedNodes.addObjects(nodesToAdd);
      nodesToAdd.forEach((node) => {
        toggle(node, true);
      });
    }

    function toggle(node, on) {
      let id = get(node,'id');
      if ( id ) {
        let input = Ember.$(`input[nodeid=${id}]`);
        if ( input && input.length ) {
          Ember.run.next(function() { input[0].checked = on; });
          let tr = Ember.$(input).closest('tr');
          let first = true;
          while ( tr && (first || tr.hasClass('sub-row') ) ) {
            tr.toggleClass('row-selected', on);
            tr = tr.next();
            first = false;
          }
        }
      }
    }
  },

  actionsChanged: Ember.observer('selectedNodes.@each.availableActions','pagedContent.firstObject.availableActions', function() {

    if (!this.get('bulkActions')) { return; }

    let nodes = this.get('selectedNodes');
    let out = null;
    let disableAll = false;

    if ( !nodes.length ) {
      disableAll = true;
      let firstNode = this.get('pagedContent.firstObject');
      if ( firstNode ) {
        nodes = [firstNode];
      }
    }

    if (nodes.length >= 1) {
      // Find all the bulkable actions from the first item (all items have all the actions, but some will be disabled
      out = nodes.get('firstObject.availableActions').filterBy('bulkable',true).map((act) => {
        return Ember.$().extend(true, {}, act);
      });

      // Make a list of ones that should be disabled because they are not available for one or more selected items
      let toDisable = [];
      nodes.forEach((node) => {
        let bad;
        if ( disableAll ) {
          bad = get(node,'availableActions').map(act => act.action);
        } else {
          bad = get(node,'availableActions').filterBy('enabled',false).map(act => act.action);
        }

        toDisable.addObjects(bad);
      });

      // Disable the bulk actions from the toDisable list
      toDisable.forEach((name) => {
        let obj = out.findBy('action', name);
        if ( obj ) {
          set(obj, 'enabled', false);
        }
      });
    }

    this.set('availableActions', out);
  }),
});

function headersToSearchField(headers) {
  let out = [];

  (headers||[]).forEach((header) => {
    let field = get(header, 'searchField');
    if ( field ) {
      if ( typeof field === 'string' ) {
        out.addObject(field);
      } else if ( Ember.isArray(field) ) {
        out.addObjects(field);
      }
    } else if ( field === false ) {
      // Don't add the name
    } else {
      out.addObject(get(header,'name'));
    }
  });

  return out.filter(x => !!x);
}

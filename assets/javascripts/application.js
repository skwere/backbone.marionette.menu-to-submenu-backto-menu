/*
*	Created: 24-11-2013
*/
MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
	mainRegion: "#content"
});

ItemMenu = Backbone.Model.extend({
	defaults: {
		subMods: undefined
	},
  
	initialize:function(options){
		if(options.subMods !== undefined){
			this.set("subMods", new ItemMenus(options.subMods));
		}
		
		this.url = "model.php"+"?id="+this.id;
	}

});

ItemMenus = Backbone.Collection.extend({
	model: ItemMenu,
	title: '',
	url : "collection.php",

	initialize: function(collections, path){
		this.sort_key = 'id';
		this.title = path;
		this.url = "collection.php?list="+path;
	},
  
	comparator: function(a, b) {
		// Assuming that the sort_key values can be compared with '>' and '<',
		// modifying this to account for extra processing on the sort_key model
		// attributes is fairly straight forward.
		a = a.get(this.sort_key);
		b = b.get(this.sort_key);
		return a > b ?  1
			 : a < b ? -1
			 :          0;
	}    
});

ItemMenuView = Backbone.Marionette.ItemView.extend({
	template: "#menu_item-template",
	tagName: 'li',
	className: 'menu_item',
  
	events : {
		'click .subMenu' : 'subMenu'
	},
	
	subMenu : function() {
		var parent_collection_title = this.model.collection.title;

		var parent_collection_name = this.model.get('name');
		parent_collection_name_st = 'الرجوع إلى ' + parent_collection_name;
		
		var collection_name = this.model.get('idAttribute');
		
		//to add to view
		var items_new = new ItemMenus({idAttribute: collection_name}, collection_name);
		items_new.fetch();
		
		if(collection_name != 'root'){
			var items_parent = new ItemMenus({id: '000', idAttribute: parent_collection_title}, parent_collection_title);
			items_parent.comparator = 'id';
			
			if(!items_new.findWhere({idAttribute : parent_collection_title})){
				item_new =  new ItemMenu({ idAttribute: parent_collection_title, subMods: items_parent.models, name: parent_collection_name_st });
				items_new.add(item_new);
				
				//Disabled
				// item_new.save({}, { url : "model.php"+"?collection_title="+collection_name});
			}
		}
		items_new.fetch();//{success: function(rec){ console.log('items_new fetched : ', rec);}}
		// items_new.each(function(doc){console.log('idA : ' + doc.idAttribute + '-- name : ' + doc.name);})

		
		
		// initialize the view and pass the collection
		var itemMenusView_new = new ItemMenusView({collection: items_new});
		MyApp.mainRegion.show(itemMenusView_new);
	}
});

ItemMenusView = Backbone.Marionette.CompositeView.extend({
	// tagName: "ul",
	id: "menu_items",
	className: "menu_items",
	template: "#menu_items-template",
	itemView: ItemMenuView,

	initialize: function() {
		this.listenTo(this.collection, 'reset sort', this.render);
	},

	appendHtml: function(collectionView, itemView){
		collectionView.$("ul").append(itemView.el);
	}
});

MyApp.addInitializer(function(options){
	var itemMenusView = new ItemMenusView({
		collection: options.items
	});
	MyApp.mainRegion.show(itemMenusView);
});

$(document).ready(function(){
	//Disabled
	/*
	var transfert = new ItemMenu({ id: '001', idAttribute: 'transfert', name: 'موجز التحركات', subMods: undefined }),
	agenda = new ItemMenu({ id: '002', idAttribute: 'agenda', name: 'أجندة', subMods: undefined }),
	member = new ItemMenu({ id: '003', idAttribute: 'member', name: 'الأعضاء', subMods: undefined }),
	task = new ItemMenu({ id: '004', idAttribute: 'task', name: 'مهام', subMods: undefined }),
	vote = new ItemMenu({ id: '005', idAttribute: 'vote', name: 'تصويت', subMods: undefined }),
	note = new ItemMenu({ id: '006', idAttribute: 'note', name: 'ملاحظات', subMods: undefined }),
	doc_pub = new ItemMenu({ id: '007', idAttribute: 'doc_pub', name: 'مكتبة المستندات', subMods: undefined }),
	photo_pub = new ItemMenu({ id: '008', idAttribute: 'photo_pub', name: 'مكتبة الصور', subMods: undefined }),
	link_pub = new ItemMenu({ id: '009', idAttribute: 'link_pub', name: 'مكتبة الروابط', subMods: undefined }),
	call_archive = new ItemMenu({ id: '010', idAttribute: 'call_archive', name: 'أرشيف المحادثات', subMods: undefined });
	var items3 = new ItemMenus().add([transfert, agenda, member, task, vote, note, doc_pub, photo_pub, link_pub, call_archive]);

	var meeting = new ItemMenu({ id: '011', idAttribute: 'meeting', name: 'الإجتماعات', subMods: items3.models });
	var items2 = new ItemMenus().add([transfert, member, call_archive, meeting]);
	var panel = new ItemMenu({ id: '012', idAttribute: 'panel', name: 'لوحة المعلومات', subMods: undefined }),
	workspace = new ItemMenu({ id: '013', idAttribute: 'workspace', name: 'مساحات العمل', subMods: items2.models }),
	search = new ItemMenu({ id: '014', idAttribute: 'search', name: 'البحث', subMods: undefined }),
	config = new ItemMenu({ id: '015', idAttribute: 'config', name: 'الإعدادات', subMods: undefined });
	var items = new ItemMenus().add([panel, task, workspace, search, config]);
	
	panel.save();task.save();workspace.save();search.save();config.save();transfert.save();member.save();
	call_archive.save();meeting.save();agenda.save();vote.sav();note.save();doc_pub.save();photo_pub.save();link_pub.save();
	*/

	var items = new ItemMenus({idAttribute: "root"}, "root");
	
	items.fetch();

	MyApp.start({items: items});

});

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"home",
        "todo":"todo",
        "misc":"misc",
        "misc?:id":"misc",
        "ready":"ready",
        "update":"update",
        "isolator?:id" : "show_isolator",
        "posts?:id": "getPost"
    },

    initialize:function () {
        // Handle back button throughout the application
//        $('.back').live('click', function(event) {
 //           window.history.back();
  //          return false;
   //     });
    //    this.firstPage = true;
    },

    home:function () {
        console.log('#home');
	$('#content_pane').gnotobiotic_misc({show:'home'});
//        this.changePage(new HomeView());
    },
    ready:function () {
        console.log('ready');
	$('#content_pane').gnotobiotic_ready();
 //       this.changePage(new Page1View());
    },
    misc:function (option) {
	if (option)
	        console.log('at misc after ' + option);
	else 
	        console.log('at misc no option');

	if (option) 
		$('#content_pane').gnotobiotic_misc({show:option});
	else
		$('#content_pane').gnotobiotic_misc();
 //       this.changePage(new Page1View());
    },
    todo:function () {
        console.log('todo');
	$('#content_pane').gnotobiotic_todo();
    },
    update:function () {
        console.log('update');
	$('#content_pane').gnotobiotic_update();
    },
    show_isolator:function(id) {
	if (id)
        	console.log('showing isolator ' + id);
	else
	       	console.log('no id passed');

	$('#content_pane').gnotobiotic_update({show:'isolator',isolator_id:id});
//        this.changePage();
        //this.changePage(new Page3View());
    },
    changePage:function (page) {
    //    $(page.el).attr('data-role', 'page');
     //   page.render();
//        $('body').append($(page.el));
//        var transition = $.mobile.defaultPageTransition;
        var transition = 'none';
        // We don't want to slide the first page
//        if (this.firstPage) {
 //           transition = 'none';
  //          this.firstPage = false;
   //     }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }

});

$(document).ready(function () {
    console.log('document ready');
    MyAppRouter = new AppRouter();
    Backbone.history.start();
});

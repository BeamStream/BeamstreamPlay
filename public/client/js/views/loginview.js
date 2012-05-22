window.LoginView = Backbone.View.extend({

	events : {
		"click #login" : "login",

	},

	initialize : function() {

		console.log('Initializing Login View');
		this.template = _.template($("#tpl-login").html());

	},

	render : function(eventName) {

		$(this.el).html(this.template());
		return this;
	},

	/**
	 * login -verification
	 */

	login : function(eventName) {
		eventName.preventDefault();

		var loginDetails = this.getLoginInfo();

		if (loginDetails != false) {
			/* post data with school and class details */
			$.ajax({
				type : 'POST',
				url : "http://localhost:9000/users",
				data : {
					data : loginDetails
				},
				dataType : "json",
				success : function(data) {
					app.navigate("school", {
						trigger : true,
						replace : true
					});
					;
				}
			});
		} else {
			alert("Fille required fileds..");
		}

	},
	/**
	 * get login form details
	 */
	getLoginInfo : function(eventName) {

		var loginModel = new Login();
		var iam = $("#iam").val();
		var email = $("#email").val();
		var status = $("input[name=signup]:checked").val();
		var pwd = $("#password").val();
		if (iam != "" && email !== "" && status != "" && pwd != "") {
			loginModel.set({

				iam : $("#iam").val(),
				email : $("#email").val(),
				pwdStatus : $("input[name=signup]:checked").val(),
				password : $("#password").val(),

			});
			var loginDetails = JSON.stringify(loginModel);
			return loginDetails;
		} else {
			return false;
		}

	},

});
Template.statistics.onCreated(function () {
	var self = this;

    self.subscribe('statistics');
});

Template.statistics.helpers({
	click: function () {
		var times = Statistics.findOne({ type: 'click' });

		if (times) {
			return times.count * 3;
		}

		return 0;
	},
	share: function () {
		var times = Statistics.findOne({ type: 'share' });

		if (times) {
			return times.count * 3;
		}

		return 0;
	},
	game: function () {
		var times = Statistics.findOne({ type: 'game' });

		if (times) {
			return times.count * 3;
		}

		return 0;
	}
});

Template.statistics.events({
	'submit #login': function (e) {
		e.preventDefault();

		var name = $('#name').val().trim(),
			pwd = $('#pwd').val().trim();

		if (name !== 'admin' || pwd !== 'admin') {
			return alert('用户名或者密码输入错误');
		}

		$('#login').hide();
		$('#info').show();
	}
});
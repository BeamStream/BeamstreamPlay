(function(Handlebars) {

  helpers = {
    // comma-separated array/object
    csv: function(list, options) {
      var cs = '';
      _.map(list, function(item, i, iter) {
        cs += options.fn(item) + (i === iter.length - 1 ? '' : ', ');
      });
      return typeof list === 'array' ? cs : cs.slice(0, cs.length - 2);
    },
    // international phone
    phone: function(text) {
      text = text.replace(/[^\d.]/g, '');
      return formatInternational('US', text);
    },
    // currency
    money: function(text) {
      // text = 'code:amount', e.g. 'USD1234.56', or '' (empty string)
      var formats = {
        AUD: {symbol: '$', decimal: '.', places: 2, thousand: ' '},
        CAD: {symbol: '$', decimal: '.', places: 2, thousand: ','},
        EUR: {symbol: '€', decimal: '.', places: 2, thousand: ','},
        GBP: {symbol: '£', decimal: '.', places: 2, thousand: ','},
        USD: {symbol: '$', decimal: '.', places: 2, thousand: ','}
      };

      // parse, format & return text
      return text.match(/([^\d]+)([\d]+)/, function(_, code, amount) {
        amount = isNaN(+amount) ? 0 : +amount;

        var format = formats[code] || formats["USD"],
          negative = amount < 0 ? '-' : '',
          i = Math.abs(amount).toFixed(format.places) + '',
          j = (j = i.length) > 3 ? j % 3 : 0;

          return format.symbol + negative + (j ? i.substr(0, j) + format.thousand : '')
            + i.substr(j).replace(/(\d{3})(?=\d)/g, $1 + format.thousand)
            + (format.places ? format.decimal + Math.abs(number - i).toFixed(format.places).slice(2): '');
      });
    },
    // dates & times
    shortDate: function(text, options) {
      if (text) return new Date(+text).format('m/dd/yy');
    },
    mediumDate: function(text, options) {
      if (text) return new Date(+text).format('mmm d, yyyy');
    },
    longDate: function(text, options) {
      if (text) return new Date(+text).format('mmmm d, yyyy');
    },
    fullDate: function(text, options) {
      if (text) return new Date(+text).format('dddd, mmmm d, yyyy');
    },
    isoDate: function(text, options) {
      if (text) return new Date(+text).format('yyyy-mm-dd');
    },
    shortTime: function(text, options) {
      if (text) return new Date(+text).format('h:MM TT');
    },
    mediumTime: function(text, options) {
      if (text) return new Date(+text).format('h:MM:ss TT');
    },
    longTime: function(text, options) {
      if (text) return new Date(+text).format('h:MM:ss TT Z')
    },
    agoTime: function(text, options) {
      if (!text) return '';
      var then = +new Date(+text),
        now = +new Date;

      var seconds = Math.round(now - then / 1000),
        minutes = Math.round(seconds / 60),
        hours = Math.round(minutes / 60),
        days = Math.round(hours / 24),
        months = Math.round(days / 30);

      if (months > 1) return months + ' months ago';
      if (months === 1) return months + ' month ago';
      if (days > 1) return days + ' days ago';
      if (days === 1) return days + ' day ago';
      if (hours > 1) return hours + ' hours ago';
      if (hours === 1) return hours + ' hour ago';
      if (minutes > 1) return minutes + ' minutes ago';
      if (minutes === 1) return minutes + ' minute ago';
      return seconds + ' seconds ago';
    },
    dateTime: function(text, options) {
      if (text) return new Date(+text).format('dddd, mmmm d, yyyy, h:MM TT');
    },
    millisToHour: function(text) {
      if (!text) return '--:--';
      var _time = (+text) / 3600000,
        time = Math.floor(_time),
        minutes = time === _time ? ':00' : ':30';
      return time < 12 ? time.toString() + minutes + ' AM' : time === 12 ? time.toString() + minutes + ' PM' :
        (time - 12).toString() + minutes + ' PM';
    },
    // html shortcuts
    checkEmpty: function(text) {
      return text == '' ? '<a class="add">Add +</a>' : text;
    },
    checkEducation: function(text) {
      return text.split(',').length < 3 ? '<button class="button btn-icon-action btn-icon-addEducation">Add</button>' : '';
    },
    checkStatusPending: function(text) {
      if (text) return !!~$.inArray(this.status, ['REQUESTED', 'NEW_TIME'])) ? '' : text;
    },
    checkStatusAccept: function(text) {
      if (text) return !!~$.inArray(this.status, ['REQUESTED', 'PENDING', 'NEW_TIME']) ? '' : text
    },
    checkStatusReschedule: function(text) {
      if (text) return !!~$.inArray(this.status, ['REQUESTED', 'PENDING', 'ACCEPTED']) ? '' : text
    },
    checkStatusAcceptDate: function(text) {
      if (this.status === 'ACCEPTED') {
        var acceptDate = new Date(+this.acceptedAppointmentTime);
        return '<td><span class="clear">' + this.datetime(acceptDate) + '</span></td>'
      }
    }

  }

  var name, helper;
  for (name in helpers) {
    helper = helpers[name];
    Handlebars.registerHelper(name, helper);
  }

})(Handlebars);
/** 
* Decode URL and return object
* First attempt to support URLs like
*	- "a=10&b=20&c%5B%5D=10&c%5B%5D=20"  
*		(aka a=10&b=20&c[]=10&c[]=20)
*		and
*	- "a=10&b=20&c%5Bhello%5D=10&c%5Bhello2%5D=20"	
*		(aka "a=10&b=20&c[hello]=10&c[hello2]=20")
*/
jQuery.toQueryParams = function(str, separator) {
		separator = separator || '&'
		var obj = {}
		if (str.length == 0)
			return obj
		var c = str.substr(0,1)
		var s = c=='?' || c=='#'  ? str.substr(1) : str; 
		 
		var a = s.split(separator)
		for (var i=0; i<a.length; i++) {
			var p = a[i].indexOf('=')
			if (p < 0) {
				obj[a[i]] = ''
				continue
			}
			var k = decodeURIComponent(a[i].substr(0,p)),
				v = decodeURIComponent(a[i].substr(p+1))
			
			var bps = k.indexOf('[')
			if (bps < 0) {
				obj[k] = v
				continue;
			} 
			
			var bpe = k.substr(bps+1).indexOf(']')
			if (bpe < 0) {
				obj[k] = v
				continue;
			}
			
			var bpv = k.substr(bps+1, bps+bpe-1)
			var k = k.substr(0,bps)
			if (bpv.length <= 0) {
				if (typeof(obj[k]) != 'object') obj[k] = []
				obj[k].push(v)
			} else {
				if (typeof(obj[k]) != 'object') obj[k] = {}
				obj[k][bpv] = v
			}
		}
		return obj;
	
}

jQuery.toQueryString = function(obj) {
	return jQuery.param(obj) //since jQuery 1.4.4
}


/**
* URL Hash management tool
* Example:
*		Hash.set("a=b&c=d")
*			or 
*		Hash.set({a: "b", c: "d"})
			or
		Hash.get('a') -> "b"
			or 
		Hash.go(Hash.set({a:10}))
*/
var Hash = {
	set: function (s) {
		var arg = $.toQueryParams(s)
		var cur = $.toQueryParams(location.hash)
		for (var i in arg)
			cur[i] = arg[i]
		return $.toQueryString(cur);
	},
	
	remove: function (s) {
		var arg = $.toQueryParams(s);
		var cur = $.toQueryParams(location.hash)
		var res = {}
		for (var i in cur) {
			if (arg[i] != undefined)
				continue;
			res[i] = cur[i]
		}
		return $.toQueryString(res)
	},
	
	get: function(key) {
		if (typeof key == 'undefined')
			return $.toQueryParams(location.hash)
		return $.toQueryParams(location.hash)[key]
	},
	
	go: function(s) {
		location.hash = s.substr(0,1)=='#' ? s : '#'+s
		return false
	} 

}

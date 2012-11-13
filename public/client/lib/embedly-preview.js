var Mustache = function() {
	var a = function() {
	};
	a.prototype = {
		otag : "{{",
		ctag : "}}",
		pragmas : {},
		buffer : [],
		pragmas_implemented : {
			"IMPLICIT-ITERATOR" : true
		},
		context : {},
		render : function(e, d, c, f) {
			if (!f) {
				this.context = d;
				this.buffer = []
			}
			if (!this.includes("", e)) {
				if (f) {
					return e
				} else {
					this.send(e);
					return
				}
			}
			e = this.render_pragmas(e);
			var b = this.render_section(e, d, c);
			if (f) {
				return this.render_tags(b, d, c, f)
			}
			this.render_tags(b, d, c, f)
		},
		send : function(b) {
			if (b != "") {
				this.buffer.push(b)
			}
		},
		render_pragmas : function(b) {
			if (!this.includes("%", b)) {
				return b
			}
			var d = this;
			var c = new RegExp(this.otag + "%([\\w-]+) ?([\\w]+=[\\w]+)?"
					+ this.ctag);
			return b
					.replace(
							c,
							function(g, e, f) {
								if (!d.pragmas_implemented[e]) {
									throw ({
										message : "This implementation of mustache doesn't understand the '"
												+ e + "' pragma"
									})
								}
								d.pragmas[e] = {};
								if (f) {
									var h = f.split("=");
									d.pragmas[e][h[0]] = h[1]
								}
								return ""
							})
		},
		render_partial : function(b, d, c) {
			b = this.trim(b);
			if (!c || c[b] === undefined) {
				throw ({
					message : "unknown_partial '" + b + "'"
				})
			}
			if (typeof (d[b]) != "object") {
				return this.render(c[b], d, c, true)
			}
			return this.render(c[b], d[b], c, true)
		},
		render_section : function(d, c, b) {
			if (!this.includes("#", d) && !this.includes("^", d)) {
				return d
			}
			var f = this;
			var e = new RegExp(this.otag + "(\\^|\\#)\\s*(.+)\\s*" + this.ctag
					+ "\n*([\\s\\S]+?)" + this.otag + "\\/\\s*\\2\\s*"
					+ this.ctag + "\\s*", "mg");
			return d.replace(e,
					function(h, i, g, j) {
						var k = f.find(g, c);
						if (i == "^") {
							if (!k || f.is_array(k) && k.length === 0) {
								return f.render(j, c, b, true)
							} else {
								return ""
							}
						} else {
							if (i == "#") {
								if (f.is_array(k)) {
									return f.map(
											k,
											function(l) {
												return f.render(j, f
														.create_context(l), b,
														true)
											}).join("")
								} else {
									if (f.is_object(k)) {
										return f.render(j, f.create_context(k),
												b, true)
									} else {
										if (typeof k === "function") {
											return k.call(c, j, function(l) {
												return f.render(l, c, b, true)
											})
										} else {
											if (k) {
												return f.render(j, c, b, true)
											} else {
												return ""
											}
										}
									}
								}
							}
						}
					})
		},
		render_tags : function(k, b, d, f) {
			var e = this;
			var j = function() {
				return new RegExp(e.otag + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?"
						+ e.ctag + "+", "g")
			};
			var g = j();
			var h = function(n, i, m) {
				switch (i) {
				case "!":
					return "";
				case "=":
					e.set_delimiters(m);
					g = j();
					return "";
				case ">":
					return e.render_partial(m, b, d);
				case "{":
					return e.find(m, b);
				default:
					return e.escape(e.find(m, b))
				}
			};
			var l = k.split("\n");
			for ( var c = 0; c < l.length; c++) {
				l[c] = l[c].replace(g, h, this);
				if (!f) {
					this.send(l[c])
				}
			}
			if (f) {
				return l.join("\n")
			}
		},
		set_delimiters : function(c) {
			var b = c.split(" ");
			this.otag = this.escape_regex(b[0]);
			this.ctag = this.escape_regex(b[1])
		},
		escape_regex : function(c) {
			if (!arguments.callee.sRE) {
				var b = [ "/", ".", "*", "+", "?", "|", "(", ")", "[", "]",
						"{", "}", "\\" ];
				arguments.callee.sRE = new RegExp("(\\" + b.join("|\\") + ")",
						"g")
			}
			return c.replace(arguments.callee.sRE, "\\$1")
		},
		find : function(c, d) {
			c = this.trim(c);
			function b(f) {
				return f === false || f === 0 || f
			}
			var e;
			if (b(d[c])) {
				e = d[c]
			} else {
				if (b(this.context[c])) {
					e = this.context[c]
				}
			}
			if (typeof e === "function") {
				return e.apply(d)
			}
			if (e !== undefined) {
				return e
			}
			return ""
		},
		includes : function(c, b) {
			return b.indexOf(this.otag + c) != -1
		},
		escape : function(b) {
			b = String(b === null ? "" : b);
			return b.replace(/&(?!\w+;)|["<>\\]/g, function(c) {
				switch (c) {
				case "&":
					return "&amp;";
				case "\\":
					return "\\\\";
				case '"':
					return '"';
				case "<":
					return "&lt;";
				case ">":
					return "&gt;";
				default:
					return c
				}
			})
		},
		create_context : function(c) {
			if (this.is_object(c)) {
				return c
			} else {
				var d = ".";
				if (this.pragmas["IMPLICIT-ITERATOR"]) {
					d = this.pragmas["IMPLICIT-ITERATOR"].iterator
				}
				var b = {};
				b[d] = c;
				return b
			}
		},
		is_object : function(b) {
			return b && typeof b == "object"
		},
		is_array : function(b) {
			return Object.prototype.toString.call(b) === "[object Array]"
		},
		trim : function(b) {
			return b.replace(/^\s*|\s*$/g, "")
		},
		map : function(f, d) {
			if (typeof f.map == "function") {
				return f.map(d)
			} else {
				var e = [];
				var b = f.length;
				for ( var c = 0; c < b; c++) {
					e.push(d(f[c]))
				}
				return e
			}
		}
	};
	return ({
		name : "mustache.js",
		version : "0.3.0",
		to_html : function(d, b, c, f) {
			var e = new a();
			if (f) {
				e.send = f
			}
			e.render(d, b, c);
			if (!f) {
				return e.buffer.join("\n")
			}
		}
	})
}();
(function() {
	var u = this;
	var r = u._;
	var b = {};
	var i = Array.prototype, B = Object.prototype, E = Function.prototype;
	var s = i.slice, w = i.unshift, v = B.toString, o = B.hasOwnProperty;
	var m = i.forEach, h = i.map, z = i.reduce, e = i.reduceRight, l = i.filter, a = i.every, y = i.some, t = i.indexOf, f = i.lastIndexOf, c = Array.isArray, A = Object.keys, j = E.bind;
	var D = function(F) {
		return new g(F)
	};
	if (typeof module !== "undefined" && module.exports) {
		module.exports = D;
		D._ = D
	} else {
		u._ = D
	}
	D.VERSION = "1.2.0";
	var d = D.each = D.forEach = function(K, J, I) {
		if (K == null) {
			return
		}
		if (m && K.forEach === m) {
			K.forEach(J, I)
		} else {
			if (K.length === +K.length) {
				for ( var H = 0, F = K.length; H < F; H++) {
					if (H in K && J.call(I, K[H], H, K) === b) {
						return
					}
				}
			} else {
				for ( var G in K) {
					if (o.call(K, G)) {
						if (J.call(I, K[G], G, K) === b) {
							return
						}
					}
				}
			}
		}
	};
	D.map = function(I, H, G) {
		var F = [];
		if (I == null) {
			return F
		}
		if (h && I.map === h) {
			return I.map(H, G)
		}
		d(I, function(L, J, K) {
			F[F.length] = H.call(G, L, J, K)
		});
		return F
	};
	D.reduce = D.foldl = D.inject = function(J, I, F, H) {
		var G = F !== void 0;
		if (J == null) {
			J = []
		}
		if (z && J.reduce === z) {
			if (H) {
				I = D.bind(I, H)
			}
			return G ? J.reduce(I, F) : J.reduce(I)
		}
		d(J, function(M, K, L) {
			if (!G) {
				F = M;
				G = true
			} else {
				F = I.call(H, F, M, K, L)
			}
		});
		if (!G) {
			throw new TypeError("Reduce of empty array with no initial value")
		}
		return F
	};
	D.reduceRight = D.foldr = function(I, H, F, G) {
		if (I == null) {
			I = []
		}
		if (e && I.reduceRight === e) {
			if (G) {
				H = D.bind(H, G)
			}
			return F !== void 0 ? I.reduceRight(H, F) : I.reduceRight(H)
		}
		var J = (D.isArray(I) ? I.slice() : D.toArray(I)).reverse();
		return D.reduce(J, H, F, G)
	};
	D.find = D.detect = function(I, H, G) {
		var F;
		p(I, function(L, J, K) {
			if (H.call(G, L, J, K)) {
				F = L;
				return true
			}
		});
		return F
	};
	D.filter = D.select = function(I, H, G) {
		var F = [];
		if (I == null) {
			return F
		}
		if (l && I.filter === l) {
			return I.filter(H, G)
		}
		d(I, function(L, J, K) {
			if (H.call(G, L, J, K)) {
				F[F.length] = L
			}
		});
		return F
	};
	D.reject = function(I, H, G) {
		var F = [];
		if (I == null) {
			return F
		}
		d(I, function(L, J, K) {
			if (!H.call(G, L, J, K)) {
				F[F.length] = L
			}
		});
		return F
	};
	D.every = D.all = function(I, H, G) {
		var F = true;
		if (I == null) {
			return F
		}
		if (a && I.every === a) {
			return I.every(H, G)
		}
		d(I, function(L, J, K) {
			if (!(F = F && H.call(G, L, J, K))) {
				return b
			}
		});
		return F
	};
	var p = D.some = D.any = function(I, H, G) {
		H = H || D.identity;
		var F = false;
		if (I == null) {
			return F
		}
		if (y && I.some === y) {
			return I.some(H, G)
		}
		d(I, function(L, J, K) {
			if (F |= H.call(G, L, J, K)) {
				return b
			}
		});
		return !!F
	};
	D.include = D.contains = function(H, G) {
		var F = false;
		if (H == null) {
			return F
		}
		if (t && H.indexOf === t) {
			return H.indexOf(G) != -1
		}
		p(H, function(I) {
			if (F = I === G) {
				return true
			}
		});
		return F
	};
	D.invoke = function(G, H) {
		var F = s.call(arguments, 2);
		return D.map(G, function(I) {
			return (H.call ? H || I : I[H]).apply(I, F)
		})
	};
	D.pluck = function(G, F) {
		return D.map(G, function(H) {
			return H[F]
		})
	};
	D.max = function(I, H, G) {
		if (!H && D.isArray(I)) {
			return Math.max.apply(Math, I)
		}
		if (!H && D.isEmpty(I)) {
			return -Infinity
		}
		var F = {
			computed : -Infinity
		};
		d(I, function(M, J, L) {
			var K = H ? H.call(G, M, J, L) : M;
			K >= F.computed && (F = {
				value : M,
				computed : K
			})
		});
		return F.value
	};
	D.min = function(I, H, G) {
		if (!H && D.isArray(I)) {
			return Math.min.apply(Math, I)
		}
		if (!H && D.isEmpty(I)) {
			return Infinity
		}
		var F = {
			computed : Infinity
		};
		d(I, function(M, J, L) {
			var K = H ? H.call(G, M, J, L) : M;
			K < F.computed && (F = {
				value : M,
				computed : K
			})
		});
		return F.value
	};
	D.shuffle = function(H) {
		var F = [], G;
		d(H, function(K, I, J) {
			if (I == 0) {
				F[0] = K
			} else {
				G = Math.floor(Math.random() * (I + 1));
				F[I] = F[G];
				F[G] = K
			}
		});
		return F
	};
	D.sortBy = function(H, G, F) {
		return D.pluck(D.map(H, function(K, I, J) {
			return {
				value : K,
				criteria : G.call(F, K, I, J)
			}
		}).sort(function(L, K) {
			var J = L.criteria, I = K.criteria;
			return J < I ? -1 : J > I ? 1 : 0
		}), "value")
	};
	D.groupBy = function(H, G) {
		var F = {};
		d(H, function(K, I) {
			var J = G(K, I);
			(F[J] || (F[J] = [])).push(K)
		});
		return F
	};
	D.sortedIndex = function(K, J, H) {
		H || (H = D.identity);
		var F = 0, I = K.length;
		while (F < I) {
			var G = (F + I) >> 1;
			H(K[G]) < H(J) ? F = G + 1 : I = G
		}
		return F
	};
	D.toArray = function(F) {
		if (!F) {
			return []
		}
		if (F.toArray) {
			return F.toArray()
		}
		if (D.isArray(F)) {
			return s.call(F)
		}
		if (D.isArguments(F)) {
			return s.call(F)
		}
		return D.values(F)
	};
	D.size = function(F) {
		return D.toArray(F).length
	};
	D.first = D.head = function(H, G, F) {
		return (G != null) && !F ? s.call(H, 0, G) : H[0]
	};
	D.initial = function(H, G, F) {
		return s.call(H, 0, H.length - ((G == null) || F ? 1 : G))
	};
	D.last = function(H, G, F) {
		return (G != null) && !F ? s.call(H, H.length - G) : H[H.length - 1]
	};
	D.rest = D.tail = function(H, F, G) {
		return s.call(H, (F == null) || G ? 1 : F)
	};
	D.compact = function(F) {
		return D.filter(F, function(G) {
			return !!G
		})
	};
	D.flatten = function(F) {
		return D.reduce(F, function(G, H) {
			if (D.isArray(H)) {
				return G.concat(D.flatten(H))
			}
			G[G.length] = H;
			return G
		}, [])
	};
	D.without = function(F) {
		return D.difference(F, s.call(arguments, 1))
	};
	D.uniq = D.unique = function(J, I, H) {
		var G = H ? D.map(J, H) : J;
		var F = [];
		D.reduce(G, function(K, M, L) {
			if (0 == L || (I === true ? D.last(K) != M : !D.include(K, M))) {
				K[K.length] = M;
				F[F.length] = J[L]
			}
			return K
		}, []);
		return F
	};
	D.union = function() {
		return D.uniq(D.flatten(arguments))
	};
	D.intersection = D.intersect = function(G) {
		var F = s.call(arguments, 1);
		return D.filter(D.uniq(G), function(H) {
			return D.every(F, function(I) {
				return D.indexOf(I, H) >= 0
			})
		})
	};
	D.difference = function(G, F) {
		return D.filter(G, function(H) {
			return !D.include(F, H)
		})
	};
	D.zip = function() {
		var F = s.call(arguments);
		var I = D.max(D.pluck(F, "length"));
		var H = new Array(I);
		for ( var G = 0; G < I; G++) {
			H[G] = D.pluck(F, "" + G)
		}
		return H
	};
	D.indexOf = function(J, H, I) {
		if (J == null) {
			return -1
		}
		var G, F;
		if (I) {
			G = D.sortedIndex(J, H);
			return J[G] === H ? G : -1
		}
		if (t && J.indexOf === t) {
			return J.indexOf(H)
		}
		for (G = 0, F = J.length; G < F; G++) {
			if (J[G] === H) {
				return G
			}
		}
		return -1
	};
	D.lastIndexOf = function(H, G) {
		if (H == null) {
			return -1
		}
		if (f && H.lastIndexOf === f) {
			return H.lastIndexOf(G)
		}
		var F = H.length;
		while (F--) {
			if (H[F] === G) {
				return F
			}
		}
		return -1
	};
	D.range = function(K, I, J) {
		if (arguments.length <= 1) {
			I = K || 0;
			K = 0
		}
		J = arguments[2] || 1;
		var G = Math.max(Math.ceil((I - K) / J), 0);
		var F = 0;
		var H = new Array(G);
		while (F < G) {
			H[F++] = K;
			K += J
		}
		return H
	};
	D.bind = function(G, H) {
		if (G.bind === j && j) {
			return j.apply(G, s.call(arguments, 1))
		}
		var F = s.call(arguments, 2);
		return function() {
			return G.apply(H, F.concat(s.call(arguments)))
		}
	};
	D.bindAll = function(G) {
		var F = s.call(arguments, 1);
		if (F.length == 0) {
			F = D.functions(G)
		}
		d(F, function(H) {
			G[H] = D.bind(G[H], G)
		});
		return G
	};
	D.memoize = function(H, G) {
		var F = {};
		G || (G = D.identity);
		return function() {
			var I = G.apply(this, arguments);
			return o.call(F, I) ? F[I] : (F[I] = H.apply(this, arguments))
		}
	};
	D.delay = function(G, H) {
		var F = s.call(arguments, 2);
		return setTimeout(function() {
			return G.apply(G, F)
		}, H)
	};
	D.defer = function(F) {
		return D.delay.apply(D, [ F, 1 ].concat(s.call(arguments, 1)))
	};
	var x = function(G, I, F) {
		var H;
		return function() {
			var K = this, J = arguments;
			var L = function() {
				H = null;
				G.apply(K, J)
			};
			if (F) {
				clearTimeout(H)
			}
			if (F || !H) {
				H = setTimeout(L, I)
			}
		}
	};
	D.throttle = function(F, G) {
		return x(F, G, false)
	};
	D.debounce = function(F, G) {
		return x(F, G, true)
	};
	D.once = function(H) {
		var F = false, G;
		return function() {
			if (F) {
				return G
			}
			F = true;
			return G = H.apply(this, arguments)
		}
	};
	D.wrap = function(F, G) {
		return function() {
			var H = [ F ].concat(s.call(arguments));
			return G.apply(this, H)
		}
	};
	D.compose = function() {
		var F = s.call(arguments);
		return function() {
			var G = s.call(arguments);
			for ( var H = F.length - 1; H >= 0; H--) {
				G = [ F[H].apply(this, G) ]
			}
			return G[0]
		}
	};
	D.after = function(G, F) {
		return function() {
			if (--G < 1) {
				return F.apply(this, arguments)
			}
		}
	};
	D.keys = A || function(H) {
		if (H !== Object(H)) {
			throw new TypeError("Invalid object")
		}
		var G = [];
		for ( var F in H) {
			if (o.call(H, F)) {
				G[G.length] = F
			}
		}
		return G
	};
	D.values = function(F) {
		return D.map(F, D.identity)
	};
	D.functions = D.methods = function(H) {
		var G = [];
		for ( var F in H) {
			if (D.isFunction(H[F])) {
				G.push(F)
			}
		}
		return G.sort()
	};
	D.extend = function(F) {
		d(s.call(arguments, 1), function(G) {
			for ( var H in G) {
				if (G[H] !== void 0) {
					F[H] = G[H]
				}
			}
		});
		return F
	};
	D.defaults = function(F) {
		d(s.call(arguments, 1), function(G) {
			for ( var H in G) {
				if (F[H] == null) {
					F[H] = G[H]
				}
			}
		});
		return F
	};
	D.clone = function(F) {
		return D.isArray(F) ? F.slice() : D.extend({}, F)
	};
	D.tap = function(G, F) {
		F(G);
		return G
	};
	function C(U, S, I) {
		if (U === S) {
			return U !== 0 || 1 / U == 1 / S
		}
		if ((U == null) || (S == null)) {
			return U === S
		}
		if (U._chain) {
			U = U._wrapped
		}
		if (S._chain) {
			S = S._wrapped
		}
		if (D.isFunction(U.isEqual)) {
			return U.isEqual(S)
		}
		if (D.isFunction(S.isEqual)) {
			return S.isEqual(U)
		}
		var O = typeof U;
		if (O != typeof S) {
			return false
		}
		if (!U != !S) {
			return false
		}
		if (D.isNaN(U)) {
			return D.isNaN(S)
		}
		var R = D.isString(U), Q = D.isString(S);
		if (R || Q) {
			return R && Q && String(U) == String(S)
		}
		var V = D.isNumber(U), T = D.isNumber(S);
		if (V || T) {
			return V && T && +U == +S
		}
		var G = D.isBoolean(U), F = D.isBoolean(S);
		if (G || F) {
			return G && F && +U == +S
		}
		var M = D.isDate(U), L = D.isDate(S);
		if (M || L) {
			return M && L && U.getTime() == S.getTime()
		}
		var K = D.isRegExp(U), J = D.isRegExp(S);
		if (K || J) {
			return K && J && U.source == S.source && U.global == S.global
					&& U.multiline == S.multiline
					&& U.ignoreCase == S.ignoreCase
		}
		if (O != "object") {
			return false
		}
		var H = I.length;
		while (H--) {
			if (I[H] == U) {
				return true
			}
		}
		I.push(U);
		var P = 0, N = true;
		if (U.length === +U.length || S.length === +S.length) {
			P = U.length;
			N = P == S.length;
			if (N) {
				while (P--) {
					if (!(N = P in U == P in S && C(U[P], S[P], I))) {
						break
					}
				}
			}
		} else {
			for ( var W in U) {
				if (o.call(U, W)) {
					P++;
					if (!(N = o.call(S, W) && C(U[W], S[W], I))) {
						break
					}
				}
			}
			if (N) {
				for (W in S) {
					if (o.call(S, W) && !P--) {
						break
					}
				}
				N = !P
			}
		}
		I.pop();
		return N
	}
	D.isEqual = function(G, F) {
		return C(G, F, [])
	};
	D.isEmpty = function(G) {
		if (D.isArray(G) || D.isString(G)) {
			return G.length === 0
		}
		for ( var F in G) {
			if (o.call(G, F)) {
				return false
			}
		}
		return true
	};
	D.isElement = function(F) {
		return !!(F && F.nodeType == 1)
	};
	D.isArray = c || function(F) {
		return v.call(F) === "[object Array]"
	};
	D.isObject = function(F) {
		return F === Object(F)
	};
	D.isArguments = function(F) {
		return !!(F && o.call(F, "callee"))
	};
	D.isFunction = function(F) {
		return !!(F && F.constructor && F.call && F.apply)
	};
	D.isString = function(F) {
		return !!(F === "" || (F && F.charCodeAt && F.substr))
	};
	D.isNumber = function(F) {
		return !!(F === 0 || (F && F.toExponential && F.toFixed))
	};
	D.isNaN = function(F) {
		return F !== F
	};
	D.isBoolean = function(F) {
		return F === true || F === false || v.call(F) == "[object Boolean]"
	};
	D.isDate = function(F) {
		return !!(F && F.getTimezoneOffset && F.setUTCFullYear)
	};
	D.isRegExp = function(F) {
		return !!(F && F.test && F.exec && (F.ignoreCase || F.ignoreCase === false))
	};
	D.isNull = function(F) {
		return F === null
	};
	D.isUndefined = function(F) {
		return F === void 0
	};
	D.noConflict = function() {
		u._ = r;
		return this
	};
	D.identity = function(F) {
		return F
	};
	D.times = function(I, H, G) {
		for ( var F = 0; F < I; F++) {
			H.call(G, F)
		}
	};
	D.escape = function(F) {
		return ("" + F).replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, "&amp;")
				.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g,
						"&quot;").replace(/'/g, "&#x27;").replace(/\//g,
						"&#x2F;")
	};
	D.mixin = function(F) {
		d(D.functions(F), function(G) {
			q(G, D[G] = F[G])
		})
	};
	var k = 0;
	D.uniqueId = function(F) {
		var G = k++;
		return F ? F + G : G
	};
	D.templateSettings = {
		evaluate : /<%([\s\S]+?)%>/g,
		interpolate : /<%=([\s\S]+?)%>/g,
		escape : /<%-([\s\S]+?)%>/g
	};
	D.template = function(I, H) {
		var J = D.templateSettings;
		var F = "var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"
				+ I.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(
						J.escape,
						function(K, L) {
							return "',_.escape(" + L.replace(/\\'/g, "'")
									+ "),'"
						}).replace(J.interpolate, function(K, L) {
					return "'," + L.replace(/\\'/g, "'") + ",'"
				}).replace(
						J.evaluate || null,
						function(K, L) {
							return "');"
									+ L.replace(/\\'/g, "'").replace(
											/[\r\n\t]/g, " ") + "__p.push('"
						}).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(
						/\t/g, "\\t") + "');}return __p.join('');";
		var G = new Function("obj", F);
		return H ? G(H) : G
	};
	var g = function(F) {
		this._wrapped = F
	};
	D.prototype = g.prototype;
	var n = function(G, F) {
		return F ? D(G).chain() : G
	};
	var q = function(F, G) {
		g.prototype[F] = function() {
			var H = s.call(arguments);
			w.call(H, this._wrapped);
			return n(G.apply(D, H), this._chain)
		}
	};
	D.mixin(D);
	d([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ],
			function(F) {
				var G = i[F];
				g.prototype[F] = function() {
					G.apply(this._wrapped, arguments);
					return n(this._wrapped, this._chain)
				}
			});
	d([ "concat", "join", "slice" ], function(F) {
		var G = i[F];
		g.prototype[F] = function() {
			return n(G.apply(this._wrapped, arguments), this._chain)
		}
	});
	g.prototype.chain = function() {
		this._chain = true;
		return this
	};
	g.prototype.value = function() {
		return this._wrapped
	}
})();
(function(e) {
	function b() {
		if (e.preview !== undefined && e.preview.debug && console) {
			console.log(Array.prototype.slice.call(arguments))
		}
	}
	/*
	 * ! linkify - v0.3 - 6/27/2009 http://benalman.com/code/test/js-linkify/
	 * 
	 * Copyright (c) 2009 "Cowboy" Ben Alman Licensed under the MIT license
	 * http://benalman.com/about/license/
	 * 
	 * Some regexps adapted from http://userscripts.org/scripts/review/7122
	 */
	window.linkify = (function() {
		var k = "[a-z\\d.-]+://", m = "(?:(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\.){3}(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])", l = "(?:(?:[^\\s!@#$%^&*()_=+[\\]{}\\\\|;:'\",.<>/?]+)\\.)+", s = "(?:ac|ad|aero|ae|af|ag|ai|al|am|an|ao|aq|arpa|ar|asia|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|biz|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|cat|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|coop|com|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|info|int|in|io|iq|ir|is|it|je|jm|jobs|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mobi|mo|mp|mq|mr|ms|mt|museum|mu|mv|mw|mx|my|mz|name|na|nc|net|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pro|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|to|tp|travel|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|xn--0zwm56d|xn--11b5bs3a9aj6g|xn--80akhbyknj4f|xn--9t4b11yi5a|xn--deba0ad|xn--g6w251d|xn--hgbk6aj7f53bba|xn--hlcj6aya9esc7a|xn--jxalpdlp|xn--kgbechtv|xn--zckzah|ye|yt|yu|za|zm|zw)", h = "(?:"
				+ l + s + "|" + m + ")", t = "(?:[;/][^#?<>\\s]*)?", i = "(?:\\?[^#<>\\s]*)?(?:#[^<>\\s]*)?", j = "\\b"
				+ k + "[^<>\\s]+", g = "\\b" + h + t + i + "(?!\\w)", r = "mailto:", n = "(?:"
				+ r
				+ ")?[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@"
				+ h + i + "(?!\\w)", f = new RegExp("(?:" + j + "|" + g + "|"
				+ n + ")", "ig"), p = new RegExp("^" + k, "i"), q = {
			"'" : "`",
			">" : "<",
			")" : "(",
			"]" : "[",
			"}" : "{",
			"Ã‚Â»" : "Ã‚Â«",
			"Ã¢â‚¬Âº" : "Ã¢â‚¬Â¹"
		}, o = {
			callback : function(v, u) {
				return u ? '<a href="' + u + '" title="' + u + '">' + v
						+ "</a>" : v
			},
			punct_regexp : /(?:[!?.,:;'"]|(?:&|&amp;)(?:lt|gt|quot|apos|raquo|laquo|rsaquo|lsaquo);)$/
		};
		return function(A, J) {
			J = J || {};
			var C, z, E, v, B = "", y = [], x, I, H, u, w, G, F, D;
			for (z in o) {
				if (J[z] === undefined) {
					J[z] = o[z]
				}
			}
			while (C = f.exec(A)) {
				E = C[0];
				I = f.lastIndex;
				H = I - E.length;
				if (/[\/:]/.test(A.charAt(H - 1))) {
					continue
				}
				do {
					u = E;
					D = E.substr(-1);
					F = q[D];
					if (F) {
						w = E.match(new RegExp("\\" + F + "(?!$)", "g"));
						G = E.match(new RegExp("\\" + D, "g"));
						if ((w ? w.length : 0) < (G ? G.length : 0)) {
							E = E.substr(0, E.length - 1);
							I--
						}
					}
					if (J.punct_regexp) {
						E = E.replace(J.punct_regexp, function(K) {
							I -= K.length;
							return ""
						})
					}
				} while (E.length && E !== u);
				v = E;
				if (!p.test(v)) {
					v = (v.indexOf("@") !== -1 ? (!v.indexOf(r) ? "" : r) : !v
							.indexOf("irc.") ? "irc://"
							: !v.indexOf("ftp.") ? "ftp://" : "http://")
							+ v
				}
				if (x != H) {
					y.push([ A.slice(x, H) ]);
					x = I
				}
				y.push([ E, v ])
			}
			y.push([ A.substr(x) ]);
			for (z = 0; z < y.length; z++) {
				B += J.callback.apply(window, y[z])
			}
			return B || A
		}
	})();
	function a(h, f) {
		var g = {
			selector : ".selector",
			type : "small",
			template : null,
			elem : null,
			partials : {
				images_small : [ '<div class="emdthumbnail">',
						'<div class="emdcontrols">',
						'<a class="left" href="#">&#9664;</a>',
						'<a class="right" href="#">&#9654;</a>',
						'<a class="nothumb" href="#">&#10005;</a>', "</div>",
						'<div class="items">', '<ul class="images">',
						"{{#images}}", '<li><img src="{{url}}"/></li>',
						"{{/images}}", "</ul>", "</div>", "</div>" ].join(""),
				images_large : [ '<div class="emdthumbnail">',
						'<a class="left" href="#">&#9664;</a>',
						'<div class="items">', '<ul class="images">',
						"{{#images}}", '<li><img src="{{url}}"/></li>',
						"{{/images}}", "</ul>", "</div>",
						'<a class="right" href="#">&#9654;</a>',
						'<a class="nothumb" href="#">&#10005;</a>', "</div>" ]
						.join(""),
				attributes : [ '<a class="title" href="#">{{title}}</a>',
						'<p><a class="description" href="#">{{description}}</a></p>' ]
						.join(""),
				title : '<a class="title" href="#">{{title}}</a>',
				description : '<p><a class="description" href="#">{{description}}</a></p>',
				favicon : '<img class="favicon" src="{{favicon_url}}">'
			},
			templates : {
				small : [
						'<div class="selector small">',
						"{{>images_small}}",
						'<div class="attributes">',
						"{{>attributes}}",
						'<span class="meta">',
						"{{>favicon}}",
						'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
						"</span>",
						"</div>",
						'<div class="action"><a href="#" class="close">&#10005;</a></div>',
						"</div>" ].join(""),
				large : [
						'<div class="selector large">',
						"{{>title}}",
						"{{>images_large}}",
						'<div class="attributes">',
						"{{>description}}",
						'<span class="meta">',
						"{{>favicon}}",
						'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
						"</span>", "</div>", "</div>" ].join(""),
				rich : {
					video : [
							'<div class="selector rich">',
							"{{>title}}",
							"{{>object}}",
							'<div class="attributes">',
							"{{>description}}",
							'<span class="meta">',
							"{{>favicon}}",
							'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
							"</span>", "</div>", "</div>" ].join(""),
					rich : [
							'<div class="selector rich">',
							"{{>title}}",
							"{{>object}}",
							'<div class="attributes">',
							"{{>description}}",
							'<span class="meta">',
							"{{>favicon}}",
							'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
							"</span>", "</div>", "</div>" ].join(""),
					photo : [
							'<div class="selector rich">',
							"{{>title}}",
							"{{>object}}",
							'<div class="attributes">',
							"{{>description}}",
							'<span class="meta">',
							"{{>favicon}}",
							'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
							"</span>", "</div>", "</div>" ].join(""),
					link : [
							'<div class="selector rich">',
							"{{>images_small}}",
							'<div class="attributes">',
							"{{>attributes}}",
							'<span class="meta">',
							"{{>favicon}}",
							'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
							"</span>", "</div>", "</div>" ].join("")
				}
			},
			render : function(m) {
				var l = null;
				if (this.template !== null) {
					l = this.template
				} else {
					l = this.templates[this.type]
				}
				if (_.isObject(l)) {
					l = l[m.object_type]
				}
				var i = this.toView(m);
				var k = this.toPartials(m);
				var j = Mustache.to_html(l, i, k);
				if (h.find(this.selector).length) {
					this.elem = h.find(this.selector).replaceWith(j)
				} else {
					this.elem = h.append(j)
				}
				this.elem = h.find(this.selector);
				this.elem.show();
				if (m.images.length > 0) {
					h.find("#id_thumbnail_url").val(
							encodeURIComponent(m.images[0].url))
				} else {
					this.elem.find(".emdthumbnail").hide()
				}
				if (m.images.length === 1) {
					this.elem.find(".left, .right").hide()
				}
				this.bind()
			},
			toView : function(i) {
				return i
			},
			toPartials : function(j) {
				var i = e.extend(true, {}, this.partials);
				i.object = "";
				if (j.object
						&& (j.object.type === "video" || j.object.type === "rich")) {
					i.object = '<div class="media">{{{html}}}</div>'
				} else {
					if (j.object && j.object.type === "photo") {
						i.object = '<div class="media"><img src="{{url}}"/></div>'
					}
				}
				if (!j.favion_url) {
					i.favicon = ""
				}
				return i
			},
			clear : function(i) {
				if (i !== undefined) {
					i.preventDefault()
				}
				this.elem.html("");
				this.elem.hide();
				h.find('input[type="hidden"].preview_input').remove()
			},
			scroll : function(l, o) {
				o.preventDefault();
				var j = this.elem.find(".images");
				var m = parseInt(j.find("li").css("width"), 10);
				var n = parseInt(j.css("left"), 10);
				var i = j.find("img").length * m;
				if (l === "left") {
					n = parseInt(n, 10) + m;
					if (n > 0) {
						return false
					}
				} else {
					if (l === "right") {
						n = parseInt(n, 10) - m;
						if (n <= -i) {
							return false
						}
					} else {
						b("not a valid direction: " + l);
						return false
					}
				}
				var k = encodeURIComponent(j.find("img").eq((n / -100)).attr(
						"src"));
				h.find("#id_thumbnail_url").val(k);
				j.css("left", n + "px")
			},
			nothumb : function(i) {
				i.preventDefault();
				this.elem.find(".emdthumbnail").hide();
				h.find("#id_thumbnail_url").val("")
			},
			title : function(k) {
				k.preventDefault();
				var j = e("<input/>").attr({
					value : e(k.target).text(),
					"class" : "title",
					type : "text"
				});
				e(k.target).replaceWith(j);
				j.focus();
				var i = this.title;
				j.one("blur", function(n) {
					var m = e(n.target);
					h.find("#id_title").val(encodeURIComponent(m.val()));
					var l = e("<a/>").attr({
						"class" : "title",
						href : "#"
					}).text(m.val());
					e(n.target).replaceWith(l);
					l.bind("click", i)
				})
			},
			description : function(j) {
				j.preventDefault();
				var i = e("<textarea/>").attr({
					"class" : "description"
				}).text(e(j.target).text());
				e(j.target).replaceWith(i);
				i.focus();
				var k = this.description;
				i.one("blur", function(n) {
					var m = e(n.target);
					h.find("#id_description").val(encodeURIComponent(m.val()));
					var l = e("<a/>").attr({
						"class" : "description",
						href : "#"
					}).text(m.val());
					e(n.target).replaceWith(l);
					l.bind("click", k)
				})
			},
			update : function(i) {
				this.elem.find("." + e(i.target).attr("name")).text(
						e(i.target).val())
			},
			bind : function() {
				this.elem.find(".left").bind("click",
						_.bind(this.scroll, {}, "left"));
				this.elem.find(".right").bind("click",
						_.bind(this.scroll, {}, "right"));
				this.elem.find(".nothumb").bind("click", this.nothumb);
				this.elem.find(".action .close").bind("click", this.clear);
				this.elem.bind("mouseenter mouseleave", function() {
					e(this).find(".action").toggle()
				});
				this.elem.find(".emdthumbnail").one("mouseenter", function() {
					e(this).bind("mouseenter mouseleave", function() {
						e(this).find(".emdcontrols").toggle()
					})
				});
				this.elem.find(".title").bind("click", this.title);
				this.elem.find(".description").bind("click", this.description)
			}
		};
		_.extend(g, f);
		_.bindAll(g);
		return g
	}
	function d(g) {
		var f = {
			selector : "#feed",
			type : "small",
			template : null,
			partials : {
				emdthumbnail : [ '<div class="emdthumbnail {{object_type}}">',
						'<a href="{{original_url}}" target="_blank">',
						'<img title="{{title}}" src="{{thumbnail_url}}"/>',
						'<span class="overlay"></span>', "</a>", "</div>" ]
						.join("")
			},
			templates : {
				small : [
						'<div class="item">',
						"{{>emdthumbnail}}",
						'<div class="attributes">',
						'<a class="title" href="{{original_url}}" target="_blank">{{title}}</a>',
						'<p class="description">{{description}}</p>',
						'<span class="meta">',
						'<img class="favicon" src="{{favicon_url}}"/>',
						'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
						"</span>", "</div>", '<div class="clearfix"></div>',
						"</div>" ].join(""),
				status : [
						'<div class="item">',
						'<div class="status">{{{status_linked}}}</div>',
						"{{>emdthumbnail}}",
						'<div class="attributes">',
						'<a class="title" href="{{original_url}}" target="_blank">{{title}}</a>',
						'<p class="description">{{description}}</p>',
						'<span class="meta">',
						'<img class="favicon" src="{{favicon_url}}"/>',
						'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
						"</span>", "</div>", '<div class="clearfix"></div>',
						"</div>" ].join(""),
				rich : {
					video : [
							'<div class="item video">',
							'<a class="title" href="{{original_url}}" target="_blank">{{title}}</a>',
							"{{>object}}",
							'<div class="attributes">',
							'<p class="description">{{description}}</p>',
							'<span class="meta">',
							'<img class="favicon" src="{{favicon_url}}"/>',
							'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
							"</span>", "</div>",
							'<div class="clearfix"></div>', "</div>" ].join(""),
					rich : [
							'<div class="item rich">',
							'<a class="title" href="{{original_url}}" target="_blank">{{title}}</a>',
							"{{>object}}",
							'<div class="attributes">',
							'<p class="description">{{description}}</p>',
							'<span class="meta">',
							'<img class="favicon" src="{{favicon_url}}"/>',
							'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
							"</span>", "</div>",
							'<div class="clearfix"></div>', "</div>" ].join(""),
					photo : [
							'<div class="item photo">',
							'<a class="title" href="{{original_url}}" target="_blank">{{title}}</a>',
							"{{>object}}",
							'<div class="attributes">',
							'<p class="description">{{description}}</p>',
							'<span class="meta">',
							'<img class="favicon" src="{{favicon_url}}"/>',
							'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
							"</span>", "</div>",
							'<div class="clearfix"></div>', "</div>" ].join(""),
					link : [
							'<div class="item link">',
							"{{>emdthumbnail}}",
							'<div class="attributes">',
							'<a class="title" href="{{original_url}}" target="_blank">{{title}}</a>',
							'<p class="description">{{description}}</p>',
							'<span class="meta">',
							'<img class="favicon" src="{{favicon_url}}"/>',
							'<a class="emdprovider" href="{{provider_url}}">{{provider_display}}</a>',
							"</span>", "</div>",
							'<div class="clearfix"></div>', "</div>" ].join("")
				}
			},
			toView : function(h) {
				if (h.hasOwnProperty("status")) {
					h.status_linked = linkify(h.status)
				}
				return h
			},
			toPartials : function(i) {
				var h = e.extend(true, {}, this.partials);
				if (!i.thumbnail_url) {
					h.emdthumbnail = ""
				}
				h.object = "";
				if (i.object_type === "video" || i.object_type === "rich") {
					h.object = '<div class="media video">{{{html}}}</div>'
				} else {
					if (i.object_type === "photo" || i.type === "image") {
						h.object = '<div class="media image"><img alt="{{title}}" src="{{image_url}}"/></div>'
					}
				}
				if (this.type === "rich" && i.object_type !== "link") {
					h.emdthumbnail = ""
				}
				return h
			},
			create : function(m) {
				var k = null;
				if (this.template !== null) {
					k = this.template
				} else {
					k = this.templates[this.type]
				}
				if (_.isObject(k)) {
					k = k[m.object_type]
				}
				var h = this.toView(m);
				var j = this.toPartials(m);
				var i = Mustache.to_html(k, h, j);
				var l = e(this.selector).prepend(i).children().first();
				l.data("preview", m)
			},
			play : function(h) {
			},
			bind : function() {
				e(".emdthumbnail.video a, .emdthumbnail.rich a").live("click",
						function(i) {
							i.preventDefault();
							var h = e(this).parents(".item").data("preview");
							e(this).parents(".item").replaceWith(h.html)
						})
			}
		};
		_.extend(f, g);
		_.bindAll(f);
		f.bind();
		return f
	}
	function c(h, f) {
		var g = {
			api_args : [ "key", "maxwidth", "maxheight", "width", "wmode",
					"autoplay", "videosrc", "allowscripts", "words", "chars",
					"secure", "frame" ],
			display_attrs : [ "type", "original_url", "url", "title",
					"description", "favicon_url", "provider_url",
					"provider_display", "safe", "html", "thumbnail_url",
					"object_type", "image_url" ],
			default_data : {},
			debug : false,
			form : null,
			type : "link",
			loading_selector : ".loading",
			options : {
				debug : false,
				selector : {},
				field : null,
				display : {},
				preview : {},
				wmode : "opaque",
				words : 30,
				maxwidth : 560
			},
			init : function(j, i) {
				this.options = _.extend(this.options,
						typeof i !== "undefined" ? i : {});
				var k = {};
				_.each(_.intersection(_.keys(this.options), this.api_args),
						function(m) {
							var l = i[m];
							if (!(_.isNull(l) || _.isUndefined(l))) {
								k[m] = l
							}
						});
				this.default_data = k;
				this.form = f.form ? f.form : j.parents("form");
				this.debug = this.options.debug;
				if (!this.default_data.hasOwnProperty("key")) {
					b("Options did not include a Embedly API key. Aborting.")
				} else {
					this.selector = a(this.form, this.options.selector);
					this.display = d(this.options.display);
					_.extend(this, this.options.preview);
					this.bind()
				}
			},
			getStatusUrl : function(m) {
				var j = h.val();
				if (j === "") {
					return null
				}
				var i = /^http(s?):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
				var l = j.match(i);
				var k = l ? l[0] : null;
				if (k === null) {
					i = /[-\w]+(\.[a-z]{2,})+(\S+)?(\/|\/[\w#!:.?+=&%@!\-\/])?/g;
					l = j.match(i);
					k = l ? "http://" + l[0] : null
				}
				return k
			},
			toggleLoading : function() {
				this.form.find(this.loading_selector).toggle()
			},
			callback : function(j) {
				this.toggleLoading();
				b(j);
				if (!j.hasOwnProperty("type")) {
					b("Embedly returned an invalid response");
					return false
				}
				if (j.type === "error") {
					b("URL (" + j.url + ") returned an error: "
							+ j.error_message);
					return false
				}
				if (!(j.type in {
					html : "",
					image : ""
				})) {
					b("URL (" + j.url + ") returned a type (" + j.type
							+ ") not handled");
					return false
				}
				this.form.find('input[type="hidden"].preview_input').remove();
				var i = this.form;
				_
						.each(
								this.display_attrs,
								function(o) {
									var k = null;
									if (o === "object_type") {
										if (j.hasOwnProperty("object")
												&& j.object
														.hasOwnProperty("type")) {
											k = j.object.type
										} else {
											k = "link"
										}
										j.object_type = k
									} else {
										if (o === "html") {
											if (j.hasOwnProperty("object")
													&& j.object
															.hasOwnProperty("html")) {
												k = j.object.html
											}
										} else {
											if (o === "image_url") {
												if (j.hasOwnProperty("object")
														&& j.object
																.hasOwnProperty("type")
														&& j.object.type === "photo") {
													k = j.object.url
												} else {
													if (j.type === "image") {
														k = j.url
													}
												}
												j.image_url = k
											} else {
												k = j.hasOwnProperty(o) && j[o] ? encodeURIComponent(j[o])
														: ""
											}
										}
									}
									var m = {
										name : o,
										type : "hidden",
										id : "id_" + o,
										value : k
									};
									var l = i.find("#id_" + o);
									if (l.length) {
										if (l.attr("type") === "hidden") {
											l.attr(m)
										} else {
											if (!l.val()) {
												l.val(j[o])
											} else {
												j[o] = l.val()
											}
											l.bind("keyup", function(n) {
												e.preview.selector.update(n)
											})
										}
										l.addClass("preview_input")
									} else {
										m["class"] = "preview_input";
										i.append(e("<input />").attr(m))
									}
								});
				this.selector.render(j)
			},
			errorCallback : function() {
				b("error");
				b(arguments)
			},
			fetch : function(i) {
				if (typeof i === "undefined" || typeof i !== "string") {
					i = this.getStatusUrl()
				}
				if (i === null) {
					return true
				}
				i = e.trim(i);
				var k = this.form.find("#id_original_url").val();
				if (k === encodeURIComponent(i)) {
					return true
				}
				this.toggleLoading();
				var j = _.clone(this.default_data);
				j.url = i;
				e.ajax({
					url : "http://api.embed.ly/1/preview",
					dataType : "jsonp",
					data : j,
					success : this.callback,
					error : this.errorCallback
				});
				return true
			},
			keyUp : function(j) {
				if (j.keyCode !== 32) {
					return null
				}
				var i = this.getStatusUrl();
				if (i === null) {
					return null
				}
				b("onKeyUp url:" + i);
				e(this.status_selector).unbind("keyup");
				this.fetch(i)
			},
			paste : function(i) {
				_.delay(this.fetch, 200)
			},
			_submit : function(j) {
				var i = {};
				this.form.find("textarea, input").not('input[type="submit"]')
						.each(function(k, l) {
							var m = e(l).attr("name");
							if (m !== undefined) {
								i[m] = decodeURIComponent(e(l).val())
							}
						});
				this.selector.clear();
				this.submit(j, i);
				h.val("");
				this.form.find('input[type="hidden"].preview_input').remove()
			},
			submit : function(k, j) {
				k.preventDefault();
				var i = e(k.target);
				e.ajax({
					type : "post",
					url : i.attr("action"),
					data : e.param(j),
					dataType : "json",
					success : this.display.create
				})
			},
			bind : function() {
				b("Starting Bind");
//				h.bind("blur", this.fetch);
				h.bind("keyup", this.keyUp);
//				h.bind("paste", this.paste);
				this.form.bind("submit", this._submit);
//				h.bind("attach", this.fetch)
			}
		};
		_.bindAll(g);
		g.init(h, f);
		return g
	}
	e.fn.preview = function(f, g) {
		 
		e(this).each(function(h, j) {
			 
			e.preview = new c(e(this), f)
		});
		return this
	}
})(jQuery);

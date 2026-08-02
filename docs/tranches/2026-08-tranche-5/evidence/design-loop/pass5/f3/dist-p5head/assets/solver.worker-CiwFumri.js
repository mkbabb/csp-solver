Object.freeze({
	Easy: 0,
	0: "Easy",
	Medium: 1,
	1: "Medium",
	Hard: 2,
	2: "Hard"
});
var F = class L {
	static __wrap(e) {
		const r = Object.create(L.prototype);
		return r.__wbg_ptr = e, M.register(r, r.__wbg_ptr, r), r;
	}
	__destroy_into_raw() {
		const e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, M.unregister(this), e;
	}
	free() {
		const e = this.__destroy_into_raw();
		n.__wbg_futoshikipuzzledata_free(e, 0);
	}
	get board() {
		const e = n.futoshikipuzzledata_board(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
	get boardSize() {
		return n.futoshikipuzzledata_boardSize(this.__wbg_ptr) >>> 0;
	}
	get inequalities() {
		const e = n.futoshikipuzzledata_inequalities(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
};
Symbol.dispose && (F.prototype[Symbol.dispose] = F.prototype.free);
var R = class q {
	static __wrap(e) {
		const r = Object.create(q.prototype);
		return r.__wbg_ptr = e, D.register(r, r.__wbg_ptr, r), r;
	}
	__destroy_into_raw() {
		const e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, D.unregister(this), e;
	}
	free() {
		const e = this.__destroy_into_raw();
		n.__wbg_futoshikisolveresult_free(e, 0);
	}
	get backtracks() {
		const e = n.futoshikisolveresult_backtracks(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get boardSize() {
		return n.futoshikisolveresult_boardSize(this.__wbg_ptr) >>> 0;
	}
	get budgetExceeded() {
		return n.futoshikisolveresult_budgetExceeded(this.__wbg_ptr) !== 0;
	}
	get nodesExplored() {
		const e = n.futoshikisolveresult_nodesExplored(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get propagations() {
		const e = n.futoshikisolveresult_propagations(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get solutionCount() {
		return n.futoshikisolveresult_solutionCount(this.__wbg_ptr) >>> 0;
	}
	get solutions() {
		const e = n.futoshikisolveresult_solutions(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
	get solved() {
		return n.futoshikisolveresult_solved(this.__wbg_ptr) !== 0;
	}
};
Symbol.dispose && (R.prototype[Symbol.dispose] = R.prototype.free);
var A = class H {
	static __wrap(e) {
		const r = Object.create(H.prototype);
		return r.__wbg_ptr = e, j.register(r, r.__wbg_ptr, r), r;
	}
	__destroy_into_raw() {
		const e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, j.unregister(this), e;
	}
	free() {
		const e = this.__destroy_into_raw();
		n.__wbg_kenkenpuzzledata_free(e, 0);
	}
	get board() {
		const e = n.kenkenpuzzledata_board(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
	get boardSize() {
		return n.kenkenpuzzledata_boardSize(this.__wbg_ptr) >>> 0;
	}
	get cages() {
		const e = n.kenkenpuzzledata_cages(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
};
Symbol.dispose && (A.prototype[Symbol.dispose] = A.prototype.free);
var I = class V {
	static __wrap(e) {
		const r = Object.create(V.prototype);
		return r.__wbg_ptr = e, B.register(r, r.__wbg_ptr, r), r;
	}
	__destroy_into_raw() {
		const e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, B.unregister(this), e;
	}
	free() {
		const e = this.__destroy_into_raw();
		n.__wbg_kenkensolveresult_free(e, 0);
	}
	get backtracks() {
		const e = n.kenkensolveresult_backtracks(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get boardSize() {
		return n.kenkensolveresult_boardSize(this.__wbg_ptr) >>> 0;
	}
	get budgetExceeded() {
		return n.kenkensolveresult_budgetExceeded(this.__wbg_ptr) !== 0;
	}
	get nodesExplored() {
		const e = n.kenkensolveresult_nodesExplored(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get propagations() {
		const e = n.kenkensolveresult_propagations(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get solutionCount() {
		return n.kenkensolveresult_solutionCount(this.__wbg_ptr) >>> 0;
	}
	get solutions() {
		const e = n.kenkensolveresult_solutions(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
	get solved() {
		return n.kenkensolveresult_solved(this.__wbg_ptr) !== 0;
	}
};
Symbol.dispose && (I.prototype[Symbol.dispose] = I.prototype.free);
var N = class $ {
	static __wrap(e) {
		const r = Object.create($.prototype);
		return r.__wbg_ptr = e, C.register(r, r.__wbg_ptr, r), r;
	}
	__destroy_into_raw() {
		const e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, C.unregister(this), e;
	}
	free() {
		const e = this.__destroy_into_raw();
		n.__wbg_killerpuzzledata_free(e, 0);
	}
	get board() {
		const e = n.killerpuzzledata_board(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
	get cages() {
		const e = n.killerpuzzledata_cages(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
	get n() {
		return n.killerpuzzledata_n(this.__wbg_ptr) >>> 0;
	}
};
Symbol.dispose && (N.prototype[Symbol.dispose] = N.prototype.free);
var T = class Y {
	static __wrap(e) {
		const r = Object.create(Y.prototype);
		return r.__wbg_ptr = e, O.register(r, r.__wbg_ptr, r), r;
	}
	__destroy_into_raw() {
		const e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, O.unregister(this), e;
	}
	free() {
		const e = this.__destroy_into_raw();
		n.__wbg_killersolveresult_free(e, 0);
	}
	get backtracks() {
		const e = n.killersolveresult_backtracks(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get budgetExceeded() {
		return n.killersolveresult_budgetExceeded(this.__wbg_ptr) !== 0;
	}
	get n() {
		return n.killersolveresult_n(this.__wbg_ptr) >>> 0;
	}
	get nodesExplored() {
		const e = n.killersolveresult_nodesExplored(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get propagations() {
		const e = n.killersolveresult_propagations(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get solutionCount() {
		return n.killersolveresult_solutionCount(this.__wbg_ptr) >>> 0;
	}
	get solutions() {
		const e = n.killersolveresult_solutions(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
	get solved() {
		return n.killersolveresult_solved(this.__wbg_ptr) !== 0;
	}
};
Symbol.dispose && (T.prototype[Symbol.dispose] = T.prototype.free);
Object.freeze({
	Easy: 0,
	0: "Easy",
	Medium: 1,
	1: "Medium",
	Hard: 2,
	2: "Hard"
});
var x = class J {
	static __wrap(e) {
		const r = Object.create(J.prototype);
		return r.__wbg_ptr = e, P.register(r, r.__wbg_ptr, r), r;
	}
	__destroy_into_raw() {
		const e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, P.unregister(this), e;
	}
	free() {
		const e = this.__destroy_into_raw();
		n.__wbg_sudokusolveresult_free(e, 0);
	}
	get backtracks() {
		const e = n.sudokusolveresult_backtracks(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get budgetExceeded() {
		return n.sudokusolveresult_budgetExceeded(this.__wbg_ptr) !== 0;
	}
	get n() {
		return n.sudokusolveresult_n(this.__wbg_ptr) >>> 0;
	}
	get nodesExplored() {
		const e = n.sudokusolveresult_nodesExplored(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get propagations() {
		const e = n.sudokusolveresult_propagations(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get solutionCount() {
		return n.sudokusolveresult_solutionCount(this.__wbg_ptr) >>> 0;
	}
	get solutions() {
		const e = n.sudokusolveresult_solutions(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
	get solved() {
		return n.sudokusolveresult_solved(this.__wbg_ptr) !== 0;
	}
};
Symbol.dispose && (x.prototype[Symbol.dispose] = x.prototype.free);
var K = class Q {
	static __wrap(e) {
		const r = Object.create(Q.prototype);
		return r.__wbg_ptr = e, W.register(r, r.__wbg_ptr, r), r;
	}
	__destroy_into_raw() {
		const e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, W.unregister(this), e;
	}
	free() {
		const e = this.__destroy_into_raw();
		n.__wbg_thermopuzzledata_free(e, 0);
	}
	get board() {
		const e = n.thermopuzzledata_board(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
	get n() {
		return n.thermopuzzledata_n(this.__wbg_ptr) >>> 0;
	}
	get thermometers() {
		const e = n.thermopuzzledata_thermometers(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
};
Symbol.dispose && (K.prototype[Symbol.dispose] = K.prototype.free);
var U = class Z {
	static __wrap(e) {
		const r = Object.create(Z.prototype);
		return r.__wbg_ptr = e, X.register(r, r.__wbg_ptr, r), r;
	}
	__destroy_into_raw() {
		const e = this.__wbg_ptr;
		return this.__wbg_ptr = 0, X.unregister(this), e;
	}
	free() {
		const e = this.__destroy_into_raw();
		n.__wbg_thermosolveresult_free(e, 0);
	}
	get backtracks() {
		const e = n.thermosolveresult_backtracks(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get budgetExceeded() {
		return n.thermosolveresult_budgetExceeded(this.__wbg_ptr) !== 0;
	}
	get n() {
		return n.thermosolveresult_n(this.__wbg_ptr) >>> 0;
	}
	get nodesExplored() {
		const e = n.thermosolveresult_nodesExplored(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get propagations() {
		const e = n.thermosolveresult_propagations(this.__wbg_ptr);
		return BigInt.asUintN(64, e);
	}
	get solutionCount() {
		return n.thermosolveresult_solutionCount(this.__wbg_ptr) >>> 0;
	}
	get solutions() {
		const e = n.thermosolveresult_solutions(this.__wbg_ptr);
		var r = c(e[0], e[1]).slice();
		return n.__wbindgen_free(e[0], e[1] * 4, 4), r;
	}
	get solved() {
		return n.thermosolveresult_solved(this.__wbg_ptr) !== 0;
	}
};
Symbol.dispose && (U.prototype[Symbol.dispose] = U.prototype.free);
function te(t, e, r) {
	const s = n.generateFutoshiki(t, e, r);
	if (s[2]) throw d(s[1]);
	return F.__wrap(s[0]);
}
function re(t, e, r) {
	const s = n.generateKenKen(t, e, r);
	if (s[2]) throw d(s[1]);
	return A.__wrap(s[0]);
}
function ne(t, e, r) {
	const s = n.generateKiller(t, e, r);
	if (s[2]) throw d(s[1]);
	return N.__wrap(s[0]);
}
function se(t, e, r, s) {
	const o = g(s, n.__wbindgen_malloc), a = l, _ = n.generateSudoku(t, e, r, o, a);
	if (_[3]) throw d(_[2]);
	var i = c(_[0], _[1]).slice();
	return n.__wbindgen_free(_[0], _[1] * 4, 4), i;
}
function oe(t, e, r) {
	const s = n.generateThermo(t, e, r);
	if (s[2]) throw d(s[1]);
	return K.__wrap(s[0]);
}
function ie(t, e, r) {
	const s = g(t, n.__wbindgen_malloc), o = l, a = g(r, n.__wbindgen_malloc), _ = l, i = n.propagateFutoshiki(s, o, e, a, _);
	if (i[3]) throw d(i[2]);
	var u = c(i[0], i[1]).slice();
	return n.__wbindgen_free(i[0], i[1] * 4, 4), u;
}
function _e(t, e, r) {
	const s = g(t, n.__wbindgen_malloc), o = l, a = g(r, n.__wbindgen_malloc), _ = l, i = n.propagateKenKen(s, o, e, a, _);
	if (i[3]) throw d(i[2]);
	var u = c(i[0], i[1]).slice();
	return n.__wbindgen_free(i[0], i[1] * 4, 4), u;
}
function ae(t, e, r) {
	const s = g(t, n.__wbindgen_malloc), o = l, a = g(r, n.__wbindgen_malloc), _ = l, i = n.propagateKiller(s, o, e, a, _);
	if (i[3]) throw d(i[2]);
	var u = c(i[0], i[1]).slice();
	return n.__wbindgen_free(i[0], i[1] * 4, 4), u;
}
function le(t, e) {
	const r = g(t, n.__wbindgen_malloc), s = l, o = n.propagateSudoku(r, s, e);
	if (o[3]) throw d(o[2]);
	var a = c(o[0], o[1]).slice();
	return n.__wbindgen_free(o[0], o[1] * 4, 4), a;
}
function ue(t, e, r) {
	const s = g(t, n.__wbindgen_malloc), o = l, a = g(r, n.__wbindgen_malloc), _ = l, i = n.propagateThermo(s, o, e, a, _);
	if (i[3]) throw d(i[2]);
	var u = c(i[0], i[1]).slice();
	return n.__wbindgen_free(i[0], i[1] * 4, 4), u;
}
function ce(t, e, r, s, o) {
	const a = g(t, n.__wbindgen_malloc), _ = l, i = g(r, n.__wbindgen_malloc), u = l, p = n.solveFutoshiki(a, _, e, i, u, b(s) ? Number.MAX_SAFE_INTEGER : s >>> 0, b(o) ? Number.MAX_SAFE_INTEGER : o >>> 0);
	if (p[2]) throw d(p[1]);
	return R.__wrap(p[0]);
}
function ge(t, e, r, s, o) {
	const a = g(t, n.__wbindgen_malloc), _ = l, i = g(r, n.__wbindgen_malloc), u = l, p = n.solveKenKen(a, _, e, i, u, b(s) ? Number.MAX_SAFE_INTEGER : s >>> 0, b(o) ? Number.MAX_SAFE_INTEGER : o >>> 0);
	if (p[2]) throw d(p[1]);
	return I.__wrap(p[0]);
}
function pe(t, e, r, s, o) {
	const a = g(t, n.__wbindgen_malloc), _ = l, i = g(r, n.__wbindgen_malloc), u = l, p = n.solveKiller(a, _, e, i, u, b(s) ? Number.MAX_SAFE_INTEGER : s >>> 0, b(o) ? Number.MAX_SAFE_INTEGER : o >>> 0);
	if (p[2]) throw d(p[1]);
	return T.__wrap(p[0]);
}
function de(t, e, r, s) {
	const o = g(t, n.__wbindgen_malloc), a = l, _ = n.solveSudoku(o, a, e, b(r) ? Number.MAX_SAFE_INTEGER : r >>> 0, b(s) ? Number.MAX_SAFE_INTEGER : s >>> 0);
	if (_[2]) throw d(_[1]);
	return x.__wrap(_[0]);
}
function be(t, e, r, s, o) {
	const a = g(t, n.__wbindgen_malloc), _ = l, i = g(r, n.__wbindgen_malloc), u = l, p = n.solveThermo(a, _, e, i, u, b(s) ? Number.MAX_SAFE_INTEGER : s >>> 0, b(o) ? Number.MAX_SAFE_INTEGER : o >>> 0);
	if (p[2]) throw d(p[1]);
	return U.__wrap(p[0]);
}
function fe() {
	return {
		__proto__: null,
		"./csp_solver_wasm_bg.js": {
			__proto__: null,
			__wbg___wbindgen_throw_344f42d3211c4765: function(t, e) {
				throw new Error(k(t, e));
			},
			__wbg_error_a6fa202b58aa1cd3: function(t, e) {
				let r, s;
				try {
					r = t, s = e, console.error(k(t, e));
				} finally {
					n.__wbindgen_free(r, s, 1);
				}
			},
			__wbg_new_227d7c05414eb861: function() {
				return /* @__PURE__ */ new Error();
			},
			__wbg_new_b667d279fd5aa943: function(t, e) {
				return new Error(k(t, e));
			},
			__wbg_set_8535240470bf2500: function() {
				return he(function(t, e, r) {
					return Reflect.set(t, e, r);
				}, arguments);
			},
			__wbg_stack_3b0d974bbf31e44f: function(t, e) {
				const r = e.stack, s = ve(r, n.__wbindgen_malloc, n.__wbindgen_realloc), o = l;
				G().setInt32(t + 4, o, !0), G().setInt32(t + 0, s, !0);
			},
			__wbindgen_cast_0000000000000001: function(t, e) {
				return k(t, e);
			},
			__wbindgen_init_externref_table: function() {
				const t = n.__wbindgen_externrefs, e = t.grow(4);
				t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, !0), t.set(e + 3, !1);
			}
		}
	};
}
const M = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((t) => n.__wbg_futoshikipuzzledata_free(t, 1)), D = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((t) => n.__wbg_futoshikisolveresult_free(t, 1)), j = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((t) => n.__wbg_kenkenpuzzledata_free(t, 1)), B = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((t) => n.__wbg_kenkensolveresult_free(t, 1)), C = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((t) => n.__wbg_killerpuzzledata_free(t, 1)), O = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((t) => n.__wbg_killersolveresult_free(t, 1)), P = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((t) => n.__wbg_sudokusolveresult_free(t, 1)), W = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((t) => n.__wbg_thermopuzzledata_free(t, 1)), X = typeof FinalizationRegistry > "u" ? {
	register: () => {},
	unregister: () => {}
} : new FinalizationRegistry((t) => n.__wbg_thermosolveresult_free(t, 1));
function we(t) {
	const e = n.__externref_table_alloc();
	return n.__wbindgen_externrefs.set(e, t), e;
}
function c(t, e) {
	return t = t >>> 0, ee().subarray(t / 4, t / 4 + e);
}
let f = null;
function G() {
	return (f === null || f.buffer.detached === !0 || f.buffer.detached === void 0 && f.buffer !== n.memory.buffer) && (f = new DataView(n.memory.buffer)), f;
}
function k(t, e) {
	return ke(t >>> 0, e);
}
let h = null;
function ee() {
	return (h === null || h.byteLength === 0) && (h = new Uint32Array(n.memory.buffer)), h;
}
let v = null;
function m() {
	return (v === null || v.byteLength === 0) && (v = new Uint8Array(n.memory.buffer)), v;
}
function he(t, e) {
	try {
		return t.apply(this, e);
	} catch (r) {
		const s = we(r);
		n.__wbindgen_exn_store(s);
	}
}
function b(t) {
	return t == null;
}
function g(t, e) {
	const r = e(t.length * 4, 4) >>> 0;
	return ee().set(t, r / 4), l = t.length, r;
}
function ve(t, e, r) {
	if (r === void 0) {
		const i = y.encode(t), u = e(i.length, 1) >>> 0;
		return m().subarray(u, u + i.length).set(i), l = i.length, u;
	}
	let s = t.length, o = e(s, 1) >>> 0;
	const a = m();
	let _ = 0;
	for (; _ < s; _++) {
		const i = t.charCodeAt(_);
		if (i > 127) break;
		a[o + _] = i;
	}
	if (_ !== s) {
		_ !== 0 && (t = t.slice(_)), o = r(o, s, s = _ + t.length * 3, 1) >>> 0;
		const i = m().subarray(o + _, o + s), u = y.encodeInto(t, i);
		_ += u.written, o = r(o, s, _, 1) >>> 0;
	}
	return l = _, o;
}
function d(t) {
	const e = n.__wbindgen_externrefs.get(t);
	return n.__externref_table_dealloc(t), e;
}
let z = new TextDecoder("utf-8", {
	ignoreBOM: !0,
	fatal: !0
});
z.decode();
const ye = 2146435072;
let E = 0;
function ke(t, e) {
	return E += e, E >= ye && (z = new TextDecoder("utf-8", {
		ignoreBOM: !0,
		fatal: !0
	}), z.decode(), E = e), z.decode(m().subarray(t, t + e));
}
const y = new TextEncoder();
"encodeInto" in y || (y.encodeInto = function(t, e) {
	const r = y.encode(t);
	return e.set(r), {
		read: t.length,
		written: r.length
	};
});
let l = 0, n;
function me(t, e) {
	return n = t.exports, f = null, h = null, v = null, n.__wbindgen_start(), n;
}
async function ze(t, e) {
	if (typeof Response == "function" && t instanceof Response) {
		if (typeof WebAssembly.instantiateStreaming == "function") try {
			return await WebAssembly.instantiateStreaming(t, e);
		} catch (o) {
			if (t.ok && r(t.type) && t.headers.get("Content-Type") !== "application/wasm") console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", o);
			else throw o;
		}
		const s = await t.arrayBuffer();
		return await WebAssembly.instantiate(s, e);
	} else {
		const s = await WebAssembly.instantiate(t, e);
		return s instanceof WebAssembly.Instance ? {
			instance: s,
			module: t
		} : s;
	}
	function r(s) {
		switch (s) {
			case "basic":
			case "cors":
			case "default": return !0;
		}
		return !1;
	}
}
async function Ee(t) {
	if (n !== void 0) return n;
	t !== void 0 && (Object.getPrototypeOf(t) === Object.prototype ? {module_or_path: t} = t : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), t === void 0 && (t = new URL("/assets/csp_solver_wasm_bg-Cy09b5He.wasm", "" + import.meta.url));
	const e = fe();
	(typeof t == "string" || typeof Request == "function" && t instanceof Request || typeof URL == "function" && t instanceof URL) && (t = fetch(t));
	const { instance: r, module: s } = await ze(await t, e);
	return me(r, s);
}
var Se = "/assets/csp_solver_wasm_bg-Cy09b5He.wasm";
function Fe(t) {
	if (t && typeof t == "object" && "code" in t && typeof t.code == "string") {
		const e = t.code;
		if (e === "INVALID_INPUT" || e === "BUDGET_EXCEEDED" || e === "UNSAT") return {
			code: e,
			message: t instanceof Error ? t.message : String(t)
		};
	}
	return {
		code: "WORKER_FAILURE",
		message: t instanceof Error ? t.message : String(t)
	};
}
let S = null;
function Re() {
	return S === null && (S = Ee({ module_or_path: Se })), S;
}
const Ae = () => /* @__PURE__ */ new Uint32Array(0), Ie = {
	sudoku: {
		generate: (t, e, r, s) => ({
			board: se(t, e, r, s),
			clue: Ae()
		}),
		solve: (t, e, r, s, o) => de(t, e, s, o),
		propagate: (t, e) => le(t, e)
	},
	futoshiki: {
		generate: (t, e, r) => {
			const s = te(t, e, r), o = {
				board: s.board,
				clue: s.inequalities
			};
			return s.free(), o;
		},
		solve: (t, e, r, s, o) => ce(t, e, r, s, o),
		propagate: (t, e, r) => ie(t, e, r)
	},
	thermo: {
		generate: (t, e, r) => {
			const s = oe(t, e, r), o = {
				board: s.board,
				clue: s.thermometers
			};
			return s.free(), o;
		},
		solve: (t, e, r, s, o) => be(t, e, r, s, o),
		propagate: (t, e, r) => ue(t, e, r)
	},
	killer: {
		generate: (t, e, r) => {
			const s = ne(t, e, r), o = {
				board: s.board,
				clue: s.cages
			};
			return s.free(), o;
		},
		solve: (t, e, r, s, o) => pe(t, e, r, s, o),
		propagate: (t, e, r) => ae(t, e, r)
	},
	kenken: {
		generate: (t, e, r) => {
			const s = re(t, e, r), o = {
				board: s.board,
				clue: s.cages
			};
			return s.free(), o;
		},
		solve: (t, e, r, s, o) => ge(t, e, r, s, o),
		propagate: (t, e, r) => _e(t, e, r)
	}
};
function w(t, e = []) {
	self.postMessage(t, e);
}
self.addEventListener("message", async (t) => {
	const e = t.data;
	try {
		if (await Re(), e.kind === "ping") {
			w({
				id: e.id,
				ok: !0,
				kind: "ping"
			});
			return;
		}
		const r = Ie[e.game];
		if (!r) throw new Error(`unknown solver game: ${String(e.game)}`);
		switch (e.kind) {
			case "generate": {
				const { board: s, clue: o } = r.generate(e.dim, e.difficulty, e.seed, e.templates);
				w({
					id: e.id,
					ok: !0,
					kind: "generate",
					board: s,
					clue: o
				}, [s.buffer, o.buffer]);
				return;
			}
			case "solve": {
				const s = performance.now(), o = r.solve(e.board, e.dim, e.clue, e.maxSolutions, e.nodeBudget), a = performance.now() - s, _ = o.solutions, i = {
					id: e.id,
					ok: !0,
					kind: "solve",
					solved: o.solved,
					solutionCount: o.solutionCount,
					solutions: _,
					backtracks: o.backtracks.toString(),
					nodesExplored: o.nodesExplored.toString(),
					propagations: o.propagations.toString(),
					budgetExceeded: o.budgetExceeded,
					elapsedMs: a
				};
				o.free(), w(i, [_.buffer]);
				return;
			}
			case "propagate": {
				const s = r.propagate(e.board, e.dim, e.clue);
				w({
					id: e.id,
					ok: !0,
					kind: "propagate",
					masks: s
				}, [s.buffer]);
				return;
			}
			default: throw new Error(`unknown solver request kind: ${String(e.kind)}`);
		}
	} catch (r) {
		const { code: s, message: o } = Fe(r);
		w({
			id: e.id,
			ok: !1,
			code: s,
			message: o
		});
	}
});

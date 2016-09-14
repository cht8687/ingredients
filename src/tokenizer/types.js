// ## Token types

// The assignment of fine-grained, information-carrying type objects
// allows the tokenizer to store the information it has about a
// token in a way that is very cheap for the parser to look up.

// All token type variables start with an underscore, to make them
// easy to recognize.

// The `beforeExpr` property is used to disambiguate between regular
// expressions and divisions. It is set on all token types that can
// be followed by an expression (thus, a slash after them would be a
// regular expression).
//
// `isLoop` marks a keyword as starting a loop, which is important
// to know when parsing a label, in order to allow or disallow
// continue jumps to that label.

import keywordsMapping from "./keywords-mapping";

export class TokenType {
  constructor(label, conf = {}) {
    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.rightAssociative = !!conf.rightAssociative;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop || null;
    this.updateContext = null;
  }
}

function binop(name, prec) {
  return new TokenType(name, {beforeExpr: true, binop: prec});
}
const beforeExpr = {beforeExpr: true}, startsExpr = {startsExpr: true};

export const types = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  eof: new TokenType("eof"),

  // Punctuation token types.
  bracketL: new TokenType("[", {beforeExpr: true, startsExpr: true}),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", {beforeExpr: true, startsExpr: true}),
  braceBarL: new TokenType("{|", {beforeExpr: true, startsExpr: true}),
  braceR: new TokenType("}"),
  braceBarR: new TokenType("|}"),
  parenL: new TokenType("(", {beforeExpr: true, startsExpr: true}),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  doubleColon: new TokenType("::", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", {beforeExpr: true, startsExpr: true}),
  at: new TokenType("@"),

  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.

  eq: new TokenType("=", {beforeExpr: true, isAssign: true}),
  assign: new TokenType("_=", {beforeExpr: true, isAssign: true}),
  incDec: new TokenType("++/--", {prefix: true, postfix: true, startsExpr: true}),
  prefix: new TokenType("prefix", {beforeExpr: true, prefix: true, startsExpr: true}),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=", 6),
  relational: binop("</>", 7),
  bitShift: binop("<</>>", 8),
  plusMin: new TokenType("+/-", {beforeExpr: true, binop: 9, prefix: true, startsExpr: true}),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  exponent: new TokenType("**", {beforeExpr: true, binop: 11, rightAssociative: true})
};

// Map keyword names to token types.

export const keywords = {};

// Succinct definitions of keyword token types
function kw(name, options = {}) {
  options.keyword = name;
  keywords[name] = types["_" + name] = new TokenType(name, options);
}

kw(keywordsMapping.break);
kw(keywordsMapping.case, beforeExpr);
kw(keywordsMapping.catch);
kw(keywordsMapping.continue);
kw(keywordsMapping.debugger);
kw(keywordsMapping.default, beforeExpr);
kw(keywordsMapping.do, {isLoop: true, beforeExpr: true});
kw(keywordsMapping.else, beforeExpr);
kw(keywordsMapping.finally);
kw(keywordsMapping.for, {isLoop: true});
kw(keywordsMapping.function, startsExpr);
kw(keywordsMapping.if);
kw(keywordsMapping.return, beforeExpr);
kw(keywordsMapping.switch);
kw(keywordsMapping.throw, beforeExpr);
kw(keywordsMapping.try);
kw(keywordsMapping.var);
kw(keywordsMapping.let);
kw(keywordsMapping.const);
kw(keywordsMapping.while, {isLoop: true});
kw(keywordsMapping.with);
kw(keywordsMapping.new, {beforeExpr: true, startsExpr: true});
kw(keywordsMapping.this, startsExpr);
kw(keywordsMapping.super, startsExpr);
kw(keywordsMapping.class);
kw(keywordsMapping.extends, beforeExpr);
kw(keywordsMapping.export);
kw(keywordsMapping.import);
kw(keywordsMapping.yield, {beforeExpr: true, startsExpr: true});
kw(keywordsMapping.null, startsExpr);
kw(keywordsMapping.true, startsExpr);
kw(keywordsMapping.false, startsExpr);
kw(keywordsMapping.in, {beforeExpr: true, binop: 7});
kw(keywordsMapping.instanceof, {beforeExpr: true, binop: 7});
kw(keywordsMapping.typeof, {beforeExpr: true, prefix: true, startsExpr: true});
kw(keywordsMapping.void, {beforeExpr: true, prefix: true, startsExpr: true});
kw(keywordsMapping.delete, {beforeExpr: true, prefix: true, startsExpr: true});

// import { ClassExp, ProcExp, Exp, Program, CExp } from "./L31-ast";
// import { Result, makeFailure, makeOk } from "../shared/result";
// import { IfExp, makeBoolExp, makeIfExp, makePrimOp, makeProcExp, makeVarDecl, makeVarRef, makeAppExp } from "../imp/L3-ast";

// /*
// Purpose: Transform ClassExp to ProcExp
// Signature: for2proc(classExp)
// Type: ClassExp => ProcExp
// */
// // export const class2proc = (exp: ClassExp): ProcExp => {
// //     return makeProcExp(exp.fields, [makeProcExp([makeVarDecl("msg")], if_generator(exp, exp.methods.length, 0))]);
// // }

// // const if_generator = (exp: ClassExp, iter: number, count: number): CExp => {
// //     return makeIfExp((makeAppExp(makePrimOp("eq?"), [makeVarRef("msg"), makeVarRef(exp.methods[count].var.var)]), exp.methods[count].val, ((iter > count) ?
// //         if_generator(exp, iter, count + 1) : makeBoolExp(false)));
// // }

// /*
// Purpose: Transform L31 AST to L3 AST
// Signature: l31ToL3(l31AST)
// Type: [Exp | Program] => Result<Exp | Program>
// */
// export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
//     makeFailure("TODO");

import { isExp, CExp, ClassExp, ProcExp, Exp, makeProcExp, Program, IfExp, Binding, makeIfExp, isBoolExp, makeBoolExp, makeVarDecl, isClassExp, makeAppExp, makeLitExp, isLitExp, isIfExp, isAppExp, isProcExp, isLetExp, isCExp, isDefineExp, makeDefineExp, isProgram, makeProgram, makeLetExp, parseL31Exp, unparseL31 } from "./L31-ast";
import { Result, makeFailure, makeOk, bind } from "../shared/result";
import { first, rest } from "../shared/list";
import { isAtomicExp } from "../imp/L3-ast";
import { map } from "ramda";
import { parse as p } from "../shared/parser";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp => {
    const setUp = makeProcExp([makeVarDecl("msg")],
        [bindingsToIfExp(first(exp.bindings), rest(exp.bindings))]);
    return makeProcExp(exp.vars, [setUp]);
}

const bindingsToIfExp = (curr: Binding, remainings: Binding[]): IfExp => {
    const test = makeAppExp(makeLitExp('eq?'), [makeLitExp('msg'), makeLitExp("'" + curr.var.var)]);
    if (remainings.length === 0) {
        return makeIfExp(test,
            makeAppExp(curr.val, []),
            makeBoolExp(false));
    }
    return makeIfExp(test,
        makeAppExp(curr.val, []),
        bindingsToIfExp(first(remainings), rest(remainings)));
}

/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
    isExp(exp) ? makeOk(rewriteClassExp(exp)) :
        isProgram(exp) ? makeOk(makeProgram(map(rewriteClassExp, exp.exps))) :
            makeOk(exp); //never


const rewriteClassCExp = (exp: CExp): CExp =>
    isAtomicExp(exp) ? exp :
        isLitExp(exp) ? exp :
            isIfExp(exp) ? makeIfExp(rewriteClassCExp(exp.test),
                rewriteClassCExp(exp.then),
                rewriteClassCExp(exp.alt)) :
                isAppExp(exp) ? makeAppExp(rewriteClassCExp(exp.rator), map(rewriteClassCExp, exp.rands)) :
                    isProcExp(exp) ? makeProcExp(exp.args, map(rewriteClassCExp, exp.body)) :
                        isLetExp(exp) ? makeLetExp(exp.bindings, map(rewriteClassCExp, exp.body)) :
                            isClassExp(exp) ? rewriteClassCExp(class2proc(exp)) :
                                exp; //never

const rewriteClassExp = (exp: Exp): Exp =>
    isCExp(exp) ? rewriteClassCExp(exp) :
        isDefineExp(exp) ? makeDefineExp(exp.var, rewriteClassCExp(exp.val)) :
            exp; //never


    // console.log((bind(bind(bind(p(`(class (a b) ((first (lambda () a)) (second (lambda () b)) (sum (lambda () (+ a b)))))`), parseL31Exp), L31ToL3),  (x: Exp | Program)=>makeOk(unparseL31(x)))))

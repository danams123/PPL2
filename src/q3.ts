import { ClassExp, ProcExp, Exp, Program, CExp } from "./L31-ast";
import { Result, makeFailure, makeOk } from "../shared/result";
import { IfExp, makeBoolExp, makeIfExp, makePrimOp, makeProcExp, makeVarDecl, makeVarRef, makeAppExp } from "../imp/L3-ast";

/*
Purpose: Transform ClassExp to ProcExp
Signature: for2proc(classExp)
Type: ClassExp => ProcExp
*/
// export const class2proc = (exp: ClassExp): ProcExp => {
//     return makeProcExp(exp.fields, [makeProcExp([makeVarDecl("msg")], if_generator(exp, exp.methods.length, 0))]);
// }

// const if_generator = (exp: ClassExp, iter: number, count: number): CExp => {
//     return makeIfExp((makeAppExp(makePrimOp("eq?"), [makeVarRef("msg"), makeVarRef(exp.methods[count].var.var)]), exp.methods[count].val, ((iter > count) ?
//         if_generator(exp, iter, count + 1) : makeBoolExp(false)));
// }

/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> =>
    makeFailure("TODO");

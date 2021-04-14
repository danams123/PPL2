import { fromPairs, map } from 'ramda';
import { Exp, Program, isBoolExp, isNumExp, isStrExp, isVarRef, isPrimOp, isProcExp, isIfExp, isAppExp, isDefineExp, isProgram, ProcExp, VarDecl, AppExp, NumExp } from '../imp/L3-ast';
import { Result, makeFailure, makeOk } from '../shared/result';
import { isNumber } from '../shared/type-predicates'

/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [EXP | Program] => Result<string>
*/

const unparseLExps = (les: Exp[]): string =>
    map(l2ToPython, les).join(" ");

const unparseProcExp = (pe: ProcExp): string =>
    `(lambda ${map((p: VarDecl) => p.var, pe.args).join(",")} : (${unparseLExps(pe.body)}))`

const unparseAppExp = (app: AppExp): string => {
    const [first, second] = unparseLExps(app.rands);
    return `${first} ${l2ToPython(app.rator)} ${second}`;
}


export const PyhtonParser = (exp: Exp | Program): string =>
    isBoolExp(exp) ? ((exp.val == true) ? 'true' : 'false') :
        (isNumExp(exp) && isNumber(exp.val)) ? exp.val.toString() :
            isStrExp(exp) ? `"${exp.val}"` :
                isVarRef(exp) ? exp.var :
                    isProcExp(exp) ? unparseProcExp(exp) :
                        isIfExp(exp) ? `(${l2ToPython(exp.then)} if (${l2ToPython(exp.test)}) else ${l2ToPython(exp.alt)})` :
                            isAppExp(exp) ? `(${unparseAppExp(exp)})` :
                                isPrimOp(exp) ? exp.op :
                                    isDefineExp(exp) ? `${exp.var.var} = ${l2ToPython(exp.val)}` :
                                        isProgram(exp) ? `${unparseLExps(exp.exps)}` :
                                            "Invalid L2 Exp";

export const l2ToPython = (exp: Exp | Program): Result<string> => {
    const p: string = PyhtonParser(exp);
    console.log("%j", p);
    return (p == "Invalid L2 Exp") ? makeFailure(p) : makeOk(p);
}



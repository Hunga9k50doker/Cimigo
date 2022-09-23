import * as yup from "yup";
import { AnyObject, Maybe, Message } from "yup/lib/types";
import freeEmailDomains from "free-email-domains";
import psl from "psl";

yup.addMethod<yup.StringSchema>(yup.string, 'businessEmail', function(msg) {
  return this.test("isValidCountry", msg, function(value) {
    const { path, createError } = this;
    if (value && value.includes("@")) {
      var parsed = psl.parse(value.toLocaleLowerCase().split('@').pop()) as psl.ParsedDomain
      if(parsed?.domain && freeEmailDomains.includes(parsed?.domain)) {
        return createError({ path, message: msg ?? "Please use business email to register"})
      }
    }
    return true
  })
})


declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext extends AnyObject = AnyObject,
    TOut extends TType = TType,
  > extends yup.BaseSchema<TType, TContext, TOut> {
    businessEmail(msg?: Message<{}>): StringSchema<TType, TContext>;
  }
}

export default yup;
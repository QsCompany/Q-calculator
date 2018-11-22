import { component } from "../component";
import { bind } from "../../../lib/q/Core";
import { attributes } from "../../../lib/q/sys/Dom";
@attributes.Event({ name: 'change' })
export abstract class MdCheckboxMixin extends component {
    @bind.property1(Object)
    model: String | Boolean | Object | Number | Array<any>;
    value;
    name: String | Number;
    required: Boolean;
    disabled: Boolean;
    indeterminate: Boolean;

    @bind.property1(Boolean, { defaultValue: true })
    trueValue: boolean;
    @bind.property1(Boolean, { defaultValue: false })
    falseValue: boolean;
}
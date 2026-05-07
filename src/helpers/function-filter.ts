import { FilterOperetorEnum, OperetorEnum } from "src/app/enum/operetor.enum"
import { Between, ILike, In, IsNull, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not } from "typeorm";


const fnSetValueCondition = async (operator: string, value: any) => {
    let lastValue = null
    if (operator === OperetorEnum.Equal) {
        lastValue = value  // =
    } else if (operator === OperetorEnum.NotEqual) {
        lastValue = Not(value)  // !=
    } else if (operator === OperetorEnum.MoreThan) {
        lastValue = MoreThan(value)   // >
    } else if (operator === OperetorEnum.LessThan) {
        lastValue = LessThan(value)   // <
    } else if (operator === OperetorEnum.MoreThanOrEqual) {
        lastValue = MoreThanOrEqual(value)   // >=   
    } else if (operator === OperetorEnum.LessThanOrEqual) {
        lastValue = LessThanOrEqual(value)   // >=   
    } else if (operator === OperetorEnum.ILike) {
        lastValue = ILike(`%${value}%`)   // like  
    } else if (operator === OperetorEnum.IsNull) {
        lastValue = IsNull()   // is null  
    } else if (operator === OperetorEnum.IsNotNull) {
        lastValue = Not(IsNull())   // is not null
    } else if (operator === OperetorEnum.Between) {
        lastValue = Between(value[0], value[1])   // between  
    } else if (operator === OperetorEnum.In) {  // in  ให้ส่งมาในรูปแบบ array
        lastValue = In(value)
    }
    return lastValue
}

const fnSetRelationsValue = (paths: string[]): any => {
    if (!paths || paths.length === 0) return undefined;
    const result: any = {};

    paths.forEach(path => {
        const keys = path.split('.');
        let current = result;

        keys.forEach((key, index) => {
            if (index === keys.length - 1) {
                if (typeof current[key] !== 'object') {
                    current[key] = true;
                }
            } else {
                if (current[key] === true || typeof current[key] !== 'object') {
                    current[key] = {};
                }
                current = current[key];
            }
        });
    });
    return Object.keys(result).length > 0 ? result : undefined;
}

const fnBuildNestedObjectAnd = async (conditions: any) => {
    const result = {};

    for (const { field, operator, value } of conditions) {
        const keys = field.split('.');
        const finalValue = await fnSetValueCondition(operator, value);

        let current = result;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (i === keys.length - 1) {
                current[key] = finalValue;
            } else {
                current[key] = current[key] || {};
                current = current[key];
            }
        }
    }

    return result;
}

const FnBuildOrConditionOr = async (conditions: any) => {
    const result = [];

    for (const { field, operator, value } of conditions) {
        const keys = field.split('.');
        const finalValue = await fnSetValueCondition(operator, value);

        let nested = {};
        let current = nested;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (i === keys.length - 1) {
                current[key] = finalValue;
            } else {
                current[key] = {};
                current = current[key];
            }
        }

        result.push(nested);
    }

    return result;
}


export const filterFunction = async (body: any) => {
    let conditionValue: any = {}
    let conditionValueOr: any = []
    const relationValue = fnSetRelationsValue(body?.relation)
    const sortingValue = body?.sorting?.reduce((acc: object, key: any) => {
        acc[key.field] = key.pattern;
        return acc;
    }, {});

    if (body.filterOperator == FilterOperetorEnum.And) {
        conditionValue = await fnBuildNestedObjectAnd(body.filter)
    }
    // ------------------------------------------------------------------------------------------ //
    else if (body.filterOperator == FilterOperetorEnum.Or) {
        conditionValueOr = await FnBuildOrConditionOr(body.filter)
    }
    return {
        conditionValue: body.filterOperator == FilterOperetorEnum.And ? conditionValue : conditionValueOr,
        relationValue: relationValue,
        sortingValue: sortingValue || {}
    }
}

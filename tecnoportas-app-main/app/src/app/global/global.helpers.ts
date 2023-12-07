/* eslint-disable max-len */
import { IonInput } from '@ionic/angular';

const isElement = (obj: any) => {
    try {
        return obj instanceof HTMLElement;
    }
    catch (e) {
        return (typeof obj === 'object') &&
            (obj.nodeType === 1) && (typeof obj.style === 'object') &&
            (typeof obj.ownerDocument === 'object');
    }
};

export const numberToDecimalFormat = (input: IonInput, separator: string = '.', toFixed: number = 2) => {
    const split: any = input.value.toString().split('');
    let newNumber = '';

    split.forEach((item: any) => {
        if (!isNaN(item)) {
            newNumber = newNumber + item;
        }
    });

    newNumber = parseInt(newNumber, 10).toString();

    if (newNumber.length < (toFixed + 1)) {
        newNumber = ('0'.repeat(toFixed + 1) + newNumber);
        newNumber = newNumber.slice((toFixed + 1) * -1);
    }

    const chars = newNumber.split('');
    let result = '';

    for (let i = 0; i < chars.length; i++) {
        if (i === chars.length - toFixed) {
            result = result + separator + chars[i];
        }
        else {
            result = result + chars[i];
        }
    }

    input.value = result;
};

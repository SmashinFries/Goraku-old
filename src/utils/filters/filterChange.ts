export const filterSet = (filterRef, newValue, type='String') => {
    switch (type) {
        case 'String':
            if (newValue !== '') {
                return newValue;
            } else if (newValue === '') {
                return undefined;
            }
            break;
        case 'Array':
            if (newValue !== '') {
                return newValue;
            }
        default:
            break;
    }
}
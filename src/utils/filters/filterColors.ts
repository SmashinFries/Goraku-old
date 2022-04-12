const getColor = (status:string):string => {
    switch (status) {
        case 'ACTIVE':
            return 'rgba(3, 252, 44, .8)';
        case 'DISABLED':
            return 'rgba(255, 40, 20, .8)';
        default:
            break;
    }
}

export default getColor;
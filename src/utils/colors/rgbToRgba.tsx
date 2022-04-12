export const rgbConvert = (color:string, opacity:number=1):string => {
    const rgbValues = color.split('(')[1].split(')')[0];
    const rgba = `rgba(${rgbValues}, ${opacity})`;
    return rgba;
}
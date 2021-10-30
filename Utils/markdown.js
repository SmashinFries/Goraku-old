import React from 'react';
import { Dimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
blockEmbedPlugin = require("markdown-it-block-embed");

// export const markdownItInstance = 
//     MarkdownIt({typographer: true})
//       .use(blockEmbedPlugin, {
//         containerClassName: "video-embed"
//       });

const {width, height} = Dimensions.get('window');

export const rules = {
    image: (node, children, parent, styles) =>
        <FastImage source={{uri:node.attributes.src}} key={node.key} style={{width:width, height:200,}} resizeMode='center' />
};

export const md = (data) => {
    const regexImg = /(img\d+\W+|[(]*\bimg\b)/gmi;
    const regHeader = /(#{1,})/gmi;
    const markdown = data.replaceAll('<br>', '')
        .replaceAll('<i>', '*')
        .replaceAll('</i>', '*')
        .replaceAll('<i/>', '*')
        .replaceAll('~~~', '')
        .replaceAll('~!', '')
        .replaceAll('!~', '')
        .replaceAll(regexImg, `![](`)
        .replaceAll('<center>' , '')
        .replaceAll('<b>', '**')
        .replaceAll('</b>', '**')
        .replaceAll('<u>', '**') // if underlined, make bold. MD has no underline. TEMP FIX
        .replaceAll('</u>', '**') // ^
        .replaceAll('<bR>', `  ${'\n'}`)
        .replaceAll('<Br>', `  ${'\n'}`)
        .replaceAll('<br/>', `  `)
        .replaceAll('<a>', '')
        .replaceAll('</A>', '')
        .replaceAll('</a>', '')
        .replaceAll(regHeader, `$1 `);
    return markdown;
}
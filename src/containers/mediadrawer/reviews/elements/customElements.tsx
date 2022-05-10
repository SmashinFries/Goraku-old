import { HTMLContentModel, HTMLElementModel } from "react-native-render-html";

export const customHTMLElementModel = {
    'center': HTMLElementModel.fromCustomModel({
      tagName: 'center',
      mixedUAStyles: {
        textAlign:'center'
      },
      contentModel: HTMLContentModel.block
    })
  };
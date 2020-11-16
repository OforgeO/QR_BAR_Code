import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const codeList = [
  {name: "QRCode", code: "QR_CODE", checked: true},
  {name: "Aztec", code: "AZTEC", checked: true},
  {name: "Codabar", code: "CODABAR", checked: true},
  {name: "CODE39", code: "CODE_39", checked: true},
  {name: "CODE93", code: "CODE_93", checked: true},
  {name: "CODE128", code: "CODE_128", checked: true},
  {name: "DataMatrix", code: "DATA_MATRIX", checked: true},
  {name: "EAN-8", code: "EAN_8", checked: true},
  {name: "EAN-13", code: "EAN_13", checked: true},
  {name: "ITF", code: "ITF", checked: true},
  {name: "PDF417", code: "PDF417", checked: true},
  {name: "UPC-A", code: "UPC_A", checked: true},
  {name: "UPC-E", code: "UPC_E", checked: true},
]
export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  codeList: codeList
};

import {Toast} from 'native-base';
export async function showToast(text = '', type = 'danger', position = 'bottom') {
    Toast.show({
        text: text == '' ? 'インターネット接続エラー！' : text,
        type: type,
        textStyle: {textAlign: 'center'},
        position: position,
        duration: 4000,
    }); 
}


import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList, Alert, PermissionsAndroid, AsyncStorage, Vibration, Share, Clipboard, Linking, Animated } from 'react-native';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import { normalize } from '../assets/styles';
import { Icon } from 'react-native-elements'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import BarcodeScanner, { Exception, FocusMode, CameraFillMode, FlashMode, BarcodeType, TorchMode} from 'react-native-barcode-scanner-google';
import { getScreenHeight, getScreenWidth } from '../assets/styles'
import moment from 'moment';
import Sound from 'react-native-sound';
import PopoverTooltip from 'react-native-popover-tooltip';
let sound = null
let timeScan = false
let scanTimeout = null
let keepTimeout = null
export default class Scan extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            type : 'bar',
            typeProgress: 100,
            loadComplete: false,
            scanned: false,
            history: [],
            codeType: '',
            codeData: '',
            setting: false,

            vibration: false,
            soundEffect: true,
            level: 50,
            restart_wait: 3.0,
            keep_time: 5.0,
            camera_startup: true,
            scanBtn: false,
            real_code_name: ''
        };
    }

    async componentDidMount(){
        let history = await AsyncStorage.getItem("code_history")
        history = JSON.parse(history)
        let temp_history = [];
        
        if(history != null){
            history.map((history, index) => {
                temp_history.push({id:parseInt(index+1), data: history.data, type:history.type, time: history.time})
            })
        }
        this.setState({history: temp_history})

        let camera_startup = await AsyncStorage.getItem("camera_startup")
        if(camera_startup == "true" || camera_startup)
            this.setState({setting: false})
        else
            this.setState({setting: true})
        sound = new Sound('sound.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
              console.log('failed to load the sound', error);
              return;
            }
        });
        
        this.refresh()
    }
    async UNSAFE_componentWillReceiveProps(){
        this.refresh()
    }

    async refresh(){
        let vibration = await AsyncStorage.getItem("vibration")
        this.setState({vibration: vibration == "true" ? true : false})
        let soundEffect = await AsyncStorage.getItem("soundEffect")
        this.setState({soundEffect: soundEffect == "true" ? true : false })
        let level = await AsyncStorage.getItem("level")
        this.setState({level: parseFloat(level)*0.01})
        let keep_time = await AsyncStorage.getItem("keep_time")
        this.setState({keep_time: parseFloat(keep_time)})
        let restart_wait = await AsyncStorage.getItem("restart_wait")
        this.setState({restart_wait: parseFloat(restart_wait)})
        if(Platform.OS === 'android') { 
            const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
            //return result === PermissionsAndroid.RESULTS.GRANTED || result === true
            if(PermissionsAndroid.RESULTS.GRANTED || result === true)
                Actions.refresh();
        }
        return true;
    }

    async readCode(data, type){
        let codeList = await AsyncStorage.getItem("codelist")
        codeList = JSON.parse(codeList)
        let code_name = '';
        if(codeList != null){
            for(var i = 0;i<codeList.length;i++){
                if(codeList[i]['code'] == type && codeList[i]['checked']){
                    code_name = codeList[i]['name']
                    break;
                }
            }
        }
        if(code_name != ''){
            if(this.state.type == 'bar' && type == 'QR_CODE')
                code_name = '';
            else if(this.state.type == 'qr' && type != 'QR_CODE')
                code_name = '';
        }
        if(code_name != '' && this.state.scanned == false && timeScan == false){
            timeScan = true
            var _self = this;
            this.setState({real_code_name: code_name})
            this.setState({codeType: code_name})
            this.setState({codeData: data})
            this.setState({scanned: true})
            this.setState({scanBtn: true})
            timeScan = false;
            keepTimeout = setTimeout(function(){
                _self.setState({codeType: ''})
                _self.setState({codeData: ''})
                _self.setState({scanBtn: false})
                scanTimeout = setTimeout(function(){
                    _self.setState({scanned: false})    
                }, _self.state.restart_wait * 1000)
            }, _self.state.keep_time * 1000)
            
        }
    }

    async scanCode(){
        if(this.state.scanned){
            clearTimeout(scanTimeout)
            clearTimeout(keepTimeout)
            this.setState({scanBtn: false})
            if(this.state.soundEffect){
                sound.setVolume(this.state.level)
                sound.play();
            }
            if(this.state.vibration)
                Vibration.vibrate();
            let time = moment().format("YYYY年MM月DD日 HH:mm:ss")

            
            
            let temp = { id: this.state.history.length + 1, type: this.state.real_code_name, data: this.state.codeData, time: time }
            let history = this.state.history;
            history.push(temp)

            let historyStr = JSON.stringify(history)
            await AsyncStorage.setItem("code_history", historyStr)
            
            this.setState({history: history})
            
            
            
            this.setState({codeType: ''})
            this.setState({codeData: ''})
            this.setState({real_code_name: ''})

            var _self = this;
            setTimeout(function(){
                _self.setState({scanned: false})
            }, _self.state.restart_wait * 1000)
        }
    }

    cancelCode(){
        clearTimeout(scanTimeout)
        clearTimeout(keepTimeout)
        this.setState({scanBtn: false})
        this.setState({codeType: ''})
        this.setState({codeData: ''})
        var _self = this;
        setTimeout(function(){
            _self.setState({scanned: false})
        }, _self.state.restart_wait * 1000)
    }

    changeType(){
        this.setState({loadComplete : false})
        if(this.state.type == 'qr')
            this.setState({type: 'bar'})
        else
            this.setState({type: 'qr'})
        this.circularProgress.reAnimate(0, 100, 1000)
    }

    async delAll(){
        this.setState({history: []})
        await AsyncStorage.setItem("code_history", '');
    }

    delHistory(){
        Alert.alert("", "履歴削除を行いますか？", [
            {
                text: "いいえ",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "はい", onPress: () => { this.delAll() } }
        ],
        { cancelable: false })
    }

    goSetting(){
        Actions.push("settings")
    }

    async share(){
        let historyStr = '';
        this.state.history.map((history) => {
            historyStr += history.type + ', ' + history.data + ', ' + history.time+'\n';
        })
        try {
            const result = await Share.share({
                message:
                historyStr,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                // shared with activity type of result.activityType
                } else {
                // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    copyCliboard(data){
        Clipboard.setString(data)
    }

    search(data, type){
        if(type == 'QRCode')
            Linking.openURL(data)
        else
            Linking.openURL("https://www.google.com/search?q="+data)
    }
    
    render(){
        return (
            <View style={styles.container}>
                {
                    this.state.setting ?
                    null
                    :
                    <BarcodeScanner
                        style={{height: 150, width: '100%'}}
                        onBarcodeRead={({data, type}) => {
                            this.readCode(data, type)
                        }}
                        focusMode={FocusMode.AUTO /* could also be TAP or FIXED */}
                        cameraFillMode={CameraFillMode.COVER /* could also be FIT */}
                        barcodeType={BarcodeType.ALL}
                        flashMode={FlashMode.TORCH}
                    />
                }
                
                
                {
                    this.state.scanned && this.state.codeType != '' ?
                    <View style={{position: 'absolute', alignItems: 'center', top: 100, left: 0, right: 0, bottom: 0}}>
                        <Text style={{backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', paddingHorizontal: 10, paddingVertical: 3, }}>{this.state.codeType} {this.state.codeData}</Text>
                    </View>
                    :
                    null
                }
                    
                
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <View style={this.state.setting ? {height: getScreenHeight() - 50, backgroundColor: 'white'} : {height: getScreenHeight() - 250, backgroundColor: 'white'}}>
                        <FlatList
                            data={this.state.history}
                            ref = "flatList"
                            onContentSizeChange={()=> this.refs.flatList.scrollToEnd({animated: true})}
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.itemSection}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'gray', borderBottomWidth: 1}}>
                                            <Text>{item.id} {item.type}</Text>
                                            <Text>{item.time}</Text>
                                        </View>
                                        <View style={styles.codeSection}>
                                            <PopoverTooltip
                                                ref='tooltip1'
                                                buttonComponent={
                                                    <View style={{width: getScreenWidth() - 70}}>
                                                        <Text style={{fontSize: 20}}>
                                                            {item.data}
                                                        </Text>
                                                    </View>
                                                }
                                                overlayStyle={{backgroundColor: 'rgba(0,0,0,0)'}}
                                                opacityChangeDuration={0}
                                                items={[{
                                                        label: 'Copy',
                                                        onPress: () => {this.copyCliboard(item.data)}
                                                    },
                                                ]}
                                            />
                                            <TouchableOpacity onPress={() => this.search(item.data, item.type)}>
                                                <Icon type="materialicons" name={"search"} size={25} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    {
                        this.state.setting == false ?
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 20}}>
                            {
                                this.state.scanBtn ?
                                <TouchableOpacity onPress={() => this.scanCode()}>
                                    <View style={{backgroundColor: '#3497fd', width: 100, height: 100, borderRadius: 50}}>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => this.changeType()}>
                                    <AnimatedCircularProgress
                                        size={100}
                                        width={5}
                                        fill={this.state.typeProgress}
                                        ref={(ref) => this.circularProgress = ref}
                                        rotation={0}
                                        duration={1000}
                                        tintColor={this.state.type == 'qr' ? "#56b3d5" : "#e25c47"}
                                        onAnimationComplete={() => this.setState({loadComplete : true})}
                                        backgroundColor="#e6e7e6" 
                                    >
                                        {
                                            (fill) => (
                                                
                                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                    <Image source={this.state.type == 'qr' ? require('../assets/images/barcode.png') : require('../assets/images/qrcode.png')} style={{height: 60}} resizeMode={"contain"} />
                                                </View>
                                            )
                                        }
                                    </AnimatedCircularProgress>
                                </TouchableOpacity>
                            }
                            {
                                this.state.setting ?
                                null
                                :
                                <TouchableOpacity onPress={() => this.setState({setting: true})} style={{position: 'absolute', left: 20}}>
                                    <Icon name={"pause-circle"} type="font-awesome" size={50} />
                                </TouchableOpacity>
                            }
                            {
                                this.state.scanBtn ?
                                <TouchableOpacity onPress={() => this.cancelCode()} style={{position: 'absolute', left: 70, backgroundColor: 'black', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center'}}>
                                    <Icon name={"close"} type="font-awesome" size={35} color={"red"} />
                                </TouchableOpacity>
                                :
                                null
                            }
                        </View>
                        :
                        null
                    }
                    
                    {
                        this.state.setting ?
                        <View style={{justifyContent: 'center', alignItems: 'center', paddingVertical: 20, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.4)'}}>
                            <TouchableOpacity style={styles.iconSection} onPress={() => this.setState({setting: false})}>
                                <Icon type="font-awesome" name={"circle"} size={30} color={"red"} />
                                <Text>Scan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconSection} onPress={() => this.share()}>
                                <Icon type="material" name={"share"} size={30} />
                                <Text>Share</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconSection} onPress={() => this.delHistory()}>
                                <Icon type="material" name={"delete"} size={30} />
                                <Text>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconSection} onPress={() => this.goSetting()}>
                                <Icon type="material" name={"settings"} size={30} />
                                <Text>Set</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                    
                </View>
                
                
                
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
    
}

Scan.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    logoImg: {
        width: 150,
        height: 150
    },
    logoPanel: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: "center",
        flex: 1
    },
    logoText: {
        fontSize: 44,
        color: '#9e9e9e',
        fontWeight: 'bold',
        opacity: .8
    },
    logoDesc: {
        fontSize: 20,
        color: '#9e9e9e',
        marginTop: 30
    },
    bodyContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: normalize(30)
    },
    input: {
        backgroundColor: '#ffffff',
        marginBottom: 8,
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(8),
        borderRadius: normalize(6),
        borderWidth: 1
    },
    btnText: {
        padding: 15,
        width: "100%",
        color: '#fff',
        textAlign: 'center',
    },
    invalid: {
        borderWidth: 1,
        borderColor: 'red'
    },
    login: {
        borderRadius: normalize(10), width: '100%', backgroundColor:'#353a50'
    },
    iconSection:{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    itemSection: {
        paddingHorizontal: 20,
        borderBottomWidth: 4, 
        borderBottomColor: '#535353', 
        paddingVertical: 10, 
        backgroundColor:'#f3f1f6'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },
    codeSection: {
        flexDirection: 'row', 
        justifyContent: "space-between", 
        alignItems: 'center', 
        paddingVertical: 3
    }
});

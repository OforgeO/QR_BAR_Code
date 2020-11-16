import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, TextInput, KeyboardAvoidingView, Image, AsyncStorage, PermissionsAndroid } from 'react-native';
import { showToast } from '../constants/Global';
import { login } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import { normalize } from '../assets/styles';
import Layout from '../constants/Layout'
export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userId: '',
            password: '',
            loginErr: false,
            loaded: true
        };
    }

    async componentDidMount(){
        this.setState({loaded: false})
        let codeList = await AsyncStorage.getItem("codelist")
        if(codeList == null){
            await AsyncStorage.setItem("codelist", JSON.stringify(Layout.codeList))
        }
        let camera_startup = await AsyncStorage.getItem("camera_startup")
        if(camera_startup == null){
            await AsyncStorage.setItem("camera_startup", "false")
        }
        let keep_time = await AsyncStorage.getItem("keep_time")
        if(keep_time == null){
            await AsyncStorage.setItem("keep_time", "5.0")
        }
        let restart_wait = await AsyncStorage.getItem("restart_wait")
        if(restart_wait == null){
            await AsyncStorage.setItem("restart_wait", "3.0")
        }
        let soundEffect = await AsyncStorage.getItem("soundEffect")
        if(soundEffect == null){
            await AsyncStorage.setItem("soundEffect", "false")
        }
        let level = await AsyncStorage.getItem("level")
        if(level == null){
            await AsyncStorage.setItem("level", "50.0")
        }
        let vibration = await AsyncStorage.getItem("vibration")
        if(vibration == null){
            await AsyncStorage.setItem("vibration", "false")
        }
        if(Platform.OS === 'android') { 
            const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
        }
        let token = await AsyncStorage.getItem("token")
        if(token != null && token != '' && token != undefined){
            Actions.reset("scan")
        }
        this.setState({loaded: true})
    }
    
    loginUser(){
        if(this.state.userId != '' && this.state.password != ''){
            this.setState({loaded: false});
            this.setState({loginErr: false})
            login(this.state.userId, this.state.password)
            .then(async (response) => {
                console.log(response)
                if(response.error == "UnAuthorised"){
                    this.setState({loaded: true});
                    showToast('ログインに失敗しました!');
                    this.setState({loginErr: true})
                    return;
                } else{ 
                    await AsyncStorage.setItem("token", response.token)
                    Actions.reset('scan')
                    this.setState({loaded: true});
                }
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
            
        }else{
            this.setState({loginErr: true})
        }
        
    }

    render(){
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView bebehavior="height"  style={styles.container}>
                    <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
                        <View style={styles.bodyContainer}>
                            <View style={styles.logoPanel}>
                                <Image source={ require('../assets/images/logo.png') } style={styles.logoImg}  />
                                <Text style={styles.logoText}>Deal</Text>
                                <Text style={styles.logoDesc}>Barcode & QR Code Reader</Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'flex-start', paddingTop: 30, width: '100%'}}>
                                <View>
                                    <Text>Email</Text>
                                    <TextInput 
                                        returnKeyType="next"
                                        autoCapitalize="none"
                                        keyboardType='email-address'
                                        autoCorrect={false}
                                        style={this.state.loginErr? [styles.input, styles.invalid] : [styles.input]} 
                                        onChangeText={userId=>this.setState({userId})}
                                        onSubmitEditing={() => this.txtPwd.focus()}
                                    />
                                </View>
                                <View>
                                    <Text>Password</Text>
                                    <TextInput 
                                        secureTextEntry
                                        returnKeyType="go"
                                        autoCapitalize="none"
                                        style={this.state.loginErr? [styles.input, styles.invalid] : [styles.input]} 
                                        ref={ref => {this.txtPwd = ref;}}
                                        onChangeText={password=>this.setState({password})}
                                        onSubmitEditing={() => this.loginUser()}
                                    />
                                </View>
                                
                                <View>
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <TouchableOpacity onPress={() => this.loginUser()} style={styles.login}>
                                            <Text style={styles.btnText}>ログイン</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{marginTop: 10}}>
                                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                        <TouchableOpacity onPress={() => Actions.push("signup")} style={styles.login}>
                                            <Text style={styles.btnText}>新規登録</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
    
}

Login.navigationOptions = {
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
});

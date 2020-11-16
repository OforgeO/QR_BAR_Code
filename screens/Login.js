import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, TextInput, KeyboardAvoidingView, Image, AsyncStorage } from 'react-native';
import { showToast } from '../constants/Global';
import { signIn } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
import { Actions } from 'react-native-router-flux';
import { normalize } from '../assets/styles';
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
        let token = await SecureStore.getItemAsync("token")
        if(token != null && token != undefined && token != ''){
            Actions.reset("scan")
        }
    }
    
    loginUser(){
        if(this.state.userId != '' && this.state.password != ''){
            this.setState({loaded: false});
            this.setState({loginErr: false})
            signIn(this.state.userId, this.state.password)
            .then(async (response) => {
                if(response.status == false){
                    this.setState({loaded: true});
                    showToast('ログインに失敗しました!');
                    this.setState({loginErr: true})
                    return;
                } else{ 
                    this.setState({loaded: true});
                    this.setState({loginErr: false})
                    await SecureStore.setItemAsync("token", response.data.token)
                    await SecureStore.setItemAsync("username", response.data.username)
                    Actions.reset('home')
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
    doLogin(){

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
                                <Text style={styles.logoDesc}>Barcode & QR リーダー</Text>
                            </View>
                            <View style={{flex: 1, justifyContent: 'flex-start', paddingTop: 30, width: '100%'}}>
                                <View>
                                    <Text>ID</Text>
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
                                <TouchableOpacity onPress={() => Actions.push("signup")} style={{marginTop: 30}}>
                                    <Text>アカウントがございませんか？</Text>
                                </TouchableOpacity>
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

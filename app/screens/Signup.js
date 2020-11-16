import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { showToast } from '../constants/Global';
import { register } from '../constants/Api';
import { Actions } from 'react-native-router-flux';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { normalize } from '../assets/styles';
export default class Signup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            email: '',
            username: '',
            password: '',
            passwordConfirm: '',
            passwordErr: false,
            emailErr: false,
            usernameErr: false
        };
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    send(){
        let is_valid = true
        if(this.state.username == ''){
            this.setState({usernameErr: true})
            is_valid = false
        }else{
            this.setState({usernameErr: false})
        }

        if(this.state.email == '' || !this.validateEmail(this.state.email)){
            this.setState({emailErr: true})
            is_valid = false
        }else{
            this.setState({emailErr: false})
        }

        if(this.state.password == '' || this.state.password != this.state.passwordConfirm){
            this.setState({passwordErr: true})
            is_valid = false
        }else{
            this.setState({passwordErr: false})
        }
        if(is_valid){
            this.setState({loaded: false});
            register(this.state.username, this.state.email, this.state.password)
            .then(async (response) => {
                this.setState({loaded: true});
                if(response.token != undefined && response.token != '' && response.token != null){
                    Actions.reset("login")
                } else if(response.password != undefined){ 
                    showToast(response.password[0])
                } else if(response.username != undefined){ 
                    showToast(response.username[0])
                }
            })
            .catch((error) => {
                this.setState({loaded: true});
                showToast();
            });
        }
    }
    
    render(){
        return (
        
            <View style={styles.container}>
                <KeyboardAvoidingView bebehavior="height"  style={styles.container}>
                    <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
                        <ScrollView>
                            <View>
                                <Text style={{fontSize: 18}}>ユーザー名</Text>
                            </View>
                            <View style={{marginTop: 5}}>
                                <TextInput 
                                    style={this.state.usernameErr ? [styles.editInput, {borderBottomColor: 'red'}] : [styles.editInput]}
                                    returnKeyType="go"
                                    autoCapitalize="none"
                                    onChangeText={val=>this.setState({username : val})}
                                />
                            </View>
                            <View>
                                <Text style={{fontSize: 18, paddingTop: 10}}>Eメール</Text>
                            </View>
                            <View style={{marginTop: 5}}>
                                <TextInput 
                                    style={this.state.emailErr ? [styles.editInput, {borderBottomColor: 'red'}] : [styles.editInput]}
                                    returnKeyType="go"
                                    autoCapitalize="none"
                                    keyboardType={'email-address'}
                                    onChangeText={val=>this.setState({email : val})}
                                />
                            </View>
                            <View>
                                <Text style={{fontSize: 18, paddingTop: 10}}>パスワード</Text>
                            </View>
                            <View style={{marginTop: 5}}>
                                <TextInput 
                                    style={this.state.passwordErr ? [styles.editInput, {borderBottomColor: 'red'}] : [styles.editInput]}
                                    returnKeyType="next"
                                    secureTextEntry
                                    autoCapitalize="go"
                                    onChangeText={val=>this.setState({password : val})}
                                />
                            </View>
                            <View>
                                <Text style={{fontSize: 18, paddingTop: 10}}>パスワード確認</Text>
                            </View>
                            <View style={{marginTop: 5}}>
                                <TextInput 
                                    style={this.state.passwordErr ? [styles.editInput, {borderBottomColor: 'red'}] : [styles.editInput]}
                                    returnKeyType="next"
                                    secureTextEntry
                                    autoCapitalize="go"
                                    onChangeText={val=>this.setState({passwordConfirm : val})}
                                />
                            </View>
                            
                            <TouchableOpacity onPress={() => {this.send()}}>
                                <View style={styles.pwdBorder}>
                                    <Text style={{color: 'black', fontSize: 20}}>送る</Text>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
    
}

Signup.navigationOptions = {
    title: '新規登録',
    headerRight: <View></View>,
    headerTitleStyle: {
        textAlign: 'center',
        flexGrow:1,
        alignSelf:'center',
    },
    headerStyle: {
        backgroundColor: 'white',
    },
    headerTintColor: 'black',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  pwdBorder: {
    borderRadius: 30,
    borderColor: '#f2aead',
    borderWidth: 1,
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: 'center'
  },
  editInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
    fontSize: 18,
    marginBottom: 5
  },
  
});

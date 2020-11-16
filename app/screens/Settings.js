import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Keyboard, TextInput, Slider, Switch, AsyncStorage } from 'react-native';
import { showToast } from '../constants/Global';
import { signIn } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import { normalize } from '../assets/styles';
import { Icon } from 'react-native-elements'
import { getScreenWidth } from '../assets/styles'
export default class Settings extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            vibration: false,
            soundEffect: true,
            level: 50,
            restart_wait: 3.0,
            keep_time: 5.0,
            camera_startup: true,
            barcodeStr: '',
            loaded: true
        };
    }
    async UNSAFE_componentWillReceiveProps(){
        this.refresh()
    }
    async componentDidMount(){
        let camera_startup = await AsyncStorage.getItem("camera_startup")
        this.setState({camera_startup: camera_startup == "true" ? true : false})
        let keep_time = await AsyncStorage.getItem("keep_time")
        this.setState({keep_time: parseFloat(keep_time)})
        let restart_wait = await AsyncStorage.getItem("restart_wait")
        this.setState({restart_wait : parseFloat(restart_wait)})
        let soundEffect = await AsyncStorage.getItem("soundEffect")
        this.setState({soundEffect: soundEffect == "true" ? true : false})
        let level = await AsyncStorage.getItem("level")
        this.setState({level: parseFloat(level)})
        let vibration = await AsyncStorage.getItem("vibration")
        this.setState({vibration: vibration == "true" ? true : false})
        this.refresh()
    }
    async refresh(){
        let codeList = await AsyncStorage.getItem("codelist")
        codeList = JSON.parse(codeList)
        let code = '';
        for(var i = 0;i<codeList.length;i++){
            if(codeList[i]['checked']){
                if(code != '')
                    code += ',';
                code += codeList[i]['name'];
            }
        }
        this.setState({barcodeStr: code})
    }
    toggleSwitchVibration = (value) => {
        this.setState({vibration: value})
    }
    toggleSwitchSound = (value) => {
        this.setState({soundEffect: value})
    }
    toggleSwitchCamera = (value) => {
        this.setState({camera_startup: value})
    }

    async goBack(){
        await AsyncStorage.setItem("camera_startup", this.state.camera_startup.toString())
        await AsyncStorage.setItem("keep_time", this.state.keep_time.toString())
        await AsyncStorage.setItem("restart_wait", this.state.restart_wait.toString())
        await AsyncStorage.setItem("soundEffect", this.state.soundEffect.toString())
        await AsyncStorage.setItem("level", this.state.level.toString())
        await AsyncStorage.setItem("vibration", this.state.vibration.toString())

        Actions.pop({refresh: {}})
        Actions.refresh();
    }

    async logout(){
        await AsyncStorage.removeItem("token")
        Actions.reset("login")
    }
    
    render(){

        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.goBack} onPress={() => this.goBack()}>
                    <Icon type="materialicons" name={"arrow-back"} size={25} />
                </TouchableOpacity>
                <ScrollView>
                    <View style={[styles.listSection, {paddingLeft: 20, paddingTop: 20}]}>
                        <Text>アプリ情報</Text>
                    </View>
                    <View style={{paddingLeft: 40, borderBottomWidth: 1,borderBottomColor: '#8a8a8a'}}>
                        <View style={styles.listSection}>
                            <Text>Sales One</Text>
                        </View>
                        <View style={[styles.listSection, {borderBottomWidth: 0}]}>
                            <Text>Version 1.0</Text>
                        </View>
                        {
                            /*<View style={styles.listSection}>
                                <Text>関連URL</Text>
                            </View>
                            <View style={styles.listSection}>
                                <Text>アプリ評価</Text>
                            </View>
                            <View style={styles.listSection}>
                                <Text>環境情報</Text>
                            </View>
                            <View style={[styles.listSection, {borderBottomWidth: 0}]}>
                                <Text>プライバシーポリシー</Text>
                            </View>*/
                        }
                        
                    </View>
                    <View style={[styles.listSection, {paddingLeft: 20, paddingTop: 20}]}>
                        <Text>設定</Text>
                    </View>
                    <View style={{paddingLeft: 40, borderBottomWidth: 1,borderBottomColor: '#8a8a8a'}}>
                        <TouchableOpacity style={[styles.listSection, styles.switchSection]} onPress={() => Actions.push("barcode")}>
                            <Text>バーコード種類</Text>
                            <Text style={{width: 120}} numberOfLines={1}>{this.state.barcodeStr}</Text>
                        </TouchableOpacity>
                        <View style={[styles.listSection, styles.switchSection]}>
                            <Text>起動時にカメラをオンにする</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#30d158" }}
                                thumbColor={"white"}
                                onValueChange={this.toggleSwitchCamera}
                                value={this.state.camera_startup}
                            />
                        </View>
                        <View style={styles.listSection}>
                            <Text>スキャン維持時間（秒）</Text>
                        </View>
                        <View style={[styles.listSection, {flexDirection: 'row'}]}>
                            <Slider
                                value={this.state.keep_time}
                                minimumTrackTintColor={"#1984ff"}
                                minimumValue={0}
                                maximumValue={60}
                                step={1.0}
                                style={{width: getScreenWidth() - 80}}
                                thumbTintColor={"#1984ff"}
                                onValueChange={(value) => this.setState({keep_time: value })}
                            />
                            <Text>{this.state.keep_time }.0</Text>
                        </View>
                        <View style={styles.listSection}>
                            <Text>再スキャン待機時間（秒）</Text>
                        </View>
                        <View style={[styles.listSection, {borderBottomWidth: 0, flexDirection: 'row'}]}>
                            <Slider
                                value={this.state.restart_wait}
                                minimumTrackTintColor={"#1984ff"}
                                minimumValue={0}
                                maximumValue={5}
                                step={0.1}
                                style={{width: getScreenWidth() - 80}}
                                thumbTintColor={"#1984ff"}
                                onValueChange={(value) => this.setState({restart_wait: value })}
                            />
                            <Text>{Math.round(this.state.restart_wait * 10) / 10}</Text>
                        </View>
                    </View>
                    <View style={[styles.listSection, {paddingLeft: 20, paddingTop: 20}]}>
                        <Text>サウンド効果</Text>
                    </View>
                    <View style={{paddingLeft: 40, borderBottomWidth: 1,borderBottomColor: '#8a8a8a'}}>
                        <View style={[styles.listSection, styles.switchSection]}>
                            <Text>サウンド効果</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#30d158" }}
                                thumbColor={"white"}
                                onValueChange={this.toggleSwitchSound}
                                value={this.state.soundEffect}
                            />
                        </View>
                        <View style={[styles.listSection, {flexDirection: 'row'}]}>
                            <Text>ボリュウーム</Text>
                            <Slider
                                value={this.state.level}
                                thumbStyle={{backgroundColor: 'red'}}
                                minimumTrackTintColor={"#1984ff"}
                                minimumValue={0}
                                maximumValue={100}
                                step={1.0}
                                style={{width: getScreenWidth() - 170}}
                                thumbTintColor={"#1984ff"}
                                onValueChange={(value) => this.setState({level: value })}
                            />
                            <Text>{this.state.level}.0</Text>
                        </View>
                        <View style={[styles.listSection, styles.switchSection, {borderBottomWidth: 0}]}>
                            <Text>振動</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#30d158" }}
                                thumbColor={"white"}
                                onValueChange={this.toggleSwitchVibration}
                                value={this.state.vibration}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.listSection, {paddingLeft: 20, paddingTop: 10, marginBottom: 20}]} onPress={() => this.logout()}>
                        <Text>ログアウト</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Spinner_bar color={'#27cccd'} visible={!this.state.loaded} textContent={""} overlayColor={"rgba(0, 0, 0, 0.5)"} />
            </View>
        );
    }
    
}

Settings.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    listSection: {
        paddingVertical: 10,
        borderBottomWidth: 1, 
        borderBottomColor: '#8a8a8a'
    },
    switchSection: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingRight: 10, 
        alignItems: 'center'
    },
    goBack: {
        paddingLeft: 10, 
        paddingVertical: 10, 
        alignItems: 'flex-start', 
        borderBottomColor: 'gray', 
        borderBottomWidth: 1
    }
});

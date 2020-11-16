import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard, TextInput, Vibration, Image, FlatList } from 'react-native';
import { showToast } from '../constants/Global';
import { signIn } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import * as SecureStore from 'expo-secure-store';
import { Actions } from 'react-native-router-flux';
import { normalize } from '../assets/styles';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Octicons, MaterialCommunityIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Third Item',
    },
    {
        id: '58694a0f-1da1-471f-bd96-145571e29d72',
        title: 'Firth Item',
    },
];
export default class Scan extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: true,
            hasPermission : null,
            type : 'bar',
            typeProgress: 100,
            loadComplete: false,
            scanned: false
        };
    }

    async componentDidMount(){
        const status = await BarCodeScanner.requestPermissionsAsync();
        this.setState({hasPermission : status})
        console.log(BarCodeScanner.Constants.BarCodeType.upc_ean)
    }

    changeType(){
        this.setState({loadComplete : false})
        if(this.state.type == 'qr')
            this.setState({type: 'bar'})
        else
            this.setState({type: 'qr'})
        this.circularProgress.reAnimate(0, 100, 1000)
    }

    handleBarCodeScanned = ({type,data}) => {
        //Vibration.vibrate();
        console.log(type)
        
    }
    
    render(){
        return (
            <View style={styles.container}>
                
                <BarCodeScanner
                    onBarCodeScanned={!this.state.scanned && this.handleBarCodeScanned}
                    style={{height: 350}}
                />
                
                <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <View style={{height: 250}}>
                        <FlatList
                            data={DATA}
                            renderItem={({ item }) => {
                                return (
                                    <View style={styles.itemSection}>
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', borderBottomColor: 'gray', borderBottomWidth: 1}}>
                                            <Text>1 UPC - E</Text>
                                            <Text>Jun 23, 2020 at 16:09:18</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', paddingVertical: 3}}>
                                            <Text style={{color:'black', fontSize: 20}}>{item.title}</Text>
                                            <Octicons name={"search"} size={20} />
                                        </View>
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.id}
                        />
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 20}}>
                        <TouchableOpacity onPress={() => this.changeType()}>
                            <AnimatedCircularProgress
                                size={100}
                                width={10}
                                fill={this.state.typeProgress}
                                ref={(ref) => this.circularProgress = ref}
                                rotation={0}
                                duration={1000}
                                tintColor={this.state.type == 'bar' ? "#56b3d5" : "#e25c47"}
                                onAnimationComplete={() => this.setState({loadComplete : true})}
                                backgroundColor="#e6e7e6" 
                            >
                                {
                                    (fill) => (
                                        this.state.type == 'bar' ?
                                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('../assets/images/barcode.png')} style={{height: 60}} resizeMode={"contain"} />
                                        </View>
                                        :
                                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                            <Image source={require('../assets/images/qrcode.png')} style={{height: 60}} resizeMode={"contain"} />
                                        </View>
                                    )
                                }
                            </AnimatedCircularProgress>
                        </TouchableOpacity>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 20, flexDirection: 'row'}}>
                        <TouchableOpacity style={styles.iconSection}>
                            <FontAwesome name={"circle"} size={33} color={"red"} />
                            <Text>Code Scan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconSection}>
                            <Entypo name={"share-alternative"} size={30} />
                            <Text>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconSection}>
                            <MaterialCommunityIcons name={"delete"} size={30} />
                            <Text>Del History</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconSection}>
                            <MaterialCommunityIcons name={"settings"} size={30} />
                            <Text>Settings</Text>
                        </TouchableOpacity>
                    </View>
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
        paddingHorizontal: 5
    },
    itemSection: {
        paddingHorizontal: 20,
        borderBottomWidth: 4, 
        borderBottomColor: '#535353', 
        paddingVertical: 10, 
        backgroundColor:'#f3f1f6'
    }
});

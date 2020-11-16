import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Keyboard, TextInput, Slider, Switch, AsyncStorage } from 'react-native';
import { showToast } from '../constants/Global';
import { signIn } from '../constants/Api';
import Spinner_bar from 'react-native-loading-spinner-overlay';
import { Actions } from 'react-native-router-flux';
import { normalize } from '../assets/styles';
import { Icon, CheckBox } from 'react-native-elements'
import { getScreenWidth } from '../assets/styles'
import Layout from '../constants/Layout';
import { Item } from 'native-base';
export default class Barcode extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            barcode: Layout.codeList,
            loaded: true,
            checked: true,
        };
    }

    checkVal(index){
        let temp = this.state.barcode;
        temp[index].checked = !temp[index].checked
        this.setState({barcode: temp})
    }

    renderCodeList(){
        return this.state.barcode.map((bar, index) => {
            return (
                <TouchableOpacity onPress={() => this.checkVal(index)} style={[styles.listSection, styles.checkSection]}>
                    <Text>{bar.name}</Text>
                    <CheckBox
                        checked={bar.checked}
                        onPress={() => {this.checkVal(index)}}
                    />
                </TouchableOpacity>
            )
        })
    }
    async goBack(){
        let codeList = JSON.stringify(this.state.barcode)
        await AsyncStorage.setItem("codelist", codeList)
        Actions.pop({refresh: {}})
        Actions.refresh();
    }
    
    render(){
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.goBack()} style={{paddingLeft: 10, paddingVertical: 10, alignItems: 'flex-start', borderBottomColor: 'gray', borderBottomWidth: 1}}>
                    <Icon type="materialicons" name={"arrow-back"} size={25} />
                </TouchableOpacity>
                <ScrollView>
                    <View style={[styles.listSection, {paddingLeft: 20, paddingVertical: 20}]}>
                        <Text>TYPE OF BAR CODE TO READ</Text>
                    </View>
                    <View style={{paddingLeft: 40}}>
                        {
                            this.renderCodeList()
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
    
}

Barcode.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    listSection: {
        borderBottomWidth: 1, 
        borderBottomColor: '#8a8a8a'
    },
    switchSection: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingRight: 10, 
        alignItems: 'center'
    },
    checkSection: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingRight: 0
    }
});

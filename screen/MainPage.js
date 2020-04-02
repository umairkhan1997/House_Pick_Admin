import React from 'react';
import { Text, View, StyleSheet, TouchableHighlight,SafeAreaView,Image,TextInput ,
    ImageBackground,Dimensions,KeyboardAvoidingView,ScrollView,TouchableOpacity} from 'react-native';
import { Root,Icon ,Drawer, Item ,Header,Body,Card,Left,Right,Button,Picker,Input, Toast,} from 'native-base';
import { Platform } from 'react-native';


class MainPage extends React.Component {
    static navigationOptions={
        header:null,
    } 
    constructor(props) {
        super(props);
        this.state = {
      
        }
    }

    render() {

      const {navigate}=this.props.navigation;
      return (
        <View style={{
          flex: 1, 
          alignItems: 'center',
          justifyContent: 'center'
          ,backgroundColor:'#f5f6fb'
      }}>
          <Text style={{marginBottom:50,marginTop:-100,fontWeight:'bold',fontSize:24}}>House Pick Admin</Text>
<View style={{height:200,width:200,backgroundColor:'white',shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.7,shadowRadius: 1,elevation: 1,borderRadius:20,justifyContent:'center',flexDirection:'row'}}>
<View style={{justifyContent:'center'}}>
<TouchableOpacity onPress={()=>navigate('AddPost')}>
<Image source={require('../images/writing.png')} style={{width:100,height:100}}/>
<Text style={{textAlign:'center',marginTop:20,fontWeight:'bold'}}>Add Post</Text>
</TouchableOpacity>
</View>


</View>


<View style={{marginTop:20,height:200,width:200,backgroundColor:'white',shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.7,shadowRadius: 1,elevation: 1,borderRadius:20,justifyContent:'center',flexDirection:'row'}}>
<View style={{justifyContent:'center'}}>
<TouchableOpacity onPress={()=>navigate('AddPost')}>
<Image source={require('../images/worker.png')} style={{width:100,height:100}}/>
<Text style={{textAlign:'center',marginTop:20,fontWeight:'bold'}}>Manage Post</Text>
</TouchableOpacity>
</View>


</View>

      </View>
);
}
}





            
export default MainPage;
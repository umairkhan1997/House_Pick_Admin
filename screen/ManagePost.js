import React from 'react';
import {
    Text, View, StyleSheet, TouchableHighlight, SafeAreaView, Image, TextInput,
    ImageBackground, Dimensions, KeyboardAvoidingView, ScrollView, TouchableOpacity,
    FlatList
} from 'react-native';
import { Root, Icon, Drawer, Item, Header, Body, Card, Left, Right, Button, Picker, Input, Toast, } from 'native-base';
import { Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/firestore';
import MEIcon from 'react-native-vector-icons/AntDesign';
class ManagePost extends React.Component {
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }

    componentDidMount() {
        let posts = []
        firestore().collection('post').get().then(async snapshot => {
            await snapshot.forEach((doc) => {
                posts.push({ ...doc.data(), key: doc.id })
            })
            this.setState({ posts })
        })
        // console.log(snapshot)
    }

    deletePost = (id, index) => {
        firebase.firestore().collection('post').doc(id).delete().then(() => {
            let allPosts = this.state.posts;
            allPosts.splice(index, 1)
            this.setState({ posts: allPosts })
        })
    }

    editPost = (post) => {
        this.props.navigation.navigate('UpdatePost', { postData: post })
    }
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1, backgroundColor: '#f5f6fb' }}>
                <ScrollView style={{}}>

                    <View style={{ flexDirection: 'row', marginTop: 30, marginLeft: 20 }}>
                        <TouchableOpacity onPress={() => navigate('MainPage')}>
                            <Image source={require('../images/back.png')} style={{ marginTop: 10, marginRight: 10, width: 30, height: 20 }} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{''}</Text>
                    </View>

                    <View style={{ flex: 1, marginTop: 20 }}>

                        <FlatList
                            numColumns={2}
                            style={{ flex: 1, }}
                            data={this.state.posts}
                            renderItem={({ item, index }) => {
                                const { postImages, flagImage } = item;
                                return (
                                    <View key={index} style={{ width: '40%', marginHorizontal: '5%', marginBottom: 20, justifyContent: 'center', }}>
                                        <TouchableOpacity>
                                            <View>
                                                <Image source={{ uri: postImages[0] }} style={{ width: '100%', height: 120, borderRadius: 10 }} />
                                                <Image source={{ uri: flagImage }} style={{ width: 20, height: 20, borderRadius: 2, position: 'absolute', bottom: 10, right: 10 }} />
                                            </View>
                                        </TouchableOpacity>
                                        <Text style={{ textAlign: 'center', width: '90%', marginLeft: '5%', marginTop: 10 }}>@palace Kingster</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => this.editPost(item)}>
                                                <Image source={require('../images/edit.png')} style={{ width: 25,marginTop:5, marginRight:20, height: 25 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.deletePost(item.key, index)}>
                                                <Image source={require('../images/delete.png')} style={{ width: 25,marginTop:5,marginLeft:20, height: 25 }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            }}
                        />

                    </View>
                </ScrollView>
            </View>
        );
    }
}




export default ManagePost;
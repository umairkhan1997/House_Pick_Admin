import React from 'react';
import {
    Text, View, StyleSheet, TouchableHighlight, SafeAreaView, Image, TextInput, ActivityIndicator,
    ImageBackground, Dimensions, KeyboardAvoidingView, ScrollView, TouchableOpacity
} from 'react-native';
import { Platform } from 'react-native';
import { Container, Header, Content, Icon, Picker, Form, Input, Textarea, Button } from "native-base";
import ImagePickerss from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import storage from '@react-native-firebase/storage';
import { firebase } from '@react-native-firebase/firestore';

export const FireBaseStorage = storage();

class UpdatePost extends React.Component {
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props);
        this.state = {
            selected: "tech",
            postName: '', postDetail: '',
            imageflag: null, imagesflag: null,
            imagePost: null, imagesPost: null,
            loader: false
        }
    }

    componentDidMount() {
        let postData = this.props.route.params.postData;

        this.setState({
            selected: postData.category,
            postName: postData.postName,
            imagesPost: postData.postImages,
            imagesflag: [postData.flagImage],
            postDetail: postData.postDetail,
        })
    }

    onValueChange(value) {
        this.setState({
            selected: value
        });
    }

    // getImagess=(parOne,parTwo)=> {
    //   ImagePickerss.openPicker({
    //     mediaType : 'photo',
    //   }).then(images => {
    //     this.setState({
    //       [parOne]: null,
    //       [parTwo]: images.map(i => {
    //         console.log('received image', i);
    //         return {uri: i.path, width: i.width, height: i.height, mime: i.mime};
    //       })
    //     });
    //   }).catch(e => console.log(e));
    // }

    getImagess(parOne, parTwo) {
        let maxImg = parOne === 'imageflag' ? 1 : 3
        ImagePickerss.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            sortOrder: 'desc',
            includeExif: true,
            forceJpg: true,
            mediaType: 'photo',
        }).then(images => {
            this.setState({
                [parOne]: null,
                [parTwo]: images.slice(0, maxImg).map(i => {
                    // console.log('received image', i);
                    return { uri: i.path, };
                })
            });
        }).catch(e => console.log('ERROR', e));
    }

    addPost = async () => {
        let postImagesURLs = [];
        let flagImageURL = '';
        let key = this.props.route.params.postData.key
        if (this.state.postName != '' && this.state.postDetail != '' && this.state.imageflag != null && this.state.imagesflag != null && this.state.imagePost != null, this.state.imagesPost != null) {

            this.setState({ loader: true });
            if (typeof (this.state.imagesPost[0]) == 'string') {
                // Download URLS
                postImagesURLs = this.state.imagesPost



                if (typeof (this.state.imagesflag[0]) == 'string') {
                    flagImageURL = this.state.imagesflag[0]
                    let post = {
                        postName: this.state.postName,
                        postDetail: this.state.postDetail,
                        postImages: postImagesURLs,
                        flagImage: flagImageURL,
                        category: this.state.selected
                    }
                    // console.log('Post not change flag not chang ', post)
                    firebase.firestore().collection('post').doc(key).update(post).then(()=>{
                        this.setState({ loader: false });
                    });

                } else {
                    // upload local files
                    let flagImageRef = `images/${key}/flag_image_${new Date().getTime()}`;
                    await FireBaseStorage.ref(flagImageRef).putFile(this.state.imagesflag[0].uri).then(async (res) => {
                        await storage().ref(flagImageRef).getDownloadURL().then((flagUri) => {
                            flagImageURL = flagUri;
                            

                            let post = {
                                postName: this.state.postName,
                                postDetail: this.state.postDetail,
                                postImages: postImagesURLs,
                                flagImage: flagImageURL,
                                category: this.state.selected
                            }
                            // console.log('Not Change final Post = ', post)
                            firebase.firestore().collection('post').doc(key).update(post).then(()=>{
                                this.setState({ loader: false });
                            });
                          

                        })
                    })
                }




            } else {
                let i = 0;
                //local paths
                // alert('locallllllllllllllllllll')

        
                this.state.imagesPost.map(async (oneImageObj, index) => {
                    let fileRef = `images/${key}/file_${new Date().getTime()}`;
                    await FireBaseStorage.ref(fileRef).putFile(oneImageObj.uri).then(async (res) => {
                        await storage().ref(fileRef).getDownloadURL().then(async (uri) => {
                            await postImagesURLs.push(uri)
                            // console.log(uri)
                            // console.log('length = ', this.state.imagesPost.length - 1, 'index = ', index)


                            if (this.state.imagesPost.length - 1 == index) {
                                // console.log('Final if ', this.state.imagesPost.length - 1, index)


                                if (typeof (this.state.imagesflag[0]) == 'string') {
                                    // console.log('in the flag not change');
                                    flagImageURL = this.state.imagesflag[0]
                                    let post = {
                                        postName: this.state.postName,
                                        postDetail: this.state.postDetail,
                                        postImages: postImagesURLs,
                                        flagImage: flagImageURL,
                                        category: this.state.selected
                                    }
                                    // console.log('Post change flag not chang ', post)
                                    firebase.firestore().collection('post').doc(key).update(post).then(()=>{
                                        this.setState({ loader: false });
                                    });
                                   
                                } else {
                                    // upload local files
                                    // console.log('in the flag change');
                                    let flagImageRef = `images/${key}/flag_image_${new Date().getTime()}`;
                                    await FireBaseStorage.ref(flagImageRef).putFile(this.state.imagesflag[0].uri).then(async (res) => {
                                        await storage().ref(flagImageRef).getDownloadURL().then((flagUri) => {
                                            flagImageURL = flagUri;


                                            let post = {
                                                postName: this.state.postName,
                                                postDetail: this.state.postDetail,
                                                postImages: postImagesURLs,
                                                flagImage: flagImageURL,
                                                category: this.state.selected
                                            }
                                            // console.log('Change final Post = ', post)
                                            firebase.firestore().collection('post').doc(key).update(post).then(()=>{
                                                this.setState({ loader: false });
                                                
                                            });
                                        })
                                    })
                                }
                            }




                        })
                    })
                })
            }
            //FLAG string = url && object  = path
            // console.log('postImagesURLs = ', postImagesURLs)
            // if (typeof (this.state.imagesflag[0]) == 'string') {
            //     flagImageURL = this.state.imagesflag
            // } else {
            //     // upload local files
            //     let flagImageRef = `images/${key}/flag_image_${new Date().getTime()}`;
            //     await FireBaseStorage.ref(flagImageRef).putFile(this.state.imagesflag[0].uri).then(async (res) => {
            //         await storage().ref(flagImageRef).getDownloadURL().then((flagUri) => {
            //             flagImageURL = flagUri;
            //         })
            //     })
            // }
            // let post = {
            //     postName: this.state.postName,
            //     postDetail: this.state.postDetail,
            //     postImages: postImagesURLs,
            //     flagImage: flagImageURL,
            //     category: this.state.selected
            // }
            // console.log('final Post = ', post)

            // console.log(this.state.imagesflag[0], 'this.state.imagesflag')
            // if (this.state.imagesflag[0].indexOf('https') !== -1) {
            //     // Download URLS
            //     alert('DOWNLOAD URLS Flag')
            //     flagImageURL = this.state.imagesflag
            // } else {
            //     //local paths
            // FireBaseStorage.ref(this.state.imagesflag).putFile(this.state.imagesflag[0].uri).then(async (res) => {
            //     await storage().ref(fileRef).getDownloadURL().then((flagUri) => {
            //         flagImageURL = flagUri;
            //         // let postRef = firebase.firestore().collection('post');

            //         // postRef.doc(key).set(post).then(() => {
            //         //     this.setState({
            //         //         selected: "key1",
            //         //         postName: '', postDetail: '',
            //         //         imageflag: null, imagesflag: null,
            //         //         imagePost: null, imagesPost: null,
            //         //         loader: false,
            //         //     })
                        // alert('Post Successfully Added')
            //         // })
            //     })
            // })
            // }

        } //if close
        else {

             alert('Please Fill All Fields and Select Images')

        }


    }

    renderVideo(video) {
        // console.log('rendering video');
        return (<View style={{ height: 300, width: 300 }}>
            <Video source={{ uri: video.uri, type: video.mime }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }}
                rate={1}
                paused={false}
                volume={1}
                muted={false}
                resizeMode={'cover'}
                onError={e => console.log(e)}
                onLoad={load => console.log(load)}
                repeat={true} />
        </View>);
    }

    renderImage(image) {

        if (typeof (image) !== 'string') {
            return <Image style={{ width: 200, height: 200, resizeMode: 'contain' }} source={image} />
        } else {
            return <Image style={{ width: 200, height: 200, resizeMode: 'contain' }} source={{ uri: image }} />
        }
    }

    renderAsset = (image) => {
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
            return this.renderVideo(image);
        }

        return this.renderImage(image);
    }

    uploadImages = () => {
        // console.log(this.state)
    }
    render() {
        // console.log(this.state, 'this.state')
        const { navigate } = this.props.navigation;

        return (
            <View style={{ flex: 1, backgroundColor: '#f5f6fb' }}>
                <ScrollView style={{}}>

                    <Text style={{ marginTop: 30, fontSize: 30, fontWeight: 'bold', marginLeft: 20, textAlign: "center" }}>Update Post</Text>
                    {/* PICKER */}
                    <Text style={{ marginTop: 30, fontSize: 18, fontWeight: 'bold', marginLeft: '5%' }}>Post Category :</Text>
                    <Content style={{ marginLeft: '5%', width: '90%', marginTop: 10, borderBottomWidth: 0.5, borderBottomColor: 'black' }}>
                        <Form>
                            <Picker
                                mode="dropdown"
                                iosHeader="Select your SIM"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                selectedValue={this.state.selected}
                                onValueChange={this.onValueChange.bind(this)}
                            >
                                <Picker.Item label="Home" value="home" />
                                <Picker.Item label="Tech" value="tech" />
                                <Picker.Item label="Men Jewels" value="men_jewels" />
                                <Picker.Item label="Women Jewels" value="women_jewels" />
                                <Picker.Item label="Men in lead" value="men_in_lead" />
                                <Picker.Item label="Women in lead" value="women_in_lead" />
                            </Picker>
                        </Form>
                    </Content>


                    {/* PICKER */}
                    <Text style={{ marginTop: 30, fontSize: 18, fontWeight: 'bold', marginLeft: '5%' }}>Post Name:</Text>
                    <Input
                        value={this.state.postName}
                        onChangeText={postName => this.setState({ postName })}
                        placeholder='Post Name' placeholderTextColor='gray'
                        style={{ fontSize: 14, fontWeight: '400', borderBottomWidth: 0.5, borderBottomColor: 'black', width: '90%', marginLeft: '5%' }} />

                    {/* PICKER */}
                    <Text style={{ marginTop: 30, fontSize: 18, fontWeight: 'bold', marginLeft: '5%' }}>Post Detail:</Text>
                    <Textarea
                        rowSpan={5} bordered
                        value={this.state.postDetail}
                        onChangeText={postDetail => this.setState({ postDetail })}
                        placeholder='Post Detail' placeholderTextColor='gray'
                        //  keyboardType='numeric'
                        style={{ fontSize: 14, fontWeight: '400', borderBottomWidth: 0.5, marginTop: 20, borderBottomColor: 'black', width: '90%', marginLeft: '5%' }} />


                    {/* POST FLAG IMAGES */}
                    <ScrollView horizontal={true} style={{ marginVertical: 20 }}>
                        {this.state.imageflag ? this.renderAsset(this.state.imageflag) : null}
                        {this.state.imagesflag ? this.state.imagesflag.map(i => <View key={i}>{this.renderAsset(i)}</View>) : null}
                    </ScrollView>
                    <Button disabled={this.state.loader} onPress={() => this.getImagess('imageflag', 'imagesflag')} style={{ justifyContent: 'center', backgroundColor: '#ba0916', width: '90%', marginLeft: '5%' }}>
                        {
                            this.state.imagesflag ?
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Select to Change Image for Flag</Text>
                                :
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Select Image for Flag</Text>
                        }
                    </Button>

                    {/* POST IMAGES */}
                    <ScrollView horizontal={true} style={{ marginVertical: 20 }}>
                        {this.state.imagePost ? this.renderAsset(this.state.imagePost) : null}
                        {this.state.imagesPost ? this.state.imagesPost.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
                    </ScrollView>
                    <Button disabled={this.state.loader} onPress={() => this.getImagess('imagePost', 'imagesPost')} style={{ justifyContent: 'center', backgroundColor: '#ba0916', width: '90%', marginLeft: '5%' }}>
                        {
                            this.state.imagesPost ?
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Select to Change Image for Post</Text>
                                :
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Select Image for Post</Text>
                        }
                    </Button>

                    {
                        this.state.loader ? <ActivityIndicator size={"large"} /> :

                            <Button

                                onPress={this.addPost}
                                style={{ justifyContent: 'center', backgroundColor: '#238cf3', width: '98%', marginLeft: '1%', marginVertical: 20 }}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Update Post</Text>
                            </Button>
                    }
                </ScrollView>
            </View>
        );
    }
}




export default UpdatePost;
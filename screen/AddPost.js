import React from 'react';
import {
  Text, View, StyleSheet, TouchableHighlight, SafeAreaView, Image, TextInput,
  ImageBackground, Dimensions, KeyboardAvoidingView, ScrollView, TouchableOpacity
} from 'react-native';
import { Platform } from 'react-native';
import { Container, Header, Content, Icon, Picker, Form, Input, Textarea, Button } from "native-base";
import ImagePickerss from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import storage from '@react-native-firebase/storage';
import { firebase } from '@react-native-firebase/firestore';

export const FireBaseStorage = storage();

class AddPost extends React.Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    this.state = {
      selected: "key1",
      postName: '', postDetail: '',
      imageflag: null, imagesflag: null,
      imagePost: null, imagesPost: null

    }
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
        [parTwo]: images.map(i => {
          // console.log('received image', i);
          return { uri: i.path, };
        })
      });
    }).catch(e => console.log('ERROR', e));
  }

  addPost = () => {
    let postImagesURLs = [];
    let flagImageURL = '';
    console.log('imagesflag =', this.state.imagesflag)
    this.state.imagesPost.map(async (oneImageObj, index) => {
      let fileRef = `images/file_${new Date().getTime()}`;
      let flagImageRef = `images/flag_image_${new Date().getTime()}`;
      await FireBaseStorage.ref(fileRef).putFile(oneImageObj.uri).then(async (res) => {
        await storage().ref(fileRef).getDownloadURL().then(async (uri) => {
          postImagesURLs.push(uri)
          await FireBaseStorage.ref(flagImageRef).putFile(this.state.imagesflag[0].uri).then(async (res) => {
            await storage().ref(fileRef).getDownloadURL().then((flagUri) => {
              flagImageURL = flagUri
            })
          })
          if (this.state.imagesPost.length - 1 == index) {
            let post = {
              postName: this.state.postName,
              postDetail: this.state.postDetail,
              postImages: postImagesURLs,
              flagImage: flagImageURL,
              category: this.state.selected
            }
            let postRef = firebase.firestore().collection('post');
            postRef.add(post)
          }
        })
      })
    })
  }

  renderVideo(video) {
    console.log('rendering video');
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
    return <Image style={{ width: 200, height: 200, resizeMode: 'contain' }} source={image} />
  }

  renderAsset = (image) => {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }

  uploadImages = () => {
    console.log(this.state)
  }
  render() {
    // console.log(this.state, 'this.state')
    const { navigate } = this.props.navigation;

    return (
      <View style={{ flex: 1, backgroundColor: '#f5f6fb' }}>
        <ScrollView style={{}}>

          <Text style={{ marginTop: 30, fontSize: 30, fontWeight: 'bold', marginLeft: 20, textAlign: "center" }}>Add Post</Text>
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
                <Picker.Item label="Technology" value="tech" />
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
            {this.state.imagesflag ? this.state.imagesflag.map(i => <View key={i.uri}>{this.renderAsset(i)}</View>) : null}
          </ScrollView>
          <Button onPress={() => this.getImagess('imageflag', 'imagesflag')} style={{ justifyContent: 'center', backgroundColor: '#ba0916', width: '90%', marginLeft: '5%' }}>
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
          <Button onPress={() => this.getImagess('imagePost', 'imagesPost')} style={{ justifyContent: 'center', backgroundColor: '#ba0916', width: '90%', marginLeft: '5%' }}>
            {
              this.state.imagesPost ?
                <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Select to Change Image for Post</Text>
                :
                <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Select Image for Post</Text>
            }
          </Button>


          <Button

            onPress={this.addPost}
            style={{ justifyContent: 'center', backgroundColor: '#238cf3', width: '98%', marginLeft: '1%', marginVertical: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>Add Post</Text>
          </Button>
        </ScrollView>
      </View>
    );
  }
}




export default AddPost;
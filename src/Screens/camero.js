import React, { Component } from 'react'
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, ToastAndroid } from 'react-native'
import { RNCamera } from 'react-native-camera';
import CameraRoll from "@react-native-community/cameraroll";

import Icon from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
class Camero extends Component {
  state = {
    recording: false,
    second: 0,
    duration: 300,
    backCamera: false,
    flash: false

  }

  /*
  .##........#######...######...####..######.
  .##.......##.....##.##....##...##..##....##
  .##.......##.....##.##.........##..##......
  .##.......##.....##.##...####..##..##......
  .##.......##.....##.##....##...##..##......
  .##.......##.....##.##....##...##..##....##
  .########..#######...######...####..######.
  */

  //SECOND TO MMS
  secondToms = (seconds: number) => {
    let m = Math.floor(seconds / 60)
    let s = Math.floor(seconds % 60)

    let mDispaly = m < 10 ? `0${m}` : `${m}`;
    let sDispaly = m < 10 ? `0${s}` : `${s}`;
    return `${mDispaly}:${sDispaly}`
  }

  recordVideo = async () => {
    if (this.camera) {
      if (!this.state.recording) {
        this.startRecording()
      } else {
        this.stopRecording()
      }
    }
  }

  //START RECORDING:-

  startRecording = async () => {
    this.setState({ recording: true })
    this.countRecordingTime = setInterval(() => this.setState({ second: this.state.second + 1 }), 1000)
    const cameraConfig = { duration: this.state.duration }
    const data = await this.camera.recordAsync(cameraConfig)
    this.setState({ recording: false })
    CameraRoll.save(data.uri, 'Video')
    // .then(onfullfilled => {
    //   ToastAndroid.show('Record Video', ToastAndroid.SHORT)
    // }).catch(error => {
    //   ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT)
    // })

  }


  //STOP RECORDING:-

  stopRecording = () => {
    this.camera.stopRecording();
    clearInterval(this.countRecordingTime)
    this.setState({ second: 0 })
  }

  rotedCamera = () => {
    // let backCamera = !this.state.backCamera
    this.setState({ backCamera: !this.state.backCamera })
  }
  flashMode = () => {
    this.setState({ flash: !this.state.flash })
  }
  /*
  ..######...#######..##.....##.########...#######..##....##.########.##....##.########
  .##....##.##.....##.###...###.##.....##.##.....##.###...##.##.......###...##....##...
  .##.......##.....##.####.####.##.....##.##.....##.####..##.##.......####..##....##...
  .##.......##.....##.##.###.##.########..##.....##.##.##.##.######...##.##.##....##...
  .##.......##.....##.##.....##.##........##.....##.##..####.##.......##..####....##...
  .##....##.##.....##.##.....##.##........##.....##.##...###.##.......##...###....##...
  ..######...#######..##.....##.##.........#######..##....##.########.##....##....##...
  */
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={this.state.backCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
          flashMode={this.state.flash ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <ActivityIndicator size="small" />;
            return (
              <View>
                {this.state.recording ? <Text style={{ color: 'red', alignSelf: 'center' }}>{this.secondToms(this.state.second)}</Text> : null}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 30 }}>
                  <TouchableOpacity onPress={() => this.flashMode()}>
                    {this.state.flash ? <Ionicons name="flash" size={30} color="#fff" />
                      : <Ionicons name="flash-off" size={30} color="#fff" />}
                  </TouchableOpacity>
                  <View style={styles.border}>
                    <TouchableOpacity
                      onPress={this.recordVideo}
                      style={styles.capture}>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={this.rotedCamera}>
                    <Icon name="rotate-right" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        </RNCamera>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  border: {
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 50,
    paddingVertical: 2,
    paddingHorizontal: 2
  },
  capture: {
    backgroundColor: 'red',
    paddingHorizontal: 30,
    paddingVertical: 30,
    borderRadius: 50,
    alignSelf: 'center'
  },
});


export default Camero

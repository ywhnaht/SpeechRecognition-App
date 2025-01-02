import { View, Text, SafeAreaView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { playAudioFile, sendRecordSignal, uploadAudioFile } from '../api/apiServices';

export default function HomeScreen() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const filename = 'recording.wav';

    const clear = () => {
        setInputText('');
        setOutputText('');
        setErrorMessage('');
    };

    const startRecording = async () => {
        setRecording(true);
        try {
            await sendRecordSignal('start-recording');
            console.log('Recording started!');
        } catch (error) {
            console.error('Error starting recording:', error);
            setErrorMessage(error.message || 'Unable to start recording.');
        } finally {
            // setRecording(false); // Reset trạng thái nếu có lỗi
        }
    };

    const stopRecording = async () => {
        setRecording(false);
        setLoading(true);
        clear();

        try {
            await sendRecordSignal('stop-recording');
            console.log('Recording stopped!');

            const result = await uploadAudioFile(filename);
            console.log('English Text:', result.englishText);
            console.log('Vietnamese Translation:', result.vietnameseText);

            setInputText(result.englishText || 'No text detected.');
            setOutputText(result.vietnameseText || 'No translation available.');
        } catch (error) {
            console.error('Error stopping recording or uploading file:', error);
            setErrorMessage('Failed to process audio. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startPlayAudio = async (action) => {
        try {
            await playAudioFile(action, filename);
            console.log('Playing-audio!');
        } catch (error) {
            console.error('Error playing-audio:', error);
            setErrorMessage(error.message || 'Unable to playing-audio.');
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-150" style={{ backgroundColor: '#F8FAFC' }}>
            <SafeAreaView className="flex-1 mx-5">
                <View className="flex-row justify-center">
                    <Image source={require('../../assets/images/bot.png')} style={{ height: hp(15), width: hp(15) }} />
                </View>

                {/* Text nhận diện từ giọng nói */}
                <View className="space-y-2 mt-3">
                    <Text style={{ fontSize: wp(4.5) }} className="text-gray-700 font-semibold ml-1">
                        Vietnamese
                    </Text>
                    <View style={{ height: hp(20) }} className="bg-white rounded-2xl p-4">
                        <Text style={{ fontSize: wp(4.5) }} className="font-medium">
                            {inputText || 'Ấn nút ghi âm để dịch.'}
                        </Text>
                        {inputText.length > 0 && (
                            <TouchableOpacity onPress={() => startPlayAudio('play-audiotv')}  className="absolute" style={{right: wp(3), bottom: wp(3) }}>
                                <Icon name="record-voice-over" size={wp(5)}/>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Kết quả dịch */}
                <View className="space-y-2 flex-1 mt-3">
                    {/* <LanguageSelector /> */}
                    <Text style={{ fontSize: wp(4.5) }} className="text-gray-700 font-semibold ml-1">
                        English
                    </Text>
                    <View style={{ height: hp(20) }} className="bg-white rounded-2xl p-4">
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <Text style={{ fontSize: wp(4.5) }} className="text-emerald-700 font-medium">
                                {outputText || 'Press the record button to translate.'}
                            </Text>
                        )}
                        {outputText.length > 0 && !loading && (
                            <TouchableOpacity onPress={() => startPlayAudio('play-audio')}  className="absolute" style={{right: wp(3), bottom: wp(3) }}>
                                <Icon name="record-voice-over" size={wp(5)}/>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Thông báo lỗi */}
                {/* {errorMessage ? (
                    <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{errorMessage}</Text>
                ) : null} */}

                {/* Nút ghi âm và dừng ghi âm */}
                <View className="flex justify-center items-center my-3">
                    {recording ? (
                        <TouchableOpacity 
                            onPress={loading ? null : stopRecording} // Vô hiệu hóa nếu đang load
                            disabled={loading} // Disable nút khi đang load
                        >
                            <Image
                                source={require('../../assets/images/voiceLoading.gif')}
                                className="rounded-full"
                                style={{
                                    height: hp(12),
                                    width: hp(12),
                                    opacity: loading ? 0.5 : 1, // Làm mờ nút nếu disable
                                }}
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                            onPress={loading ? null : startRecording} // Vô hiệu hóa nếu đang load
                            disabled={loading} // Disable nút khi đang load
                        >
                            <Image
                                source={require('../../assets/images/recordingicon.png')}
                                className="rounded-full"
                                style={{
                                    height: hp(12),
                                    width: hp(12),
                                    opacity: loading ? 0.5 : 1, // Làm mờ nút nếu disable
                                }}
                            />
                        </TouchableOpacity>
                    )}
                    {inputText.length > 0 && (
                        <TouchableOpacity
                            onPress={clear}
                            className="bg-neutral-400 rounded-3xl p-2 absolute right-10"
                            disabled={loading} // Disable nút Clear khi đang load
                            style={{ opacity: loading ? 0.5 : 1 }} // Làm mờ nút Clear nếu disable
                        >
                            <Text className="text-white font-semibold">Clear</Text>
                        </TouchableOpacity>
                    )}
                    {!loading && recording ? (
                        <TouchableOpacity
                            onPress={stopRecording}
                            className="bg-red-400 rounded-3xl p-2 absolute left-10"
                        >
                            <Text className="text-white font-semibold">Stop</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>

            </SafeAreaView>
        </SafeAreaView>
    );
}

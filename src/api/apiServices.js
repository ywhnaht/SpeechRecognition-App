import axios from 'axios';

const RASPBERRY_PI_URL = 'http://192.168.147.135:5000'; // Địa chỉ Raspberry Pi của bạn


// Gửi tín hiệu bắt đầu ghi âm đến Raspberry Pi
export const sendRecordSignal = async (action) => {
    const url = `${RASPBERRY_PI_URL}/${action}`;
    
    try {
        const response = await axios.get(url, {
            validateStatus: (status) => status >= 200 && status < 300,
        });
        console.log('Raspberry Pi response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending record signal:', error);
        throw new Error(
            error.response
                ? `Server Error: ${error.response.status} - ${error.response.statusText}`
                : 'Network Error: Unable to reach Raspberry Pi'
        );
    }
};

// Gửi file âm thanh lên server và nhận lại kết quả
export const uploadAudioFile = async (filename) => {
    try {
        const url = `${RASPBERRY_PI_URL}/send-audio/${filename}`;
        const response = await axios.get(url, {
            validateStatus: (status) => status >= 200 && status < 300,
        });
        // Kiểm tra dữ liệu trả về
        if (response.data && response.data.text && response.data.result) {
            console.log('Transcription and translation received:', response.data);
            return {
                englishText: response.data.text,   // Văn bản tiếng Anh
                vietnameseText: response.data.result // Kết quả dịch tiếng Việt
            };
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error uploading audio file:', error);
        throw error;
    }
};

// Gửi tín hiệu bắt đầu ghi âm đến Raspberry Pi
export const playAudioFile = async (action, filename) => {
    const url = `${RASPBERRY_PI_URL}/${action}/${filename}`;
    
    try {
        const response = await axios.get(url, {
            validateStatus: (status) => status >= 200 && status < 300,
        });
        console.log('Raspberry Pi response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending record signal:', error);
        throw new Error(
            error.response
                ? `Server Error: ${error.response.status} - ${error.response.statusText}`
                : 'Network Error: Unable to reach Raspberry Pi'
        );
    }
};

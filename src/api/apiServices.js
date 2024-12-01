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

// import axios from 'axios';

// const RASPBERRY_PI_URL = 'http://192.168.147.135:5000'; // Địa chỉ Raspberry Pi của bạn

// // Hàm chung để gửi request với retry logic
// const axiosRetry = async (config, retries = 3, delay = 2000) => {
//     try {
//         const response = await axios(config);
//         return response.data; // Trả về dữ liệu nếu thành công
//     } catch (error) {
//         if (retries > 0 && (!error.response || error.code === 'ECONNABORTED')) {
//             console.warn(`Retrying... Attempts left: ${retries}`);
//             await new Promise((resolve) => setTimeout(resolve, delay));
//             return axiosRetry(config, retries - 1, delay * 2);
//         }
//         throw error;
//     }
// };


// // Gửi tín hiệu bắt đầu/dừng ghi âm đến Raspberry Pi
// export const sendRecordSignal = async (action) => {
//     try {
//         const config = {
//             method: 'get', // Thay đổi sang GET vì API server dùng GET
//             url: `${RASPBERRY_PI_URL}/${action}`,
//             timeout: 10000, // Timeout 10 giây
//             validateStatus: (status) => status >= 200 && status < 500, // Chỉ chấp nhận các mã từ 200-499
//         };
//         const data = await axiosRetry(config); // Gửi request với retry logic
//         console.log('Raspberry Pi response:', data);
//         return data; // Trả về kết quả
//     } catch (error) {
//         console.error('Error sending record signal:', error);
//         throw error;
//     }
// };

// // Gửi file âm thanh lên server
// export const uploadAudioFile = async (filename) => {
//     try {
//         const config = {
//             method: 'post',
//             url: `${RASPBERRY_PI_URL}/send-audio/${filename}`,
//             timeout: 10000, // Timeout 10 giây
//             validateStatus: (status) => status >= 200 && status < 500, // Chỉ chấp nhận các mã từ 200-499
//         };
//         const data = await axiosRetry(config); // Gửi request với retry logic
//         console.log('Audio file upload response:', data);
//         if (data && data.text && data.result) {
//             console.log('Transcription and translation received:', data);
//             return {
//                         englishText: data.text,   // Văn bản tiếng Anh
//                         vietnameseText: data.result // Văn bản dịch tiếng Việt
//                     };
//             } else {
//                 throw new Error('Invalid response structure');
//             }
//     } catch (error) {
//         console.error('Error uploading audio file:', error);
//         throw error;
//     }
// };




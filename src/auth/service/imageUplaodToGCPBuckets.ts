import {initializeApp} from 'firebase/app';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {firebaseConfig} from '../../CloudConfig/getFirebaseConfig';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const ImageUpload = async (image: Blob | ArrayBuffer | Uint8Array, user_id: string) => {
    if (image) {
        const storageRef = ref(storage, `${user_id}`);
        const res = await uploadBytes(storageRef, image);
        console.log(res);
        const downloadURL = await getDownloadURL(storageRef);
        console.log(downloadURL);
        console.log('Image uploaded successfully!');
        return downloadURL;
    } else {
        console.log('Image not found');
    }
    return '';
};

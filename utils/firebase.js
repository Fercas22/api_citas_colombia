const {initializeApp} = require('firebase/app')
const {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
  } = require('firebase/storage');

const firebaseConfig = {
    apiKey: "AIzaSyBwm1KiAvq-6bv3i1DQDkgffIEqHdbQaPY",
    authDomain: "fotos-api-2ccef.firebaseapp.com",
    projectId: "fotos-api-2ccef",
    storageBucket: "fotos-api-2ccef.appspot.com",
    messagingSenderId: "468910648710",
    appId: "1:468910648710:web:4016e1a485c7e9a6d01007"
};

const appFirebase = initializeApp(firebaseConfig);
const storage = getStorage(appFirebase);

async function uploadFiles(files) {

    console.log(files);
    const uploadPromises = [];
  
    for (const file of files) {
      const storageRef = ref(storage, `img/${file.name}`);
      const uploadTask = uploadBytes(storageRef, file);
      uploadPromises.push(uploadTask);
    }
  
    await Promise.all(uploadPromises);
  
    const downloadURLPromises = [];
  
    for (const file of files) {
      const storageRef = ref(storage, `img/${file.name}`);
      const urlPromise = getDownloadURL(storageRef);
      downloadURLPromises.push(urlPromise);
    }
  
    const downloadURLs = await Promise.all(downloadURLPromises);
    return downloadURLs;
  }

  module.exports = {
    storage,
    uploadFiles
  }
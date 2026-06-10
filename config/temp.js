import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({

  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});
export default client; 
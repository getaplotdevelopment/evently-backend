import QRCode from 'qrcode';

const generateQRCodeHelper = async text => {
  try {
    const qrCode = await QRCode.toDataURL(text);
    return qrCode;
  } catch (err) {}
};
export default generateQRCodeHelper;

const getImage = (buffer: Uint8Array, imgType = 'jpeg') => {
  const byteArray = new Uint8Array(buffer);
  const picBlob = new Blob([byteArray], { type: `image/${imgType}` });
  const picSrc = URL.createObjectURL(picBlob);
  return picSrc;
};
export { getImage };

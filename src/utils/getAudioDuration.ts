const getAudioDuration = (src: string) => {
  return new Promise(function (resolve) {
    var audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    }
    audio.src = src;
  });
};

export default getAudioDuration;

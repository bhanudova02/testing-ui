import ReactPlayer from 'react-player';

const BunnyReactPlayer = () => {
  return (
    <ReactPlayer
      url="https://iframe.mediadelivery.net/play/424074/03eef0e0-b994-40da-93cd-297f856bfe4e"
      controls
      playing
      muted
      loop
      width="100%"
      height="360px"
    />
  );
};


export default BunnyReactPlayer;
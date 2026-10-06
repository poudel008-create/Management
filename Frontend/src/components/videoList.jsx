// import { useEffect, useState } from "react";
// import { getVideos } from "../services/videoService";
// import { useAuth } from "../context/authContext";

// const VideoList = () => {
//   const { token } = useAuth();

//   const [videos, setVideos] = useState([]);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const data = await getVideos(token);
//         setVideos(data);
//       } catch (error) {
//         console.error("Failed to fetch videos", error);
//       }
//     };

//     if (token) {
//       fetchVideos();
//     }
//   }, [token]);

//   return (
//     <div>
//       <h2>Videos</h2>

//       {videos.map((video) => (
//         <div key={video._id}>
//           <h3>{video.title}</h3>

//           <video
//             controls
//             width="600"
//             src={`https://stream.mux.com/${video.playbackId}.m3u8`}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default VideoList;
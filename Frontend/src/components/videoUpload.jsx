import { useState } from "react";
import { getUploadUrl } from "../services/videoService";
import { useAuth } from "../context/authContext";

const VideoUpload = () => {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !file) {
      alert("Title and video are required");
      return;
    }

    try {
      setLoading(true);

      // 1. Get upload URL from our backend
      const data = await getUploadUrl(title, token);

      // 2. Upload video directly to Mux
      await fetch(data.uploadUrl, {
        method: "PUT",
        body: file,
      });

      alert("Video uploaded successfully!");

      setTitle("");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Video upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>

      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;
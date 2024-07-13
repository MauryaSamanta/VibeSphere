import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase, 
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  TextField
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import * as faceapi from 'face-api.js';
import Dropzone from "react-dropzone";
import { useDropzone,getRootProps,
  getInputProps } from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState([]);
  const [post, setPost] = useState("");
  //const [friends, setFriends] = useState([]);
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "A3A3A3",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out"
  };
  // const mediumMain = palette.neutral.mediumMain;
  // const medium = palette.neutral.medium;
  const activeStyle = {
    borderColor: "#2196f3"
  };
  
  const acceptStyle = {
    borderColor: "#00e676"
  };
  
  const rejectStyle = {
    borderColor: "#ff1744"
  };
  
  const thumbsContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16
  };
  
  const thumb = {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: "auto",
    height: 200,
    padding: 4,
    boxSizing: "border-box"
  };
  
  const thumbInner = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden"
  };
  
  const img = {
    display: "block",
    width: "auto",
    height: "100%"
  };
  
  const StyledDropzone=()=> {
    
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      acceptedFiles,
      open
    } = useDropzone({
      accept: "image/*",
      noClick: true,
      noKeyboard: true,
      onDrop: acceptedFiles => {
        setFiles(
          acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );
        setImage(acceptedFiles[0]);
        setIsImage(true);
      }
    });
  
    const style = useMemo(
      () => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }),
      [isDragActive,isDragAccept, isDragReject]
    );
  
    const thumbs = files.map(file => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          <img src={file.preview} alt="" style={img} />
        </div>
      </div>
    ));
    {
    useEffect(
      () => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
      },
      [files]
    );
  
    const filepath = acceptedFiles.map(file => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));
  
    return (
      <div className="container">
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          {!image? 
          (<p onClick={open} sx={{cursor:"pointer"}}>Drag 'n' drop your image here</p>):(<p>{image.name}</p>)}
          {/* <button type="button" onClick={open}>
            Open File Dialog
          </button> */}
        </div>
        <aside>
          {/* <h4>Files</h4> */}
          {/* <ul>{filepath}</ul> */}
        </aside>
        <aside style={thumbsContainer}>{thumbs}</aside>
      </div>
    );
  }
}
  
  const handleState=({files})=>{
   setImage(files[0]);
  }
  const stopPropagation = (event) => {
    event.stopPropagation();
  }
  const videoRef = useRef()
  const canvasRef = useRef()
    //const {url}=image;
    const [faces,setFaces]=useState();
    const [friends, setFriends]=useState([]);
  useEffect(()=>{
    //startVideo()
    videoRef && loadModels()

  },[])
  const loadModels = ()=>{
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")

      ]).then(()=>{
      faceMyDetect()
    })
  }
  const faceMyDetect = async()=>{
    
    const detections = await faceapi.detectAllFaces(videoRef.current,
      new faceapi.TinyFaceDetectorOptions());
      setFaces(detections.map(d=>Object.values(d.box)));
      console.log(detections);
    // DRAW YOU FACE IN WEBCAM
   }
   const enter=()=>{
    loadModels();
    const ctx=canvasRef.current.getContext("2d");
    ctx.lineWidth=3;
    ctx.strokeStyle="lightblue";
    faces.map(face=>ctx.strokeRect(...face));
 }
  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
    if(friends){
      formData.append("tagged",JSON.stringify(friends));
    }
    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setImage(null);
    setPost("");
  };
  const addFriend = (i,e) => {
    //let prev;
    const newF=[...friends];
    newF[i]=e.target.value;
    setFriends(newF);
    //setFriends((prev) => ({...prev, [e.target.name]: e.target.value }));
    console.log(friends);
  };
  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
        
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => {
              setImage(acceptedFiles[0]);
              
              setFiles({
                  
                    preview: URL.createObjectURL(acceptedFiles[0]),

                  
              });
            }}
          >
          {/* <StyledDropzone/> */}
          
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      {/* <Typography>{image.name}</Typography> */}
                      <Box position="relative" display="inline-block">
                      <img ref={videoRef} crossOrigin="anonymous" src={files.preview} style={{ display: 'block' }} width="300" height="250" alt="" />
                      <canvas onMouseEnter={enter} ref={canvasRef} style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      }}
                      width="300" height="250"/>
                      {faces? (faces.map((face, i) => (
                  
                  // <input
                  // name={`input${i}`}
                  // style={{ left: face[0], top: face[1] + face[3] + 5 }}
                  // placeholder="Tag a friend"
                  // key={i}
                  // onChange={addFriend}
                  // />
                  <TextField
                  
          key={i}
          onChange={(e)=>addFriend(i,e)}
          variant="outlined"
          size="small"
          placeholder="Tag friend"
          onClick={stopPropagation} 
          style={{
            position: 'absolute',
            top: face[1]+face[3]+5, // Position just below the rectangle
            left: face[0], // Align with the left side of the rectangle
            zIndex: 3,
            //width: `${face.width}px`,
            borderColor: 'red',
            borderWidth: '2px',
            backgroundColor: 'transparent', // Transparent background
            color: 'black', // Black text
          }}
          InputProps={{
            style: {
              color: 'black', // Text color
            },
          }}
          
        />
                ))):(<span></span>)}
                      </Box>
                      <EditOutlined />
                    </FlexBetween>
                    
                  )}
                </Box>
                
                {image && (
                  <IconButton
                    onClick={() => {setImage(null); setFaces(null); setFriends(null);}}
                    sx={{ width: "15%" }} 
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
        </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}
        {/* {friends && (
          <span className="friends">
            with <span className="name">{Object.values(friends) + " "}</span>
          </span>
        )} */}
        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;

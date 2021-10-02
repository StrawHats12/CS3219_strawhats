ffmpeg -re -f video4linux2 -i /dev/video0 -vcodec libx264 -vprofile high422 -acodec aac -strict -2 -f flv rtmp://localhost/show/stream

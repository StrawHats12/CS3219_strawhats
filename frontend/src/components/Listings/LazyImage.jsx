import Storage from "@aws-amplify/storage";
import { useEffect, useState } from "react";
import { getCurrentUserCredentials } from "../../hooks/useAuth";

// Lazily load image, for use with ListingsImageUpload.jsx
const LazyImage = (props) => {
  const imagename = props.imagename;
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!imagename) {
      return;
    }

    getCurrentUserCredentials().then((userCreds) => {
      Storage.get(imagename, {
        level: "protected",
        identityId: userCreds.identityId,
      })
        .then((image) => {
          setImage(image);
        })
        .catch((err) => {
          console.err(err);
        });
    });
  }, [imagename]);

  return image && <img style={{ height: "120px" }} src={image} alt="" />;
};

export default LazyImage;

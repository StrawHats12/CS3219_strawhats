import Storage from "@aws-amplify/storage";
import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import placeholder from "./placeholder-image.jpg";

const ListingsCarousel = (props) => {
  const [images, setImages] = useState([placeholder]);
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    async function getImages() {
      if (props.imageUris && props.imageUris.length) {
        const imagesData = [];

        for (let i = 0; i < props.imageUris.length; i++) {
          const image = await Storage.get(props.imageUris[i], {
            level: "protected",
            identityId: props.seller_uid,
          });
          if (image) {
            imagesData.push(image);
          }
        }

        if (imagesData.length) {
          setImages(imagesData);
        }
      }
    }

    getImages();
  }, [props.imageUris, props.seller_uid, setImages]);

  return (
    <div style={{ maxWidth: "500px" }}>
      {images.length === 1 ? (
        <img
          src={images[0]}
          alt="Product"
          style={{ objectFit: "contain", width: "100%" }}
        />
      ) : (
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {images.map((image, idx) => (
            <Carousel.Item key={idx}>
              <img
                src={image}
                alt="Product"
                style={{ objectFit: "contain", width: "100%" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ListingsCarousel;

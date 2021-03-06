import Storage from "@aws-amplify/storage";
import { useEffect, useState } from "react";
import { Button, Col, Container, Figure, Form, Row } from "react-bootstrap";
import { updateAccount } from "../../services/account-service";
import PlaceholderProfileImage from "./placeholderProfileImage.jpg";

const ProfileCard = (props) => {
  const [profile, setProfile] = useState(props.profile);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [image, setImage] = useState(PlaceholderProfileImage);

  const setField = (field, value) => {
    setProfile({
      ...profile,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const findFormErrors = () => {
    const newErrors = {};

    if (!profile.name) {
      newErrors.name = "cannot be blank!";
    }

    return newErrors;
  };

  const selectImage = (event) => {
    setImageFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      props.setIsLoading(true);
      updateAccount(profile, imageFile)
        .catch((e) => {
          alert(e);
        })
        .finally(() => {
          props.setIsLoading(false);
          props.setIsEditing(false);
        });
    }
  };

  useEffect(() => {
    if (props.edit) {
      setProfile(props.profile); // reset profile
    }
  }, [profile.image, profile.uid, props.edit, props.profile]);

  useEffect(() => {
    if (profile.image && profile.uid) {
      Storage.get(profile.image, {
        level: "protected",
        identityId: profile.uid,
      }).then((image) => {
        setImage(image);
      });
    }
  }, [profile.image, profile.uid]);

  if (props.edit) {
    return (
      <Container>
        <Form>
          <Row>
            <Col sm={3}>
              <Figure>
                <Figure.Image
                  width={180}
                  height={180}
                  alt="profile"
                  src={image}
                />
              </Figure>
              <input type="file" accept="image/*" onChange={selectImage} />
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formAccountName">
                <Form.Label>Profile Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Profile Name"
                  defaultValue={profile.name}
                  onChange={(e) => setField("name", e.target.value)}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formAccountAbout">
                <Form.Label>About Me</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Tell us a few words about yourself!"
                  defaultValue={profile.about}
                  onChange={(e) => setField("about", e.target.value)}
                  isInvalid={!!errors.about}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.about}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <Row>
          <Button
            variant="secondary"
            className="m-2"
            onClick={() => props.setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button className="m-2" onClick={handleSave}>
            Save
          </Button>
        </Row>
      </Container>
    );
  }

  // View mode
  return (
    <Container>
      <Row>
        <Col sm={3}>
          <Figure>
            <Figure.Image width={180} height={180} alt="profile" src={image} />
          </Figure>
        </Col>
        <Col>
          <h2>{profile.name || profile.username}</h2>
          <p>
            {profile.about || "This user does not have an about section yet."}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileCard;
